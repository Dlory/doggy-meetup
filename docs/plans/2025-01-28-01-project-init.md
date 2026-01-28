# 阶段一：项目初始化 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 搭建项目基础结构，配置开发环境，建立数据库模型

**Architecture:** 移动端 Expo + React Native，后端 FastAPI + PostgreSQL + Redis，模块化分层架构

**Tech Stack:** Expo 54, FastAPI 0.115, PostgreSQL, SQLAlchemy, Alembic

**Reference:** 基于 `docs/framework.md` 技术框架

---

## Task 1: 初始化 Git 仓库

**Files:**
- Modify: 项目根目录

**Step 1: 初始化 Git**

```bash
cd /Users/stargin/Work/doggy-meetup
git init
```

**Step 2: 首次提交**

```bash
git add .
git commit -m "chore: initialize project structure"
```

---

## Task 2: 配置后端项目基础结构

**Files:**
- Create: `server/pyproject.toml`
- Create: `server/requirements.txt`
- Create: `server/app/__init__.py`
- Create: `server/app/main.py`
- Create: `server/app/core/__init__.py`
- Create: `server/app/core/config.py`
- Create: `server/app/core/security.py`
- Create: `server/app/api/__init__.py`
- Create: `server/app/api/deps.py`
- Create: `server/.gitignore`

**Step 1: 创建 Poetry 依赖配置**

```toml
# server/pyproject.toml
[tool.poetry]
name = "doggy-meetup-server"
version = "0.1.0"
description = "Doggy Meetup Backend API"
authors = ["Your Name"]

[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.115.0"
uvicorn = "^0.32.0"
sqlalchemy = "^2.0.35"
asyncpg = "^0.29.0"
alembic = "^1.13.3"
redis = "^5.2.0"
celery = "^5.4.0"
pydantic = "^2.9.0"
pydantic-settings = "^2.6.0"
python-jose = "^3.3.0"
passlib = "^1.7.4"
websockets = "^13.1"
geopy = "^2.4.1"
boto3 = "^1.35.50"
firebase-admin = "^6.5.0"
httpx = "^0.27.2"

[tool.poetry.group.dev.dependencies]
pytest = "^8.3.3"
pytest-asyncio = "^0.24.0"
black = "^24.10.0"
ruff = "^0.7.1"
mypy = "^1.12.0"
pre-commit = "^4.0.1"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"

[tool.black]
line-length = 100
target-version = ['py311']

[tool.ruff]
line-length = 100
target-version = "py311"
```

**Step 2: 创建配置管理模块**

```python
# server/app/core/config.py
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Mapbox
    MAPBOX_ACCESS_TOKEN: str

    # Firebase (optional)
    FIREBASE_CREDENTIALS_PATH: str | None = None

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
```

**Step 3: 创建主应用入口**

```python
# server/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

app = FastAPI(
    title="Doggy Meetup API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境需限制
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Doggy Meetup API", "version": "0.1.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
```

**Step 4: 创建目录结构**

```bash
cd server && mkdir -p app/{core,api,models,schemas,services,tasks}
mkdir -p alembic/versions
```

**Step 5: 创建 .gitignore**

```
# server/.gitignore
__pycache__/
*.py[cod]
*$py.class
.env
.venv
venv/
.alembic/
*.db
*.sqlite3
.pytest_cache/
.coverage
htmlcov/
dist/
build/
*.egg-info/
```

**Step 6: 提交**

```bash
git add server/
git commit -m "feat: setup backend project structure and config"
```

---

## Task 3: 配置后端数据库连接

**Files:**
- Create: `server/app/database.py`
- Create: `server/alembic.ini`
- Create: `server/alembic/env.py`

**Step 1: 创建数据库连接模块**

```python
# server/app/database.py
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
```

**Step 2: 创建 Alembic 配置文件**

```ini
# server/alembic.ini
[alembic]
script_location = alembic
sqlalchemy.url = postgresql+asyncpg://user:password@localhost/doggymeetup

[loggers]
keys = root,sqlalchemy,alembic
```

**Step 3: 创建 Alembic 环境配置**

```python
# server/alembic/env.py
from asyncio import run
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import async_engine_from_config
from alembic import context
from app.core.config import settings
from app.database import Base

config = context.config
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
target_metadata = Base.metadata

async def run_async_migrations():
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()

def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

if context.is_offline_mode():
    context.configure(url=config.get_main_option("sqlalchemy.url"), target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()
else:
    run(run_async_migrations())
```

