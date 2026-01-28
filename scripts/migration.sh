#!/bin/bash
# 狗狗拼团 - 数据库迁移脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取项目根目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SERVER_DIR="$PROJECT_ROOT/server"

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  狗狗拼团 - 数据库迁移${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

cd "$SERVER_DIR"

# 检查当前迁移状态
echo -e "${BLUE}当前迁移状态:${NC}"
poetry run alembic current
echo ""

# 显示可用命令
echo -e "${YELLOW}可用命令:${NC}"
echo "  migration.sh [命令]"
echo ""
echo "命令:"
echo "  current   - 显示当前版本"
echo "  history   - 显示迁移历史"
echo "  upgrade   - 执行迁移"
echo "  downgrade - 回滚迁移"
echo "  revision  - 创建新迁移"
echo "  branches  - 显示分支"
echo ""

# 如果有参数，执行对应命令
if [ -n "$1" ]; then
    case "$1" in
        current)
            poetry run alembic current
            ;;
        history)
            poetry run alembic history
            ;;
        upgrade)
            echo -e "${BLUE}执行数据库迁移...${NC}"
            poetry run alembic upgrade head
            echo -e "${GREEN}迁移完成${NC}"
            ;;
        downgrade)
            echo -e "${BLUE}回滚数据库迁移...${NC}"
            poetry run alembic downgrade -1
            echo -e "${GREEN}回滚完成${NC}"
            ;;
        revision)
            echo -e "${BLUE}创建新迁移...${NC}"
            poetry run alembic revision --autogenerate -m "$2"
            ;;
        branches)
            poetry run alembic branches
            ;;
        *)
            echo -e "${RED}未知命令: $1${NC}"
            exit 1
            ;;
    esac
fi
