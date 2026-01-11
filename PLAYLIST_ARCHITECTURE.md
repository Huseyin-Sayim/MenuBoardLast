# Playlist Mimarisi ve Veri Akışı

## Genel Bakış

Playlist sistemi, kullanıcının bir ekran için seçtiği içeriklerin (medya ve şablonlar) sıralı listesini yönetir. Her şablon config'i ayrı bir item olarak gösterilir.

---

## 1. Veritabanı Şeması (Prisma)

### ScreenConfig Modeli

```prisma
model ScreenConfig {
  id              String         @id @default(uuid())
  screenId        String
  mediaId         String?           // Medya için (opsiyonel)
  templateId      String?           // Eski format template için (opsiyonel)
  templateConfigId String?          // YENİ: Config'li şablonlar için (opsiyonel)
  mediaIndex      Int               // Sıra numarası (1, 2, 3, ...)
  displayDuration Int?              // Gösterim süresi (saniye)
  
  // Relations
  Media           Media?
  Template        Template?
  TemplateConfig  TemplateConfig?   // YENİ: Her config ayrı
}
```

**Önemli**: ScreenConfig artık 3 tür içerik tutabilir:
- **Media** → `mediaId` kullanılır
- **Template (eski)** → `templateId` kullanılır  
- **TemplateConfig (yeni)** → `templateConfigId` kullanılır

---

## 2. Frontend Tip Tanımları

### Template Tipi (Şablon Listesi)

```typescript
type Template = {
  id: string;              // Config ID'si (her config için benzersiz)
  name: string;            // "Şablon 1", "Şablon 1 - Config 2", vs.
  path: string;            // "/design/template-1"
  preview: string;         // Path'i preview olarak kullan
  configId?: string;       // TemplateConfig ID'si (DB'deki gerçek ID)
  component?: string;      // "template-1", "template-2", vs.
}
```

### MenuBoardDesign Tipi (Playlist Item)

```typescript
type MenuBoardDesign = {
  id: string;              // Config ID'si
  name: string;            // Görünen isim
  preview: string;         // Önizleme görseli
  path?: string;           // Template path'i (/design/template-1)
  configId?: string;       // TemplateConfig ID'si (iframe için)
  isActive: boolean;
  type: "image" | "video";
}
```

### PlaylistItemType (Playlist Item)

```typescript
type PlaylistItemType = {
  id: string;              // "config-{configId}" veya "media-{mediaId}" formatında
  item: MediaItem | MenuBoardDesign;
  isDesign: boolean;
  duration: number;
}
```

### ScreenConfig (API'ye Gönderilen)

```typescript
interface ScreenConfig {
  screenId: string;
  mediaId?: string;
  templateId?: string;
  templateConfigId?: string;  // YENİ
  mediaIndex: number;
  duration: number;
}
```

---

## 3. ID Formatları

Playlist'te 3 farklı ID formatı kullanılıyor:

1. **`media-{mediaId}`** → Medya için
   - Örnek: `media-abc123-def456`
   
2. **`template-{component}`** → Eski format template için (geriye uyumluluk)
   - Örnek: `template-1`, `template-2`
   
3. **`config-{configId}`** → YENİ: Config'li şablonlar için
   - Örnek: `config-e82d5ab8-a1da-4223-a5ae-37e5ce4489ab`
   - Bu format, her template config'inin ayrı bir item olarak gösterilmesini sağlar

---

## 4. Veri Akışı

### A) Şablonların Yüklenmesi (`/api/userTemplate`)

**Endpoint**: `GET /api/userTemplate`

**Amaç**: Kullanıcının kaydettiği tüm template config'lerini getirir.

**Süreç**:
1. Kullanıcının tüm `TemplateConfig` kayıtları çekilir
2. Her config için:
   - Config ID'si `id` olarak kullanılır
   - Template bilgisi (name, path, component) alınır
   - Benzersiz isim oluşturulur (aynı template'in config'leri için):
     - İlk config: "Şablon 1"
     - İkinci config: "Şablon 1 - Config 2"
     - Üçüncü config: "Şablon 1 - Config 3"
   - `configId` olarak TemplateConfig ID'si eklenir

**Response Örneği**:
```json
[
  {
    "id": "43225490-d6ed-486d-8ab6-0fe1a0e005a5",
    "name": "Şablon 1",
    "path": "/design/template-1",
    "configId": "43225490-d6ed-486d-8ab6-0fe1a0e005a5",
    "component": "template-1"
  },
  {
    "id": "f721919f-8e0c-4cc3-838c-f6c1de5ccd16",
    "name": "Şablon 1 - Config 2",
    "path": "/design/template-1",
    "configId": "f721919f-8e0c-4cc3-838c-f6c1de5ccd16",
    "component": "template-1"
  }
]
```

---

### B) Şablon Seçimi (`handleTemplateSelect`)

**Fonksiyon**: `handleTemplateSelect(templateId: string)`

