# EduAI-Hub — Design System V2

Phong cách V2.1: **Editorial Learning Experience — Modern Notebook Edition**. Ba giá trị: Distinctive — Readable — Functional. Thiết kế phục vụ học sinh THPT theo nhịp **Hiểu → Thử → Sửa → Áp dụng**. Giữ nội dung học thuật và bản sắc kem–xanh; dùng phân cấp chữ, đường phân cách và khoảng cách để tổ chức bài đọc.

## Signature được bảo vệ

Floating Capsule Navigation (desktop), Layered Paper Hero và Three AI Notebooks dùng ngôn ngữ giấy/sổ tay, layering có chủ đích và logo xanh–cam. Đây là ngoại lệ biểu cảm của hệ thống; không thay bằng generic cards hoặc flat navigation để tối giản. Quy tắc chi tiết tại [redesign brief](docs/eduaihub-redesign-brief.md). Các vùng đọc và controls còn lại giữ chuẩn V2.

## V2.4 — Public và Learning Workspace (hiện hành)

- **Public:** `/` luôn là Landing cho cả guest và member; `/about` dùng cùng public shell. Logo luôn về `/` qua SPA. Capsule navbar chỉ có Trang chủ, Tài nguyên (`/textbooks`), Giới thiệu (`/about`). Từ1024px hiển thị navigation đầy đủ; dưới1024px dùng hàng logo/CTA và compact hamburger mở ba mục, không bottom bar. Menu hỗ trợ Escape, trả focus và đóng khi điều hướng. CTA guest dùng OAuth hiện có; member về `/dashboard`. Giữ layered-paper hero và three AI notebooks. Cụm giấy hero có `user-select: none`, còn headline, links và nội dung trang vẫn chọn/đọc được. Không dùng pointer-events để khóa nội dung.
- **Workspace:** chỉ dành cho member. Guest mở deep link nhận hướng dẫn đăng nhập tại URL đó, giữ query/hash để callback Dashboard trả về một lần. Root/About không làm return destination; auth-loading chưa biết user hiển thị loading, đã biết user giữ nguyên Outlet và draft. Không đổi OAuth SDK arguments hoặc backend authorization. Sidebar **bên trái**, một cột grid thật: 240px từ1280px, rail72px ở768–1279px hoặc collapse. Main mở rộng168px khi thu gọn. Trang thường mở đầy đủ mặc định; chat mặc định rail và có nút expand ở desktop rộng. Sidebar không capsule/floating top navbar. Dưới768px giữ mobile avatar/bottom navigation; không hamburger hoặc navigation kép.
- **Dashboard:** giữ greeting, bài01, ba công cụ gọn, tối đa ba prompt thật và gợi ý minh bạch từ hồ sơ. Chỉ đổi link tài nguyên, không thêm KPI/progress/streak hoặc thay cơ chế lưu.
- **Chat:** từ1024px dùng `APP NAV LEFT | HISTORY | CHAT | CONTEXT RIGHT (nếu có)`. History220px mở mặc định cho cả ba bot; context280px của bot2 mở mặc định. Collapse thay đổi cột thật và trượt panel; cùng DOM/state giữ draft, choices và conversation. Không có context rỗng ở bot1/3. Dưới1024px history/context là native sheet, context trượt từ phải. Không bottom navigation trong chat. Chat rộng tối thiểu434px ở viewport1024px với cả hai panel, sidebar rail.
- **Guides Explorer:** intro gọn, CTA bài01; bốn tabs với phân bổ3/3/4/2 bài. Chỉ một panel hiển thị. URL `?stage=1..4` và hash cũ `#guide-stage-N` được hỗ trợ; hash cũ ưu tiên nếu cùng có query. ArrowLeft/Right/Home/End, roving tab index, aria-selected/controls và hidden panels hợp lệ. Label chữ mực; số và border mang màu từng chặng. Chọn chặng giữ vị trí đọc bằng opt-in scroll coordinates trước navigation; POP, bài mới và anchors giữ hành vi cũ.
- **Resources:** `/textbooks` là **Tài nguyên học tập**, gồm Danh mục học tập và nguồn học liệu. Guest xem metadata và dùng bộ lọc, đăng nhập để mở học liệu từ UI; member dùng đầy đủ. `?grade=&subject=` giữ bộ lọc qua Back/callback; anchor giữ query. Đây là UX gating, không thay quyền truy cập các PDF tĩnh hoặc RLS. Giữ lớp/môn, PDF thật, published resources, safe-URL và duplicate filtering. Bỏ UI bản đồ và lời giới thiệu tính năng đó; giữ curriculum data phục vụ ngữ cảnh chatbot và admin.
- **Trợ lý hướng dẫn website:** component độc lập, **fixed góc dưới phải viewport**, không nằm trong hoặc đọc chiều rộng sidebar. Launcher tròn56px, window340px, radius16px là ngoại lệ có chủ đích. Hướng dẫn tĩnh có sẵn; ba quick actions hoạt động thật. Không input giả, typing giả hay API mới. Presentation, content và future adapter contract tách riêng.
- **Widget visibility:** desktop từ1024px, viewport cao ít nhất320px; không mobile/chat/admin. Native modal hoặc focus trong form làm widget ẩn/thu gọn. Guest được chào tự động ở lần đầu vào Landing trong phiên; sessionStorage ghi đã xem/đã đóng. Đóng/Escape/tương tác ngoài không làm bật lại mỗi route. Member nhận welcome/links học tập khi mở launcher; không auto-popup sau đăng nhập. Không thêm API hoặc phản hồi AI động. Non-modal, không trap Tab, Escape/close trả focus launcher. Right20px + safe area; bottom20/84/148px được chọn để né các action bên dưới, không dựa sidebar. Nếu mọi vị trí đều chồng control, tạm ẩn khỏi tương tác/Tab. Khi cửa sổ đang mở và viewport thấp, clamp bottom và thu header để body vẫn cuộn được.
- **Hồ sơ:** giữ nguyên V2.1/V2.2 opt-in modal, ba nhóm chỉnh sửa, payload và draft guards.

