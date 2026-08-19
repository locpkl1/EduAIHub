# Curriculum context của EduAI-Hub

## Phạm vi hiện tại

Bộ sách dùng trong luồng demo là **Kết nối tri thức với cuộc sống**.

Curriculum UX của EduAI-Hub tổ chức lựa chọn theo luồng:

**Lớp → Môn học → Mảng kiến thức → Chủ đề cụ thể**

Chủ đề cụ thể có thể để trống. Khi đó chatbot dùng mảng kiến thức làm phạm vi chính và không được tự đoán một chủ đề thay cho học sinh.

> Các mảng kiến thức là cách EduAI-Hub tổ chức nội dung để đơn giản hóa trải nghiệm lựa chọn cho học sinh; không được coi chúng là tên chương chính thức của SGK.

## Toán 11 — dữ liệu demo đã kiểm soát

Phần dưới đây phản ánh đúng dữ liệu UX hiện có trong `src/data/curriculumData.ts`: 5 mảng kiến thức và 17 chủ đề.

### 1. Đại số & Hàm số

- Hàm số lượng giác và phương trình lượng giác
- Dãy số, cấp số cộng và cấp số nhân
- Hàm số mũ và logarit

### 2. Giải tích

- Giới hạn dãy số
- Giới hạn hàm số
- Hàm số liên tục
- Đạo hàm

### 3. Hình học không gian

- Quan hệ song song
- Quan hệ vuông góc
- Góc và khoảng cách
- Thể tích

### 4. Thống kê

- Mẫu số liệu ghép nhóm
- Các số đặc trưng của mẫu số liệu

### 5. Xác suất

- Biến cố
- Quy tắc cộng xác suất
- Quy tắc nhân xác suất
- Biến cố độc lập

## Context chatbot nhận được

Với luồng Toán 11, các biến chính là:

- `grade`: `11`
- `subject`: `Toán học`
- `knowledge_area`: tên mảng đã chọn
- `topic`: tên chủ đề đã chọn, có thể rỗng
- `textbook_series`: `Kết nối tri thức với cuộc sống`

Để tương thích với cấu hình bot cũ, ứng dụng hiện có thể đồng thời ánh xạ:

- `chapter` = `knowledge_area`
- `lesson` = `topic`

Việc ánh xạ tương thích này không biến mảng kiến thức thành chương chính thức hoặc chủ đề thành tên bài học chính thức của SGK.

Ví dụ context hợp lệ:

```text
grade = 11
subject = Toán học
knowledge_area = Giải tích
topic = Đạo hàm
textbook_series = Kết nối tri thức với cuộc sống
```

## Quy tắc sử dụng context

- Dùng tên đúng như context được truyền; không tự sửa thành tên chương hoặc bài khác.
- Nếu `topic` rỗng, chỉ hỗ trợ ở mức mảng kiến thức hoặc hỏi học sinh muốn tập trung phần nào.
- Kết hợp context với nhu cầu học tập và trình độ hiện tại nếu các biến đó có mặt.
- Curriculum context giúp tạo prompt sát nhu cầu; nó không cung cấp kiến thức chi tiết để giải bài.
- Khi cần nội dung môn học chính xác, yêu cầu học sinh cung cấp đề bài, đoạn SGK hoặc tài liệu đang dùng, rồi nhắc kiểm chứng.

## Giới hạn dữ liệu

Package này không chứa và không được dùng để suy diễn:

- tên chương SGK chính thức;
- chapter ID hoặc lesson ID;
- danh sách bài học SGK;
- nội dung bài học chi tiết;
- số trang hoặc thứ tự trang;
- mapping nội bộ tới chương/bài nếu mapping đó chưa được xác minh.
