# Prompt engineering thực dụng cho học sinh THPT

## Prompt là gì?

Prompt là câu hỏi hoặc chỉ dẫn bạn gửi cho AI. Prompt rõ giúp AI hiểu đúng việc cần làm, bối cảnh của người học và kiểu phản hồi mong muốn. Prompt mơ hồ buộc AI phải tự đoán nên dễ cho câu trả lời chung chung, lan man hoặc không giúp bạn học thật.

## Khung prompt 5 phần

Không phải prompt nào cũng cần đủ mọi phần, nhưng đây là checklist hữu ích:

1. **Role — Vai trò:** AI nên hỗ trợ như ai? Ví dụ: gia sư kiên nhẫn, người phản biện, người tạo câu hỏi tự luyện.
2. **Task — Nhiệm vụ:** AI cần làm gì? Dùng động từ rõ như giải thích, đặt câu hỏi, góp ý, so sánh hoặc kiểm tra.
3. **Context — Bối cảnh:** Bạn học lớp nào, môn gì, chủ đề nào, đã biết gì và đang vướng ở đâu?
4. **Constraints — Ràng buộc:** Điều gì cần giới hạn? Ví dụ: không đưa đáp án cuối ngay, chỉ gợi ý một bước, dùng ngôn ngữ dễ hiểu, tối đa năm ý.
5. **Expected output — Đầu ra mong muốn:** Muốn nhận bảng, danh sách, câu hỏi Socratic, từng bước hay bài tự kiểm tra?

Context quan trọng vì cùng một câu hỏi có thể cần cách giải thích khác nhau tùy lớp, mục tiêu và trình độ. Chỉ thêm context liên quan; nhiều chi tiết không cần thiết có thể làm prompt kém tập trung.

## Mẫu ngắn

> Bạn là [vai trò]. Em đang [bối cảnh]. Hãy [nhiệm vụ]. Vui lòng [ràng buộc]. Trình bày dưới dạng [đầu ra mong muốn].

## Sửa prompt quá chung chung

Khi prompt chưa tốt, hãy tự hỏi:

- Mình muốn hiểu, luyện tập, kiểm tra hay cải thiện điều gì?
- AI có biết lớp, môn, chủ đề và mức hiểu hiện tại của mình không?
- Mình muốn gợi ý hay đáp án? Muốn AI dừng ở đâu để mình tự làm?
- Câu trả lời cần ngắn hay chi tiết, theo bước hay theo bảng?
- Mình sẽ dùng tiêu chí nào để biết câu trả lời đã phù hợp?

## Before → After

### Ví dụ 1: học một khái niệm

**Before:**

> Dạy em bài này.

**After:**

> Bạn là gia sư kiên nhẫn. Em là học sinh lớp 11 và đang chưa hiểu khái niệm trong chủ đề em vừa gửi. Trước tiên hãy hỏi em đã biết gì, sau đó giải thích bằng một ví dụ đơn giản. Đừng đưa lời giải hoàn chỉnh; hãy dừng sau mỗi bước để em tự nói bước tiếp theo.

Điểm cải thiện: có vai trò, lớp, khó khăn hiện tại, cách hướng dẫn và giới hạn đáp án.

### Ví dụ 2: kiểm tra bài làm

**Before:**

> Sửa bài cho em.

**After:**

> Hãy đóng vai người phản biện. Đọc phần làm của em, chỉ ra tối đa ba điểm hợp lý và ba điểm cần xem lại. Với mỗi điểm chưa ổn, hãy đặt một câu hỏi gợi ý để em tự sửa trước; chưa viết lại toàn bộ bài.

Điểm cải thiện: nói rõ nhiệm vụ, số lượng phản hồi, cách gợi mở và phần AI không được làm thay.

### Ví dụ 3: tự kiểm tra

**Before:**

> Cho em câu hỏi ôn tập.

**After:**

> Dựa trên phần nội dung em cung cấp, hãy tạo năm câu hỏi từ cơ bản đến vận dụng. Hỏi từng câu một và chờ em trả lời. Sau mỗi câu, giải thích ngắn vì sao câu trả lời đúng hoặc cần sửa. Không tự bổ sung kiến thức ngoài phần em đã cung cấp.

Điểm cải thiện: xác định nguồn, số câu, tiến trình tương tác, phản hồi và giới hạn kiến thức.

## Iterative prompting — cải thiện qua nhiều lượt

Không cần viết prompt hoàn hảo ngay lần đầu:

1. Gửi yêu cầu rõ nhất có thể.
2. Đọc phản hồi và xác định điểm chưa đúng mục tiêu.
3. Bổ sung một yêu cầu cụ thể, chẳng hạn “giải thích đơn giản hơn”, “hãy hỏi em trước” hoặc “chỉ dùng nội dung em đã gửi”.
4. Tự tóm tắt lại điều đã hiểu và nhờ AI kiểm tra phần tóm tắt đó.

## Cách yêu cầu giải thích thay vì lấy đáp án

Có thể thêm một hoặc nhiều câu sau:

- “Đừng đưa đáp án cuối ngay; hãy cho em một gợi ý đầu tiên.”
- “Hãy hỏi em câu tiếp theo để em tự suy luận.”
- “Giải thích lý do của từng bước và chờ em xác nhận.”
- “Kiểm tra cách làm của em, nhưng để em tự sửa.”
- “Cuối cùng hãy yêu cầu em giải thích lại bằng lời của mình.”

## Checklist trước khi gửi

- Mục tiêu có rõ không?
- Context có đủ và liên quan không?
- Nhiệm vụ dùng động từ cụ thể không?
- Ràng buộc có bảo vệ phần học sinh cần tự làm không?
- Đầu ra có dễ đọc và phù hợp mục tiêu học không?
- Prompt có yêu cầu kiểm chứng khi cần không?
