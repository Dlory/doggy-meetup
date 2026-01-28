# 阶段三：聚会核心功能 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现聚会发起、参加、列表展示、状态流转等核心功能

**Duration:** 5-7天

**Tech Stack:** FastAPI, React Native, Mapbox, React Hook Form

**Reference:** `docs/designs/2025-01-28-doggy-meetup-design.md` 第2.2、2.3节

---

## Task 1: 后端地点 API

**Files:**
- Create: `server/app/schemas/location.py` - 地点 Schema
- Create: `server/app/services/location_service.py` - 地点服务
- Create: `server/app/api/v1/locations.py` - 地点路由

**Step 1: 创建地点 Schema**

```python
# server/app/schemas/location.py
from pydantic import BaseModel
from uuid import UUID

class LocationBase(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    is_dog_friendly: bool = True
    tags: list[str] = []

class LocationCreate(LocationBase):
    pass

class LocationResponse(LocationBase):
    id: UUID
    created_by: UUID | None = None
```

**Step 2: 创建地点服务**

```python
# server/app/services/location_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from geopy.distance import geodesic
from app.models.location import Location

class LocationService:
    async def get_nearby(
        self, db: AsyncSession, lat: float, lng: float, radius_km: float = 10
    ) -> list[Location]:
        """获取附近地点，按距离排序"""
        pass

    async def search(self, db: AsyncSession, query: str) -> list[Location]:
        """搜索地点"""
        pass
```

**Step 3: 创建地点路由**

```python
# server/app/api/v1/locations.py
from fastapi import APIRouter, Query

router = APIRouter(prefix="/locations", tags=["地点"])

@router.get("/nearby", response_model=list[LocationResponse])
async def get_nearby_locations(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: float = Query(10)
):
    """获取附近地点"""
    pass

@router.get("/search", response_model=list[LocationResponse])
async def search_locations(q: str = Query(...)):
    """搜索地点"""
    pass
```

**Step 4: 提交**

```bash
git add server/app/schemas/location.py server/app/services/location_service.py server/app/api/v1/locations.py
git commit -m "feat: add location API"
```

---

## Task 2: 后端聚会 API

**Files:**
- Create: `server/app/schemas/session.py` - 聚会 Schema
- Create: `server/app/services/session_service.py` - 聚会服务
- Create: `server/app/api/v1/sessions.py` - 聚会路由

**Step 1: 创建聚会 Schema**

```python
# server/app/schemas/session.py
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from app.models.session import SessionStatus

class ParticipantFilter(BaseModel):
    size_min: str | None = None
    size_max: str | None = None
    breeds: list[str] = []
    age_min_months: int | None = None
    age_max_months: int | None = None

class SessionBase(BaseModel):
    title: str
    location_id: UUID
    scheduled_at: datetime
    max_dogs: int
    requirements: ParticipantFilter | None = None
    notes: str | None = None

class SessionCreate(SessionBase):
    pass

class SessionResponse(SessionBase):
    id: UUID
    creator_id: UUID
    status: SessionStatus
    current_dogs: int
    location: "LocationResponse"
    participants: list["DogResponse"]

class SessionListResponse(BaseModel):
    id: UUID
    title: str
    location_name: str
    scheduled_at: datetime
    current_dogs: int
    max_dogs: int
    status: SessionStatus
    creator_nickname: str
    creator_dog_avatar: str | None
    participant_avatars: list[str]
```

**Step 2: 创建聚会服务**

```python
# server/app/services/session_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.session import Session, SessionStatus, session_participants
from app.models.dog import Dog
from typing import Literal

class SessionService:
    async def list_sessions(
        self,
        db: AsyncSession,
        lat: float | None = None,
        lng: float | None = None,
        radius_km: float = 50,
        status: SessionStatus | None = None,
        dog_id: UUID | None = None,
    ) -> list[Session]:
        """获取聚会列表，支持按距离、状态、筛选条件过滤"""
        pass

    async def create_session(
        self, db: AsyncSession, creator_id: UUID, data: SessionCreate
    ) -> Session:
        """创建聚会"""
        pass

    async def join_session(
        self, db: AsyncSession, session_id: UUID, dog_id: UUID
    ) -> Session:
        """参加聚会"""
        pass

    async def leave_session(
        self, db: AsyncSession, session_id: UUID, dog_id: UUID
    ) -> bool:
        """离开聚会"""
        pass

    async def check_and_update_status(
        self, db: AsyncSession, session: Session
    ) -> Session:
        """检查并更新聚会状态（满员自动转为full）"""
        current_count = await self.get_participant_count(db, session.id)
        if current_count >= session.max_dogs and session.status == SessionStatus.recruiting:
            session.status = SessionStatus.full
            await db.commit()
        return session
```

