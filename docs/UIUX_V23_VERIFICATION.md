# EduAI-Hub V2.3 — triển khai và kiểm chứng

Ngày: 10/11/2026. Baseline thực tế: `6b57ac8`. Nhánh mới: `feat/eduaihub-v23-learning-ux`, tạo trực tiếp từ correction V2.2. Yêu cầu mới nhất là sidebar ứng dụng **trái**, trợ lý hướng dẫn website **fixed góc dưới phải viewport**, độc lập với sidebar. Những chỉ dẫn sidebar phải V2.2 hoặc widget góc trái trong brief ban đầu được thay thế.

## Thay đổi đã triển khai

| Khu vực | Kết quả |
| --- | --- |
| Application sidebar | Grid `APP NAV LEFT | MAIN`, sidebar sticky bên trái,240px từ1280px, rail72px ở768–1279px hoặc khi collapse. Có icon/label/active/expand; không public top navbar khi đăng nhập. Main nhận thêm168px khi collapse. |
| Logo và mobile | BrandLink giữ guest→`/`, user→`/dashboard`, không reload. Mobile avatar/bottom navigation giữ nguyên; không hamburger và không navigation kép. |
| History | Ba bot mở history mặc định từ1024px, bên trái chat. Collapse/expand thu hồi220px bằng grid push và transform, không mất phiên/draft. |
| Context chatbot2 | Giữ bên phải,280px, mở mặc định từ1024px; toàn bộ fields/selection và cách tạo context giữ nguyên. Bot1/3 không có context giả. Main chat còn434px ở1024px với app rail, history và context đồng thời;1440px có850px. Dưới1024px dùng sheet; không cố ép nhiều cột. |
| Cẩm nang | Intro gọn, icon sổ tay, màu xanh/cam, CTA sớm. Một Explorer bốn tabs, số bài3/3/4/2; mỗi lúc chỉ một panel hiện. URL `?stage=N`, hash cũ, Back/Forward, ArrowLeft/Right/Home/End và deep lesson links được giữ. |
| Resources | Route `/textbooks` giữ tương thích, đổi thành Tài nguyên học tập. Bỏ local CurriculumMapSection/types/derived map state/copy handler, không còn feature map trong public nav/CTA. Giữ danh mục sách, bộ lọc lớp/môn, PDF, resource cards, safe URL và duplicate filtering. |
| Hero | Chỉ thêm `select-none` cho figure giấy minh họa. Không đổi bố cục/màu/copy, không pointer-events:none, không chặn chọn headline hoặc link. Nội dung ví dụ còn nguyên trong DOM/figure. |
| Website assistant | Một widget riêng cho hướng dẫn sử dụng, không phải ba chatbot. Launcher56px tròn xanh, window340px/max440px, radius16px. Fixed cạnh phải viewport với safe area; không đọc sidebar width. Không fake input/typing/AI response. |

Không redesign Dashboard/Profile/AI notebooks/Public capsule hoặc cơ chế đọc bài. Chỉ đổi nhãn/link tài nguyên ở Dashboard/Landing và một câu mô tả tính năng trong bài01. Integrity test đối chiếu toàn source với baseline, chỉ cho phép đúng câu đổi từ “Bản đồ chương trình…” sang “Tài nguyên học tập…”. Giữ12 bài/bốn chặng/32 prompt ví dụ/15 hoạt động/36 self-check/12 alias.

## Website assistant: hành vi và kiến trúc

Ba quick actions đều hoạt động thật:

1. “Tôi nên bắt đầu từ đâu?” → hướng dẫn bài01 và links bài01/Cẩm nang.
2. “Chọn trợ lý AI phù hợp.” → mô tả ba công cụ từ metadata hiện có và links đúng chatbot.
3. “Tìm tài nguyên học tập.” → hướng dẫn lọc lớp/môn, links Danh mục và Tài nguyên tại `/textbooks`.

`AssistantWindow` chỉ trình bày nội dung/callback; `guidance.ts` giữ static content và type `LearningAssistantAdapter` cho tương lai; `DesktopLearningAssistant` quản lý mở/đóng/focus/visibility. Chưa có implementation service, API key, request AI, schema hoặc lưu thông tin nhạy cảm. Thêm API sau này chỉ cần thay nguồn reply/controller, không phải thay layout cửa sổ.

Widget không tự mở sau navigation. Chỉ xuất hiện từ1024px và viewport cao ít nhất320px; không mobile, chat Focus Mode, admin, native modal hoặc lúc focus trong form/input bên ngoài widget. Nó không trap Tab; Escape và nút đóng trả focus launcher. Chọn hướng dẫn/back đưa vùng nội dung về đầu.

