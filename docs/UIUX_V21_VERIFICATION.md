# EduAI-Hub V2.1 — Brand Restoration & Mobile Experience

Ngày: 2026-11-10. Nhánh: `feat/eduaihub-v2-brand-restoration`, dựa trên V2 `ffbb70b`.

## Kết quả

- **Floating Capsule Navigation:** phục hồi khung giấy ấm tách nền, radius 24px ở desktop, border/shadow nhẹ, nhóm tab, trạng thái active và logo xếp lớp xanh–cam. Giữ desktop breakpoint 1280px; tablet dùng top bar gọn. Không dùng glass/blur. Dropdown, tài khoản, đăng nhập và theme giữ nguyên handlers.
- **Layered Paper Hero:** giữ headline “Học cách hỏi, để biết cách học.”, hai cột desktop, ví dụ câu hỏi chưa rõ/cải thiện và ghi chú xanh. Chỉ lớp giấy trang trí dùng absolute; toàn bộ chữ ở flow bình thường. Nhịp Hiểu–Thử–Sửa–Áp dụng nằm ở section tiếp theo. Không tăng số section của V2.
- **Three AI Notebooks:** ba sổ xanh/cam/xanh lá trên `/ai-tools`, có gáy, mép giấy, tab màu, icon, số trợ lý, tình huống, ví dụ và một CTA. Cùng hàng desktop, xếp dọc mobile; không stagger/clipPath cắt chữ hoặc focus. Nội dung/routes lấy từ learningTools V2.
- **Mobile bottom navigation:** năm đích có icon + label dưới 768px, active đúng deep route. Tài nguyên dùng native dialog riêng cho Kho Prompt và Bản đồ chương trình; Escape/đóng/đổi route trả focus, đổi sang tablet đóng menu và focus nội dung. Có safe-area và khoảng chừa cuối trang. Tất cả chat routes/alias ẩn bottom bar, giữ nút quay về Công cụ AI. Khi visual viewport giảm do nhập liệu, có logic ẩn bar; chưa kiểm chứng bàn phím thiết bị thật.
- **Profile:** overview + ba nhóm chỉnh sửa; không mở toàn bộ form ban đầu. Native checkbox multi-select trong disclosure có tìm kiếm, chỉ tóm tắt lựa chọn đã chọn, có nút bỏ chọn và giữ giá trị cũ ngoài danh mục. Không giới hạn số lựa chọn. Radio/select/input được chọn theo loại dữ liệu; giữ trường văn bản tự do. Chuyển nhóm giữ draft; Thu gọn trả focus đúng trigger.
- **Completion modal:** ba bước Thông tin cơ bản → Cách học với AI → Mục tiêu; một vùng nội dung cuộn, header/footer trong flex flow, chiều cao phản ứng theo visual viewport. Giữ draft khi Next/Back, chặn lưu sớm ở ô tìm kiếm, khóa Để sau/Escape khi lưu, lỗi cho retry, có thông báo thành công. Focus heading/Tab qua summary, Escape disclosure và return focus đã kiểm thử.

## File đã thay đổi

- `src/components/Layout.tsx`
- `src/components/MobileNavigation.tsx` (mới)
- `src/pages/LandingPage.tsx`
- `src/pages/AiTools.tsx`
- `src/pages/Profile.tsx`
- `src/components/ProfileCompletionModal.tsx`
- `src/components/profile/ProfileFields.tsx` (mới)
- `src/components/profile/profileFormModel.ts` (mới, chỉ model UI)
- `src/components/Modal.tsx` (vòng Tab hỗ trợ heading và native summary)
- `src/index.css`
- `scripts/verify-uiux-browser.mjs`
- `DESIGN.md`
- `docs/eduaihub-redesign-brief.md`
- Báo cáo này.

## Lịch sử thiết kế và skills

Đã đọc `git log/show/diff`, so ba component trước overhaul tại `0bd1c09` với V2. Khôi phục ngôn ngữ thiết kế có chọn lọc, không checkout/cherry-pick file cũ. Đã cập nhật brief để bảo vệ ba signature và phân biệt Signature / Functional / Reading UI.

Đã đọc `frontend-design`, `impeccable`, `web-design-guidelines` và áp dụng hướng dẫn critique, distill, typeset, adapt, colorize, polish. Quy tắc web được đối chiếu từ [nguồn chính thức](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). Áp dụng thủ công, không cài/chạy engine hoặc tuyên bố chạy detector.

Hai đánh giá độc lập: A xem lịch sử/source và ảnh desktop/mobile/light/dark; B rà semantics, focus, draft và contract lưu. Đã xử lý các phát hiện về Tab qua summary, Enter trong ô lọc, Escape disclosure, focus sau Thu gọn và đổi breakpoint. Không còn P1/P2 được xác nhận trong vùng review. Đây không phải chứng nhận accessibility toàn bộ.

