#!/bin/bash
# 狗狗拼团 - 后端启动脚本

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
SERVER_DIR="$PROJECT_ROOT/server"

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  狗狗拼团 - 后端服务${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# 切换到后端目录
cd "$SERVER_DIR"

# 检查 Poetry 是否安装
if ! command -v poetry &> /dev/null; then
    echo -e "${RED}错误: Poetry 未安装${NC}"
    echo -e "请先安装 Poetry: ${YELLOW}curl -sSL https://install.python-poetry.org | python3 -${NC}"
    exit 1
fi

# 检查 .env 文件
if [ ! -f "$SERVER_DIR/.env" ]; then
    echo -e "${YELLOW}警告: .env 文件不存在${NC}"
    if [ -f "$SERVER_DIR/.env.example" ]; then
        echo -e "从 .env.example 创建 .env..."
        cp "$SERVER_DIR/.env.example" "$SERVER_DIR/.env"
        echo -e "${YELLOW}请编辑 .env 文件配置数据库等信息${NC}"
    fi
    echo ""
fi

# 检查依赖是否已安装
if [ ! -d "$SERVER_DIR/.venv" ]; then
    echo -e "${BLUE}[1/3] 安装 Python 依赖...${NC}"
    poetry install
    echo ""
else
    echo -e "${GREEN}[1/3] 依赖已安装${NC}"
fi

# 检查数据库迁移
echo -e "${BLUE}[2/3] 检查数据库迁移...${NC}"
if poetry run alembic current | grep -q "No current revision"; then
    echo -e "${YELLOW}需要运行数据库迁移${NC}"
    read -p "是否现在运行? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        poetry run alembic upgrade head
    fi
else
    echo -e "${GREEN}数据库迁移已更新${NC}"
fi
echo ""

# 启动服务
echo -e "${BLUE}[3/3] 启动 FastAPI 服务...${NC}"
echo -e "${GREEN}API 地址: http://localhost:8000${NC}"
echo -e "${GREEN}API 文档: http://localhost:8000/docs${NC}"
echo ""
echo -e "${YELLOW}按 Ctrl+C 停止服务${NC}"
echo ""

poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
