#!/bin/bash
# 狗狗拼团 - 前端启动脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取脚本所在目录的父目录（项目根目录）
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
APPS_DIR="$PROJECT_ROOT/apps"

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  狗狗拼团 - 前端应用${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# 切换到前端目录
cd "$APPS_DIR"

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: Node.js 未安装${NC}"
    echo -e "请先安装 Node.js: ${YELLOW}https://nodejs.org/${NC}"
    exit 1
fi

# 检查依赖是否已安装
if [ ! -d "$APPS_DIR/node_modules" ]; then
    echo -e "${BLUE}[1/3] 安装 npm 依赖...${NC}"
    npm install
    echo ""
else
    echo -e "${GREEN}[1/3] 依赖已安装${NC}"
fi

# 检查 .env 文件
echo -e "${BLUE}[2/3] 检查环境变量...${NC}"
if [ ! -f "$APPS_DIR/.env" ]; then
    if [ -f "$APPS_DIR/.env.example" ]; then
        echo -e "${YELLOW}从 .env.example 创建 .env...${NC}"
        cp "$APPS_DIR/.env.example" "$APPS_DIR/.env"
        echo -e "${YELLOW}请编辑 .env 文件配置 API 地址等信息${NC}"
    fi
fi
echo ""

# 启动开发服务器
echo -e "${BLUE}[3/3] 启动 Expo 开发服务器...${NC}"
echo -e "${GREEN}开发服务器: http://localhost:8081${NC}"
echo ""
echo -e "${YELLOW}按 w 打开 web 版本${NC}"
echo -e "${YELLOW}按 i 打开 iOS 模拟器${NC}"
echo -e "${YELLOW}按 a 打开 Android 模拟器${NC}"
echo -e "${YELLOW}按 r 重新加载${NC}"
echo -e "${YELLOW}按 Ctrl+C 停止服务${NC}"
echo ""

npm start
