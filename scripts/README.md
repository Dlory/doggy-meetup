# 狗狗拼团 - 启动脚本说明

## 快速启动

### macOS / Linux

```bash
# 启动后端
./scripts/start-backend.sh

# 启动前端
./scripts/start-frontend.sh
```

### Windows

```cmd
# 启动后端
scripts\start-backend.bat

# 启动前端
scripts\start-frontend.bat
```

## 脚本说明

### start-backend.sh / start-backend.bat
后端服务启动脚本，功能：
- 检查 Poetry 是否安装
- 自动安装 Python 依赖（首次运行）
- 检查 .env 文件
- 检查数据库迁移状态
- 启动 FastAPI 开发服务器（http://localhost:8000）

### start-frontend.sh / start-frontend.bat
前端应用启动脚本，功能：
- 检查 Node.js 是否安装
- 自动安装 npm 依赖（首次运行）
- 检查 .env 文件
- 启动 Expo 开发服务器（http://localhost:8081）

### migration.sh
数据库迁移管理脚本，用法：
```bash
./scripts/migration.sh current    # 查看当前版本
./scripts/migration.sh upgrade    # 执行迁移
./scripts/migration.sh downgrade  # 回滚迁移
./scripts/migration.sh revision   # 创建新迁移
```

## 首次运行

1. **配置环境变量**
   ```bash
   # 后端
   cp server/.env.example server/.env
   # 编辑 server/.env 配置数据库

   # 前端
   cp apps/.env.example apps/.env
   ```

2. **启动数据库**
   ```bash
   # PostgreSQL
   brew services start postgresql
   # 或使用 Docker
   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15
   ```

3. **运行迁移**
   ```bash
   ./scripts/migration.sh upgrade
   ```

4. **启动服务**
   ```bash
   # 终端 1: 后端
   ./scripts/start-backend.sh

   # 终端 2: 前端
   ./scripts/start-frontend.sh
   ```

## 开发环境要求

- Python 3.11+
- Node.js 18+
- Poetry
- PostgreSQL 15+
- Expo CLI