Chi tiết luồng Public/Workspace và QA tại [V2.4 verification](docs/UIUX_V24_VERIFICATION.md). Bằng chứng baseline V2.3 tại [V2.3 verification](docs/UIUX_V23_VERIFICATION.md). V2.3 thay thế các chỉ dẫn sidebar phải của V2.2 và vị trí widget trái trong brief cũ. Lịch sử correction được lưu tại [V2.2 correction](docs/UIUX_V22_CORRECTION.md).

## Màu và trạng thái

| Vai trò | Light | Dark |
| --- | --- | --- |
| Background | `#F8F3E7` | `#141820` |
| Surface | `#FFFAF0` | `#1D222B` |
| Text | `#171512` | `#F5EFE4` |
| Secondary text | `#625B4F` | `#C4B9A8` |
| Subtle text | `#706657` | `#B0A694` |
| Primary brand | `#0957FF` | `#7AA7FF` |
| Primary text on tinted surface | `#0646D2` | `#9ABAFF` |
| Interactive border | `#8B7A62` | `#8793A6` |

Các biến gốc nằm trong `src/index.css`, ánh xạ Tailwind trong `tailwind.config.js`.

- Dùng `--foreground-on-primary`, `--foreground-on-accent`, `--foreground-on-success` cho chữ trên nền màu đặc. Dark mode dùng foreground tối, không mặc định chữ trắng.
- `--focus-ring`: outline 2px, offset 3px. Không dùng glow thay focus.
- `--text-subtle`, `--surface-muted`, `--surface-interactive` dùng cho trạng thái thứ cấp; placeholder nhận màu subtle.
- `--color-primary-text` dùng cho chữ trên primary-light. Màu thương hiệu vẫn giữ ở nền nút và điểm nhấn lớn.
- Utilities `/opacity` sinh qua `color-mix`; không ghép alpha hex với CSS variable.
- Giữ border thường nhẹ; input và control cần đường viền rõ dùng interactive border.
- Màu lỗi dùng accent hoặc cặp đỏ nền sáng hiện có, tránh đỏ tối trên surface tối.

## Hình khối và khoảng cách

| Thành phần | Radius | Quy tắc |
| --- | --- | --- |
| Card / prompt example | 6px | Chỉ khi cần nhóm một đối tượng; không shadow mặc định |
| Button | 4px | `btn-primary`, `btn-outline`, `btn-ghost`, `btn-accent` |
| Input / textarea / select | 6px | 16px, tên và label rõ |
| Navigation / menu / dialog | 8px | Active state rõ; Escape và return focus |
| Tag | 4px | Metadata ngắn, không giả làm CTA |
| Chat bubble | 12px | Ngoại lệ có chủ đích |
| Avatar / status dot | Tròn | Giữ ý nghĩa nhận diện / trạng thái |

Spacing: **4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px**. Mục cùng nhóm gần nhau; phần mới có khoảng cách lớn hơn. Không ép chiều cao card để cân lưới. Shadow mềm chỉ dành cho menu nổi và dialog.

