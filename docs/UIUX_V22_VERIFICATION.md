# EduAI-Hub V2.2 — triển khai và kiểm chứng

Ghi nhận baseline `9a6c436`. Các quyết định về Public hero/navbar và chat panels đã được cập nhật trong [correction pass](UIUX_V22_CORRECTION.md); nội dung dưới đây lưu lại trạng thái kiểm chứng ban đầu.

Ngày kiểm chứng: 10/11/2026. Baseline V2.1 thực tế: `55a4dd4`. Nhánh: `feat/eduaihub-v22-learning-workspace`.

## Trạng thái và phạm vi

Đây là thay đổi frontend của workspace; Public V2.1 được giữ lại. Không sửa backend, schema, migrations, quyền truy cập, Coze contract hoặc cơ chế OAuth. Không thêm dependency, tiến độ học, KPI, lịch học hay dữ liệu người học giả vào sản phẩm. Không push, merge hoặc deploy.

Trước khi làm, working tree có `skills-lock.json` bị sửa và `outputs/` chưa được theo dõi. Hai đường dẫn được giữ nguyên, không stage/commit. QA local nằm trong `.qa/v22.local/`, cũng không thuộc commit. Commit V2.2 chỉ chứa file source, kiểm thử và tài liệu được liệt kê bên dưới.

## Kiến trúc và hành vi thực tế

| Khu vực | Hành vi V2.2 |
| --- | --- |
| Public | Khách mở `/` thấy landing V2.1. Giữ capsule desktop, layered paper hero và ba notebooks. Mobile có đăng nhập, bottom nav, không hamburger. |
| Root | `HomeEntry` chờ auth resolution trước khi chọn Landing/Dashboard. Authenticated root dùng `Navigate replace`, không thêm vòng Back. |
| Login | Giữ nguyên `signInWithOAuth({ provider: 'google', options: { redirectTo: origin + '/dashboard' } })`. Lưu path/query/hash trong sessionStorage theo tab trước login; `DashboardEntry` tiêu thụ đích một lần sau session resolution. Chỉ chấp nhận same-origin path, loại root/dashboard và các alias dấu slash/case/encoding. Nếu storage bị chặn, callback dashboard vẫn là mặc định. |
| Logout | Gọi `signOut` có sẵn rồi quay về `/` bằng replace; lỗi có thông báo để thử lại. |
| Desktop | Không PublicHeader khi đã đăng nhập. Right sidebar 240px từ 1280px, 72px từ 768px hoặc collapse. Chia Học tập / Tài nguyên / Cá nhân; NavLink active, accessible names và native title cho rail. |
| Mobile | Header logo/avatar mở account dialog; Profile, theme, logout ở đây. Bottom nav năm đích, tab đầu Dashboard cho user, Landing cho khách. Giữ safe area và tài nguyên. Không có navigation kép. |
| Dashboard | Greeting từ displayName, grade hợp lệ; bài 01 là CTA chính. Ba công cụ lấy metadata dùng chung. Prompt gần đây lấy hook `useSavedPrompts`, giới hạn ba; giữ empty/error/retry và edit/delete/copy hiện có. |
| Cá nhân hóa | Quy tắc trên `common_problems`, `learning_goals`, `preferred_learning_style`, hiển thị lý do. Ưu tiên vấn đề → mục tiêu → cách học; loại trùng, tối đa hai. Không có dữ liệu phù hợp thì gợi ý bài 01. Grade hiện ở lời chào, không suy diễn năng lực theo lớp. Không gọi AI API hoặc ghi lịch sử học mới. |
| Hồ sơ | Không còn auto modal toàn ứng dụng. Banner/link tại dashboard và nút mở ba bước tại Profile. Giữ payload cũ, draft qua token refresh và lỗi đọc hồ sơ; khóa mở modal khi form chính đang lưu. |
| Chat | Full available viewport, header gọn, empty state/rows gọn, composer 44px và textarea tự tăng tối đa 160px. Không navbar/footer/bottom bar; desktop authenticated chỉ còn rail 72px. History mặc định đóng, mở drawer trái có focus trap/Escape; context mở dialog riêng. Khách có nút login ngay trong chat. |
| Guides | Intro xanh và bốn accent từ semantic tokens. Không đổi learning rows hoặc nội dung 12 bài / bốn chặng. |
| Admin | Routes, layout và quyền admin không sửa. Browser QA có guest route và keyboard fixture, chưa kiểm chứng đăng nhập admin thật. |

