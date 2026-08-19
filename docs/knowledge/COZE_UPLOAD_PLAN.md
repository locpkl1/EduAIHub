# Kế hoạch đưa Knowledge Base vào Coze

## Phạm vi và quyền truy cập

Các bước dưới đây là hướng dẫn thao tác thủ công. Repository không chứng minh có quyền chỉnh Coze Dashboard, vì vậy package này chưa được upload hoặc cấu hình tự động trong Coze.

Trước khi upload, kiểm tra loại Knowledge/database mà workspace Coze hiện tại hỗ trợ. Markdown là định dạng nguồn của package này; nếu Coze yêu cầu định dạng khác, hãy xác nhận yêu cầu trong Dashboard rồi chuyển đổi có kiểm soát, không đổi nội dung theo phỏng đoán.

## File nên gắn với từng bot

| Bot | File chính | File theo điều kiện |
|---|---|---|
| Prompt Thinking (`prompt-thinking`) | `01-eduai-hub.md`, `02-prompt-engineering.md`, `03-responsible-ai-learning.md`, `KNOWLEDGE-USAGE.md` | `04-curriculum-context.md` chỉ khi bot cần xử lý study context |
| Study Prompt (`study-prompt`) | `01-eduai-hub.md`, `02-prompt-engineering.md`, `03-responsible-ai-learning.md`, `04-curriculum-context.md`, `KNOWLEDGE-USAGE.md` | Không có |
| Prompt Evaluator (`prompt-evaluator`) | `02-prompt-engineering.md`, `03-responsible-ai-learning.md`, `KNOWLEDGE-USAGE.md` | `01-eduai-hub.md` để giữ triết lý; `04-curriculum-context.md` chỉ khi cần đánh giá prompt có context Toán 11 |

Không cần upload chính file `COZE_UPLOAD_PLAN.md` làm Knowledge cho bot; đây là tài liệu vận hành.

## Vì sao không nên mặc định upload mọi file vào cả ba bot?

- Retrieval có thể lấy đoạn ít liên quan và làm phản hồi lệch vai trò bot.
- Curriculum context có thể xuất hiện trong câu hỏi thuần prompt engineering dù không cần thiết.
- Nhiều tài liệu tương tự làm giảm độ tập trung của đoạn được truy xuất.
- Khó xác định file nào gây phản hồi sai khi kiểm thử.
- Mỗi lần cập nhật phải đồng bộ nhiều nơi, tăng nguy cơ lệch phiên bản.
- Context truy xuất không cần thiết có thể làm phản hồi dài và kém trực tiếp hơn.

## Instruction ngắn cần thêm trong Coze

### Prompt Thinking

```text
Ưu tiên Knowledge về EduAI-Hub, prompt engineering và học với AI có trách nhiệm. Dạy bằng câu hỏi gợi mở, ví dụ ngắn và yêu cầu học sinh tự giải thích; không mặc định đưa đáp án ngay. Chỉ dùng curriculum khi user hoặc custom variables cung cấp study context. Không bịa kiến thức môn học.
```

### Study Prompt

```text
Dùng custom variables của phiên hiện tại làm nguồn context chính, rồi dùng Knowledge để tạo hoặc góp ý prompt học tập. Topic có thể để trống; không tự đoán. Với Toán 11, knowledge_area là nhóm UX, không phải tên chương SGK chính thức. Không bịa bài học, trang hoặc kiến thức môn học chưa có nguồn; ưu tiên prompt giúp học sinh tự suy nghĩ và kiểm chứng.
```

### Prompt Evaluator

```text
Đánh giá prompt theo mức rõ của role, task, context, constraints và expected output. Nêu điểm mạnh, điểm cần sửa, bản viết lại và lý do. Dùng nguyên tắc học có trách nhiệm để phát hiện yêu cầu làm thay. Không coi Knowledge là bằng chứng về độ đúng của kiến thức môn học và không bịa nội dung.
```

## Trình tự upload thủ công

1. Xác nhận đúng ba bot và môi trường demo trong Coze Dashboard.
2. Tạo hoặc chọn Knowledge/database riêng phù hợp với từng bot.
3. Upload các file theo bảng mapping; giữ nguyên tên file để dễ truy vết phiên bản.
4. Gắn Knowledge đúng bot và kiểm tra trạng thái xử lý/index hoàn tất.
5. Thêm instruction ngắn tương ứng vào phần prompt/instruction của bot mà không xóa quy tắc runtime hiện có.
6. Xác nhận bot vẫn nhận custom variables hiện tại, đặc biệt `grade`, `subject`, `knowledge_area`, `topic`, `textbook_series`; giữ `chapter` và `lesson` nếu cấu hình cũ còn dùng.
7. Chạy bộ kiểm thử retrieval bên dưới trong Dashboard hoặc qua ứng dụng.
8. Ghi lại ngày upload, bot, file và phiên bản để lần cập nhật sau có thể đối chiếu.

## Kiểm thử retrieval

### Prompt Thinking

1. Hỏi: “Prompt tốt cần những phần nào?”
   - Mong đợi: role, task, context, constraints, expected output; giải thích ngắn, không thêm curriculum vô cớ.
2. Hỏi: “Làm sao hỏi AI để em vẫn tự suy nghĩ?”
   - Mong đợi: gợi ý từng bước, không đáp án ngay, tự giải thích và kiểm chứng.
3. Hỏi: “Tên chương chính thức Toán 11 là gì?” khi không có nguồn SGK.
   - Mong đợi: không bịa; nói Knowledge không chứa danh sách chương chính thức.

### Study Prompt

1. Truyền `grade=11`, `subject=Toán học`, `knowledge_area=Giải tích`, `topic=Đạo hàm`, `textbook_series=Kết nối tri thức với cuộc sống`; yêu cầu tạo prompt học chủ động.
   - Mong đợi: dùng đúng toàn bộ context, không đổi mảng/chủ đề thành tên chương/bài chính thức.
2. Truyền cùng context nhưng để `topic` rỗng.
   - Mong đợi: vẫn tạo được prompt ở mức Giải tích hoặc hỏi muốn tập trung phần nào; không tự chọn chủ đề.
3. Đổi `knowledge_area=Hình học không gian` và để `topic` rỗng.
   - Mong đợi: không nhắc lại Đạo hàm; phản hồi bám context mới.

### Prompt Evaluator

1. Hỏi: “Đánh giá prompt: Dạy em bài này.”
   - Mong đợi: phát hiện thiếu task cụ thể, context, constraints và output; đưa bản sửa kèm lý do.
2. Đưa prompt yêu cầu AI làm toàn bộ bài để nộp.
   - Mong đợi: nhận diện rủi ro làm thay và chuyển thành prompt gợi ý/phản hồi học chủ động.
3. Đưa prompt có tên bài hoặc số trang không tồn tại trong Knowledge.
   - Mong đợi: đánh giá cấu trúc prompt nhưng không xác nhận dữ liệu môn học là đúng.

## Dấu hiệu retrieval chưa hoạt động đúng

- Bot không dùng đúng thuật ngữ của package dù câu hỏi trùng trực tiếp nội dung.
- Study Prompt bỏ qua custom variables hoặc tự điền topic.
- Bot gọi mảng kiến thức là chương SGK chính thức.
- Bot viện dẫn bài, trang hoặc nội dung chi tiết không có trong Knowledge.
- Ba bot trả lời gần như cùng một vai trò dù instruction và mapping khác nhau.

Nếu gặp các dấu hiệu này, kiểm tra lần lượt trạng thái index, Knowledge đã gắn đúng bot, phạm vi retrieval, instruction và custom variables trước khi thay đổi nội dung package.
