# EduAI-Hub V2.2 Correction — bằng chứng và kết quả

Bản ghi lịch sử của `6b57ac8`. Vị trí sidebar và hành vi Guides/Resources/Assistant hiện hành được cập nhật tại [V2.3](UIUX_V23_VERIFICATION.md).

Ngày: 10/11/2026. Nhánh giữ nguyên: `feat/eduaihub-v22-learning-workspace`. Baseline correction: `9a6c436`. Nguồn nhận diện trước V2: `1b0c374`; đợt tinh gọn tiếp theo là `43acd23`. Không checkout/restore toàn bộ source cũ.

## Kết quả theo phạm vi yêu cầu

| Khu vực | Trước correction | Sau correction |
| --- | --- | --- |
| Right navigation | Fixed sidebar + padding mô phỏng chỗ trống; chat buộc collapse, không có nút expand | Grid `MAIN \| RIGHT NAV`, sidebar chiếm cột thật; 240px từ1280, 72px ở768–1279; nút collapse/expand cả chat desktop rộng. Trang thường mặc định expanded; chat mặc định rail. Mobile giữ bottom navigation, không hamburger hoặc navigation kép. |
| Logo | Link Public/workspace triển khai riêng, workspace chỉ có icon đơn | `BrandLink` dùng chung với mặt xanh/giấy cam; guest tới `/`, user tới `/dashboard`. Thu gọn vẫn có link và accessible name. Browser xác nhận SPA sentinel còn nguyên khi nhấn logo, không reload. |
| Public navbar | Active tint/đường dưới; mobile header phẳng | Capsule inset/radius cả mobile và desktop; subtitle, icon tabs, nhóm nền giấy, active viền xanh + bóng lệch. Giữ full nav ở1280 để không khôi phục lỗi overflow768. |
| Hero | Một tờ chứa tất cả ví dụ và blue note | Năm đối tượng giấy: backing, prompt chưa rõ, prompt cải thiện, checklist ba câu, statement xanh. Label giấy, Aleo lớn, highlight xanh, marker cam, nền chấm và nét trang trí. Nội dung nằm trong grid/flow, mobile xếp dọc. Không khôi phục các section dài bên dưới. |
| Chat desktop | History/context modal overlay, context đóng mặc định | Từ1024: `HISTORY(optional) \| CHAT \| CONTEXT(if available) \| APP NAV`. History220px, context280px; chatbot2 context bên phải, mở sẵn. Grid thay cột và panel transform theo hướng cạnh. Bot1/3 không có panel context rỗng. |
| Chat mobile/tablet hẹp | Context icon mở dialog thường | Nút chữ “Ngữ cảnh học tập” dễ thấy; context sheet trượt từ phải, history từ trái. Native modality, focus vào nút đóng sau reveal, Tab/Escape/return focus. Composer dùng available viewport; không bottom bar trong chat. |
| State và dữ liệu | Conversation/prompt/profile logic V2.2 | Giữ nguyên. Context cùng một cây DOM khi collapse hoặc đổi dock/sheet; không reset lựa chọn, draft hay conversation. FieldLabel chỉ đổi sang `htmlFor`/id rõ để tên trường không lẫn text option. |

## Đối chiếu Git và ảnh thực tế

Đã dùng `git log`, `git show`, `git diff` trên Layout/Landing/CSS/UI liên quan. V1 có active offset shadow nhưng **không có viền xanh active riêng**; viền là yêu cầu bổ sung trong correction. V1 cũng có một số câu prompt và checklist bị lớp giấy khác che; không sao chép lại lỗi đó.

Đã chạy riêng snapshot source/theme/UI của `1b0c374` và `9a6c436`, với cấu hình preview React tối thiểu, không backend middleware. Các ảnh cùng viewport1440×900 và390×900; capture vượt viewport để lấy hết chiều cao hero mà không đổi viewport. Không phải ảnh mockup.

| Đối chiếu | File local (không commit) |
| --- | --- |
| Hero V1 | `.qa/correction.local/history-hero-{1440,390}.png` |
| Hero V2.2 trước correction | `.qa/correction.local/before-hero-{1440,390}.png` |
| Hero sau correction | `.qa/correction.local/after-hero-{1440,390}.png` |
| Dashboard trước/sau | `before-dashboard-{1440,390}.png`, `after-{light,dark}-dashboard-{1440,390}.png` trong cùng thư mục |
| Chatbot1 trước/sau | `before-chat1-{1440,390}.png`, `after-{light,dark}-chat1-{1440,390}.png` |
| Chatbot2 trước | `before-chat2-{collapsed,expanded}-{1440,390}.png` |
| Chatbot2 sau | `after-{light,dark}-chat2-{1440,390}.png`; desktop có context mở sẵn |
| Context collapsed/sheet | `after-{light,dark}-chat2-collapsed-1440.png`, `after-{light,dark}-chat2-sheet-390.png` |
| Ba dock cùng mở | `after-chat2-all-docks-1440.png` |

Ảnh workspace dùng tài khoản/prompt fixture. Bottom bar xuất hiện giữa ảnh mobile dài vì được ghim ở đáy viewport đầu; đã kiểm tra đọc chữ khi cuộn, không suy ra lỗi overlap chỉ từ ảnh full-page.

Review A độc lập đã xác nhận layering, typography, accent, mật độ, đọc hết hai ví dụ/checklist/statement và capsule mobile sau sửa. Review B độc lập xác nhận focus/Escape, đổi breakpoint, đóng/mở nhanh10 lần, unmount giữa animation, cùng DOM và draft. Không còn finding chặn trong phạm vi đã review. Không chạy/cài engine thiết kế; áp dụng hướng dẫn và kiểm tra thủ công/browser. Workflow review không mở thêm câu hỏi thiết kế vì người dùng đã cung cấp phương án correction cụ thể.

