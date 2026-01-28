@echo off
REM 狗狗拼团 - 后端启动脚本 (Windows)

setlocal enabledelayedexpansion

echo ======================================
echo   狗狗拼团 - 后端服务
echo ======================================
echo.

REM 获取项目根目录
set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR:~0,-1%\..
set SERVER_DIR=%PROJECT_ROOT%\server

cd /d "%SERVER_DIR%"

REM 检查 Poetry 是否安装
where poetry >nul 2>nul
if errorlevel 1 (
    echo 错误: Poetry 未安装
    echo 请先安装 Poetry
    pause
    exit /b 1
)

REM 检查 .env 文件
if not exist "%SERVER_DIR%\.env" (
    echo 警告: .env 文件不存在
    if exist "%SERVER_DIR%\.env.example" (
        echo 从 .env.example 创建 .env...
        copy "%SERVER_DIR%\.env.example" "%SERVER_DIR%\.env"
        echo 请编辑 .env 文件配置数据库等信息
    )
    echo.
)

REM 安装依赖
if not exist "%SERVER_DIR%\.venv" (
    echo [1/3] 安装 Python 依赖...
    call poetry install
    echo.
) else (
    echo [1/3] 依赖已安装
    echo.
)

REM 启动服务
echo [2/2] 启动 FastAPI 服务...
echo API 地址: http://localhost:8000
echo API 文档: http://localhost:8000/docs
echo.
echo 按 Ctrl+C 停止服务
echo.

call poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
