import { ClipboardCheck, Lightbulb, NotebookPen } from 'lucide-react';

/** Shared labels and destinations for the three existing assistants. */
export const learningTools = [
  {
    href: '/ai-tools/hoc-tu-duy-prompt', title: 'Học tư duy prompt', icon: Lightbulb,
    situation: 'Bạn chưa biết bắt đầu hỏi AI từ đâu.',
    helps: 'Làm rõ mục tiêu, bối cảnh và mức hỗ trợ phù hợp trước khi viết prompt.',
    example: 'Mình muốn hiểu bài nhưng chưa biết nên hỏi AI thế nào.', action: 'Học cách hỏi AI',
  },
  {
    href: '/ai-tools/goi-y-prompt-hoc-tap', title: 'Gợi ý prompt học tập', icon: NotebookPen,
    situation: 'Bạn đã có lớp, môn hoặc chủ đề cần học.',
    helps: 'Tạo bản gợi ý prompt theo ngữ cảnh để bạn đọc, điều chỉnh và thử.',
    example: 'Gợi ý prompt học Toán 11 về ý nghĩa của đạo hàm.', action: 'Tạo prompt học tập',
  },
  {
    href: '/ai-tools/danh-gia-prompt', title: 'Đánh giá prompt', icon: ClipboardCheck,
    situation: 'Bạn đã tự viết prompt và muốn biết chỗ cần sửa.',
    helps: 'Nhận góp ý về phần mơ hồ, thông tin còn thiếu và cách cải thiện.',
    example: 'Prompt “Dạy em bài này” cần bổ sung điều gì?', action: 'Đánh giá prompt của bạn',
  },
];
