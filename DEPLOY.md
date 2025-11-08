# Firebase Hosting 部署指南

## 📋 前置準備

1. **安裝 Firebase CLI**（已完成）
   ```bash
   npm install -g firebase-tools
   ```

2. **登入 Firebase**
   ```bash
   firebase login
   ```

## 🚀 首次部署步驟

### 1. 初始化 Firebase 專案

如果你還沒有 Firebase 專案：

```bash
# 前往 https://console.firebase.google.com/
# 點擊「新增專案」
# 輸入專案名稱（例如：city-explore-taipei）
# 等待專案建立完成
```

### 2. 連結本地專案到 Firebase

```bash
cd c:\Users\catfi\OneDrive\Desktop\project\fight\118\frontend\services\city-explore

# 初始化 Firebase（如果 firebase.json 已存在可跳過）
firebase init hosting

# 選擇以下選項：
# - Use an existing project -> 選擇你的專案
# - What do you want to use as your public directory? -> dist
# - Configure as a single-page app? -> Yes
# - Set up automatic builds with GitHub? -> No
# - File dist/index.html already exists. Overwrite? -> No
```

### 3. 更新 .firebaserc

編輯 `.firebaserc` 檔案，將 `your-project-id` 替換成你的 Firebase 專案 ID：

```json
{
  "projects": {
    "default": "city-explore-taipei"
  }
}
```

### 4. 建置並部署

```bash
# 方法 1: 使用 npm script（推薦）
npm run deploy

# 方法 2: 分步執行
npm run build
firebase deploy --only hosting
```

### 5. 取得公開 URL

部署成功後，你會看到類似這樣的訊息：

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/city-explore-taipei/overview
Hosting URL: https://city-explore-taipei.web.app
```

## 🔄 後續更新部署

每次修改代碼後，只需執行：

```bash
npm run deploy
```

## 🌐 自訂網域（選用）

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇你的專案 → Hosting
3. 點擊「新增自訂網域」
4. 輸入你的網域名稱（例如：explore.yourdomain.com）
5. 依照指示設定 DNS 記錄

## 📊 查看使用情況

```bash
# 查看部署歷史
firebase hosting:channel:list

# 查看即時流量（需要先部署）
firebase hosting:channel:open live
```

## ⚙️ 進階設定

### 環境變數
如果需要在 production 使用不同的 API endpoint：

1. 建立 `.env.production` 檔案：
   ```
   VITE_API_BASE_URL=https://your-api-domain.com/api
   ```

2. 在程式中使用：
   ```javascript
   const apiUrl = import.meta.env.VITE_API_BASE_URL || '/api';
   ```

### Preview 部署（測試用）
```bash
# 建立一個預覽頻道
firebase hosting:channel:deploy preview

# 會得到臨時 URL，例如：
# https://city-explore-taipei--preview-abc123.web.app
```

## 🎯 快速指令參考

```bash
# 登入
firebase login

# 登出
firebase logout

# 建置
npm run build

# 部署
npm run deploy

# 查看專案資訊
firebase projects:list

# 切換專案
firebase use <project-id>

# 查看部署歷史
firebase hosting:channel:list
```

## 🔒 安全建議

1. **不要將 Firebase config 放在前端**：敏感資料應該放在後端
2. **設定 Firebase Security Rules**：限制資料庫存取權限
3. **使用環境變數**：API keys 不要直接寫死在程式碼中

## 📝 注意事項

- Firebase Hosting 免費額度：10 GB 儲存空間 + 360 MB/天傳輸量
- 超過免費額度會需要升級到 Blaze 方案（按用量計費）
- 部署後可能需要 1-2 分鐘才能全球生效
- 建議使用 `npm run build` 檢查建置是否成功再部署

## 🆘 常見問題

### Q: 部署後顯示 404？
A: 確認 `firebase.json` 中的 `rewrites` 設定正確，讓 SPA 路由能正常運作

### Q: 想要回滾到之前的版本？
A: 
```bash
firebase hosting:rollback
```

### Q: 如何刪除舊的部署？
A: Firebase 會自動保留最近的版本，舊版本會自動清理
