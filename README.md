# 🐕 狗狗拼团 (Doggy Meetup)

> 连接狗狗主人的社交平台，通过「拼团」形式组织小型狗狗聚会

## 项目结构

```
doggy-meetup/
├── apps/                   # React Native 移动应用 (Expo)
│   ├── src/                # 源代码
│   ├── package.json        # 依赖配置
│   ├── app.json           # Expo 配置
│   └── eas.json           # EAS Build 配置
│
├── server/                 # Python FastAPI 后端
│   └── app/               # 应用代码
│       ├── api/           # API 路由
│       ├── core/          # 核心配置
│       ├── models/        # 数据模型
│       ├── schemas/       # Pydantic schemas
│       ├── services/      # 业务逻辑
│       └── tasks/         # Celery 任务
│
├── docs/                   # 文档
│   ├── designs/           # 设计文档
│   └── plans/             # 实施计划
│
└── scripts/                # 工具脚本
```

## 技术栈

### 移动端
- Expo + React Native (~54.0.32 / 0.81.5)
- Zustand (状态管理)
- @rnmapbox/maps (地图)
- React Navigation (导航)

### 后端
- FastAPI (^0.115.0)
- PostgreSQL + SQLAlchemy
- Redis (缓存)
- Celery (异步任务)

## 快速开始

### 移动端开发

```bash
cd apps

# 安装��赖
npm install

# 启动开发服务器
npm start

# 运行 iOS
npm run ios

# 运行 Android
npm run android
```

### 后端开发

```bash
cd server

# 安装依赖
poetry install

# 启动开发服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 运行数据库迁移
alembic upgrade head

# 启动 Celery worker
celery -A app.tasks.celery_app worker -l info
```

## 设计文档

详细的设计方案请查看: [docs/designs/2025-01-28-doggy-meetup-design.md](./docs/designs/2025-01-28-doggy-meetup-design.md)

## 许可证

MIT