**Süreç**:
1. `templateId` parametresi aslında Config ID'sidir
2. `templates` array'inden config bulunur
3. Playlist ID'si oluşturulur: `config-{configId}`
4. Template, `MenuBoardDesign` formatına çevrilir:
   - `id`: Config ID'si
   - `name`: Template ismi
   - `path`: Template path'i
   - `configId`: Config ID'si (iframe için)
5. Playlist'e eklenir:
   ```typescript
   {
     id: "config-{configId}",
     item: templateAsDesign,
     isDesign: true,
     duration: 10
   }
   ```

---

### C) Config Formatlaması (`formattedConfig`)

**Hook**: `useEffect` - playlist değiştiğinde çalışır

**Süreç**:
1. Her playlist item'ı için:
   - **Config item ise** (`id.startsWith('config-')`):
     - `config-` prefix'i kaldırılır
     - `templateConfigId` olarak kullanılır
   - **Eski format template ise** (`id.startsWith('template-')`):
     - `templateId` olarak kullanılır
   - **Media ise**:
     - `media-` prefix'i kaldırılır
     - `mediaId` olarak kullanılır

**Örnek Çıktı**:
```typescript
[
  {
    screenId: "3aa0ac0f-...",
    templateConfigId: "43225490-d6ed-486d-8ab6-0fe1a0e005a5",
    mediaIndex: 1,
    duration: 10
  },    
  {
    screenId: "3aa0ac0f-...",
    templateConfigId: "f721919f-8e0c-4cc3-838c-f6c1de5ccd16",
    mediaIndex: 2,
    duration: 10
  }
]
```

---

### D) API'ye Gönderme (`handleSaveDesign`)

**Fonksiyon**: `handleSaveDesign` in `table-wrapper.tsx`

**Süreç**:
1. `screenConfig` array'i alınır
2. Her config için API formatına çevrilir:
   ```typescript
   {
     ...(config.mediaId && { mediaId: config.mediaId }),
     ...(config.templateId && { templateId: config.templateId }),
     ...(config.templateConfigId && { templateConfigId: config.templateConfigId }),
     mediaIndex: config.mediaIndex,
     duration: config.duration
   }
   ```
3. `PUT /api/screens/{screenId}/config` endpoint'ine gönderilir

**Gönderilen Paket Örneği**:
```json
[
  {
    "templateConfigId": "43225490-d6ed-486d-8ab6-0fe1a0e005a5",
    "mediaIndex": 1,
    "duration": 10
  },
  {
    "templateConfigId": "f721919f-8e0c-4cc3-838c-f6c1de5ccd16",
    "mediaIndex": 2,
    "duration": 10
  }
]
```

---

### E) Veritabanına Kaydetme (`updateScreenConfig`)

**Fonksiyon**: `updateScreenConfig` in `screenServices.ts`