**Step 3: 创建聚会路由**

```python
# server/app/api/v1/sessions.py
from fastapi import APIRouter, Query, Depends
from app.schemas.session import SessionCreate, SessionResponse, SessionListResponse

router = APIRouter(prefix="/sessions", tags=["聚会"])

@router.get("", response_model=list[SessionListResponse])
async def list_sessions(
    lat: float = Query(None),
    lng: float = Query(None),
    radius: float = Query(50),
    status: SessionStatus = Query(None),
    dog_id: str = Query(None)
):
    """获取聚会列表"""
    pass

@router.post("", response_model=SessionResponse)
async def create_session(data: SessionCreate):
    """发起聚会"""
    pass

@router.get("/{session_id}", response_model=SessionResponse)
async def get_session(session_id: UUID):
    """获取聚会详情"""
    pass

@router.post("/{session_id}/join", response_model=SessionResponse)
async def join_session(session_id: UUID, dog_id: UUID):
    """参加聚会"""
    pass

@router.post("/{session_id}/leave")
async def leave_session(session_id: UUID, dog_id: UUID):
    """离开聚会"""
    pass

@router.post("/{session_id}/start")
async def start_session_early(session_id: UUID):
    """管理员提前启动聚会"""
    pass

@router.delete("/{session_id}")
async def cancel_session(session_id: UUID):
    """取消聚会"""
    pass
```

**Step 4: 提交**

```bash
git add server/app/schemas/session.py server/app/services/session_service.py server/app/api/v1/sessions.py
git commit -m "feat: add session API"
```

---

## Task 3: 前端聚会 API 服务

**Files:**
- Create: `apps/src/services/sessions.ts` - 聚会 API
- Create: `apps/src/services/locations.ts` - 地点 API

**Step 1: 创建聚会 API**

```typescript
// apps/src/services/sessions.ts
import api from './api';

export const sessionsService = {
  list: (params: {
    lat?: number;
    lng?: number;
    radius?: number;
    status?: string;
    dog_id?: string;
  }) => api.get('/sessions', { params }),

  create: (data: SessionCreate) => api.post('/sessions', data),

  get: (id: string) => api.get(`/sessions/${id}`),

  join: (sessionId: string, dogId: string) => api.post(`/sessions/${sessionId}/join`, { dog_id: dogId }),

  leave: (sessionId: string, dogId: string) => api.post(`/sessions/${sessionId}/leave`, { dog_id: dogId }),

  startEarly: (sessionId: string) => api.post(`/sessions/${sessionId}/start`),

  cancel: (sessionId: string) => api.delete(`/sessions/${sessionId}`),
};
```

**Step 2: 创建地点 API**

```typescript
// apps/src/services/locations.ts
import api from './api';

export const locationsService = {
  getNearby: (lat: number, lng: number, radius = 10) =>
    api.get('/locations/nearby', { params: { lat, lng, radius } }),

  search: (query: string) => api.get('/locations/search', { params: { q: query } }),
};
```

**Step 3: 提交**

```bash
git add apps/src/services/sessions.ts apps/src/services/locations.ts
git commit -m "feat: add session and location API services"
```

---

## Task 4: 前端聚会状态管理

**Files:**
- Create: `apps/src/stores/sessionStore.ts` - 聚会状态
- Create: `apps/src/stores/locationStore.ts` - 地点状态

**Step 1: 创建聚会 Store**

