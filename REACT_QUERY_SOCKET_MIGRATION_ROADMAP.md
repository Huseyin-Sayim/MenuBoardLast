# MenuBoard: React Query + Socket.io Geçiş Yol Haritası

## 📋 İÇİNDEKİLER
1. [Mevcut Durum Analizi](#1-mevcut-durum-analizi)
2. [Backend (Next.js) Socket.io Hazırlığı](#2-backend-nextjs-socketio-hazırlığı)
3. [Frontend React Query Geçişi](#3-frontend-react-query-geçişi)
4. [Socket + Query Senkronizasyonu](#4-socket--query-senkronizasyonu)
5. [Monitoring & Device Tracking](#5-monitoring--device-tracking)

---

## 1. MEVCUT DURUM ANALİZİ

### 1.1. useEffect + fetch Kullanımı Tespit Edilen Dosyalar

#### 🔴 Kritik Seviye (Real-time Gerekli):
1. **`src/components/Tables/top-channels/table-wrapper.tsx`** (Satır 46-83)
   - **Sorun:** `handleEdit` içinde `fetch('/api/screens/${screenId}/config')` çağrısı
   - **Zayıflık:** Screen config değişiklikleri anında görünmüyor, sayfa yenileme veya manuel refresh gerekiyor
   - **WebSocket Entegrasyonu Risk:** Screen config güncellemeleri Socket.io ile broadcast edilmiyor

2. **`src/app/(home)/dashboard/users/_components/users-table.tsx`** (Satır 30-50)
   - **Sorun:** `useEffect(() => { fetchUsers(); }, [])` ve `api.get('/api/dashboard/user')`
   - **Zayıflık:** Kullanıcı listesi değişiklikleri anında yansımıyor
   - **WebSocket Entegrasyonu Risk:** Çoklu admin kullanıcı yönetimi senkronizasyon sorunları

3. **`src/components/Tables/top-channels/edit-view.tsx`** (Satır 353-368)
   - **Sorun:** `useEffect` içinde `getScreenName(screenName)` çağrısı
   - **Zayıflık:** Screen name değişiklikleri anında görünmüyor
   - **WebSocket Entegrasyonu Risk:** Screen metadata güncellemeleri real-time değil

#### 🟡 Orta Seviye:
4. **`src/app/(home)/dashboard/media/_components/media-gallery.tsx`** (Satır 122-125)
   - **Sorun:** `handleUploadSuccess` içinde `window.location.reload()` kullanımı
   - **Zayıflık:** Sayfa tamamen yenileniyor, kötü UX
   - **WebSocket Entegrasyonu Risk:** Media upload işlemleri Socket ile broadcast edilebilir

5. **`src/components/Tables/top-channels/table-wrapper.tsx`** (Satır 146-148)
   - **Sorun:** `handleAddScreenSuccess` içinde `window.location.reload()`
   - **Zayıflık:** Yeni ekran eklendiğinde sayfa yenileniyor
   - **WebSocket Entegrasyonu Risk:** Screen creation event'leri Socket ile yayınlanabilir

#### 🟢 Düşük Seviye (UI State Yönetimi):
6. **`src/components/Tables/top-channels/edit-view.tsx`** (Çoklu useEffect'ler)
   - **Durum:** Playlist state yönetimi, preview scale hesaplamaları
   - **Not:** Bu useEffect'ler WebSocket'ten bağımsız, UI logic

### 1.2. WebSocket Entegrasyonu Sırasındaki Zayıflıklar

#### ❌ **Problem 1: Polling Eksikliği**
- Mevcut yapı hiçbir yerde otomatik polling yapmıyor
- Kullanıcılar manuel refresh yapmak zorunda
- **Çözüm:** React Query'nin `refetchInterval` + Socket.io `invalidateQueries` kombinasyonu

#### ❌ **Problem 2: Cache Yönetimi Yok**
- `useState` ile yönetilen veriler cache'lenmiyor
- Aynı veri birden fazla component'te tekrar fetch ediliyor
- **Çözüm:** React Query'nin merkezi cache yönetimi

#### ❌ **Problem 3: Optimistic Updates Yok**
- `PUT /api/screens/${id}/config` çağrısı yapıldığında UI anında güncellenmiyor
- Response bekleniyor, kötü UX
- **Çözüm:** `useMutation` ile optimistic updates + Socket broadcast

#### ❌ **Problem 4: Race Condition Riski**
- Aynı screen config'e paralel istekler gönderilebilir
- Son yazma kazanır (last write wins) problemi
- **Çözüm:** Socket.io ile event-based update mekanizması

#### ❌ **Problem 5: Multi-User Senkronizasyon Sorunu**
- İki admin aynı anda screen config düzenlerse conflict olur
- **Çözüm:** Socket.io room-based broadcasting + operational transform (OT) veya last-write-wins

---

## 2. BACKEND (Next.js) SOCKET.IO HAZIRLIĞI

### 2.1. Next.js Custom Server vs API Routes

#### ⚠️ **KRİTİK KARAR:** Custom Server Gerekli mi?

**Seçenek A: Custom Server (Önerilen)**
- `server.js` veya `server.ts` oluşturulmalı
- `next dev` ve `next start` yerine custom server çalıştırılmalı
- Socket.io native integration
- **Avantaj:** Tam kontrol, performans
- **Dezavantaj:** Next.js standalone build ile uyumsuz, deployment karmaşıklaşır

**Seçenek B: API Routes + Socket.io Adapter (Önerilen - Hibrit)**
- `/api/socket` route oluşturulmalı
- Socket.io'yu HTTP upgrade üzerinden çalıştır
- **Avantaj:** Next.js native, deployment kolay
- **Dezavantaj:** Biraz daha karmaşık setup

**🎯 ÖNERİ:** Seçenek B (API Routes) - Modern Next.js best practice

### 2.2. Socket.io Server Kurulumu

#### Dosya Yapısı:
```
src/
  app/
    api/
      socket/
        route.ts          ← Socket.io handler (HTTP upgrade)
  lib/
    socket/
      server.ts          ← Socket.io server instance
      events.ts          ← Event handler definitions
      rooms.ts           ← Room management logic
```

#### `src/lib/socket/server.ts` Yapısı:
- Socket.io server instance
- JWT authentication middleware
- Room join/leave logic
- Event broadcasting helpers

#### `src/lib/socket/events.ts` Yapısı:
- Client → Server events (emit)
- Server → Client events (broadcast)
- Event type definitions (TypeScript)

#### `src/lib/socket/rooms.ts` Yapısı:
- Room naming convention
- Room-based user management
- Device tracking rooms

### 2.3. Room (Oda) Mantığı

#### Room Naming Convention:

```
/user:{userId}                    → Kullanıcıya özel room (tüm ekranlarını dinler)
/screen:{screenId}                → Belirli bir ekrana özel room
/device:{deviceId}                → Belirli bir cihaza özel room
/admin:all                        → Tüm adminler için global room
/admin:users                      → Admin kullanıcı yönetimi room'u
/admin:screens                    → Admin ekran yönetimi room'u
```

#### Room Join Stratejisi:

1. **Kullanıcı Login Olduğunda:**
   - `/user:{userId}` → Kendi ekranlarını dinler
   - Screen config değişiklikleri burada broadcast edilir

2. **Screen Edit Mode Açıldığında:**
   - `/screen:{screenId}` → O ekrana özel room'a join
   - Diğer kullanıcılar "Screen düzenleniyor" bildirimi alır (opsiyonel)

3. **Admin Kullanıcı Yönetimi Sayfasında:**
   - `/admin:users` → Kullanıcı listesi değişikliklerini dinler

4. **Device Tracking:**
   - `/device:{deviceId}` → Cihaz heartbeat'lerini dinler
   - Backend otomatik olarak device'ı bu room'a ekler

### 2.4. API Route Değişiklikleri

#### Mevcut Route'lar ve Socket Entegrasyonu:

1. **`PUT /api/screens/[id]/config`** (Satır 26-55)
   - **Şu An:** Sadece DB güncelliyor
   - **Değişiklik:** DB update'ten sonra Socket.io ile broadcast yapmalı
   - **Event:** `screen:config:updated` → `/screen:{screenId}` ve `/user:{userId}` room'larına

2. **`POST /api/screens`** (Screen creation)
   - **Event:** `screen:created` → `/user:{userId}` room'una

3. **`POST /api/media`** (Media upload)
   - **Event:** `media:created` → `/user:{userId}` room'una

4. **`PUT /api/media/[id]`** (Media update)
   - **Event:** `media:updated` → `/user:{userId}` room'una

5. **`DELETE /api/media/[id]`** (Media delete)
   - **Event:** `media:deleted` → `/user:{userId}` room'una

6. **`POST /api/dashboard/user`** (User creation - Admin only)
   - **Event:** `user:created` → `/admin:users` room'una

7. **`DELETE /api/dashboard/user/[id]`** (User delete - Admin only)
   - **Event:** `user:deleted` → `/admin:users` room'una

### 2.5. Authentication & Authorization

#### Socket.io JWT Middleware:
- Socket connection'da JWT token validate edilmeli
- Token `socket.handshake.auth.token` veya `socket.handshake.headers.authorization` içinde gelmeli
- Invalid token → `socket.disconnect()`
- Valid token → `socket.data.userId` ve `socket.data.role` set edilmeli

#### Room Authorization:
- Kullanıcı sadece kendi `/user:{userId}` room'una join edebilmeli
- Admin tüm `/admin:*` room'larına join edebilmeli
- Screen edit için `/screen:{screenId}` room'una join → Screen'in userId'si kontrol edilmeli

---

## 3. FRONTEND REACT QUERY GEÇIŞİ

### 3.1. React Query Kurulumu

#### package.json Dependencies:
```json
{
  "@tanstack/react-query": "^5.x.x",
  "socket.io-client": "^4.x.x"
}
```

#### `src/app/providers.tsx` Güncellemesi:
- `QueryClientProvider` eklenmeli
- `QueryClient` instance oluşturulmalı
- Default query options set edilmeli (staleTime, cacheTime, retry logic)

### 3.2. Query Key Yapısı

#### Naming Convention:
```typescript
// Screens
['screens', userId]                           → Kullanıcının tüm ekranları
['screen', screenId]                          → Belirli bir ekran
['screen', screenId, 'config']                → Screen config
['screen', screenId, 'name']                  → Screen name

// Media
['media', userId]                             → Kullanıcının tüm medyaları
['media', mediaId]                            → Belirli bir medya

// Users (Admin only)
['users']                                     → Tüm kullanıcılar
['user', userId]                              → Belirli bir kullanıcı

// Device
['device', deviceId]                          → Device bilgileri
['device', deviceId, 'status']                → Device online/offline status
```

### 3.3. Mevcut Fetch Fonksiyonlarının useQuery'e Dönüşümü

#### 3.3.1. Screens Listesi

**Mevcut:** `src/components/Tables/top-channels/index.tsx` (Satır 21)
- Server Component'te `getScreen(id)` çağrısı
- **Değişiklik:** Client Component'e çevrilmeli veya `useQuery` ile client-side fetch

**Yeni Yapı:**
```typescript
// src/hooks/queries/useScreens.ts
export function useScreens(userId: string) {
  return useQuery({
    queryKey: ['screens', userId],
    queryFn: () => api.get(`/api/screens?userId=${userId}`).then(res => res.data),
    staleTime: 30 * 1000, // 30 saniye
  });
}
```

#### 3.3.2. Screen Config

**Mevcut:** `src/components/Tables/top-channels/table-wrapper.tsx` (Satır 53)
- `fetch('/api/screens/${screenId}/config')` içinde async function

**Yeni Yapı:**
```typescript
// src/hooks/queries/useScreenConfig.ts
export function useScreenConfig(screenId: string) {
  return useQuery({
    queryKey: ['screen', screenId, 'config'],
    queryFn: () => api.get(`/api/screens/${screenId}/config`).then(res => res.data.data),
    enabled: !!screenId,
  });
}
```

#### 3.3.3. Media Listesi

**Mevcut:** `src/app/(home)/dashboard/media/page.tsx` (Satır 15)
- Server Component'te `getMedia(id)` çağrısı

**Yeni Yapı:**
```typescript
// src/hooks/queries/useMedia.ts
export function useMedia(userId: string) {
  return useQuery({
    queryKey: ['media', userId],
    queryFn: () => api.get(`/api/media?userId=${userId}`).then(res => res.data),
    staleTime: 60 * 1000, // 1 dakika
  });
}
```

#### 3.3.4. Users List (Admin)

**Mevcut:** `src/app/(home)/dashboard/users/_components/users-table.tsx` (Satır 34)
- `api.get('/api/dashboard/user')`

**Yeni Yapı:**
```typescript
// src/hooks/queries/useUsers.ts
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/api/dashboard/user').then(res => res.data.data),
    staleTime: 30 * 1000,
  });
}
```

### 3.4. Mutations (Create, Update, Delete)

#### 3.4.1. Screen Config Update

**Mevcut:** `src/components/Tables/top-channels/table-wrapper.tsx` (Satır 110-116)

**Yeni Yapı:**
```typescript
// src/hooks/mutations/useUpdateScreenConfig.ts
export function useUpdateScreenConfig() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ screenId, configs }: { screenId: string; configs: any[] }) =>
      api.put(`/api/screens/${screenId}/config`, { configs }),
    onMutate: async ({ screenId, configs }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['screen', screenId, 'config'] });
      const previous = queryClient.getQueryData(['screen', screenId, 'config']);
      queryClient.setQueryData(['screen', screenId, 'config'], configs);
      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback
      queryClient.setQueryData(['screen', variables.screenId, 'config'], context?.previous);
    },
    onSettled: (data, error, variables) => {
      // Socket.io event'i geldiğinde zaten güncellenir, burada sadece refetch yapabilirsin
      queryClient.invalidateQueries({ queryKey: ['screen', variables.screenId, 'config'] });
    },
  });
}
```

#### 3.4.2. Media Upload

**Mevcut:** `src/app/(home)/dashboard/media/_components/media-upload-view.tsx`

**Yeni Yapı:**
```typescript
// src/hooks/mutations/useUploadMedia.ts
export function useUploadMedia() {
  const queryClient = useQueryClient();
  const userId = getUserIdFromCookie(); // Helper function
  
  return useMutation({
    mutationFn: (formData: FormData) => api.post('/api/media', formData),
    onSuccess: () => {
      // Socket event'i ile otomatik güncellenir, sadece invalidate yeterli
      queryClient.invalidateQueries({ queryKey: ['media', userId] });
    },
  });
}
```

### 3.5. Server Components → Client Components Geçişi

#### Dikkat Edilmesi Gerekenler:

1. **`src/components/Tables/top-channels/index.tsx`**
   - Şu an: Server Component (async function)
   - Değişiklik: Client Component'e çevrilmeli veya wrapper Client Component eklenmeli

2. **`src/app/(home)/dashboard/media/page.tsx`**
   - Şu an: Server Component
   - Değişiklik: Client Component'e çevrilmeli

3. **`src/app/(home)/dashboard/screens/page.tsx`**
   - Şu an: Server Component (Suspense kullanıyor)
   - Değişiklik: Suspense korunarak Client Component'e çevrilebilir

---

## 4. SOCKET + QUERY SENKRONİZASYONU

### 4.1. Socket.io Client Hook

#### `src/hooks/useSocket.ts` Yapısı:

```typescript
export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const token = getAccessToken(); // Cookie'den token al
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });
    
    setSocket(newSocket);
    
    // Event listeners
    newSocket.on('screen:config:updated', (data: { screenId: string; config: any }) => {
      queryClient.setQueryData(['screen', data.screenId, 'config'], data.config);
    });
    
    newSocket.on('media:created', (data: { userId: string; media: any }) => {
      queryClient.invalidateQueries({ queryKey: ['media', data.userId] });
    });
    
    newSocket.on('media:updated', (data: { userId: string; mediaId: string; media: any }) => {
      queryClient.setQueryData(['media', data.mediaId], data.media);
      queryClient.invalidateQueries({ queryKey: ['media', data.userId] });
    });
    
    newSocket.on('media:deleted', (data: { userId: string; mediaId: string }) => {
      queryClient.removeQueries({ queryKey: ['media', data.mediaId] });
      queryClient.invalidateQueries({ queryKey: ['media', data.userId] });
    });
    
    newSocket.on('screen:created', (data: { userId: string; screen: any }) => {
      queryClient.invalidateQueries({ queryKey: ['screens', data.userId] });
    });
    
    newSocket.on('user:created', () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    });
    
    newSocket.on('user:deleted', (data: { userId: string }) => {
      queryClient.removeQueries({ queryKey: ['user', data.userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    });
    
    return () => {
      newSocket.close();
    };
  }, [queryClient]);
  
  return socket;
}
```

### 4.2. Socket Event → Query Cache Güncelleme Stratejisi

#### Strateji 1: `setQueryData` (Optimistic, Anında)
**Kullanım:** Event'te tam data geliyorsa
- `screen:config:updated` → `setQueryData(['screen', screenId, 'config'], data.config)`
- `media:updated` → `setQueryData(['media', mediaId], data.media)`

#### Strateji 2: `invalidateQueries` (Refetch, Güncel Veri)
**Kullanım:** Event'te sadece ID geliyorsa veya complex data varsa
- `media:created` → `invalidateQueries(['media', userId])`
- `screen:created` → `invalidateQueries(['screens', userId])`
- `user:created` → `invalidateQueries(['users'])`

#### Strateji 3: `removeQueries` (Silme İşlemleri)
**Kullanım:** Delete event'leri
- `media:deleted` → `removeQueries(['media', mediaId])` + `invalidateQueries(['media', userId])`

### 4.3. Dosya Bazlı Socket Event Handler Konumlandırması

#### `src/hooks/socket/useSocketEvents.ts`
- Tüm Socket event listener'ları burada toplanmalı
- `useSocket` hook'u bu hook'u çağırmalı
- Event handler'lar ayrı dosyalara bölünebilir:
  - `useSocketScreenEvents.ts`
  - `useSocketMediaEvents.ts`
  - `useSocketUserEvents.ts`
  - `useSocketDeviceEvents.ts`

### 4.4. Room Join/Leave Yönetimi

#### `src/hooks/useSocketRoom.ts`:

```typescript
export function useSocketRoom(roomName: string, enabled: boolean = true) {
  const socket = useSocket();
  
  useEffect(() => {
    if (!socket || !enabled || !roomName) return;
    
    socket.emit('join-room', roomName);
    
    return () => {
      socket.emit('leave-room', roomName);
    };
  }, [socket, roomName, enabled]);
}
```

#### Kullanım Örnekleri:

1. **Screen Edit Mode:**
   ```typescript
   // table-wrapper.tsx içinde
   useSocketRoom(`screen:${selectedScreenId}`, isEditing);
   ```

2. **User Dashboard:**
   ```typescript
   // dashboard page içinde
   const userId = getUserIdFromCookie();
   useSocketRoom(`user:${userId}`, true);
   ```

3. **Admin Users Page:**
   ```typescript
   // users-table.tsx içinde
   useSocketRoom('admin:users', true);
   ```

---

## 5. MONITORING & DEVICE TRACKING

### 5.1. Device Heartbeat Mekanizması

#### Backend: Heartbeat Endpoint

**Yeni Endpoint:** `POST /api/device/heartbeat`
- DeviceId header'da veya body'de gelmeli
- Her 30 saniyede bir çağrılmalı (client-side)
- Backend'de device'ın `lastSeen` timestamp'i güncellenir
- Socket.io ile `device:heartbeat` event'i broadcast edilir

#### Backend: Device Status Check
- `lastSeen` 60 saniyeden eskiyse → `status: 'offline'`
- `lastSeen` 60 saniyeden yeniyse → `status: 'online'`
- Socket.io ile `device:status:changed` event'i broadcast edilir

### 5.2. Socket Event Akışı (Device Tracking)

#### Client → Server Events:

1. **`device:register`**
   - Device ilk bağlandığında
   - Payload: `{ deviceId, screenId?, userId? }`
   - Backend: Device'ı `/device:{deviceId}` room'una ekler

2. **`device:heartbeat`** (Opsiyonel, HTTP endpoint tercih edilebilir)
   - Her 30 saniyede bir
   - Payload: `{ deviceId, timestamp }`
   - Backend: `lastSeen` güncellenir

#### Server → Client Events:

1. **`device:status:changed`**
   - Device online/offline olduğunda
   - Payload: `{ deviceId, status: 'online' | 'offline', lastSeen }`
   - Room: `/device:{deviceId}`, `/user:{userId}` (eğer device bir screen'e bağlıysa)

2. **`device:heartbeat:ack`**
   - Heartbeat'e response (opsiyonel)
   - Payload: `{ deviceId, serverTime }`

### 5.3. React Query ile Device Status

#### Query Key:
```typescript
['device', deviceId, 'status']  → { status: 'online' | 'offline', lastSeen: Date }
```

#### Hook:
```typescript
// src/hooks/queries/useDeviceStatus.ts
export function useDeviceStatus(deviceId: string) {
  return useQuery({
    queryKey: ['device', deviceId, 'status'],
    queryFn: () => api.get(`/api/screens/device/${deviceId}`).then(res => ({
      status: res.data.deviceScreen?.[0]?.lastSeen 
        ? (Date.now() - new Date(res.data.deviceScreen[0].lastSeen).getTime() < 60000 ? 'online' : 'offline')
        : 'offline',
      lastSeen: res.data.deviceScreen?.[0]?.lastSeen,
    })),
    refetchInterval: 30000, // 30 saniyede bir refetch (fallback)
  });
}
```

#### Socket Event Handler:
```typescript
// useSocketEvents.ts içinde
socket.on('device:status:changed', (data: { deviceId: string; status: string; lastSeen: Date }) => {
  queryClient.setQueryData(['device', data.deviceId, 'status'], {
    status: data.status,
    lastSeen: data.lastSeen,
  });
  
  // Screen listesini de güncelle (screen card'ında status gösteriliyorsa)
  queryClient.invalidateQueries({ queryKey: ['screens'] });
});
```

### 5.4. Screen Listesinde Online/Offline Göstergesi

#### Database Schema Değişikliği (Opsiyonel):
```prisma
model Screen {
  // ... mevcut fields
  lastSeen DateTime?  // Device'ın son görülme zamanı
}
```

#### Backend Logic:
- Screen'in `deviceId`'si ile Device'ın `lastSeen`'i kontrol edilir
- Screen listesi dönerken `status: 'online' | 'offline'` field'ı eklenir

#### Frontend:
- Screen card/table'da status badge gösterilir
- Socket event'i geldiğinde `useScreens` query'si invalidate edilir veya `setQueryData` ile güncellenir

### 5.5. Device Heartbeat Client-Side Implementation

#### Digital Signage Player (Client Device) Tarafı:

**Dosya:** `src/app/player/[deviceId]/page.tsx` (Yeni oluşturulmalı)

```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      await api.post('/api/device/heartbeat', { deviceId });
    } catch (error) {
      console.error('Heartbeat failed:', error);
    }
  }, 30000); // 30 saniye
  
  return () => clearInterval(interval);
}, [deviceId]);
```

#### Veya Socket.io ile:
```typescript
useEffect(() => {
  if (!socket) return;
  
  const interval = setInterval(() => {
    socket.emit('device:heartbeat', { deviceId, timestamp: Date.now() });
  }, 30000);
  
  return () => clearInterval(interval);
}, [socket, deviceId]);
```

---

## 📝 ÖZET: UYGULAMA SIRASI

### Faz 1: Temel Altyapı
1. ✅ Socket.io server kurulumu (API route)
2. ✅ React Query kurulumu (providers.tsx)
3. ✅ Socket.io client hook (useSocket.ts)
4. ✅ Temel event handler'lar

### Faz 2: Screens Modülü
1. ✅ Screens list query'si (useScreens)
2. ✅ Screen config query'si (useScreenConfig)
3. ✅ Screen config mutation (useUpdateScreenConfig)
4. ✅ Socket events: `screen:config:updated`, `screen:created`
5. ✅ Room management: `/user:{userId}`, `/screen:{screenId}`

### Faz 3: Media Modülü
1. ✅ Media list query'si (useMedia)
2. ✅ Media upload mutation (useUploadMedia)
3. ✅ Media update/delete mutations
4. ✅ Socket events: `media:created`, `media:updated`, `media:deleted`

### Faz 4: Users Modülü (Admin)
1. ✅ Users list query'si (useUsers)
2. ✅ User create/delete mutations
3. ✅ Socket events: `user:created`, `user:deleted`
4. ✅ Room: `/admin:users`

### Faz 5: Device Tracking
1. ✅ Device status query'si (useDeviceStatus)
2. ✅ Heartbeat endpoint/event
3. ✅ Socket events: `device:status:changed`
4. ✅ Room: `/device:{deviceId}`
5. ✅ Screen listesinde status gösterimi

### Faz 6: Optimizasyon & Testing
1. ✅ Optimistic updates test
2. ✅ Multi-user conflict handling
3. ✅ Error handling & retry logic
4. ✅ Performance monitoring

---

## ⚠️ KRİTİK NOTLAR

1. **Authentication:** Socket.io connection'da JWT token mutlaka validate edilmeli
2. **Error Handling:** Socket connection kesildiğinde React Query fallback olarak HTTP polling yapmalı
3. **Race Conditions:** Mutations ve Socket events arasında race condition olmamalı (optimistic update + Socket update kombinasyonu)
4. **Scalability:** Socket.io room'ları memory'de tutulur, çok fazla room olursa Redis adapter kullanılmalı
5. **Testing:** Socket.io event'leri unit test ile test edilmeli (mock socket)

---

**Hazırlayan:** Senior Full-stack Architect Analysis  
**Tarih:** 2025-01-XX  
**Versiyon:** 1.0













