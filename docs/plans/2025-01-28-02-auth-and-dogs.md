# 阶段二：认证与狗狗档案 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现用户认证系统和狗狗档案 CRUD 功能

**Duration:** 3-4天

**Tech Stack:** FastAPI, JWT, React Native, Expo Secure Store, React Hook Form

**Reference:** `docs/designs/2025-01-28-doggy-meetup-design.md`

---

## Task 1: 后端认证 API

**Files:**
- Create: `server/app/core/security.py` - JWT 工具函数
- Create: `server/app/schemas/auth.py` - 认证相关 Schema
- Create: `server/app/schemas/user.py` - 用户 Schema
- Create: `server/app/services/auth_service.py` - 认证业务逻辑
- Create: `server/app/api/v1/auth.py` - 认证路由

**Step 1: JWT 安全工具**

```python
# server/app/core/security.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.core.config import settings

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")

def verify_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except JWTError:
        return None
```

**Step 2: 创建认证 Schema**

```python
# server/app/schemas/auth.py
from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    phone: str
    code: str  # 验证码登录

class RegisterRequest(BaseModel):
    phone: str
    nickname: str
    code: str

class TokenResponse(BaseModel):
    access_token: str
    user: "UserResponse"
```

**Step 3: 创建用户 Schema**

```python
# server/app/schemas/user.py
from pydantic import BaseModel
from uuid import UUID

class UserBase(BaseModel):
    nickname: str
    avatar: str | None = None

class UserResponse(UserBase):
    id: UUID
    phone: str | None = None

class UserUpdate(BaseModel):
    nickname: str | None = None
    avatar: str | None = None
```

**Step 4: 创建认证服务**

```python
# server/app/services/auth_service.py
# 业务逻辑：验证码验证、用户注册/登录、Token生成
```

**Step 5: 创建认证路由**

```python
# server/app/api/v1/auth.py
from fastapi import APIRouter, Depends
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["认证"])

@router.post("/send-code")
async def send_code(phone: str):
    """发送验证码（MVP阶段可跳过真实发送）"""
    pass

@router.post("/register", response_model=TokenResponse)
async def register(data: RegisterRequest):
    """注册新用户"""
    pass

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    """验证码登录"""
    pass

@router.get("/me", response_model=UserResponse)
async def get_current_user():
    """获取当前用户信息"""
    pass
```

**Step 6: 注册路由到主应用**

```python
# server/app/main.py
from app.api.v1 import auth
app.include_router(auth.router, prefix="/api/v1")
```

**Step 7: 提交**

```bash
git add server/app/core/security.py server/app/schemas/ server/app/services/auth_service.py server/app/api/v1/auth.py
git commit -m "feat: add authentication API"
```

---

## Task 2: 后端狗狗 API

**Files:**
- Create: `server/app/schemas/dog.py` - 狗狗 Schema
- Create: `server/app/services/dog_service.py` - 狗狗业务逻辑
- Create: `server/app/api/v1/dogs.py` - 狗狗路由

**Step 1: 创建狗狗 Schema**

```python
# server/app/schemas/dog.py
from pydantic import BaseModel
from uuid import UUID
from app.models.dog import DogSize, DogGender

class DogBase(BaseModel):
    name: str
    breed: str
    size: DogSize
    gender: DogGender
    age_months: int
    avatar: str | None = None

class DogCreate(DogBase):
    pass

class DogResponse(DogBase):
    id: UUID
    user_id: UUID
    mbti: str | None = None

class DogUpdate(BaseModel):
    name: str | None = None
    breed: str | None = None
    size: DogSize | None = None
    gender: DogGender | None = None
    age_months: int | None = None
    avatar: str | None = None
```

**Step 2: 创建狗狗服务**

```python
# server/app/services/dog_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.dog import Dog
from app.schemas.dog import DogCreate, DogUpdate

class DogService:
    async def get_user_dogs(self, db: AsyncSession, user_id: UUID) -> list[Dog]:
        pass

    async def create_dog(self, db: AsyncSession, user_id: UUID, data: DogCreate) -> Dog:
        pass

    async def update_dog(self, db: AsyncSession, dog_id: UUID, data: DogUpdate) -> Dog:
        pass

    async def delete_dog(self, db: AsyncSession, dog_id: UUID) -> bool:
        pass
```

**Step 3: 创建狗狗路由**

