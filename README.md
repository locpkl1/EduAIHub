# EduAI-Hub

**EduAI-Hub: Nền tảng hỗ trợ học sinh THPT rèn luyện và nâng cao kỹ năng sử dụng AI trong việc tự học**

EduAI-Hub hướng đến một cách học chủ động: xác định điều cần hiểu, đặt câu hỏi rõ, tự thử giải quyết vấn đề và kiểm chứng phản hồi AI. AI là công cụ hỗ trợ quá trình học, không phải nơi giao hết việc học.

## Các phần chính

- **Hướng dẫn:** lộ trình học cách đặt câu hỏi, viết prompt và sử dụng AI có trách nhiệm.
- **Ba trợ lý Coze:** Học Tư Duy Prompt, Gợi Ý Prompt Học Tập và Đánh Giá Prompt.
- **Kho Prompt:** tham khảo và quản lý các prompt đã lưu.
- **Bài học:** nội dung hướng dẫn học cùng AI, gồm bài viết được quản lý qua Admin Center.
- **Tài nguyên học tập:** tìm danh mục sách theo lớp, môn và mở các nguồn học liệu đang có.
- **Dashboard:** truy cập và quản lý prompt cá nhân. Đăng nhập Google qua Supabase để dùng các tính năng cần tài khoản.

## Công nghệ và cấu trúc

- Giao diện: React 18, TypeScript, Vite, Tailwind CSS, React Router.
- Đăng nhập và dữ liệu: Supabase Auth, Database và Storage.
- Trợ lý AI: Coze qua endpoint **server-side** `/api/coze`, không gọi Coze trực tiếp từ trình duyệt.
- Triển khai web: Vercel. Có cấu hình Capacitor/Android trong repository.

Thư mục quan trọng:

| Đường dẫn | Chức năng |
| --- | --- |
| `src/pages/`, `src/components/` | Trang và thành phần giao diện |
| `src/contexts/`, `src/hooks/`, `src/lib/` | Context, hooks và lớp tích hợp frontend |
| `api/coze.js`, `lib/cozeHandler.mjs` | API trên Vercel và phần xử lý Coze dùng chung |
| `vite-plugin-coze-api.ts` | Phục vụ `/api/coze` khi chạy Vite local |
| `supabase/migrations/` | Các migration cơ sở dữ liệu |
| `docs/` | Tài liệu kỹ thuật, định hướng và tri thức phục vụ chatbot |

## Chạy ở môi trường phát triển

Yêu cầu: Node.js và npm tương thích với các dependency hiện tại.

```bash
npm ci
cp .env.example .env.local
```

Sao chép `.env.example` thành `.env.local`, sau đó nhập cấu hình của môi trường phát triển vào file local (không commit). Cuối cùng:

```bash
npm run dev
```

### Những biến môi trường chính

| Biến | Vai trò |
| --- | --- |
| `VITE_SUPABASE_URL` | URL project Supabase |
| `VITE_SUPABASE_ANON_KEY` | Client anon/publishable key tương thích với cấu hình hiện tại |
| `COZE_API_KEY` | Token Coze chỉ dùng ở máy chủ; có thể dùng alias `COZE_API_TOKEN` |
| `COZE_PROMPT_THINKING_BOT_ID` | Bot học tư duy prompt |
| `COZE_STUDY_PROMPT_BOT_ID` | Bot gợi ý prompt học tập |
| `COZE_PROMPT_EVALUATOR_BOT_ID` | Bot đánh giá prompt |
| `COZE_API_BASE_URL` | Tùy chọn; mặc định `https://api.coze.com` |

Các tên biến Coze cũ vẫn được backend chấp nhận cho mục đích tương thích; xem [tài liệu chatbot](docs/chatbot-system.md) và [mẫu biến môi trường](.env.example).

**Bảo mật:** Không đưa Coze token, Supabase service-role key hay bất kỳ secret nào vào biến có tiền tố `VITE_`, file được commit, log hoặc ảnh chụp màn hình. Môi trường Cloud Development và Vercel Production cần cấu hình riêng.

## Kiểm tra trước khi đưa thay đổi lên GitHub

```bash
npm run typecheck
npm run lint
npm run build
```

`npm run build` chỉ chạy Vite build, **không tự chạy TypeScript check**. Hãy chạy riêng cả ba lệnh. Các kiểm tra này không thay thế kiểm thử Google OAuth, database hay chatbot với dịch vụ thật.

## Dữ liệu và triển khai

- Các migration tại `supabase/migrations/` phải được xem xét và áp dụng theo thứ tự phù hợp. Không tự chạy migration production trong quá trình dọn repo.
- Web production dùng `api/coze.js`; local `npm run dev` dùng Vite middleware nhưng cùng logic xử lý Coze.
- Bản Vercel Preview của nhánh thử nghiệm có thể không có các biến môi trường production; việc build thành công không chứng minh toàn bộ tích hợp hoạt động.
- Chỉ đưa lên `public/resources/` tài liệu được phép phân phối. Không coi việc có thể tìm thấy một PDF trên Internet là có quyền đăng lại.

## Tài liệu tham khảo nội bộ

- [Kiến trúc chatbot và các bot ID](docs/chatbot-system.md)
- [Định hướng frontend chính](docs/eduaihub-redesign-brief.md)

Mọi thay đổi cần có lý do rõ ràng, có thể kiểm chứng và được người phát triển dự án hiểu trước khi merge. Việc sử dụng AI hỗ trợ lập trình cần được khai báo trung thực trong các hồ sơ liên quan.
