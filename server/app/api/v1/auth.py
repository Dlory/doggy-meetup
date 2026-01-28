"""Authentication API routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.schemas.auth import SendCodeRequest, LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["认证"])


@router.post("/send-code")
async def send_code(
    data: SendCodeRequest,
):
    """发送验证码"""
    await AuthService.send_verification_code(data.phone)
    return {"message": "验证码已发送", "code": "1234"}  # MVP: Return code directly


@router.post("/register", response_model=TokenResponse)
async def register(
    data: RegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    """注册新用户"""
    # Check if user exists
    existing_user = await AuthService.get_user_by_phone(db, data.phone)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="手机号已注册",
        )

    # Verify code
    if not await AuthService.verify_code(db, data.phone, data.code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="验证码错误",
        )

    # Create user
    user = await AuthService.create_user(db, data.phone, data.nickname)

    # Generate token
    access_token = AuthService.generate_token(user.id)

    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """验证码登录"""
    # Get user
    user = await AuthService.get_user_by_phone(db, data.phone)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在，请先注册",
        )

    # Verify code
    if not await AuthService.verify_code(db, data.phone, data.code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="验证码错误",
        )

    # Generate token
    access_token = AuthService.generate_token(user.id)

    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
):
    """获取当前用户信息"""
    return UserResponse.model_validate(current_user)
