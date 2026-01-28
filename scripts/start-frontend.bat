@echo off
REM 狗狗拼团 - 前端启动脚本 (Windows)

setlocal enabledelayedexpansion

echo ======================================
echo   狗狗拼团 - 前端应用
echo ======================================
echo.

REM 获取项目根目录
set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR:~0,-1%\..
set APPS_DIR=%PROJECT_ROOT%\apps

cd /d "%APPS_DIR%"

REM 检查 Node.js 是否安装
where node >nul 2>nul
if errorlevel 1 (
    echo 错误: Node.js 未安装
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查依赖
if not exist "%APPS_DIR%\node_modules" (
    echo [1/2] 安装 npm 依赖...
    call npm install
    echo.
) else (
    echo [1/2] 依赖已安装
    echo.
)

REM 检查 .env 文件
echo [2/2] 检查环境变量...
if not exist "%APPS_DIR%\.env" (
    if exist "%APPS_DIR%\.env.example" (
        echo 从 .env.example 创建 .env...
        copy "%APPS_DIR%\.env.example" "%APPS_DIR%\.env"
        echo 请编辑 .env 文件配置 API 地址等信息
    )
)
echo.

REM 启动开发服务器
echo 启动 Expo 开发服务器...
echo 开发服务器: http://localhost:8081
echo.
echo 按 w 打开 web 版本
echo 按 Ctrl+C 停止服务
echo.

call npm start

pause