Session loading khi **đã có user** không được tháo toàn bộ Outlet: token refresh phải giữ chat và draft hồ sơ. Root/callback vẫn chờ auth trước khi redirect. RouteScrollManager không sửa; nó tiếp tục quản lý document, còn chat cuộn trong pane riêng.

## File thuộc thay đổi

- Routing/shell: `src/App.tsx`, `src/components/HomeEntry.tsx`, `src/components/DashboardEntry.tsx`, `src/components/Layout.tsx`, `src/components/workspace/WorkspaceShell.tsx`, `src/components/MobileNavigation.tsx`, `src/lib/loginDestination.ts`.
- Dashboard/Guides/styles: `src/pages/Dashboard.tsx`, `src/lib/learningRecommendations.ts`, `src/pages/Guides.tsx`, `src/index.css`.
- Chat/dialog: `src/components/ChatbotPage.tsx`, `src/pages/chatbots/StudyPromptChatbot.tsx`, `src/components/Modal.tsx`.
- Profile/auth presentation: `src/contexts/AuthProvider.tsx`, `src/pages/Profile.tsx`, `src/components/ProfileCompletionModal.tsx`.
- Kiểm thử: `scripts/verify-uiux-browser.mjs`, `scripts/verify-workspace.mjs`.
- Tài liệu: `DESIGN.md`, `docs/eduaihub-redesign-brief.md`, tài liệu này.

`AuthProvider` chỉ thêm nhớ/xóa đích frontend ở thao tác login và bỏ global mount completion modal. Các hàm fetch/create/normalize profile, signOut, dismiss TTL, updateProfile và OAuth SDK arguments được đối chiếu với baseline, giữ nguyên. Profile chỉ thêm lifecycle/draft guards và opt-in modal; không thay payload.

## Workflow thiết kế thực sự sử dụng

Đã đọc hướng dẫn local `frontend-design`, `impeccable` và `web-design-guidelines`, cùng React best practices. Áp dụng thủ công các workflow critique, distill, typeset, adapt, colorize, polish và craft-floor/operate: đọc baseline → giữ signature Public → xác định hierarchy học tập → triển khai shell/dashboard/chat gọn → xem ảnh và kiểm thử tương tác → sửa edge cases.

Hai lượt review độc lập chỉ đọc: A đối chiếu 12 ảnh trước/sau; B kiểm tra source và lifecycle. A không thấy lỗi visual cần chặn trong ảnh đã xem. B tìm ra các lỗi dashboard alias, mất draft khi refresh, sheet tại cùng route và mở modal trong lúc save; đã sửa, thêm regression cases. Đây là review thủ công và browser QA, **không phải** kết quả chạy engine/detector Impeccable; không cài engine.

## Kết quả kiểm thử

| Kiểm tra | Kết quả và giới hạn bằng chứng |
| --- | --- |
| `npm run typecheck` | PASS. |
| `npm run lint` | PASS. |
| `npm run build` | PASS. Có cảnh báo Browserslist cũ và bundle JS >500kB; không sửa dependency/chunking ngoài phạm vi. |
| `node scripts/verify-uiux-content.mjs` | PASS: 12 bài, bốn chặng, 32 prompt ví dụ, 15 hoạt động, 36 self-check, 12 aliases, ba kinh nghiệm, ba công cụ, 26 route declarations; academic source giữ nguyên. Alpha utilities vẫn sinh đúng. |
| `scripts/verify-uiux-browser.mjs` | PASS 15 nhóm: responsive Public, document scroll/Back/Forward/anchors, prompt keyboard/copy/mobile return, shell, saved-prompt dialogs, profile/admin focus, chat mock send/history/persistence, slow article/error retry, computed contrast, reduced motion/reflow, native Chromium clipboard, bottom nav, Profile payload, onboarding, signatures. |
| `scripts/verify-workspace.mjs` | PASS 12 nhóm: auth pending/root, callback/deep link/back, 240/72 sidebar/logout, mobile account/nav, dashboard dữ liệu/empty, opt-in profile, focus chat/context/history/refresh, responsive themes, invalid return destinations/guest chat login, modal refresh/same-route sheet, dirty draft/read error, pending save/modal hydration. |
| Responsive | 168 Public + 168 Workspace = 336 route/viewport/theme states. Widths 320/390/768/1024/1280/1440, light/dark; không document overflow được phát hiện. Workspace kiểm tra thêm composer ở viewport thấp 600px. |
| Source invariants local | PASS: AST của tám hàm auth/profile và 15 hàm chat giữ nguyên; hai profile payloads và OAuth arguments giữ nguyên. Không diff hooks/data/types/API/Supabase/Coze, Landing/AiTools/RouteScrollManager/dependency files. CSS V2.1 giữ nguyên prefix. Chín input cases của recommendation đều dẫn tới route/slug tồn tại. Script local `.qa/v22.local/protected-source.mjs`, không commit. |
| `git diff --check` | PASS. |

