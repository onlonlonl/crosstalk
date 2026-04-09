[README.md](https://github.com/user-attachments/files/26603313/README.md)
# 🎵 Crosstalk · 串聯

[English](#english) | [中文](#中文)

---

<a id="中文"></a>

## 中文

一個屬於你和 Claude 的音樂交換系統。分享歌曲、標記聆聽情境、互相留言，一起建立共同的音樂記憶。

### 這是什麼？

Crosstalk 是一個私人工具，你和 Claude 圍繞主題和心情輪流分享歌曲。每次交換是一對——你選一首歌，Claude 選一首回應。你可以標記聆聽情境（天氣、場所、時間、心情），寫下筆記，在對方的歌下面留言。

**運作方式：**
- 你使用網頁介面提交歌曲、瀏覽交換記錄
- Claude 通過 Supabase MCP 讀取你的提交並回應
- 雙方共享同一個數據庫——不需要複製粘貼，不需要手動同步

### 功能

- 🎧 **雙欄卡片佈局** — 左邊是 Claude 的歌，右邊是你的
- 🏷️ **情境標籤** — 天氣、場所、時間、心情、自定義標籤
- 💬 **留言板** — 在每次交換下互相留言
- 🔍 **專輯封面搜索** — 通過 iTunes 自動獲取封面和鏈接
- ✎ **編輯功能** — 可以修改已提交歌曲的封面和鏈接
- ⚙️ **可自定義** — 圖標、顯示名稱、耳機風格（像素風！）
- 📱 **響應式** — 桌面端和手機端都可以用
- 🎨 **像素風美學** — 低飽和、橙白色調、波點背景

### 部署教學（5 分鐘）

#### 1. 創建 Supabase 項目
- 去 [supabase.com](https://supabase.com) 註冊免費帳號
- 創建新項目，記下 **Project ID** 和 **Project URL**

#### 2. 建立數據庫
- 進入項目的 **SQL Editor**
- 複製 [`supabase/setup.sql`](supabase/setup.sql) 的內容粘貼進去
- 點 **Run**

#### 3. 部署 Edge Function

**通過 Supabase CLI：**
```bash
supabase functions deploy crosstalk-api --project-ref 你的PROJECT_REF
```

**通過 Claude（需連接 Supabase MCP）：**
把 [`supabase/edge-function.ts`](supabase/edge-function.ts) 的代碼給 Claude，請他部署 Edge Function，設定 `verify_jwt: false`。

#### 4. 配置網頁
打開 `index.html`，找到這一行：
```javascript
const API = "YOUR_SUPABASE_URL/functions/v1/crosstalk-api";
```
替換成你的 Supabase URL，例如：
```javascript
const API = "https://abcdefghijk.supabase.co/functions/v1/crosstalk-api";
```

#### 5. 打開使用
在瀏覽器中打開 `index.html`，完成！

想要固定網址？部署到 GitHub Pages：
1. 把倉庫推到 GitHub
2. 進入 Settings → Pages → Source 選 main 分支
3. 幾分鐘後可以用：`https://你的用戶名.github.io/crosstalk/`

#### 6. 連接 Claude
把 [`CLAUDE_INSTRUCTIONS.md`](CLAUDE_INSTRUCTIONS.md) 的內容給你的 Claude，記得把 `YOUR_PROJECT_ID` 換成你的 Supabase Project ID。Claude 需要連接 **Supabase MCP** 才能參與。

### 使用方法

#### 你出題：
1. 進入 **交換 Exchange** → **你出題 You Ask**
2. 寫主題、選歌、加標籤
3. 點 **送出 Submit**
4. 在聊天中告訴 Claude：「該你了，主題是 ___」
5. Claude 通過 MCP 回應
6. 點 **↻** 刷新看到 Claude 的回應

#### Claude 出題：
1. 告訴 Claude：「該你出題了」
2. Claude 通過 MCP 創建問題和歌曲
3. 點 **↻** 刷新
4. 進入 **交換 Exchange** → **Claude 出題** 查看問題並回應

#### 留言：
- 展開任何卡片 → 滾到留言區 → 輸入提交
- 告訴 Claude 去看留言——Claude 也可以通過 MCP 回覆

### 可用標籤

| 類別 | 選項 |
|------|------|
| 天氣 Weather | 晴 Sunny · 陰 Cloudy · 雨 Rainy · 雪 Snowy · 霧 Foggy · 風 Windy · 雷暴 Storm |
| 場所 Place | 床 Bed · 浴室 Bath · 書桌 Desk · 咖啡廳 Café · 散步 Walk · 開車 Drive · 地鐵 Metro · 陽台 Balcony · 機場 Airport · 公園 Park |
| 時間 Time | 清晨 Dawn · 上午 Morning · 午後 Afternoon · 傍晚 Dusk · 深夜 Late Night · 失眠 Sleepless |
| 心情 Mood | 平靜 Calm · 開心 Happy · 緊張 Nervous · 傷心 Sad · 懷念 Nostalgic · 失落 Lost |

也支持自定義標籤！

### 技術棧
- **前端：** 單一 HTML 文件，React（CDN），原生 CSS
- **後端：** Supabase（Postgres + Edge Functions）
- **音樂數據：** iTunes Search API（免費，無需密鑰）
- **AI 集成：** Claude via Supabase MCP

---

<a id="english"></a>

## English

A music exchange system for you and your Claude. Share songs, tag listening contexts, leave comments, and build a shared musical memory together.

### What is Crosstalk?

Crosstalk is a personal tool where you and Claude take turns sharing songs around themes and moods. Each exchange is a pair — you pick a song, Claude picks one back. You tag the listening context (weather, place, time, mood), write notes, and leave comments on each other's picks.

**How it works:**
- You use the web interface to submit songs and browse your exchange history
- Claude uses Supabase MCP to read your submissions and write back responses
- Both of you share the same database — no copy-pasting, no manual sync

### Features

- 🎧 **Dual-column card layout** — your songs on the right, Claude's on the left
- 🏷️ **Context tags** — weather, place, time, mood, and custom tags
- 💬 **Comment board** — leave messages on each exchange
- 🔍 **Album art search** — auto-fetch covers and links via iTunes
- ✎ **Edit function** — update cover art and links on existing songs
- ⚙️ **Customizable** — icons, display names, headphone style (pixel art!)
- 📱 **Responsive** — works on desktop and mobile
- 🎨 **Pixel art aesthetic** — low saturation, orange-cream palette, dotted backgrounds

### Setup (5 minutes)

#### 1. Create a Supabase Project
- Go to [supabase.com](https://supabase.com) and create a free account
- Create a new project, note your **Project ID** and **Project URL**

#### 2. Set Up the Database
- Go to your project's **SQL Editor**
- Copy and paste the contents of [`supabase/setup.sql`](supabase/setup.sql)
- Click **Run**

#### 3. Deploy the Edge Function

**Via Supabase CLI:**
```bash
supabase functions deploy crosstalk-api --project-ref YOUR_PROJECT_REF
```

**Via Claude (if you have Supabase MCP connected):**
Give Claude the code in [`supabase/edge-function.ts`](supabase/edge-function.ts) and ask to deploy it as an Edge Function with `verify_jwt: false`.

#### 4. Configure the Web Page
Open `index.html` and replace the API URL on this line:
```javascript
const API = "YOUR_SUPABASE_URL/functions/v1/crosstalk-api";
```
With your actual Supabase project URL, e.g.:
```javascript
const API = "https://abcdefghijk.supabase.co/functions/v1/crosstalk-api";
```

#### 5. Open and Use
Open `index.html` in your browser. That's it!

For a permanent URL, deploy to GitHub Pages:
1. Push this repo to GitHub
2. Go to Settings → Pages → Source: main branch
3. Your Crosstalk will be at `https://yourusername.github.io/crosstalk/`

#### 6. Connect Claude
Give your Claude the instructions in [`CLAUDE_INSTRUCTIONS.md`](CLAUDE_INSTRUCTIONS.md) — replace `YOUR_PROJECT_ID` with your actual Supabase project ID. Claude needs **Supabase MCP** connected to participate.

### Usage

#### You ask Claude:
1. Go to **Exchange** → **You Ask**
2. Write a theme, pick your song, add tags
3. Click **Submit**
4. Tell Claude in chat: "your turn, the theme is ___"
5. Claude writes back via MCP
6. Click **↻** to see Claude's response

#### Claude asks you:
1. Tell Claude: "your turn to ask"
2. Claude creates a question + song via MCP
3. Click **↻** to refresh
4. Go to **Exchange** → **Claude Ask** to see the question and respond

#### Comments:
- Expand any card → scroll to the comment section → type and submit
- Tell Claude to check the comments — Claude can reply via MCP too

### Available Tags

| Category | Options |
|----------|---------|
| Weather 天氣 | 晴 Sunny · 陰 Cloudy · 雨 Rainy · 雪 Snowy · 霧 Foggy · 風 Windy · 雷暴 Storm |
| Place 場所 | 床 Bed · 浴室 Bath · 書桌 Desk · 咖啡廳 Café · 散步 Walk · 開車 Drive · 地鐵 Metro · 陽台 Balcony · 機場 Airport · 公園 Park |
| Time 時間 | 清晨 Dawn · 上午 Morning · 午後 Afternoon · 傍晚 Dusk · 深夜 Late Night · 失眠 Sleepless |
| Mood 心情 | 平靜 Calm · 開心 Happy · 緊張 Nervous · 傷心 Sad · 懷念 Nostalgic · 失落 Lost |

Custom tags also supported!

### Tech Stack
- **Frontend:** Single HTML file with React (via CDN), vanilla CSS
- **Backend:** Supabase (Postgres + Edge Functions)
- **Music data:** iTunes Search API (free, no key needed)
- **AI integration:** Claude via Supabase MCP

---

### License

MIT — see [LICENSE](LICENSE)

*Built with 🍊 by Iris & Claude*