**Step 4: 提交**

```bash
git add server/app/database.py server/alembic.ini server/alembic/env.py
git commit -m "feat: add database connection and alembic config"
```

---

## Task 4: 创建用户模型

**Files:**
- Create: `server/app/models/user.py`

**Step 1: 创建用户模型**

```python
# server/app/models/user.py
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nickname = Column(String(50), nullable=False)
    avatar = Column(String(500), nullable=True)
    phone = Column(String(20), nullable=True, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<User {self.nickname}>"
```

**Step 2: 创建迁移**

```bash
cd server && alembic revision --autogenerate -m "add users table"
alembic upgrade head
```

**Step 3: 提交**

```bash
git add server/app/models/user.py
git commit -m "feat: add user model"
```

---

## Task 5: 创建狗狗模型

**Files:**
- Create: `server/app/models/dog.py`

**Step 1: 创建狗狗模型**

```python
# server/app/models/dog.py
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship

from app.database import Base


class DogSize(str, Enum):
    small = "small"
    medium = "medium"
    large = "large"
    giant = "giant"


class DogGender(str, Enum):
    male = "male"
    female = "female"


class Dog(Base):
    __tablename__ = "dogs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String(50), nullable=False)
    breed = Column(String(50), nullable=False)
    size = Column(Enum(DogSize), nullable=False)
    gender = Column(Enum(DogGender), nullable=False)
    age_months = Column(Integer, nullable=False)
    mbti = Column(String(4), nullable=True)
    avatar = Column(String(500), nullable=True)
    images = Column(ARRAY(String), nullable=True, default=list)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", backref="dogs")

    def __repr__(self):
        return f"<Dog {self.name}>"
```

**Step 2: 创建迁移**

```bash
cd server && alembic revision --autogenerate -m "add dogs table"
alembic upgrade head
```

**Step 3: 提交**

```bash
git add server/app/models/dog.py
git commit -m "feat: add dog model"
```

---

## Task 6: 创建地点模型

**Files:**
- Create: `server/app/models/location.py`

**Step 1: 创建地点模型**

```python
# server/app/models/location.py
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, ARRAY
from sqlalchemy.dialects.postgresql import UUID as PGUUID, ARRAY as PGArray
from sqlalchemy.orm import relationship

from app.database import Base


class Location(Base):
    __tablename__ = "locations"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    address = Column(String(500), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    is_dog_friendly = Column(Boolean, default=True)
    tags = Column(PGArray(String), nullable=True, default=list)
    created_by = Column(PGUUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    sessions = relationship("Session", back_populates="location")

    def __repr__(self):
        return f"<Location {self.name}>"
```

**Step 2: 创建迁移**

```bash
cd server && alembic revision --autogenerate -m "add locations table"
alembic upgrade head
```

**Step 3: 提交**

```bash
git add server/app/models/location.py
git commit -m "feat: add location model"
```

---

## Task 7: 创建聚会模型

**Files:**
- Create: `server/app/models/session.py`

**Step 1: 创建聚会模型**

```python
# server/app/models/session.py
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum, JSON, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class SessionStatus(str, Enum):
    recruiting = "recruiting"
    full = "full"
    upcoming = "upcoming"
    ended = "ended"
    cancelled = "cancelled"


class Session(Base):
    __tablename__ = "sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id = Column(UUID(as_uuid=True), nullable=False)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=False)
    title = Column(String(100), nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    max_dogs = Column(Integer, nullable=False)
    requirements = Column(JSON, nullable=True)
    status = Column(Enum(SessionStatus), default=SessionStatus.recruiting)
    chat_group_id = Column(UUID(as_uuid=True), ForeignKey("chat_groups.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    location = relationship("Location", back_populates="sessions")
    chat_group = relationship("ChatGroup", back_populates="session", foreign_keys=[chat_group_id])

    def __repr__(self):
        return f"<Session {self.title}>"


# 关联表
session_participants = Table(
    'session_participants', Base.metadata,
    Column('session_id', UUID(as_uuid=True), ForeignKey("sessions.id"), primary_key=True),
    Column('dog_id', UUID(as_uuid=True), ForeignKey("dogs.id"), primary_key=True),
    Column('joined_at', DateTime, default=datetime.utcnow, nullable=False)
)
```