Browser chạy Chromium headless local trên Vite. Bộ workspace dùng **Supabase SDK fixture trong bộ nhớ**, không đăng nhập tài khoản thật hoặc ghi database. Bộ hồi quy dùng response/callback fixtures cho thao tác lưu/xóa/chat; clipboard thực sự được round-trip trên Chromium. Kết quả không chứng minh dịch vụ OAuth, Supabase hoặc Coze đang hoạt động live.

Bộ hồi quy cũ được sửa để chờ trạng thái xác minh session kết thúc trước khi kiểm tra focus/navigation. Không bỏ assertion để làm test xanh. Các test header/history cũ được cập nhật theo kiến trúc workspace/dialog đã yêu cầu.

### Chạy lại browser QA

Vite local cần chạy trước bằng `npm run dev`. Dùng Playwright và Chromium có sẵn trên máy, không thêm vào package/dependency dự án:

```powershell
$env:EDUAIHUB_PLAYWRIGHT_MODULE = '<absolute path to playwright/index.mjs>'
$env:EDUAIHUB_BROWSER_PATH = '<absolute path to Chromium executable>'
$env:EDUAIHUB_QA_OUTPUT = '.qa/v22.local'
node scripts/verify-uiux-browser.mjs
node scripts/verify-workspace.mjs
```

### Ảnh và bằng chứng local

Tất cả ảnh chứa tài khoản/prompt **fixture** để kiểm thử, không phải dữ liệu thật. Ảnh full-page có thanh navigation ghim ở đáy viewport đầu; vị trí giữa ảnh dài không tự chứng minh overlap khi cuộn.

- Trước: `.qa/v22.local/before-dashboard-{390,1440}.png`, `before-chat-{390,1440}.png`.
- Sau: `.qa/v22.local/after-{light,dark}-{dashboard,guides,chat}-{390,1440}.png`.
- Public/signatures và Profile: `.qa/v22.local/final-*.png`, `after-{light,dark}-{home,tools}-*.png`, `after-profile-*.png`.
- Kết quả máy đọc: `.qa/v22.local/workspace-results.json`, `interaction-results.json`, `responsive.json`, `contrast.json`.

## Những phần chưa kiểm chứng

- Google OAuth round trip thật, session refresh qua mạng thật, đăng xuất tài khoản thật, admin authorization thật.
- Supabase read/write thật, lỗi mạng thật khi lưu prompt/profile, Coze response/conversation continuity live.
- Bàn phím vật lý/ảo Android hoặc iOS, Safari/iOS visual viewport offset, notch/safe-area trên thiết bị thật. Viewport thấp trong Chromium là bằng chứng layout thay thế, không phải test bàn phím native.
- Screen reader thật, zoom browser native 200%, Firefox/WebKit. Đã kiểm tra keyboard, semantics/focus, reduced motion và CSS reflow 720px.
- Native `title` trên icon rail được giữ cùng accessible names; chưa kiểm chứng tooltip với mọi browser/assistive technology.

Trước khi phát hành, cần kiểm thử thủ công các mục trên trong môi trường thích hợp. Chưa push, merge hoặc deploy V2.2.