Đã thấy launcher mặc định che link “Cập nhật mục tiêu” trong ảnh đầu. Cách sửa: giữ `right: max(20px, safe area)` nhưng thử bottom20/84/148px theo va chạm với controls, không theo sidebar. Nếu cả ba vị trí đều che control thì tạm ẩn khỏi tương tác/Tab cho tới khi có chỗ. Đang mở thì giữ vị trí để không nhảy dưới con trỏ; resize thấp giới hạn lại bottom, thu header và giữ body cuộn. Đã tái hiện và sửa ca1440×900→1024×320: trước sửa body bị cắt; sau sửa window120px, body57px nằm trong khung, cuộn và bấm action cuối bằng chuột thật thành công.

## Explorer và document scroll

Stage selector có roles tablist/tab/tabpanel, aria-selected/controls, roving tab index, hidden panels; mọi controls của panel không hiện đều không tham gia Tab. Query không hợp lệ về chặng1. Hash cũ ưu tiên nếu cùng có query; chọn tab đưa về query canonical, không tạo history entry lặp khi nhấn lại tab đã chọn.

Lỗi đã tái hiện: đổi stage tạo navigation key mới làm document về0. `RouteScrollManager` nhận opt-in `preserveDocumentScroll:{x,y}` chỉ cho navigation trong cùng pathname, không phải POP; Explorer chụp tọa độ trước navigation. Route mới vẫn về đầu; POP và anchors giữ cơ chế cũ. Đã đo click chuột thật ở tab đang hiển thị giữscroll180px trong sai số1–2px. Test vị trí dùng click tọa độ để không lẫn lệnh scrollIntoView tự động của automation. Các bài kiểm tra Back/Forward/PUSH/anchor/late article/user interruption vẫn chạy.

Nhãn tab dùng màu mực để đạt contrast; số/border vẫn mang bốn accent. Đã sửa nhãn xanh lá14px ban đầu chỉ đạt4.46:1 trên nền muted; không hạ tiêu chí contrast của test.

## Kiểm thử thực tế

| Kiểm tra | Kết quả |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS; CSS54.23kB/gzip11.07kB, JS806.99kB/gzip223.47kB |
| `verify-uiux-content.mjs` | PASS: integrity ngoài đúng một câu feature rename,12/4/32/15/36/12,ba kinh nghiệm,ba công cụ,26 route declarations và alpha utilities |
| `verify-v23.mjs` | PASS8 nhóm: sidebar trái/logo/widget position; ba bot/default history/context/push/state; Explorer/keyboard/URL/scroll; resources/PDF/filter; static actions/no API; modal/editor/mobile/admin/low viewport; hero mouse selection; responsive/light-dark/screenshots |
| `verify-workspace.mjs` | PASS12 nhóm: auth loading/routing/callback/deep link/logout, sidebar/mobile, dashboard real prompts/empty, profile/modal/draft refresh và chat |
| `verify-correction.mjs` | PASS5 nhóm brand/keyboard/dock/slide/responsive; expectations cập nhật sidebar trái/default history, không bỏ assertions |
| `verify-uiux-browser.mjs` | PASS15 nhóm public/mobile/profile/chat, copy/clipboard, scroll/loading/error retry, contrast/reduced motion/signatures; kết quả cuối tại `.qa/v23.local/regression/interaction-results.json` |
| Layout coverage | 168 Public +168 Workspace +48 Correction +108 V2.3 =492 lượt route/width/theme. Widths320/390/768/1024/1280/1440, light/dark. Không overflow được phát hiện. |
| Source invariants | PASS tám hàm auth/profile và15 hàm chat, localStorage read/write effects, hai profile payloads, OAuth arguments; AuthProvider, lib/API/hooks/schema/data curriculum/PDF/dependencies/Profile/Modal/SlidingPanel/lesson detail giữ nguyên. Hero khác đúng class selection; Dashboard/Landing khác đúng nhãn tài nguyên. |
| `git diff --check` | PASS |

Bốn bộ browser đạt tổng cộng40 nhóm. Không dùng các lượt timeout hoặc lỗi trung gian để tính PASS.

Browser chạy Chromium headless trên preview QA React-only với cache riêng trong node_modules; SDK/response fixtures biệt lập. Không gọi dịch vụ thật để tạo dữ liệu người dùng. Trong ca assistant quick actions, không có lời gọi `/api/`; local PDF Ngữ văn11 kiểm tra HEAD trả200. Đây là bằng chứng frontend, không chứng minh tài khoản/dịch vụ production đang hoạt động.