**Step 2: 创建迁移**

```bash
cd server && alembic revision --autogenerate -m "add sessions table"
alembic upgrade head
```

**Step 3: 提交**

```bash
git add server/app/models/session.py
git commit -m "feat: add session model"
```

---

## Task 8: 创建聊天模型

**Files:**
- Create: `server/app/models/chat.py`

**Step 1: 创建聊天模型**

```python
# server/app/models/chat.py
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class ChatMessageType(str, Enum):
    text = "text"
    voice = "voice"
    location = "location"
    system = "system"


class ChatGroup(Base):
    __tablename__ = "chat_groups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id"), nullable=False)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    session = relationship("Session", back_populates="chat_group")
    messages = relationship("ChatMessage", back_populates="group", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<ChatGroup {self.name}>"


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id = Column(UUID(as_uuid=True), ForeignKey("chat_groups.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    message_type = Column(Enum(ChatMessageType), default=ChatMessageType.text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    group = relationship("ChatGroup", back_populates="messages")

    def __repr__(self):
        return f"<ChatMessage {self.id}>"
```

**Step 2: 创建迁移**

```bash
cd server && alembic revision --autogenerate -m "add chat models"
alembic upgrade head
```

**Step 3: 提交**

```bash
git add server/app/models/chat.py
git commit -m "feat: add chat models"
```

---

## Task 9: 创建动态模型

**Files:**
- Create: `server/app/models/post.py`

**Step 1: 创建动态模型**

```python
# server/app/models/post.py
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, ARRAY as PGArray
from sqlalchemy.orm import relationship

from app.database import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    dog_id = Column(UUID(as_uuid=True), ForeignKey("dogs.id"), nullable=False)
    content = Column(Text, nullable=True)
    images = Column(PGArray(String), nullable=True, default=list)
    tags = Column(PGArray(String), nullable=True, default=list)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", backref="posts")
    dog = relationship("Dog", backref="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Post {self.id}>"


class Comment(Base):
    __tablename__ = "comments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUID(as_uuid=True), ForeignKey("posts.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    post = relationship("Post", back_populates="comments")

    def __repr__(self):
        return f"<Comment {self.id}>"
```

**Step 2: 创建迁移**

```bash
cd server && alembic revision --autogenerate -m "add posts and comments"
alembic upgrade head
```

**Step 3: 提交**

```bash
git add server/app/models/post.py
git commit -m "feat: add post and comment models"
```

---

## Task 10: 更新模型模块导出

**Files:**
- Modify: `server/app/models/__init__.py`

**Step 1: 更新导出**

```python
# server/app/models/__init__.py
from app.models.user import User
from app.models.dog import Dog, DogSize, DogGender
from app.models.location import Location
from app.models.session import Session, SessionStatus
from app.models.chat import ChatGroup, ChatMessage, ChatMessageType
from app.models.post import Post, Comment

__all__ = [
    "User",
    "Dog", "DogSize", "DogGender",
    "Location",
    "Session", "SessionStatus",
    "ChatGroup", "ChatMessage", "ChatMessageType",
    "Post", "Comment",
]
```

**Step 2: 提交**

```bash
git add server/app/models/__init__.py
git commit -m "chore: export all models"
```

---

## Task 11: 配置 RN 项目依赖

**Files:**
- Create: `apps/package.json`
- Create: `apps/app.json`
- Create: `apps/eas.json`
- Create: `apps/tsconfig.json`
- Create: `apps/.gitignore`

**Step 1: 创建 package.json**