**Süreç**:
1. Mevcut `ScreenConfig` kayıtları silinir (tüm ekran config'leri)
2. Her config için:
   - Eğer `templateConfigId` varsa:
     ```typescript
     data.TemplateConfig = {
       connect: { id: config.templateConfigId }
     };
     ```
   - Eğer `templateId` varsa (eski format):
     - Component'e göre Template ID'si bulunur
     - `data.Template = { connect: { id: templateDbId } }`
   - Eğer `mediaId` varsa:
     - `data.Media = { connect: { id: config.mediaId } }`
3. Yeni `ScreenConfig` kayıtları oluşturulur

**Prisma Create Örneği**:
```typescript
prisma.screenConfig.create({
  data: {
    screen: { connect: { id: screenId } },
    TemplateConfig: { connect: { id: "43225490-..." } },
    mediaIndex: 1,
    displayDuration: 10
  }
})
```

---

### F) Veritabanından Yükleme (`getScreenConfig`)

**Fonksiyon**: `getScreenConfig` in `screenServices.ts`

**Süreç**:
1. `ScreenConfig` kayıtları çekilir
2. Her config için:
   - Eğer `templateConfigId` varsa:
     - `TemplateConfig` relation'ı `include: { Template: true }` ile çekilir
     - Template bilgisi `TemplateConfig.Template`'den alınır
   - Eğer `templateId` varsa:
     - `Template` relation'ı çekilir
   - Eğer `mediaId` varsa:
     - `Media` relation'ı çekilir

**Response Örneği**:
```json
[
  {
    "id": "...",
    "templateConfigId": "43225490-...",
    "TemplateConfig": {
      "id": "43225490-...",
      "Template": {
        "id": "...",
        "name": "Şablon 1",
        "path": "/design/template-1",
        "component": "template-1"
      }
    },
    "mediaIndex": 1,
    "displayDuration": 10
  }
]
```

---

### G) Playlist'e Dönüştürme (`table-wrapper.tsx`)

**Fonksiyon**: `handleEdit` içinde

**Süreç**:
1. `getScreenConfig` sonucu alınır
2. Her config için:
   - **TemplateConfig varsa**:
     - Config ID'si `templateConfig.id`'den alınır
     - Template bilgisi `TemplateConfig.Template`'den alınır
     - Benzersiz isim oluşturulur (config ID'sinin son 4 karakteri ile)
     - Playlist ID'si: `config-{configId}`
   - **Template varsa** (eski format):
     - Template component'ine göre ID oluşturulur: `template-{component}`
   - **Media varsa**:
     - Playlist ID'si: `media-{mediaId}`

**Playlist Item Örneği**:
```typescript
{
  id: "config-43225490-d6ed-486d-8ab6-0fe1a0e005a5",
  item: {
    id: "43225490-d6ed-486d-8ab6-0fe1a0e005a5",
    name: "Şablon 1 - 0a5a",
    path: "/design/template-1",
    configId: "43225490-d6ed-486d-8ab6-0fe1a0e005a5",
    isActive: true,
    type: "image"
  },
  isDesign: true,
  duration: 10
}
```

---

### H) İframe Önizlemeleri

**Şablon Listesinde** (`edit-view.tsx`):
```typescript
<iframe
  src={template.configId 
    ? `${template.path}?configId=${template.configId}` 
    : template.path}
/>
```

**Playlist Item'ında** (`SortableItem`):
```typescript
<iframe
  src={templateItem.configId 
    ? `${templateItem.path}?configId=${templateItem.configId}` 
    : templateItem.path}
/>
```

**Amaç**: Her config kendi verisini gösterir. `configId` parametresi ile template sayfası doğru config'i yükler.

---

## 5. Önemli Noktalar

### Neden Her Config Ayrı?

- Kullanıcı aynı template'den birden fazla config oluşturabilir
- Her config farklı veriler içerir (ürünler, fiyatlar, vs.)
- Playlist'te her config ayrı bir item olarak gösterilmelidir
- Örnek: "Şablon 1 - Config 1", "Şablon 1 - Config 2", "Şablon 1 - Config 3"

### ID Formatı Neden Önemli?

- `config-{configId}` formatı, hangi item'ın config olduğunu belirler
- `formattedConfig` içinde `startsWith('config-')` kontrolü ile ayırt edilir
- Geriye uyumluluk için `template-{component}` formatı da desteklenir

### Path ve ConfigId Neden Gerekli?

- **Path**: Template sayfasının URL'i (`/design/template-1`)
- **ConfigId**: Hangi config'in gösterileceğini belirler (query parametresi)
- İframe'de: `${path}?configId=${configId}` formatında kullanılır

### Benzersiz İsimler Nasıl Oluşuyor?

**API'de** (`/api/userTemplate`):
- Aynı template'in config'leri için sıra numarası eklenir
- "Şablon 1", "Şablon 1 - Config 2", "Şablon 1 - Config 3"

**table-wrapper'da** (yükleme sırasında):
- Config ID'sinin son 4 karakteri eklenir
- "Şablon 1 - 0a5a" formatında

---

## 6. Örnek Senaryo

1. **Kullanıcı 3 tane "Şablon 1" config'i oluşturur**
   - Config 1 ID: `abc-123`
   - Config 2 ID: `def-456`
   - Config 3 ID: `ghi-789`

2. **Şablon listesinde gösterilir**:
   - "Şablon 1" (Config 1)
   - "Şablon 1 - Config 2" (Config 2)
   - "Şablon 1 - Config 3" (Config 3)

3. **Kullanıcı hepsini playlist'e ekler**:
   - Playlist item 1: `id: "config-abc-123"`
   - Playlist item 2: `id: "config-def-456"`
   - Playlist item 3: `id: "config-ghi-789"`

4. **Kaydetme**:
   ```json
   [
     { "templateConfigId": "abc-123", "mediaIndex": 1, "duration": 10 },
     { "templateConfigId": "def-456", "mediaIndex": 2, "duration": 10 },
     { "templateConfigId": "ghi-789", "mediaIndex": 3, "duration": 10 }
   ]
   ```

5. **Veritabanına kaydedilir**:
   - 3 ayrı `ScreenConfig` kaydı
   - Her biri farklı `templateConfigId` ile

6. **Yükleme**:
   - Her config kendi verisini gösterir
   - Önizlemelerde farklı içerikler görünür

---

## 7. Avantajlar

✅ Her config ayrı bir item olarak gösterilir
✅ Her config'in kendi verisi vardır
✅ Önizlemelerde doğru veri gösterilir
✅ Geriye uyumluluk korunur (eski format template'ler)
✅ Tip güvenliği sağlanır (TypeScript)
✅ Ölçeklenebilir yapı (yeni config'ler kolayca eklenebilir)

---

## 8. İyileştirme Önerileri

1. **Config İsimlendirme**: Kullanıcı config'lere özel isim verebilir
2. **Config Sıralaması**: Config'ler oluşturulma tarihine göre sıralanabilir
3. **Config Silme**: Kullanılmayan config'ler temizlenebilir
4. **Cache**: Config verileri cache'lenebilir (performans için)