```typescript
// apps/src/stores/sessionStore.ts
import { create } from 'zustand';
import { sessionsService } from '@/services/sessions';

interface SessionState {
  sessions: SessionListItem[];
  currentSession: Session | null;
  loading: boolean;
  fetchSessions: (params?: any) => Promise<void>;
  fetchSession: (id: string) => Promise<void>;
  createSession: (data: SessionCreate) => Promise<void>;
  joinSession: (sessionId: string, dogId: string) => Promise<void>;
  leaveSession: (sessionId: string, dogId: string) => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  currentSession: null,
  loading: false,

  fetchSessions: async (params = {}) => {
    set({ loading: true });
    const res = await sessionsService.list(params);
    set({ sessions: res.data, loading: false });
  },

  fetchSession: async (id) => {
    const res = await sessionsService.get(id);
    set({ currentSession: res.data });
  },

  createSession: async (data) => {
    await sessionsService.create(data);
    get().fetchSessions();
  },

  joinSession: async (sessionId, dogId) => {
    await sessionsService.join(sessionId, dogId);
    get().fetchSession(sessionId);
  },

  leaveSession: async (sessionId, dogId) => {
    await sessionsService.leave(sessionId, dogId);
    get().fetchSession(sessionId);
  },
}));
```

**Step 2: 创建地点 Store**

```typescript
// apps/src/stores/locationStore.ts
import { create } from 'zustand';
import { locationsService } from '@/services/locations';

interface LocationState {
  nearbyLocations: Location[];
  searchResults: Location[];
  loading: boolean;
  fetchNearby: (lat: number, lng: number) => Promise<void>;
  search: (query: string) => Promise<void>;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  nearbyLocations: [],
  searchResults: [],
  loading: false,

  fetchNearby: async (lat, lng) => {
    const res = await locationsService.getNearby(lat, lng);
    set({ nearbyLocations: res.data });
  },

  search: async (query) => {
    set({ loading: true });
    const res = await locationsService.search(query);
    set({ searchResults: res.data, loading: false });
  },
}));
```

**Step 3: 提交**

```bash
git add apps/src/stores/sessionStore.ts apps/src/stores/locationStore.ts
git commit -m "feat: add session and location stores"
```

---

## Task 5: 广场首页（聚会列表）

**Files:**
- Create: `apps/src/screens/plaza/PlazaScreen.tsx` - 广场首页
- Create: `apps/src/components/SessionCard.tsx` - 聚会卡片
- Create: `apps/src/components/PostCard.tsx` - 动态卡片（占位）

**Step 1: 创建聚会卡片组件**

```typescript
// apps/src/components/SessionCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface SessionCardProps {
  session: SessionListItem;
  onPress: () => void;
}

export default function SessionCard({ session, onPress }: SessionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recruiting': return '#4CAF50';
      case 'full': return '#9E9E9E';
      case 'upcoming': return '#2196F3';
      case 'ended': return '#757575';
      default: return '#4CAF50';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Image source={{ uri: session.creator_dog_avatar || '' }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.creator}>{session.creator_nickname}</Text>
          <Text style={styles.title}>{session.title}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
          <Text style={styles.statusText}>
            {session.status === 'recruiting' ? '招募中' : session.status}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.location}>📍 {session.location_name}</Text>
        <Text style={styles.time}>🕐 {formatTime(session.scheduled_at)}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.avatars}>
          {session.participant_avatars.slice(0, 5).map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.participantAvatar} />
          ))}
        </View>
        <Text style={styles.count}>
          🐶 {session.current_dogs}/{session.max_dogs}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
```

**Step 2: 创建广场首页**

```typescript
// apps/src/screens/plaza/PlazaScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useSessionStore } from '@/stores/sessionStore';
import SessionCard from '@/components/SessionCard';
import * as Location from 'expo-location';

export default function PlazaScreen({ navigation }: any) {
  const { sessions, loading, fetchSessions } = useSessionStore();
  const [filter, setFilter] = useState<'all' | 'recruiting' | 'nearby'>('all');

  useEffect(() => {
    loadSessions();
  }, [filter]);

  const loadSessions = async () => {
    // 获取当前位置
    const location = await Location.getCurrentPositionAsync({});
    await fetchSessions({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      status: filter === 'all' ? undefined : filter,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, filter === 'all' && styles.activeTab]}
          onPress={() => setFilter('all')}
        >
          <Text style={styles.tabText}>全部</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, filter === 'recruiting' && styles.activeTab]}
          onPress={() => setFilter('recruiting')}
        >
          <Text style={styles.tabText}>招募中</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, filter === 'nearby' && styles.activeTab]}
          onPress={() => setFilter('nearby')}
        >
          <Text style={styles.tabText}>附近</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadSessions} />}
      >
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onPress={() => navigation.navigate('SessionDetail', { sessionId: session.id })}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateSession')}
      >
        <Text style={styles.fabText}>+ 发起聚会</Text>
      </TouchableOpacity>
    </View>
  );
}
```

