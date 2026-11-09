# EduAI-Hub — Kiểm toán repository, Phase 2

**Ngày rà soát:** 09/11/2026  
**Nguồn:** `locpkl1/EduAIHub`, nhánh `main` tại `c860da4`.  
**Phạm vi PR này:** tài liệu repository, không sửa ứng dụng, database, API, dependency hoặc cấu hình triển khai.

## Nguyên tắc

1. Đánh giá **mức cần thiết và khả năng bảo trì**, không đoán tác giả đoạn mã từ phong cách viết.
2. Chỉ xóa khi đã kiểm tra nơi sử dụng, tác động tới runtime, giá trị lịch sử và khả năng khôi phục.
3. Việc vượt qua build không thay thế kiểm thử đăng nhập, Coze, Supabase và quyền truy cập.
4. Các tệp phục vụ hồ sơ KHKT, lịch sử phát triển và minh chứng phải được giữ nguyên hoặc chuyển lưu trữ có chủ đích; không xóa để che việc dùng AI.

## Phát hiện đã đối chiếu từ repository

| Ưu tiên | Phát hiện | Tệp / dấu hiệu | Xử lý |
| --- | --- | --- | --- |
| P1 | README mô tả ba chatbot theo tên cũ, Dashboard có Pomodoro dù mã Dashboard hiện chủ yếu quản lý prompt | `README.md`, `src/pages/Dashboard.tsx`, `src/lib/cozeClient.ts` | Sửa README trong PR này |
| P2 | Hai bản frontend redesign brief trùng phần lớn yêu cầu; bản ngắn còn viết sai `redesgin` | `docs/frontend_redesgin-brief.md`, `docs/eduaihub-redesign-brief.md` | Đề xuất chỉ giữ bản đầy đủ; thay đổi được review qua PR |
| P1 | Ba PDF sách giáo khoa đã được commit và phục vụ qua `public/resources`; tổng khoảng 82,8 MiB | `public/resources/` | **Chưa xóa:** xác minh quyền phân phối và chức năng đang dùng trước |
| P1 | Danh mục local trỏ tới PDF Hóa 11 và Toán 11 nhưng không có hai file đó trong commit `main` | `src/data/localTextbookResources.ts`, `.gitignore` | **Chưa sửa:** xác định mong muốn hiển thị tài liệu và kiểm thử liên kết |
| P2 | Hướng dẫn tác nhân AI dành riêng cho redesign trong khi repo còn backend, Admin Center và cấu hình Coze | `AGENTS.md`, `.cursor/rules/` | **Chưa sửa:** làm rõ quy trình chung và ranh giới từng nhiệm vụ |
| P2 | Có mã dữ liệu được chú thích `legacy/sample`; chưa chứng minh không có nơi sử dụng | `src/data/educationData.ts` | **Chưa xóa:** truy vết import và trạng thái hiển thị trước |
| P2 | Nhiều trang/component lớn (đơn cử `LandingPage.tsx`, `Textbooks.tsx`, `ChatbotPage.tsx`); độ dài tự nó không phải lỗi | `src/` | Chỉ refactor sau khi có chỉ dấu lặp logic hoặc khó kiểm thử |
| P2 | Chưa có script kiểm thử tự động trong `package.json` | `package.json` | Đề xuất thêm test theo luồng quan trọng trong PR sau |
| P2 | Dev server khai báo một hostname cụ thể trong `allowedHosts` | `vite.config.ts` | **Chưa sửa:** xác nhận môi trường nào còn sử dụng |
| P1 | Endpoint Coze nhận cả request guest; chưa thấy rate limiting trong handler | `api/coze.js`, `lib/cozeHandler.mjs` | Chuyển sang đợt kiểm toán API và bảo mật riêng |

### Lưu ý về tài liệu PDF

`.gitignore` **không xóa hay ngăn phân phối những file đã được Git theo dõi**. Các PDF nằm trong `public/` có thể trở thành nội dung được phân phối qua website. Cần xác minh quyền, tính cần thiết và đường dẫn trước khi gỡ khỏi bản triển khai; cũng cần cân nhắc ảnh hưởng tới dung lượng lịch sử Git. Không sửa lịch sử Git chỉ để làm cho repo trông như chưa từng dùng AI hoặc chưa từng chứa tài liệu.

## Phân biệt đã xác minh và chưa xác minh

**Đã xác minh:** tên biến Coze trong frontend/backend, cấu trúc route, tệp nguồn tồn tại trong Git, danh sách tài nguyên và nội dung README không khớp mã hiện tại.

**Chưa xác minh:** quyền phân phối từng PDF, tính đúng của secret production, phản hồi Coze thực, thao tác OAuth thật, tác động hiệu năng khi tách bundle, việc các module có được người dùng sử dụng thường xuyên hay không.

## Thứ tự công việc đề xuất

- **Phase 2A — tài liệu (PR này):** README đúng với code, gỡ tài liệu redesign ngắn trùng lặp, ghi lại backlog có căn cứ.
- **Phase 2B — kiểm toán dead code:** lập danh sách import/route/cấu hình thực sự không dùng; mỗi mục phải có bằng chứng, rollback và kiểm thử trước khi xóa.
- **Phase 2C — tài nguyên:** kiểm tra quyền sử dụng PDF, các liên kết hỏng và phương án thay thế; yêu cầu người quản lý dự án duyệt.
- **Phase 3 — bảo mật và độ tin cậy:** Coze request parsing, giới hạn request, timeout, quyền Supabase, logging và smoke test.
- **Phase 4 — trải nghiệm học tập:** cân nhắc giản lược những tính năng không còn phục vụ triết lý học chủ động bằng phản hồi người dùng, không dựa vào suy đoán.

## Tiêu chuẩn review cho mỗi PR

- Có mục tiêu và phạm vi thay đổi cụ thể; không trộn cleanup và feature mới.
- `npm ci`, `npm run typecheck`, `npm run lint`, `npm run build` được chạy lại khi có chỉnh mã.
- Chức năng quan trọng được kiểm tra bằng test thực tế hoặc mock có ghi rõ giới hạn.
- Preview được xem trước khi merge; không đưa secret ra log.
- Nếu làm thay đổi production, tài liệu công khai, database hoặc quyền truy cập, cần duyệt riêng.
