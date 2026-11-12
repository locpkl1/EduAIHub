# EduAI-Hub V2.4 — Public Landing & Learning Workspace

Ngày kiểm tra: 2026-11-10. Baseline thực tế: `feat/eduaihub-v23-learning-ux` tại `1dba92b`. Nhánh triển khai: `feat/eduaihub-v24-public-onboarding`.

## Kết quả và hợp đồng điều hướng

- `/` luôn hiển thị Landing với public shell, cho cả guest và member; không redirect sang Dashboard. Logo dùng React Router về `/` từ public/workspace/chat. `/about` cũng dùng public shell cho cả hai trạng thái.
- Public capsule chỉ có **Trang chủ / Tài nguyên / Giới thiệu**. Mobile có hai hàng: logo/CTA rồi ba mục ở trên; chữ giữ cỡ đọc được, không hamburger hoặc bottom navigation. Theme toggle ở footer dưới640px và header khi đủ chỗ.
- Guest hero/footer CTA dùng Google OAuth hiện có. Member CTA **Vào không gian học tập** mở `/dashboard`; ở header hẹp có nhãn hiển thị **Vào học**, tên truy cập vẫn đầy đủ.
- Learning workspace chỉ dành cho member: Dashboard, Guides/detail, AI tools/ba chatbot và aliases, lessons/detail, Prompt Library, Profile và prompt-creator redirect. Guest nhận màn hình đăng nhập có ngữ cảnh tại URL đang mở; trang học tập chưa mount nên không gọi dữ liệu riêng của trang đó.
- `/textbooks` cho guest xem metadata/catalogue/filters, có thông báo preview và nút đăng nhập thay cho link mở học liệu. Member mở PDF/link như trước. `grade` và `subject` có trong query; đổi lớp đặt lại môn; Back/callback và section anchors giữ bộ lọc. PDF Ngữ văn11 hiện có được kiểm tra HEAD200, dung lượng hơn30MB; không thay/xóa file.
- `/about` giới thiệu ngắn sản phẩm, đối tượng, kỹ năng, nguyên tắc và cách bắt đầu; không thêm số liệu/thành tích hoặc hiệu quả chưa xác minh.
- Auth-loading chưa biết user: hiển thị trạng thái xác minh, không flash guest/member sai. Đã biết user khi token refresh: giữ Outlet và form/chat draft. Logout từ workspace về `/` với public navigation.
- Callback OAuth giữ `/dashboard` và arguments cũ. Login từ `/` hoặc `/about` mặc định đến Dashboard. Deep link học tập hoặc tài nguyên giữ pathname/query/hash trong sessionStorage và được DashboardEntry tiêu thụ một lần; chặn external/invalid return URL như trước. Không thay SDK hoặc AuthProvider.

## Assistant onboarding

- Giữ widget độc lập fixed dưới phải, launcher56px/window340px và các quy tắc tránh controls/modals/forms của V2.3. Chỉ desktop từ1024px, không chat/admin/mobile.
- Guest vào Landing lần đầu trong phiên: auto-open lời chào cùng CTA đăng nhập và links About/Resources. Không auto-open trên mọi public route.
- `eduaihub_assistant_onboarding_v24` chỉ là cờ per-tab/session đã xem hoặc đóng; không lưu user ID hoặc dữ liệu học tập. Đóng/Escape/tương tác ngoài được tôn trọng qua đổi route và reload. Khi storage không dùng được, bộ nhớ trong trang giữ trạng thái cho lần tải trang hiện tại.
- Member mở launcher thấy lời chào học tập và links Guides/AI Tools/Prompts; vẫn có các hướng dẫn chi tiết tĩnh V2.3. Không tự popup sau đăng nhập (đây là lựa chọn được phép trong brief). Khi user thay đổi, reset phần hướng dẫn chi tiết về welcome phù hợp.
- Escape/close trả focus launcher, dialog không modal và không trap Tab. Không thêm API, input chat giả, typing hoặc AI response giả.

## File thay đổi

| Nhóm | File |
| --- | --- |
| Routing và shells | `src/App.tsx`, `src/components/Layout.tsx`, `HomeEntry.tsx`, `BrandLink.tsx`, `MobileNavigation.tsx` |
| Gate và CTA | `src/components/LearningAccessGuard.tsx` (mới), `StartLearningAction.tsx` (mới), `src/lib/loginDestination.ts` |
| Public surfaces | `src/components/home/LearningHero.tsx`, `src/pages/LandingPage.tsx`, `Textbooks.tsx`, `About.tsx` (mới), `src/index.css` |
| Assistant | `src/components/learning-assistant/DesktopLearningAssistant.tsx`, `AssistantWindow.tsx`, `guidance.ts`, `onboardingSession.ts` (mới) |
| Tài liệu | `DESIGN.md`, tài liệu này |

Hero paper geometry/copy, màu, font và blue statement giữ nguyên. Chỉ CTA/thông báo đăng nhập thay đổi. Không refactor chat, Profile hoặc backend.

## Kiểm thử đã chạy