**Step 3: 提交**

```bash
git add apps/src/screens/plaza/PlazaScreen.tsx apps/src/components/SessionCard.tsx
git commit -m "feat: add plaza screen and session card"
```

---

## Task 6: 发起聚会页面

**Files:**
- Create: `apps/src/screens/session/CreateSessionScreen.tsx` - 发起聚会
- Create: `apps/src/screens/session/LocationSelectScreen.tsx` - 地点选择

**Step 1: 创建发起聚会页面**

```typescript
// apps/src/screens/session/CreateSessionScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useSessionStore } from '@/stores/sessionStore';

export default function CreateSessionScreen({ navigation, route }: any) {
  const { createSession } = useSessionStore();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(route.params?.location);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: '',
      scheduled_at: new Date(Date.now() + 86400000).toISOString(), // 明天
      max_dogs: 5,
      notes: '',
    },
  });

  const onSubmit = async (data: any) => {
    if (!selectedLocation) {
      alert('请选择地点');
      return;
    }
    await createSession({
      ...data,
      location_id: selectedLocation.id,
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>聚会主题</Text>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="如：周末踏春聚会"
            style={styles.input}
          />
        )}
      />

      <Text style={styles.label}>地点</Text>
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => navigation.navigate('LocationSelect')}
      >
        <Text style={styles.locationText}>
          {selectedLocation ? selectedLocation.name : '请选择地点 >'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>期望人数</Text>
      <Controller
        control={control}
        name="max_dogs"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={String(value)}
            onChangeText={(v) => onChange(parseInt(v) || 1)}
            keyboardType="number-pad"
            style={styles.input}
          />
        )}
      />

      <Text style={styles.label}>备注（可选）</Text>
      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="如：请带好拾便袋"
            style={[styles.input, styles.textArea]}
            multiline
          />
        )}
      />

      <Button title="发布聚会" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
}
```

**Step 2: 创建地点选择页面**

```typescript
// apps/src/screens/session/LocationSelectScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { useLocationStore } from '@/stores/locationStore';

Mapbox.setAccessToken(config.mapboxAccessToken);

export default function LocationSelectScreen({ navigation }: any) {
  const { nearbyLocations, searchResults, search, fetchNearby } = useLocationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    // 获取当前位置并加载附近地点
  }, []);

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (text.length > 1) {
      await search(text);
    }
  };

  const displayLocations = searchQuery ? searchResults : nearbyLocations;

  return (
    <View style={styles.container}>
      <TextInput
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="搜索地点"
        style={styles.searchInput}
      />

      <FlatList
        data={displayLocations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.locationItem}
            onPress={() => navigation.navigate('CreateSession', { location: item })}
          >
            <Text style={styles.locationName}>{item.name}</Text>
            <Text style={styles.locationAddress}>{item.address}</Text>
            {item.tags.length > 0 && (
              <View style={styles.tags}>
                {item.tags.map((tag, i) => (
                  <Text key={i} style={styles.tag}>{tag}</Text>
                ))}
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
```

**Step 3: 提交**

```bash
git add apps/src/screens/session/CreateSessionScreen.tsx apps/src/screens/session/LocationSelectScreen.tsx
git commit -m "feat: add create session and location select screens"
```

---

## Task 7: 聚会详情页面

**Files:**
- Create: `apps/src/screens/session/SessionDetailScreen.tsx` - 聚会详情
- Create: `apps/src/components/DogPicker.tsx` - 狗狗选择器

**Step 1: 创建聚会详情页面**

