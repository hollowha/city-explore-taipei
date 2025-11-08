# 🗺️ City Explore Taipei - 台北城市探索

一個基於 Vue 3 的互動式城市探索應用程式，讓使用者透過行走探索台北市的街道和地標。

## ✨ 主要功能

- 🗺️ **互動地圖**：顯示已探索與未探索的街道路段
- 🎯 **地標系統**：解鎖並收集台北市各大地標
- 🎮 **角色選擇**：可愛的動物角色（橘貓、棒球狗、綿羊）
- 📊 **每週任務**：完成挑戰獲取成就
- 🏃 **慢跑規劃**：規劃並追蹤你的探索路線
- 📈 **統計分析**：查看探索進度與各區統計

## 🚀 快速開始

### 系統需求

- Node.js 16.x 或更高版本
- npm 或 yarn 套件管理器

### 安裝步驟

1. **複製專案**
```bash
git clone https://github.com/hollowha/city-explore-taipei.git
cd city-explore-taipei
```

2. **安裝相依套件**
```bash
npm install
```

3. **啟動開發伺服器**
```bash
npm run dev
```

4. **開啟瀏覽器**
   - 開發 URL：http://localhost:5173/
   - 地圖頁面：`/`
   - 探索頁面：`/explore`

### 建置產品版本

```bash
# 建置靜態檔案
npm run build

# 預覽建置結果
npm run preview
```

### 部署至 Firebase

```bash
# 建置並部署
npm run deploy
```

## 📁 專案結構

```
city-explore-taipei/
├── public/                   # 靜態資源
│   ├── characters/          # 角色動畫 GIF
│   │   ├── cat.gif
│   │   ├── dog.gif
│   │   └── sheep.gif
│   └── mock/                # Mock 資料
│       ├── segments.json
│       ├── landmarks.json
│       └── progress.json
├── src/
│   ├── assets/              # 圖片與資源
│   ├── components/          # Vue 元件
│   │   ├── BottomNav.vue
│   │   ├── MissionsPanel.vue
│   │   ├── StatsPanel.vue
│   │   └── AchievementsPanel.vue
│   ├── views/               # 頁面視圖
│   │   ├── MapView.vue      # 地圖主頁
│   │   └── ExploreView.vue  # 探索統計頁
│   ├── router/              # Vue Router 設定
│   │   └── index.js
│   ├── lib/                 # 工具函式庫
│   │   ├── api.js           # API 整合
│   │   └── bootstrap.js     # 初始化設定
│   ├── App.vue              # 根元件
│   ├── main.js              # 應用程式入口
│   └── styles.css           # 全域樣式
├── scripts/                 # 資料處理腳本
├── index.html
├── vite.config.js
├── package.json
├── firebase.json
└── README.md
```

## 🎨 技術棧

- **前端框架**：Vue 3 (Composition API)
- **地圖引擎**：Leaflet + @vue-leaflet/vue-leaflet
- **路由管理**：Vue Router 4
- **圖示系統**：Lucide Vue Next
- **建置工具**：Vite
- **部署平台**：Firebase Hosting

## 📱 功能詳細說明

### 地圖頁面 (`/`)

#### 🎯 角色選擇
- **橘貓**：預設可用
- **棒球狗**：預設可用
- **綿羊**：需完成 3 個成就解鎖（灰色鎖定狀態）

