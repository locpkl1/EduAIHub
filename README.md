# EduAI-Hub

Nền tảng học tập giúp học sinh THPT Việt Nam sử dụng AI hiệu quả và có trách nhiệm.

## Tính năng

- **3 chatbot AI** — Hướng dẫn dùng AI, tạo prompt học tập, tạo prompt đa dụng
- **Kho prompt** — Lưu và quản lý prompt cá nhân
- **Bài học & hướng dẫn** — Nội dung chiến lược học với AI
- **Dashboard** — Theo dõi prompt, công việc và phiên học (Pomodoro)
- **Đăng nhập Google** — Qua Supabase Auth

## Tech stack

- React 18 + TypeScript + Vite + Tailwind CSS
- Supabase (auth, database)
- Coze API (chatbot backend)
- Vercel (deploy + serverless `/api/coze`)

## Cài đặt

```bash
npm install
cp .env.example .env.local
# Điền VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, COZE_API_KEY và các COZE_*_BOT_ID
npm run dev
```

## Biến môi trường

| Biến | Mô tả |
|------|--------|
| `VITE_SUPABASE_URL` | URL project Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon key Supabase |
| `COZE_API_KEY` | Personal Access Token Coze (server-only) |
| `COZE_AI_GUIDE_BOT_ID` | Bot cho chatbot hướng dẫn AI |
| `COZE_STUDY_PROMPT_BOT_ID` | Bot cho prompt học tập |
| `COZE_GENERAL_PROMPT_BOT_ID` | Bot cho prompt đa dụng |
| `COZE_API_BASE_URL` | Tùy chọn; để trống dùng `https://api.coze.com`, hoặc dùng `https://api.coze.cn` |
| `COZE_BOT_ID` | Tùy chọn; bot fallback nếu dùng một bot cho mọi chatbot |

## Database

Chạy migrations trong `supabase/migrations/` trên Supabase SQL Editor (theo thứ tự).

Migration `002` thêm cột `grade` và `school` cho bảng `profiles`.

## Dev local — API Coze

`npm run dev` tự động phục vụ `/api/coze` qua Vite plugin (đọc biến môi trường từ `.env.local`).

Trên production, Vercel dùng `api/coze.js`.

## Scripts

```bash
npm run dev        # Dev server
npm run build      # Production build
npm run preview    # Preview build
npm run typecheck  # TypeScript check
npm run lint       # ESLint
```