```python
# server/app/api/v1/dogs.py
from fastapi import APIRouter, Depends
from app.schemas.dog import DogCreate, DogResponse, DogUpdate

router = APIRouter(prefix="/dogs", tags=["狗狗"])

@router.get("", response_model=list[DogResponse])
async def get_my_dogs():
    """获取我的狗狗列表"""
    pass

@router.post("", response_model=DogResponse)
async def create_dog(data: DogCreate):
    """创建狗狗档案"""
    pass

@router.get("/{dog_id}", response_model=DogResponse)
async def get_dog(dog_id: UUID):
    """获取狗狗详情"""
    pass

@router.put("/{dog_id}", response_model=DogResponse)
async def update_dog(dog_id: UUID, data: DogUpdate):
    """更新狗狗信息"""
    pass

@router.delete("/{dog_id}")
async def delete_dog(dog_id: UUID):
    """删除狗狗"""
    pass
```

**Step 4: 提交**

```bash
git add server/app/schemas/dog.py server/app/services/dog_service.py server/app/api/v1/dogs.py
git commit -m "feat: add dog CRUD API"
```

---

## Task 3: 前端 API 服务层

**Files:**
- Create: `apps/src/services/api.ts` - Axios 封装
- Create: `apps/src/services/auth.ts` - 认证 API
- Create: `apps/src/services/dogs.ts` - 狗狗 API
- Create: `apps/src/services/storage.ts` - Token 存储

**Step 1: 创建 Axios 封装**

```typescript
// apps/src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器：添加 Token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**Step 2: 创建认证 API**

```typescript
// apps/src/services/auth.ts
import api from './api';

export interface LoginRequest {
  phone: string;
  code: string;
}

export interface RegisterRequest {
  phone: string;
  nickname: string;
  code: string;
}

export const authService = {
  sendCode: (phone: string) => api.post('/auth/send-code', { phone }),
  register: (data: RegisterRequest) => api.post('/auth/register', data),
  login: (data: LoginRequest) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};
```

**Step 3: 创建狗狗 API**

```typescript
// apps/src/services/dogs.ts
import api from './api';
import { DogCreate, DogUpdate } from '@/types/dog';

export const dogsService = {
  getMyDogs: () => api.get('/dogs'),
  createDog: (data: DogCreate) => api.post('/dogs', data),
  getDog: (id: string) => api.get(`/dogs/${id}`),
  updateDog: (id: string, data: DogUpdate) => api.put(`/dogs/${id}`, data),
  deleteDog: (id: string) => api.delete(`/dogs/${id}`),
};
```

**Step 4: 提交**

```bash
git add apps/src/services/
git commit -m "feat: add API service layer"
```

---

## Task 4: 前端状态管理

**Files:**
- Create: `apps/src/stores/authStore.ts` - 认证状态
- Create: `apps/src/stores/dogStore.ts` - 狗狗状态

**Step 1: 创建认证 Store**

```typescript
// apps/src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (phone: string, code: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (phone, code) => {
        const res = await authService.login({ phone, code });
        set({ user: res.data.user, token: res.data.access_token, isAuthenticated: true });
      },

      register: async (data) => {
        const res = await authService.register(data);
        set({ user: res.data.user, token: res.data.access_token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-storage' }
  )
);
```

**Step 2: 创建狗狗 Store**

```typescript
// apps/src/stores/dogStore.ts
import { create } from 'zustand';
import { dogsService } from '@/services/dogs';

interface DogState {
  dogs: Dog[];
  loading: boolean;
  fetchDogs: () => Promise<void>;
  createDog: (data: DogCreate) => Promise<void>;
  updateDog: (id: string, data: DogUpdate) => Promise<void>;
  deleteDog: (id: string) => Promise<void>;
}

export const useDogStore = create<DogState>((set, get) => ({
  dogs: [],
  loading: false,

  fetchDogs: async () => {
    set({ loading: true });
    const res = await dogsService.getMyDogs();
    set({ dogs: res.data, loading: false });
  },

  createDog: async (data) => {
    await dogsService.createDog(data);
    get().fetchDogs();
  },

  updateDog: async (id, data) => {
    await dogsService.updateDog(id, data);
    get().fetchDogs();
  },

  deleteDog: async (id) => {
    await dogsService.deleteDog(id);
    get().fetchDogs();
  },
}));
```

**Step 3: 提交**

```bash
git add apps/src/stores/
git commit -m "feat: add Zustand stores"
```

---

## Task 5: 认证页面 UI

**Files:**
- Create: `apps/src/screens/auth/LoginScreen.tsx`
- Create: `apps/src/screens/auth/RegisterScreen.tsx`
- Create: `apps/src/screens/auth/PhoneVerifyScreen.tsx`

**Step 1: 创建登录页面**

```typescript
// apps/src/screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuthStore } from '@/stores/authStore';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const login = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    await login(phone, code);
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>狗狗拼团</Text>
      <TextInput
        placeholder="手机号"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />
      <TextInput
        placeholder="验证码"
        value={code}
        onChangeText={setCode}
        style={styles.input}
      />
      <Button title="登录" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 32, textAlign: 'center', marginBottom: 40 },
  input: { borderWidth: 1, padding: 15, marginBottom: 15, borderRadius: 8 },
});
```

**Step 2: 创建注册页面**

```typescript
// apps/src/screens/auth/RegisterScreen.tsx
// 类似 LoginScreen，增加昵称输入
```

**Step 3: 创建验证码页面**

```typescript
// apps/src/screens/auth/PhoneVerifyScreen.tsx
// 手机号验证页面，发送验证码后跳转登录/注册
```

**Step 4: 提交**

```bash
git add apps/src/screens/auth/
git commit -m "feat: add auth screens"
```

---

## Task 6: 狗狗档案页面 UI

**Files:**
- Create: `apps/src/screens/dogs/MyDogsScreen.tsx`
- Create: `apps/src/screens/dogs/DogFormScreen.tsx`
- Create: `apps/src/screens/dogs/DogDetailScreen.tsx`
- Create: `apps/src/components/DogCard.tsx`

**Step 1: 创建狗狗列表页面**

```typescript
// apps/src/screens/dogs/MyDogsScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDogStore } from '@/stores/dogStore';
import DogCard from '@/components/DogCard';