## Typography

- **Aleo** cho tiêu đề, trọng lượng tới 700; **Be Vietnam Pro** cho nội dung/controls; **JetBrains Mono** cho code và số thứ tự cần tra cứu.
- H1 32–48px, H2 24–32px (bài đọc 24–26px), H3 20–24px. Không dùng font 800/900 khi font tải tới 700.
- Nội dung đọc và prompt ngôn ngữ tự nhiên: 16px, line-height 1.75–1.8, tối đa 72ch. Metadata 12–14px.
- Không dùng nhãn trang trí phía trên heading. Số chặng/bài chỉ xuất hiện khi thể hiện trình tự học.
- Prompt không dùng monospace chỉ vì có yếu tố AI. Code thực sự vẫn dùng mono và có cuộn ngang trong vùng riêng.

## Layout và responsive

- `page-container`: tối đa 1280px, padding 16 / 24 / 32px.
- Trang chủ: giá trị → ví dụ thực tế → lộ trình → lựa chọn công cụ → bài kinh nghiệm/tài nguyên → bắt đầu học.
- Cẩm nang: intro gọn, CTA bài01, bốn stage tabs; chỉ hiện các learning rows của chặng đang chọn. Không có `min-h-[25rem]`.
- Bài cẩm nang: một main, breadcrumb, mục tiêu, mục lục, bài đọc, ví dụ/thực hành, ý chính, tự kiểm tra, bài trước/sau. Desktop mục lục sticky; mobile dùng details có thể thu gọn.
- Kho Prompt: tham khảo mặc định; danh sách và một panel chi tiết trên desktop; danh sách → chi tiết → quay lại trên mobile. Một nút copy nội dung trong panel.
- Header Public chuyển sang navigation đầy đủ ở **1024px**; viewport nhỏ hơn dùng menu thu gọn theo bản sửa `fa35dd8`.
- Không dùng `overflow-x-hidden` để che lỗi trang. Bảng/code có vùng cuộn riêng. Controls chính tối thiểu 44px.
- Ngắt dòng cho nội dung dài; không lấy tuyệt đối positioning để dàn nội dung học tập.

## Hành vi dùng chung

- RouteScrollManager chỉ điều khiển document: PUSH về đầu (stage-only opt-in giữ tọa độ đọc), POP khôi phục theo entry trong phiên, hash có offset, chờ nội dung tới trễ và hủy khôi phục khi người dùng cuộn/nhấn phím.
- Chat tự cuộn trong pane; nếu đang đọc phía trên thì giữ vị trí và cho nút xem phản hồi mới. Không đổi schema, key localStorage, conversation ID hoặc lời gọi Coze.
- CopyButton có trạng thái thành công/thất bại, thông báo cho công nghệ hỗ trợ và fallback cho browser thiếu async clipboard.
- Modal dùng native dialog, tên truy cập được, nền inert, vòng Tab, Escape và trả focus về control còn tồn tại. Consumer quyết định có cho đóng khi đang lưu hay không.
- Loading / empty / error / not-found phải phân biệt. Lỗi đọc có cách thử lại; không suy diễn rằng dữ liệu đã mất.
- Reduced motion tắt các chuyển động không cần thiết. Không thêm hiệu ứng chỉ để trang trí.

## Ranh giới nội dung và dữ liệu

12 bài / 4 chặng / 32 prompt ví dụ / 15 hoạt động / 36 self-check / 12 alias được bảo toàn. Metadata lộ trình lấy trực tiếp từ `guideLessons.ts`; ba công cụ dùng `learningTools.ts`.

Giới thiệu rút gọn, CTA và thuật ngữ thống nhất. Chỉ làm rõ một câu kiểm chứng trong bài kinh nghiệm: AI tự xác nhận không thay nguồn độc lập. Không thay prompt học thuật mẫu, nguồn tài liệu, backend, auth hoặc cơ chế lưu.

V2.1 mobile dưới 768px có bottom navigation năm đích và menu tài nguyên native dialog. Chatbot ẩn bottom bar; trang thường chừa chỗ cho safe area. Profile dùng ba nhóm chỉnh sửa; completion modal ba bước với một vùng scroll, footer trong flex flow và chiều cao theo visual viewport.

V2.3 chỉ cập nhật một câu mô tả tính năng trong bài01 từ bản đồ sang Tài nguyên học tập. Integrity check cho phép đúng câu này; prompts, activities, self-checks và mọi phần học thuật khác giữ nguyên.