## Kết quả kiểm thử

| Kiểm tra | Kết quả |
| --- | --- |
| Typecheck | PASS |
| Lint | PASS, không warning ESLint |
| Build | PASS; JS 789.73kB / gzip 218.19kB |
| Browser | PASS, 15 nhóm test trên Chromium headless |
| Responsive | 14 routes × 6 widths 320/390/768/1024/1280/1440 × light/dark = 168 trạng thái; theme thực, một main/h1, không tràn ngang document hoặc lỗi JS |
| Header | Guest thật của app + provider logged-in giả lập, tên dài, đủ 6 widths; menu, Escape và return focus |
| Bottom nav | Active deep routes, đủ hai resources, Escape/đổi breakpoint, footer không bị bar che, không xuất hiện trong chat/alias |
| Profile | Lựa chọn cũ, tìm không dấu, Enter không tự lưu, đổi nhóm không mất dữ liệu, payload đầy đủ, Thu gọn trả focus |
| Completion modal | Next/Back giữ draft, search/summary keyboard, lỗi/retry, pending khóa đóng, focus trap; chiều cao 400/600/900px, scroll tới trường cuối và không có scroll thứ hai ở outer dialog |
| V2 regression | PUSH/Back/Forward/anchors, slow GET restoration/interruption/error retry, Prompt detail mobile/keyboard, native Clipboard Enter/Space, saved prompt dialogs, chat persistence với response giả lập |
| Nội dung/routes | PASS: 12 bài, 4 chặng, 32 prompt, 15 hoạt động, 36 self-check, 12 alias, 3 kinh nghiệm, 3 công cụ, 26 routes giữ nguyên |
| API/auth/data safety | 50 đường dẫn nguồn được bảo vệ không khác V2; AST của đối số updateProfile tại cả Profile/CompletionModal giống V2, đủ 11 fields |

Kiểm thử provider/profile/save dùng dữ liệu và callback trong bộ nhớ; Supabase reads/Coze được chặn bằng fixtures. Không đăng nhập hoặc ghi dữ liệu lên dịch vụ thật. File academic, hooks, auth, schemas, API, package manifests và các trang V2 ngoài phạm vi không sửa.

Chạy lại bằng `node scripts/verify-uiux-content.mjs` và `node scripts/verify-uiux-browser.mjs` sau khi mở Vite local. Có thể đặt `EDUAIHUB_QA_OUTPUT=.qa/v21.local`; trỏ `EDUAIHUB_PLAYWRIGHT_MODULE` / `EDUAIHUB_BROWSER_PATH` đến Playwright và Chromium đã có trên máy. Không thêm dependency.

## Ảnh trước / sau

Lưu local ở `.qa/v21.local/`, không commit: `before-{home,tools,profile,modal}-{390,1440}.png`, `after-{light,dark}-{home,tools}-{width}.png`, `after-profile-*.png`, `after-modal-*.png`. Kết quả chi tiết: `responsive.json`, `contrast.json`, `interaction-results.json`.

Đo từ ảnh cùng fixture dữ liệu và viewport:

| Bề mặt | Trước | Sau |
| --- | --- | --- |
| Home 1440px | 2542px | 2529px |
| AI Tools 1440px | 1184px | 1230px |
| Profile 390px | 2884px, toàn bộ form | 900px, overview; mở từng nhóm khi chỉnh |

Profile không mất field; số đo sau là trạng thái overview, không phải toàn bộ form đã trải ra. Fullpage screenshot đặt bottom bar fixed tại đáy viewport đầu, nên bar có thể nằm giữa ảnh dài; kiểm thử scroll cuối trang xác nhận nội dung cuối không bị che.

## Hạn chế còn lại

- Chưa thử OAuth/save Supabase/Coze live hoặc thiết bị Android/iOS/Safari thật.
- Chưa kiểm chứng bàn phím điện thoại thực; viewport thấp/visualViewport chỉ là kiểm tra thay thế, không được gọi là nghiệm thu keyboard thiết bị.
- Screen reader và zoom browser native 200% chưa được kiểm chứng.
- Cảnh báo bundle >500kB và Browserslist cũ vẫn có; không che cảnh báo hoặc thêm dependency để đạt số đo hình thức.

Đủ điều kiện review giao diện và kiểm thử thủ công bổ sung. Không push/merge/tạo GitHub PR/deploy. Thay đổi `skills-lock.json` và thư mục `outputs/` có từ trước được giữ nguyên ngoài staging/commit; không thay cấu hình Git hoặc đưa AI Skills vào commit.