export default function MyDogsScreen({ navigation }: any) {
  const { dogs, fetchDogs } = useDogStore();

  useEffect(() => {
    fetchDogs();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={dogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DogCard dog={item} onPress={() => navigation.navigate('DogDetail', { dogId: item.id })} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>还没有添加狗狗哦</Text>}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('DogForm')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
```

**Step 2: 创建狗狗表单页面**

```typescript
// apps/src/screens/dogs/DogFormScreen.tsx
import React from 'react';
import { View, ScrollView, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useDogStore } from '@/stores/dogStore';
import { DogCreate } from '@/types/dog';

export default function DogFormScreen({ navigation, route }: any) {
  const { createDog, updateDog } = useDogStore();
  const editingDog = route.params?.dog;

  const { control, handleSubmit } = useForm<DogCreate>({
    defaultValues: editingDog || { name: '', breed: '', size: 'medium', gender: 'male', age_months: 12 },
  });

  const onSubmit = async (data: DogCreate) => {
    if (editingDog) {
      await updateDog(editingDog.id, data);
    } else {
      await createDog(data);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>狗狗名字</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput value={value} onChangeText={onChange} style={styles.input} />
        )}
      />
      {/* 其他表单字段... */}
      <Button title="保存" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
}
```

**Step 3: 提交**

```bash
git add apps/src/screens/dogs/ apps/src/components/DogCard.tsx
git commit -m "feat: add dog screens and components"
```

---

## Task 7: 类型定义

**Files:**
- Create: `apps/src/types/user.ts`
- Create: `apps/src/types/dog.ts`
- Create: `apps/src/types/common.ts`

**Step 1: 创建类型文件**

```typescript
// apps/src/types/user.ts
export interface User {
  id: string;
  nickname: string;
  avatar: string | null;
  phone: string | null;
}

// apps/src/types/dog.ts
export enum DogSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
  giant = 'giant',
}

export enum DogGender {
  male = 'male',
  female = 'female',
}

export interface Dog {
  id: string;
  user_id: string;
  name: string;
  breed: string;
  size: DogSize;
  gender: DogGender;
  age_months: number;
  mbti: string | null;
  avatar: string | null;
}

export interface DogCreate {
  name: string;
  breed: string;
  size: DogSize;
  gender: DogGender;
  age_months: number;
  avatar?: string;
}

export interface DogUpdate {
  name?: string;
  breed?: string;
  size?: DogSize;
  gender?: DogGender;
  age_months?: number;
  avatar?: string;
}
```

**Step 2: 提交**

```bash
git add apps/src/types/
git commit -m "feat: add TypeScript types"
```

---

## 完成检查

**后端检查:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register -d '{"phone":"13800138000","nickname":"测试用户","code":"1234"}'
curl http://localhost:8000/api/v1/dogs -H "Authorization: Bearer <token>"
```

**前端检查:**
- [ ] 登录/注册流程正常
- [ ] 狗狗列表显示正确
- [ ] 狗狗创建/编辑/删除功能正常

**阶段二验收标准:**
- [ ] 用户可以通过验证码登录/注册
- [ ] Token 持久化存储
- [ ] 可以添加/编辑/删除狗狗
- [ ] 狗狗列表正常显示
