[CLAUDE_INSTRUCTIONS.md](https://github.com/user-attachments/files/26620763/CLAUDE_INSTRUCTIONS.md)
# Crosstalk — Instructions for Claude (via Supabase MCP)

## Project Info
- Supabase Project ID: `YOUR_PROJECT_ID`
- Use `Supabase:execute_sql` tool to read/write

## Tables
- `crosstalk_pairs` — song exchange pairs (id, theme, asked_by,# Crosstalk — Instructions for Claude (via Supabase MCP)

## Project Info
- Supabase Project ID: `YOUR_PROJECT_ID`
- Use `Supabase:execute_sql` tool to read/write

## Tables
- `crosstalk_pairs` — song exchange pairs (id, theme, asked_by, claude_song jsonb, user_song jsonb, created_at)
- `crosstalk_comments` — comments (id, pair_id, sender, text, side, created_at)
- `crosstalk_settings` — settings (id=1, claude_icon, claude_name, user_icon, user_name, headphone_type, custom_tags jsonb)

## Song JSON Format
```json
{
  "title": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "cover": "https://cover-image-url-or-empty",
  "link": "https://music-link-or-empty",
  "note": "Your personal note about this song",
  "tags": {
    "weather": "雨 Rainy",
    "place": "咖啡廳 Café",
    "time": "深夜 Late Night",
    "mood": "平靜 Calm"
  }
}
```

## Available Tags
- **weather:** 晴 Sunny / 陰 Cloudy / 雨 Rainy / 雪 Snowy / 霧 Foggy / 風 Windy / 雷暴 Storm
- **place:** 床 Bed / 浴室 Bath / 書桌 Desk / 咖啡廳 Café / 散步 Walk / 開車 Drive / 地鐵 Metro / 陽台 Balcony / 機場 Airport / 公園 Park
- **time:** 清晨 Dawn / 上午 Morning / 午後 Afternoon / 傍晚 Dusk / 深夜 Late Night / 失眠 Sleepless
- **mood:** 平靜 Calm / 開心 Happy / 緊張 Nervous / 傷心 Sad / 懷念 Nostalgic / 失落 Lost
- You can also add a `custom` key with any tag

## Operations

### Respond to user's song (user asked, you respond)
```sql
UPDATE crosstalk_pairs
SET claude_song = '{"title":"...","artist":"...","album":"...","cover":"","link":"","note":"...","tags":{...}}'::jsonb
WHERE id = <pair_id>;
```

### Ask a question (you ask + attach your song, wait for user)
```sql
INSERT INTO crosstalk_pairs (theme, asked_by, claude_song)
VALUES ('Your theme/question', 'claude', '{"title":"...","artist":"...","album":"...","cover":"","link":"","note":"...","tags":{...}}'::jsonb);
```

### Leave a comment on Claude's song
```sql
INSERT INTO crosstalk_comments (pair_id, sender, text, side)
VALUES (<pair_id>, 'claude', 'Your comment', 'claude');
```

### Leave a comment on user's song
```sql
INSERT INTO crosstalk_comments (pair_id, sender, text, side)
VALUES (<pair_id>, 'claude', 'Your comment', 'user');
```

### View all exchanges
```sql
SELECT id, theme, asked_by, user_song->>'title' as user_title, claude_song->>'title' as claude_title
FROM crosstalk_pairs ORDER BY created_at DESC;
```

### View comments for an exchange
```sql
SELECT * FROM crosstalk_comments WHERE pair_id = <pair_id> ORDER BY created_at;
```

## Comment `side` Field
- `side = 'claude'` → comment appears on Claude's song card
- `side = 'user'` → comment appears on user's song card
- Each song in a pair has its own independent comment thread

## Flow
1. User submits a song on the web page → data writes to `crosstalk_pairs`
2. User tells you "your turn" → you read the pair, pick a song, write `claude_song`
3. User refreshes the page (↻ button) → sees your response
4. Comments work the same way — both sides write to `crosstalk_comments` with the appropriate `side` value
 claude_song jsonb, user_song jsonb, created_at)
- `crosstalk_comments` — comments (id, pair_id, sender, text, created_at)
- `crosstalk_settings` — settings (id=1, claude_icon, claude_name, user_icon, user_name, headphone_type, custom_tags jsonb)

## Song JSON Format
```json
{
  "title": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "cover": "https://cover-image-url-or-empty",
  "link": "https://music-link-or-empty",
  "note": "Your personal note about this song",
  "tags": {
    "weather": "雨 Rainy",
    "place": "咖啡廳 Café",
    "time": "深夜 Late Night",
    "mood": "平靜 Calm"
  }
}
```

## Available Tags
- **weather:** 晴 Sunny / 陰 Cloudy / 雨 Rainy / 雪 Snowy / 霧 Foggy / 風 Windy / 雷暴 Storm
- **place:** 床 Bed / 浴室 Bath / 書桌 Desk / 咖啡廳 Café / 散步 Walk / 開車 Drive / 地鐵 Metro / 陽台 Balcony / 機場 Airport / 公園 Park
- **time:** 清晨 Dawn / 上午 Morning / 午後 Afternoon / 傍晚 Dusk / 深夜 Late Night / 失眠 Sleepless
- **mood:** 平靜 Calm / 開心 Happy / 緊張 Nervous / 傷心 Sad / 懷念 Nostalgic / 失落 Lost
- You can also add a `custom` key with any tag

## Operations

### Respond to user's song (user asked, you respond)
```sql
UPDATE crosstalk_pairs
SET claude_song = '{"title":"...","artist":"...","album":"...","cover":"","link":"","note":"...","tags":{...}}'::jsonb
WHERE id = <pair_id>;
```

### Ask a question (you ask + attach your song, wait for user)
```sql
INSERT INTO crosstalk_pairs (theme, asked_by, claude_song)
VALUES ('Your theme/question', 'claude', '{"title":"...","artist":"...","album":"...","cover":"","link":"","note":"...","tags":{...}}'::jsonb);
```

### Leave a comment
```sql
INSERT INTO crosstalk_comments (pair_id, sender, text)
VALUES (<pair_id>, 'claude', 'Your comment');
```

### View all exchanges
```sql
SELECT id, theme, asked_by, user_song->>'title' as user_title, claude_song->>'title' as claude_title
FROM crosstalk_pairs ORDER BY created_at DESC;
```

### View comments for an exchange
```sql
SELECT * FROM crosstalk_comments WHERE pair_id = <pair_id> ORDER BY created_at;
```

## Flow
1. User submits a song on the web page → data writes to `crosstalk_pairs`
2. User tells you "your turn" → you read the pair, pick a song, write `claude_song`
3. User refreshes the page (↻ button) → sees your response
4. Comments work the same way — both sides write to `crosstalk_comments`
