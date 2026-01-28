# GuardAngel 项目技术框架文档

> 本文档记录项目中使用的所有技术栈及版本号，方便后续项目快速复用已验证的配置。

---

## 项目架构

```
guardAngle/
├── apps_reacte_native/    # React Native 移动应用 (Expo)
├── server/                # Python FastAPI 后端服务
├── web-share/             # React + Vite 分享页面
└── scripts/               # 通用脚本
```

---

## 1. React Native 移动端 (Expo)

### 核心框架
| 依赖 | 版本 | 用途 |
|------|------|------|
| expo | ~54.0.32 | React Native 开发框架 |
| react | 19.1.0 | UI 框架 |
| react-native | 0.81.5 | 原生组件库 |
| react-dom | 19.1.0 | Web 渲染支持 |
| react-native-web | ^0.21.0 | Web 平台兼容 |

### 地图���件（重点）
| 依赖 | 版本 | 用途 |
|------|------|------|
| @rnmapbox/maps | ^10.2.10 | Mapbox 地图 SDK（核心） |
| expo-location | ^19.0.8 | 位置服务（GPS定位） |
| gcoord | ^1.0.7 | 坐标系转换工具 |

**Mapbox 配置要点：**
```json
// app.json 中的插件配置
"plugins": [
  ["@rnmapbox/maps", {"RNMapboxMapsImpl": "mapbox"}]
]
```
- 需要在 Mapbox 官网申请 Access Token
- 支持 iOS 和 Android 双平台
- 支持后台位置追踪（守护模式核心功能）

### 导航
| 依赖 | 版本 | 用途 |
|------|------|------|
| @react-navigation/native | ^7.1.28 | 导航核心 |
| @react-navigation/native-stack | ^7.10.1 | 原生栈导航 |
| @react-navigation/bottom-tabs | ^7.10.1 | 底部标签导航 |
| react-native-screens | ~4.16.0 | 原生屏幕优化 |
| react-native-safe-area-context | ^5.6.2 | 安全区域处理 |

### 状态管理
| 依赖 | 版本 | 用途 |
|------|------|------|
| zustand | ^5.0.10 | 轻量级状态管理 |

### UI 组件库
| 依赖 | 版本 | 用途 |
|------|------|------|
| react-native-paper | ^5.14.5 | Material Design 组件库 |
| @expo/vector-icons | ^15.0.3 | 图标库 |

### 表单处理
| 依赖 | 版本 | 用途 |
|------|------|------|
| react-hook-form | ^7.71.1 | 表单验证与状态管理 |

### 数据持久化
| 依赖 | 版本 | 用途 |
|------|------|------|
| @react-native-async-storage/async-storage | ^2.2.0 | 本地键值存储 |
| expo-secure-store | ^15.0.8 | 安全存储（敏感信息） |

### 网络请求
| 依赖 | 版本 | 用途 |
|------|------|------|
| axios | ^1.13.2 | HTTP 客户端 |

### 后台任务
| 依赖 | 版本 | 用途 |
|------|------|------|
| expo-background-fetch | ^14.0.9 | 后台任务调度 |
| expo-task-manager | ^14.0.9 | 任务管理器 |
| @react-native-community/netinfo | ^11.4.1 | 网络状态检测 |

### 其他工具
| 依赖 | 版本 | 用途 |
|------|------|------|
| expo-clipboard | ^8.0.8 | 剪贴板操作 |
| expo-av | ^16.0.8 | 音视频播放 |

### 开发工具
| 依赖 | 版本 | 用途 |
|------|------|------|
| typescript | ~5.9.2 | 类型系统 |
| @types/react | ~19.1.0 | React 类型定义 |
| expo-dev-client | ^6.0.20 | 开发客户端（开发构建） |

### Expo 构建配置 (EAS)
```json
// eas.json
{
  "cli": { "version": ">= 16.0.0" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal" },
    "production": { "distribution": "store" }
  }
}
```

### iOS 权限配置
```xml
<!-- app.json iOS infoPlist -->
NSLocationWhenInUseUsageDescription
NSLocationAlwaysAndWhenInUseUsageDescription
UIBackgroundModes: ["location", "fetch"]
```

### Android 权限配置
```xml
<!-- app.json Android permissions -->
ACCESS_COARSE_LOCATION
ACCESS_FINE_LOCATION
ACCESS_BACKGROUND_LOCATION
FOREGROUND_SERVICE
FOREGROUND_SERVICE_LOCATION
POST_NOTIFICATIONS
```

---

## 2. Python 后端 (FastAPI)

### 核心框架
| 依赖 | 版本 | 用途 |
|------|------|------|
| python | ^3.11 | 运行环境 |
| fastapi | ^0.115.0 | Web 框架 |
| uvicorn | ^0.32.0 | ASGI 服务器 |

### 数据库
| 依赖 | 版本 | 用途 |
|------|------|------|
| sqlalchemy | ^2.0.35 | ORM |
| asyncpg | ^0.29.0 | PostgreSQL 异步驱动 |
| alembic | ^1.13.3 | 数据库迁移 |