## Bằng chứng push/slide

Số đo cuối lưu tại `.qa/correction.local/push-measurements.json`:

- Viewport1440: main workspace1200px khi nav240px → khoảng1329.23px giữa transition →1368px khi rail72px. Main thực sự nhận thêm168px.
- Context chatbot2: chat1070px → khoảng1247.80px giữa transition →1350px khi context đóng. Thu hồi đúng280px, không overlay desktop. Mở thêm history thu hẹp tiếp220px, ba dock không chồng nhau.
- Context mobile390: cạnh trái sheet đi từ khoảng246.16px giữa animation tới70px khi ổn định (sheet320px sát phải). Mobile320: khoảng186.95px tới24px; tablet768: khoảng624.21px tới448px.
- Thời lượng grid/transform220ms; sidebar200ms. Reduced motion trả computed transition duration0s. Panel đóng có `inert`, không nhận Tab; desktop là region không modal, mobile dùng native modal sheet.

## Kiểm thử

- `npm run typecheck`: PASS.
- `npm run lint`: PASS sau khi dọn cache QA sinh tự động, không đổi quy tắc lint.
- `npm run build`: PASS; CSS52.67kB, JS800.94kB (gzip220.84kB). Còn cảnh báo Browserslist cũ và chunk>500kB; không thay dependency/chunking ngoài phạm vi.
- `node scripts/verify-uiux-content.mjs`: PASS; giữ12 bài/bốn chặng/32 prompt ví dụ/15 hoạt động/36 self-check/12 aliases/ba công cụ/ba kinh nghiệm/26 route declarations.
- `scripts/verify-uiux-browser.mjs`: PASS15 nhóm,168 responsive states, scroll/back/forward/anchors, prompt keyboard/copy, dialogs, profile/admin focus, chat mock send và persistence, contrast, reduced motion, bottom nav, signatures.
- `scripts/verify-correction.mjs`: PASS5 nhóm; logo không reload, hero text không bị giấy che, sidebar grid, context/history push, cùng DOM/draft/conversation, sheet focus/Escape/resize, cả ba chatbot, light/dark. Thêm48 states gồm dashboard và ba chatbot ở sáu widths×hai themes.
- `scripts/verify-workspace.mjs`: PASS12 nhóm routing/dashboard/profile/workspace sau correction;168 responsive states. Tổng ba bộ là32 nhóm và384 lượt layout; xem kết quả cuối `.qa/v22.local/workspace-results.json`.
- Source invariant local: PASS tám hàm auth/profile và15 hàm chat đối chiếu baseline; hai effect đọc/ghi localStorage và payloads giữ nguyên; AuthProvider nguyên file, hooks/data/lib/API/schema/dependencies/RouteScrollManager/Guides/Profile/Dashboard không sửa. Phần Landing phía dưới hero giữ nguyên.
- `git diff --check`: PASS.

Browser cuối chạy Chromium headless với SDK/response fixtures. Không dùng kết quả này để tuyên bố Google OAuth, Supabase hoặc Coze live đang hoạt động. Lần chạy bị preview dừng do snapshot watcher/cache đã bị loại khỏi kết quả PASS và chạy lại. Preview QA sau đó tách cache, bỏ theo dõi snapshot và không chứa Coze middleware. Lint từng đọc nhầm cache vendor local; không sửa source/rules để che lỗi, cache sinh ra được dọn sau QA.

## File source/test/tài liệu thuộc correction

- Shared brand: `src/components/BrandLink.tsx` (mới), `src/components/Layout.tsx`, `src/components/workspace/WorkspaceShell.tsx`.
- Hero: `src/components/home/LearningHero.tsx` (mới), `src/pages/LandingPage.tsx`.
- Chat: `src/components/chat/SlidingPanel.tsx` (mới), `src/components/ChatbotPage.tsx`, `src/pages/chatbots/StudyPromptChatbot.tsx`.
- Styles: `src/index.css`.
- QA: `scripts/verify-correction.mjs` (mới), `scripts/verify-uiux-browser.mjs`, `scripts/verify-workspace.mjs`. Fixture đọc đúng module URLs từ Vite thay vì hardcode đường dẫn cache; assertion history đổi theo DOM được giữ mount, chờ transition thay vì đo trước khi animation xong.
- Tài liệu: `DESIGN.md`, `docs/eduaihub-redesign-brief.md`, ghi chú baseline tại `docs/UIUX_V22_VERIFICATION.md`, báo cáo này.

## Giới hạn và Git safety

Chưa kiểm chứng bàn phím ảo Android/iOS thật, Safari/WebKit, native browser zoom200%, screen reader hoặc GPU/performance trên thiết bị thật. Đã kiểm tra viewport thấp500px như bằng chứng layout thay thế. Log preview dev cũ có lỗi Coze4101; không thay token/cấu hình/API trong correction và không coi đó là luồng live đã đạt.

Không sửa backend/schema/OAuth/data contracts. Không stage/commit skills, `skills-lock.json`, `outputs/` hoặc QA artifacts. Giữ nguyên thay đổi có sẵn `M skills-lock.json` và `?? outputs/`; hash lock được đối chiếu trước/sau. Không push, merge hoặc deploy. Preview snapshot và các file unpack tạm được dọn sau đối chiếu; ảnh/archive QA chỉ ở local.