#### 🗺️ 地圖顯示
- 使用 CartoDB Voyager 底圖
- 已探索路段：亮 Teal 色圓點 (#468D9B)
- 未探索路段：淺灰色圓點
- 地標標記：
  - 已解鎖：Teal 漸層 + 脈動動畫
  - 未解鎖：灰色去飽和效果

#### 📊 浮動任務卡片
- 顯示當前任務進度（新路 1000 步：620 / 1000 m）
- 快捷操作按鈕：
  - 角色選擇
  - 慢跑規劃
  - 探索（顯示 18% 完成度徽章）

#### 🏃 慢跑規劃
- 設定慢跑距離（1-10 公里）
- 自動規劃環形路線
- 顯示距離與預估時間

#### 🎛️ 地圖篩選
- 已探索 / 未探索路段
- 地標分類篩選（公園、運動中心、活動中心、河濱等）

### 探索頁面 (`/explore`)

#### 📋 本週任務
- **新路 1000 步**：在未探索的街道累積 1000 公尺
- **新地標 x1**：解鎖一個從未造訪的地標
- 顯示週數與連勝記錄

#### 📊 探索統計
- 整體探索度百分比
- 已解鎖地標數量
- 已探索街道數量
- 連勝週數
- 各行政區探索進度
- 地標分類統計

#### 🏆 成就系統
- 首次探索、區域探險家、河濱達人
- 地標收藏家、週連勝、文化探索者
- 顯示解鎖日期與進度
- 未解鎖成就呈現半透明狀態

## 🎨 設計系統

### 色彩系統
- **Primary**：Teal/Cyan 漸層 (#93D4DF - #468D9B)
- **Secondary**：Orange/Amber 漸層
- **Grey**：50-900 色階

### 間距系統
使用 CSS Variables：
- `--space-1` to `--space-12` (4px 到 48px)
- `--radius-{sm|md|lg|xl|full}` 圓角
- `--shadow-{sm|md|lg}` 陰影效果

### 動畫效果
- `fadeIn`：淡入 + 上滑
- `pulse`：脈動閃爍（地標標記）
- `shimmer`：光澤掃過（進度條）

## 🔧 開發指南

### 可用指令

```bash
# 開發模式
npm run dev

# 建置專案
npm run build

# 預覽建置結果
npm run preview

# 部署到 Firebase
npm run deploy
```

### Mock API 資料

開發環境使用 Mock 資料，位於 `public/mock/`：

- `segments.json`：路段資料（已探索/未探索）
- `landmarks.json`：地標資料
- `progress.json`：進度資料

### 環境設定

專案使用 Vite 作為建置工具，設定檔位於 `vite.config.js`。

### WebView 整合

支援透過 Query Parameters 傳遞參數：
- `userId`：使用者識別
- `token`：授權 token（可選）
- `lang`：語系設定（預設 zh-Hant）

## 🌐 瀏覽器支援

- Chrome / Edge (最新版)
- Safari (iOS 13+)
- Firefox (最新版)

## 📱 行動裝置優化

- 最小觸控目標：44x44px
- iOS 安全區域適配
- 響應式設計
- 觸控手勢支援

## 🤝 貢獻指南

歡迎提交 Issue 或 Pull Request！

1. Fork 此專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

此專案採用 MIT 授權條款。

## 📞 聯絡方式

如有問題或建議，請開啟 Issue 或聯繫專案維護者。

---

Made with ❤️ for exploring Taipei City

## 功能特色

### 地圖視圖 (`/`)
- 🗺️ 彩色明亮地圖（CartoDB Voyager）
- 🟢 已探索路段：亮 Teal 圓點 (#468D9B)
- ⚫ 未探索路段：淺灰圓點
- 📍 地標標記：
  - 已解鎖：Teal 漸層 + 脈動動畫
  - 未解鎖：灰色去飽和
- 🔵 當前位置：Google Maps 風格藍色脈動圓圈
- 💬 地標 Popup：顯示名稱、分類、描述、解鎖狀態
- 📊 浮動統計卡：探索進度、路段數、地標數（可點擊進入詳情）

### 探索頁面 (`/explore`)
- 📋 **每週任務系統**
  - 新路 1000 步：追蹤未探索街道距離
  - 新地標 x1：解鎖新地標任務
  - 進度條與完成狀態
  - 連勝週數顯示
  
- 📈 **探索統計**
  - 整體探索度百分比
  - 已解鎖地標數、已探索街道數
  - 連勝週數
  - 各行政區探索進度條
  - 地標分類統計（公園、運動中心、活動中心、自行車道河濱景點）

- 🏆 **成就系統**
  - 首次探索、區域探險家、河濱達人
  - 地標收藏家、週連勝、文化探索者
  - 進度追蹤與解鎖日期
  - 未解鎖成就半透明顯示

### 底部導航
- 🗺️ 地圖
- 🏠 探索（統計與任務）

## 結構
```
services/city-explore/
├─ index.html
├─ vite.config.js (base: /services/city-explore/)
├─ src/
│  ├─ App.vue
│  ├─ main.js
│  ├─ styles.css
│  ├─ router/
│  │  └─ index.js
│  ├─ views/
│  │  └─ MapView.vue
│  ├─ components/
│  │  └─ ProgressBar.vue
│  └─ lib/
│     ├─ api.js (mock API)
│     └─ bootstrap.js (讀取 userId/token/lang)
└─ public/
   └─ mock/ (假資料)
```

## UI 元件說明（簡）

### 設計系統
採用現代化設計語言，參考 Apple HIG、Google Material 與 Figma 設計原則：
- **色彩系統**：Primary (Teal/Cyan 漸層)、Secondary (Orange/Amber 漸層)、Grey scale
- **視覺效果**：Glassmorphism（毛玻璃）、柔和陰影、流暢動畫
- **行動優先**：44px 最小觸控區、安全區適配、單手操作友善

### 核心元件

#### ProgressBar.vue
漸層進度條，帶發光與動畫效果。
- Props: `value: number` (0–100) 進度百分比
- Props: `size: string` ('sm' | 'md' | 'lg') 尺寸

#### Card.vue
通用卡片容器，支援毛玻璃效果。
- Props: `variant: string` ('default' | 'glass') 樣式變體
- Props: `elevated: boolean` 是否帶陰影與按壓效果

#### Button.vue
多樣式按鈕，符合無障礙觸控標準（最小 44px）。
- Props: `variant: string` ('primary' | 'secondary' | 'ghost' | 'danger')
- Props: `size: string` ('sm' | 'md' | 'lg')
- Props: `block: boolean` 是否全寬
- Props: `disabled: boolean` 停用狀態
- Slots: `default` (文字), `icon` (圖示)

#### Badge.vue
小型標籤徽章，用於狀態顯示。
- Props: `variant: string` ('default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning')
- Props: `size: string` ('sm' | 'md' | 'lg')

#### MapView.vue
主地圖視圖，包含：
- **浮動統計卡片**：即時探索進度、已探索路段數、地標解鎖數
- **地圖標記**：
  - 已探索 segment：Teal 圓點，帶發光效果
  - 未探索 segment：灰色圓點，半透明
  - 地標：自訂 Pin，已解鎖用 Teal 漸層 + 動畫，未解鎖用 Orange
- **地標 Popup**：毛玻璃卡片，顯示名稱、狀態徽章、描述、解鎖提示
- **FAB 按鈕**：右下角浮動按鈕，回到使用者位置

### 設計 Token (CSS Variables)
所有設計 token 定義於 `src/styles.css`：
- 色彩：`--primary-{50-900}`, `--secondary-{50-900}`, `--grey-{50-900}`
- 間距：`--space-{1-12}` (4px 到 48px)
- 圓角：`--radius-{sm|md|lg|xl|full}`
- 陰影：`--shadow-{sm|md|lg}`
- 字重：`--font-weight-{regular|medium|semibold|bold}`

### 動畫效果
- `fadeIn`：淡入 + 上滑
- `pulse`：脈動閃爍（用於已解鎖地標）
- `shimmer`：光澤掃過（用於進度條）

### 無障礙與適配
- ✅ 最小觸控目標 44x44px
- ✅ iOS 安全區域 (safe-area-inset)
- ✅ 深色模式優化
- ✅ 高對比度文字
- ✅ ARIA labels (FAB)

## Mock API 介面
- GET `mock/segments.json`
  - `{ explored: Array<{id, latlng:[lat,lng]}>, unexplored: Array<...> }`
- GET `mock/landmarks.json`
  - `Array<{ id, name, lat, lng }>`
- GET `mock/progress.json`
  - `{ percent: number, weekly: { goal:number, done:number } }`

未來替換為：
- `GET /api/explore/segments?userId=...`
- `GET /api/explore/landmarks?userId=...`
- `GET /api/explore/progress?userId=...`

## WebView 參數（JS Bridge/Query）
- `userId`: 使用者識別
- `token`: 授權用 token（可選）
- `lang`: 語系（預設 zh-Hant）

## 下一步建議
- 把 segment 從點狀示意改為 polyline/GeoJSON。
- 在地標點加入 Popup，顯示 D 組提供的文字與解鎖條件。
- 與 A 組對齊 API 規格並替換 mock。
- 加入 i18n 與輕量 UI system（或 Tailwind）。