```json
// apps/package.json
{
  "name": "doggy-meetup",
  "version": "0.1.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "ios": "expo run:ios",
    "android": "expo run:android",
    "ios:auto": "IP=$(ipconfig getifaddr en0) && EXPO_PUBLIC_API_URL=http://$IP:8000/api/v1 expo run:ios",
    "android:auto": "IP=$(ipconfig getifaddr en0) && EXPO_PUBLIC_API_URL=http://$IP:8000/api/v1 expo run:android",
    "lint": "eslint .",
    "test": "jest"
  },
  "dependencies": {
    "expo": "~54.0.32",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "react-dom": "19.1.0",
    "react-native-web": "^0.21.0",
    "@rnmapbox/maps": "^10.2.10",
    "expo-location": "^19.0.8",
    "gcoord": "^1.0.7",
    "@react-navigation/native": "^7.1.28",
    "@react-navigation/native-stack": "^7.10.1",
    "@react-navigation/bottom-tabs": "^7.10.1",
    "react-native-screens": "~4.16.0",
    "react-native-safe-area-context": "^5.6.2",
    "zustand": "^5.0.10",
    "react-native-paper": "^5.14.5",
    "@expo/vector-icons": "^15.0.3",
    "react-hook-form": "^7.71.1",
    "@react-native-async-storage/async-storage": "^2.2.0",
    "expo-secure-store": "^15.0.8",
    "axios": "^1.13.2",
    "expo-background-fetch": "^14.0.9",
    "expo-task-manager": "^14.0.9",
    "@react-native-community/netinfo": "^11.4.1",
    "expo-clipboard": "^8.0.8",
    "expo-av": "^16.0.8"
  },
  "devDependencies": {
    "typescript": "~5.9.2",
    "@types/react": "~19.1.0",
    "expo-dev-client": "^6.0.20"
  },
  "private": true
}
```

**Step 2: 创建 app.json**

```json
// apps/app.json
{
  "expo": {
    "name": "狗狗拼团",
    "slug": "doggy-meetup",
    "version": "0.1.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "plugins": [
      [
        "@rnmapbox/maps",
        {
          "RNMapboxMapsImpl": "mapbox"
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "需要位置权限以发现附近的聚会地点",
          "backgroundMode": true
        }
      ]
    ],
    "ios": {
      "bundleIdentifier": "com.doggymeetup.app",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "需要位置权限以发现附近的聚会地点",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "需要后台位置权限以持续追踪活动位置",
        "UIBackgroundModes": ["location", "fetch"]
      }
    },
    "android": {
      "package": "com.doggymeetup.app",
      "versionCode": 1,
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE",
        "FOREGROUND_SERVICE_LOCATION",
        "POST_NOTIFICATIONS"
      ]
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

**Step 3: 创建 eas.json**

```json
// apps/eas.json
{
  "cli": { "version": ">= 16.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  }
}
```

**Step 4: 创建 tsconfig.json**

```json
// apps/tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**Step 5: 创建 .gitignore**

```
# apps/.gitignore
node_modules/
.expo/
.expo-shared/
dist/
web-build/
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-report/
.env
```

**Step 6: 提交**

```bash
git add apps/package.json apps/app.json apps/eas.json apps/tsconfig.json apps/.gitignore
git commit -m "feat: setup RN project dependencies and config"
```

---

## Task 12: 初始化 RN 项目结构

**Files:**
- Create: `apps/src/index.ts`
- Create: `apps/App.tsx`
- Create: `apps/src/config.ts`

**Step 1: 创建入口文件**

```typescript
// apps/src/index.ts
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

**Step 2: 创建主 App 组件**

```typescript
// apps/App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function HomeScreen() {
  return null;
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: '狗狗拼团' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
```

**Step 3: 创建配置文件**

```typescript
// apps/src/config.ts
const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  mapboxAccessToken: process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '',
};

export default config;
```

**Step 4: 创建目录结构**

```bash
cd apps && mkdir -p src/{components,screens,navigators,services,stores,types,hooks,utils,assets}
```

**Step 5: 提交**

```bash
git add apps/src/index.ts apps/App.tsx apps/src/config.ts
git commit -m "feat: initialize RN app structure"
```

---

## Task 13: 配置环境变量示例

**Files:**
- Create: `apps/.env.example`
- Create: `server/.env.example`

**Step 1: 创建环境变量示例**

```env
# apps/.env.example
EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1
EXPO_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

```env
# server/.env.example
DATABASE_URL=postgresql+asyncpg://user:password@localhost/doggymeetup
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=change-this-in-production
MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

**Step 2: 提交**

```bash
git add apps/.env.example server/.env.example
git commit -m "chore: add env examples"
```

---

## 完成检查

**后端检查:**
```bash
cd server
poetry install
alembic current
python -m app.main
```

**前端检查:**
```bash
cd apps
npm install
npm start
```

**阶段一验收标准:**
- [ ] Git 仓库初始化完成
- [ ] 后端 Poetry 依赖配置完成
- [ ] 数据库模型创建并迁移成功
- [ ] RN 项目依赖安装成功
- [ ] Mapbox 插件配置正确
- [ ] iOS/Android 权限配置完成