### 缓存/消息队列
| 依赖 | 版本 | 用途 |
|------|------|------|
| redis | ^5.2.0 | 缓存 + 消息队列 |
| celery | ^5.4.0 | 异步任务队列 |

### 数据验证
| 依赖 | 版本 | 用途 |
|------|------|------|
| pydantic | ^2.9.0 | 数据验证 |
| pydantic-settings | ^2.6.0 | 配置管理 |

### 认证
| 依赖 | 版本 | 用途 |
|------|------|------|
| python-jose | ^3.3.0 | JWT 处理 |
| passlib | ^1.7.4 | 密码哈希 |

### 实时通信
| 依赖 | 版本 | 用途 |
|------|------|------|
| websockets | ^13.1 | WebSocket 支持 |

### 地理位置
| 依赖 | 版本 | 用途 |
|------|------|------|
| geopy | ^2.4.1 | 地理位置计算 |

### 第三方服务
| 依赖 | 版本 | 用途 |
|------|------|------|
| boto3 | ^1.35.50 | AWS SDK |
| firebase-admin | ^6.5.0 | Firebase 推送 |

### HTTP 客户端
| 依赖 | 版本 | 用途 |
|------|------|------|
| httpx | ^0.27.2 | 异步 HTTP 客户端 |

### 开发工具
| 依赖 | 版本 | 用途 |
|------|------|------|
| poetry | - | 依赖管理 |
| pytest | ^8.3.3 | 测试框架 |
| pytest-asyncio | ^0.24.0 | 异步测试 |
| black | ^24.10.0 | 代码格式化 |
| ruff | ^0.7.1 | Linter |
| mypy | ^1.12.0 | 类型检查 |
| pre-commit | ^4.0.1 | Git hooks |

### 代码风格配置
```toml
[tool.black]
line-length = 100
target-version = ['py311']

[tool.ruff]
line-length = 100
target-version = "py311"
```

---

## 3. Web 分享页面 (React + Vite)

### 核心框架
| 依赖 | 版本 | 用途 |
|------|------|------|
| react | ^19.2.0 | UI 框架 |
| react-dom | ^19.2.0 | DOM 渲染 |
| vite | ^7.2.4 | 构建工具 |
| @vitejs/plugin-react | ^5.1.1 | React 支持 |

### 地图
| 依赖 | 版本 | 用途 |
|------|------|------|
| mapbox-gl | ^3.18.1 | Mapbox GL JS |
| @types/mapbox-gl | ^3.4.1 | 类型定义 |

### 样式
| 依赖 | 版本 | 用途 |
|------|------|------|
| tailwindcss | ^4.1.18 | CSS 框架 |
| @tailwindcss/postcss | ^4.1.18 | PostCSS 集成 |
| postcss | ^8.5.6 | CSS 处理 |
| autoprefixer | ^10.4.23 | CSS 兼容 |

### 开发工具
| 依赖 | 版本 | 用途 |
|------|------|------|
| typescript | ~5.9.3 | 类型系统 |
| eslint | ^9.39.1 | 代码检查 |
| typescript-eslint | ^8.46.4 | TS ESLint |

### Vite 配置要点
```typescript
{
  base: '/share/static/',           // 静态资源路径
  outDir: '../server/app/static/share', // 构建输出到后端静态目录
  proxy: { '/api': 'http://localhost:8000' } // 开发代理
}
```

---

## 4. 项目启动流程

### 移动端开发
```bash
cd apps_reacte_native

# 安装依赖
npm install

# 启动开发服务器
npm start

# 运行 iOS
npm run ios

# 运行 Android
npm run android

# 自动更新本地 IP 后运行（局域网调试）
npm run ios:auto
npm run android:auto
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

### Web 分享页面开发
```bash
cd web-share

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```

---

## 5. Mapbox 地图配置要点

### Mapbox Public Token 配置
```typescript
// 在应用启动时设置
Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN || 'YOUR_TOKEN');
```

### 需要注意的版本兼容性
- `@rnmapbox/maps@10.2.10` 与 `expo@54` 兼容
- iOS 需要 CocoaPods 安装原生依赖
- Android 需要在 `app.json` 配置权限

### 后台定位配置
```json
{
  "plugins": [
    ["expo-location", {
      "locationAlwaysAndWhenInUsePermission": "需要后台位置权限以持续守护您的安全",
      "backgroundMode": true
    }]
  ]
}
```

---

## 6. 下个项目启动清单

- [ ] 复制 `apps_reacte_native/package.json` 中的依赖版本
- [ ] 配置 Mapbox Access Token
- [ ] 配置 iOS/Android 位置权限
- [ ] 设置 `app.json` 中的 bundleIdentifier/package
- [ ] 配置后端 Poetry 依赖
- [ ] 设置 Vite 输出路径与后端集成
- [ ] 配置 EAS Build（如需云端构建）

---

*文档生成时间: 2026-01-28*
*项目: GuardAngel - 守护天使 App*
