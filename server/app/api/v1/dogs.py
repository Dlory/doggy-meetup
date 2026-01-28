"""Dog API routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.schemas.dog import DogCreate, DogResponse, DogUpdate
from app.services.dog_service import DogService
from app.models.user import User

router = APIRouter(prefix="/dogs", tags=["狗狗"])


@router.get("", response_model=list[DogResponse])
async def get_my_dogs(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """获取我的狗狗列表"""
    dogs = await DogService.get_user_dogs(db, current_user.id)
    return [DogResponse.model_validate(dog) for dog in dogs]


@router.post("", response_model=DogResponse)
async def create_dog(
    data: DogCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """创建狗狗档案"""
    dog = await DogService.create_dog(db, current_user.id, data)
    return DogResponse.model_validate(dog)


@router.get("/{dog_id}", response_model=DogResponse)
async def get_dog(
    dog_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """获取狗狗详情"""
    dog = await DogService.get_dog_by_id(db, dog_id)
    if not dog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="狗狗不存在",
        )
    return DogResponse.model_validate(dog)


@router.put("/{dog_id}", response_model=DogResponse)
async def update_dog(
    dog_id: str,
    data: DogUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """更新狗狗信息"""
    # Check ownership
    if not await DogService.check_ownership(db, dog_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权操作此狗狗",
        )

    dog = await DogService.update_dog(db, dog_id, data)
    if not dog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="狗狗不存在",
        )
    return DogResponse.model_validate(dog)


@router.delete("/{dog_id}")
async def delete_dog(
    dog_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """删除狗狗"""
    # Check ownership
    if not await DogService.check_ownership(db, dog_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权操作此狗狗",
        )

    success = await DogService.delete_dog(db, dog_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="狗狗不存在",
        )
    return {"message": "删除成功"}