| Kiểm tra | Kết quả thực tế |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS; JS809.00kB/gzip224.13kB, CSS54.17kB/gzip11.10kB |
| V2.4 browser flows | 9/9 nhóm PASS |
| Workspace regression | 11/11 nhóm PASS |
| V2.3 regression | 8/8 nhóm PASS |
| UI interaction regression | 13/13 nhóm PASS |
| Independent A/B | mỗi lượt5 nhóm riêng PASS; không có P1/P2 tái hiện trong phạm vi review |
| Nội dung/route compatibility | 12 bài,4 chặng,32 prompt ví dụ,15 hoạt động thử,36 tự kiểm tra,12 aliases;3 kinh nghiệm và3 công cụ giữ nguyên;26 route declarations cũ + `/about` |
| Source invariants | 8 auth/profile và15 chat functions; OAuth arguments, profile payloads, storage effects; protected files và dependencies giữ nguyên so với `1dba92b` |

Browser dùng Chromium headless local Vite, SDK fixture cách ly. Các script QA được giữ local trong `.qa/v24.local/`; không nằm trong commit. Script kiểm tra cũ được copy và điều chỉnh fixture/expected routing cho hợp đồng V2.4: private routes dùng member fixture thay guest, logo/root không tự Dashboard, nguồn bài đọc đi qua fixture SDK, chờ render commit trước khi kiểm tra aria-current/filter. Không đổi source chỉ để làm test pass.

- 336 trạng thái V2.4 = guest/member ×14 routes ×6 widths ×2 themes; mỗi trạng thái kiểm tra overflow, main/H1, shell đúng và những điều kiện navigation liên quan.
- 168 trạng thái Workspace =14 routes ×6 widths ×2 themes; bao gồm cả3 bot aliases.
- 108 trạng thái V2.3 =9 routes/stages ×6 widths ×2 themes.
- Tổng612 lượt bố cục; widths320/390/768/1024/1280/1440, light/dark. Ảnh chính chờ chuyển động kết thúc trước khi chụp.
- Functional checks gồm OAuth invocation/retry, callback mặc định/deep link/query/hash, guest/member loading, token refresh, logout, Back/Forward, scroll restore/late article/error retry, filters/anchors/PDF, welcome một lần/session/manual reopen/keyboard, ba chat History/Context/push/retained state, Explorer URL/keyboard, Prompt select/copy Enter+Space/clipboard error+native round-trip, Saved Prompt dialogs, Profile dirty/pending/error payloads, modal focus, reduced motion và text contrast trên các trang được quét.

Kết quả local: `results.json`, `responsive.json`, `regression-workspace/workspace-results.json`, `regression-v23/results.json`, `regression-v23/responsive.json`, `regression-general/interaction-results.json`, `technical-review-b-results.json` trong `.qa/v24.local/`.

## Ảnh đối chiếu (local, không commit)

- Baseline: `.qa/v24.local/before-guest-1440.png`, `before-workspace-1440.png`.
- Public320px: `.qa/v24.local/after-guest-light-home-320.png`.
- Member Landing dark1440px: `.qa/v24.local/after-member-dark-home-1440.png`.
- Dashboard1440px: `.qa/v24.local/after-member-light-dashboard-1440.png`.
- Chat2 History/Context: `.qa/v24.local/after-member-dark-chat2-1440.png`.
- Onboarding: `.qa/v24.local/after-welcome-guest-1440.png`, `after-welcome-member-1440.png`.
- Có thêm ảnh guest/member, light/dark cho About, tài nguyên, gate và mobile390px.

## Phạm vi bằng chứng và việc chưa kiểm chứng

VERIFIED: source/build/browser với SDK mock và dữ liệu cách ly như mô tả. Checklist thiết kế/frontend/accessibility áp dụng thủ công theo frontend-design, Impeccable onboard/craft floor và Web Interface Guidelines; engine Impeccable không được kích hoạt ở V2.4. Hướng dẫn hiện hành: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md . Hai lượt đánh giá độc lập không thay source/Git.

NOT VERIFIED: Google OAuth/callback trên tài khoản thật, Supabase/RLS/Storage thật, lưu dữ liệu thật, Coze thật, trình duyệt/thiết bị mobile thật, screen reader và accessibility audit đầy đủ, native browser zoom. Không phát sinh yêu cầu API AI mới từ widget trong QA. Lượt gửi tin nhắn chat là response fixture; không xác nhận Coze continuity thật.

Frontend gating chỉ hướng dẫn trải nghiệm; PDF tĩnh trong `public/resources/` vẫn có thể được mở bằng URL trực tiếp và backend policies không thay đổi. Không tuyên bố bảo mật học liệu dựa trên UI gate.

Build còn cảnh báo Browserslist cũ và chunk lớn hơn500kB; không thêm dependency hoặc đổi bundling ngoài phạm vi.

## Git safety

Ban đầu chỉ có `M skills-lock.json` và `?? outputs/`; đã giữ nguyên. Hash SHA256 của `skills-lock.json`: `21149af4a5c07b7577ad985efca2ff00c87d345c1c0d8c37afe649924f63947c`.

Chỉ stage chính xác17 file frontend và2 tài liệu nêu trên. Không stage skills, lockfile skills, outputs hoặc `.qa` artifacts. Không sửa Git ignore/exclude, không push/merge/deploy. Commit V2.4 local được báo lại bằng hash trong phản hồi hoàn tất; trạng thái còn lại dự kiến đúng hai thay đổi có sẵn ở baseline.