```typescript
// apps/src/screens/session/SessionDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSessionStore } from '@/stores/sessionStore';
import { useDogStore } from '@/stores/dogStore';
import DogPicker from '@/components/DogPicker';

export default function SessionDetailScreen({ navigation, route }: any) {
  const { sessionId } = route.params;
  const { currentSession, fetchSession, joinSession, leaveSession, startEarly, cancel } = useSessionStore();
  const { dogs } = useDogStore();
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);

  useEffect(() => {
    fetchSession(sessionId);
  }, [sessionId]);

  const isCreator = currentSession?.creator_id === useAuthStore.getState().user?.id;
  const hasJoined = currentSession?.participants.some((p: any) => p.id === selectedDogId);

  const handleJoin = async () => {
    if (!selectedDogId) {
      Alert.alert('提示', '请选择要参加的狗狗');
      return;
    }
    await joinSession(sessionId, selectedDogId);
  };

  const handleLeave = async () => {
    Alert.alert('确认', '确定要离开这个聚会吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        onPress: async () => {
          await leaveSession(sessionId, selectedDogId);
        },
      },
    ]);
  };

  if (!currentSession) return <View><Text>加载中...</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{currentSession.title}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 地点</Text>
        <Text style={styles.content}>{currentSession.location.name}</Text>
        <Text style={styles.address}>{currentSession.location.address}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🕐 时间</Text>
        <Text style={styles.content}>{formatDateTime(currentSession.scheduled_at)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🐶 参加的狗狗 ({currentSession.participants.length}/{currentSession.max_dogs})</Text>
        <View style={styles.participants}>
          {currentSession.participants.map((dog: any) => (
            <View key={dog.id} style={styles.participant}>
              <Image source={{ uri: dog.avatar }} style={styles.participantAvatar} />
              <Text>{dog.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {currentSession.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 备注</Text>
          <Text style={styles.content}>{currentSession.notes}</Text>
        </View>
      )}

      {!isCreator && (
        <View style={styles.actions}>
          {!hasJoined ? (
            <>
              <DogPicker dogs={dogs} selectedId={selectedDogId} onSelect={setSelectedDogId} />
              <TouchableOpacity style={styles.button} onPress={handleJoin}>
                <Text style={styles.buttonText}>报名参加</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={[styles.button, styles.leaveButton]} onPress={handleLeave}>
              <Text style={styles.buttonText}>离开聚会</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {isCreator && (
        <View style={styles.actions}>
          {currentSession.status === 'recruiting' && (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() => Alert.alert('提前开始', '确定要提前开始聚会吗？', [
                  { text: '取消' },
                  { text: '确定', onPress: () => startEarly(sessionId) },
                ])}
              >
                <Text style={styles.buttonText}>提前开始</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => Alert.alert('取消聚会', '确定要取消聚会吗？', [
                  { text: '取消' },
                  { text: '确定', onPress: () => cancel(sessionId) },
                ])}
              >
                <Text style={styles.buttonText}>取消聚会</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}
```

**Step 2: 创建狗狗选择器**

```typescript
// apps/src/components/DogPicker.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DogPickerProps {
  dogs: Dog[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function DogPicker({ dogs, selectedId, onSelect }: DogPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>选择参加的狗狗</Text>
      <View style={styles.dogList}>
        {dogs.map((dog) => (
          <TouchableOpacity
            key={dog.id}
            style={[styles.dogItem, selectedId === dog.id && styles.selected]}
            onPress={() => onSelect(dog.id)}
          >
            <Text style={styles.dogName}>{dog.name}</Text>
            {selectedId === dog.id && <Text style={styles.check}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
```

**Step 3: 提交**

```bash
git add apps/src/screens/session/SessionDetailScreen.tsx apps/src/components/DogPicker.tsx
git commit -m "feat: add session detail screen and dog picker"
```

---

## 完成检查

**后端检查:**
```bash
# 创建聚会
curl -X POST http://localhost:8000/api/v1/sessions \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"周末聚会","location_id":"<uuid>","scheduled_at":"2026-02-01T14:00:00","max_dogs":5}'

# 参加聚会
curl -X POST http://localhost:8000/api/v1/sessions/<id>/join \
  -H "Authorization: Bearer <token>" \
  -d '{"dog_id":"<uuid>"}'
```

**前端检查:**
- [ ] 广场列表正常显示聚会
- [ ] 可以发起聚会
- [ ] 可以查看聚会详情
- [ ] 可以报名参加聚会
- [ ] 满员后状态正确变更

**阶段三验收标准:**
- [ ] 聚会列表支持按距离/状态筛选
- [ ] 发起聚会流程完整
- [ ] 参加聚会流程完整
- [ ] 满员自动转为 full 状态
- [ ] 发起人可以提前开始/取消聚会
- [ ] 地点选择功能正常