Hai review độc lập đã đọc source/ảnh và kiểm tra browser riêng: A phát hiện scroll reset của Explorer; B phát hiện cửa sổ trợ lý mất body khi thu thấp viewport. Cả hai được sửa và có regression checks. Hướng dẫn frontend-design/impeccable/web-design-guidelines/React best practices được áp dụng thủ công; không cài/chạy engine thiết kế hoặc tuyên bố có detector overlay.

Một lỗi timing trong test bài chậm được điều chỉnh bằng cách chờ trang danh sách thực sự render trước Back; không thay production LessonDetail hay hạ assertion. Các lượt chưa đạt được sửa/tái kiểm tra trước khi kết luận PASS.

## Số đo và ảnh local

- Main tại1440px: x240/w1200 khi sidebar mở; x72/w1368 khi thu gọn.
- Bot1/3 tại1440px: historyx81/w220, chatx301/w1130. Bot2 chatx301/w850; context ở cạnh phải chat.
- Explorer bắt đầu ở y239.72px trên desktop authenticated; chỉ3 rows của chặng1 xuất hiện, không toàn bộ12 rows.
- Launcher Dashboard nằm x1364,y760,w56,h56 khi né action bằng bottom84; vẫn cách cạnh phải20px.

Ảnh trong `.qa/v23.local/` (không commit, dữ liệu fixture):

- Before: `before-{dashboard,guides,resources,chat1,chat2}-{1440,390}.png`.
- After: `after-{light,dark}-{dashboard,guides,stage3,resources,chat1,chat2}-{1440,390}.png`.
- Widget: `assistant-window-1440.png`; còn ảnh Public/signatures/modal/profile trong `regression/`.
- Máy đọc: `results.json`, `measurements.json`, `responsive.json`; regression contrast và interaction JSON ở `regression/`. Các bộ workspace/correction dùng đường dẫn QA local được ghi trong script tương ứng.

## File và Git safety

Các file thuộc thay đổi:

- Shell/navigation: `src/components/workspace/WorkspaceShell.tsx`, `src/components/Layout.tsx`, `src/components/MobileNavigation.tsx`.
- Chat/scroll: `src/components/ChatbotPage.tsx`, `src/components/RouteScrollManager.tsx`.
- Explorer: `src/pages/Guides.tsx`, `src/components/guides/LearningExplorer.tsx` (mới).
- Resources/copy: `src/pages/Textbooks.tsx`, `src/pages/Dashboard.tsx`, `src/pages/LandingPage.tsx`, `src/data/guideLessons.ts` (đúng một câu).
- Hero/styles: `src/components/home/LearningHero.tsx`, `src/index.css`.
- Widget (mới): `src/components/learning-assistant/DesktopLearningAssistant.tsx`, `src/components/learning-assistant/AssistantWindow.tsx`, `src/components/learning-assistant/guidance.ts`.
- QA: `scripts/verify-uiux-browser.mjs`, `scripts/verify-uiux-content.mjs`, `scripts/verify-workspace.mjs`, `scripts/verify-correction.mjs`, `scripts/verify-v23.mjs` (mới).
- Tài liệu: `DESIGN.md`, `docs/eduaihub-redesign-brief.md`, `docs/UIUX_V22_CORRECTION.md`, `docs/UIUX_V23_VERIFICATION.md`.

Giữ nguyên thay đổi có sẵn `M skills-lock.json`, `?? outputs/`. Hash skills-lock được đối chiếu với baseline. Không stage/commit AI Skills, lock, outputs hoặc QA artifacts. Không reset/clean, đổi remote, push, merge hay deploy. Preview QA chỉ phục vụ kiểm thử local và được dừng khi kết thúc.

## Chưa kiểm chứng

- OAuth/Supabase/Coze production, tài khoản admin thật, lưu/xóa dữ liệu thật hoặc response/conversation continuity live.
- Safari/WebKit/Firefox, thiết bị Android/iOS và bàn phím ảo thật, screen reader, native zoom200% hoặc GPU performance trên máy cấu hình thấp.
- Tính sẵn sàng của link tài liệu bên ngoài từ dữ liệu production. URL validation và filters được giữ; PDF local đã HEAD200.

Build còn cảnh báo Browserslist cũ và chunk>500kB; không thay dependency hoặc làm code-splitting ngoài phạm vi. Không tích hợp AI API cho trợ lý website ở V2.3.
