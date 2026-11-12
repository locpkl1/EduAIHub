import type { ElementType } from 'react';
import { Brain, AlertTriangle, TrendingUp } from 'lucide-react';

export interface Lesson {
  id: number;
  title: string;
  tag: string;
  tagColor: 'primary' | 'accent' | 'warning' | 'success';
  desc: string;
  readTime: string;
  featured?: boolean;
  icon: ElementType;
  content: {
    intro: string;
    sections: { heading: string; body: string; tips?: string[] }[];
  };
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Biến AI thành người hướng dẫn học tập',
    tag: 'Chiến lược',
    tagColor: 'primary',
    desc: 'Thiết lập vai trò, yêu cầu câu hỏi gợi mở và giữ phần suy luận chính cho chính bạn.',
    readTime: '7 phút',
    featured: true,
    icon: Brain,
    content: {
      intro: 'AI hỗ trợ học tốt hơn khi nó hướng dẫn quá trình suy nghĩ thay vì đưa ngay một câu trả lời hoàn chỉnh.',
      sections: [
        {
          heading: 'Bước 1: Thiết lập vai trò cho AI',
          body: 'Bắt đầu bằng prompt: "Bạn là người hướng dẫn học tập kiên nhẫn. Nhiệm vụ của bạn là giúp em hiểu, không làm thay. Khi em sai, hãy đặt một câu hỏi gợi ý thay vì đưa đáp án ngay." Sau đó thêm lớp, môn và nội dung bạn đang học.',
          tips: ['Nói rõ vai trò hỗ trợ', 'Đặt quy tắc không đưa đáp án ngay', 'Thêm lớp, môn và mục tiêu'],
        },
        {
          heading: 'Bước 2: Học theo phương pháp Socratic',
          body: 'Thay vì hỏi "giải bài này", hãy hỏi "Bài này tôi cần áp dụng kiến thức gì? Gợi ý cho tôi điểm bắt đầu." Sau đó tự làm, nếu sai, hỏi "Tôi sai ở bước nào? Cho tôi một câu hỏi gợi ý thay vì đáp án."',
        },
        {
          heading: 'Bước 3: Kiểm tra sau khi học',
          body: 'Cuối mỗi phiên, yêu cầu: "Hãy hỏi tôi 5 câu kiểm tra về những gì tôi vừa học. Chờ tôi trả lời từng câu trước khi phản hồi." Sau đó tự giải thích lại phần quan trọng bằng lời của mình.',
          tips: ['Tự trả lời trước khi xem đáp án', 'Yêu cầu câu hỏi từ dễ đến khó', 'Nhờ AI phân tích lỗi sai'],
        },
      ],
    },
  },
  {
    id: 3,
    title: 'Những lỗi phổ biến khi dùng AI học tập',
    tag: 'Kinh nghiệm',
    tagColor: 'warning',
    desc: 'Nhận diện prompt mơ hồ, thói quen sao chép và việc tin câu trả lời mà chưa kiểm chứng.',
    readTime: '6 phút',
    featured: false,
    icon: AlertTriangle,
    content: {
      intro: 'AI chỉ hỗ trợ việc học khi bạn vẫn đọc, suy nghĩ, kiểm tra và tự trình bày lại kết quả.',
      sections: [
        {
          heading: 'Lỗi 1: Hỏi quá mơ hồ',
          body: 'Prompt "Giải thích bài này" thiếu mục tiêu và bối cảnh. Hãy nói rõ lớp, môn, nội dung đang học, phần chưa hiểu và kiểu hỗ trợ bạn muốn nhận.',
          tips: ['Thêm lớp, môn và chủ đề', 'Nêu phần đang vướng', 'Nói rõ muốn gợi ý hay phản hồi'],
        },
        {
          heading: 'Lỗi 2: Copy nguyên văn câu trả lời AI',
          body: 'Sao chép một câu trả lời hoàn chỉnh không cho thấy bạn đã hiểu. Hãy đọc, kiểm chứng, tự giải thích và viết lại bằng lời của mình theo yêu cầu của giáo viên.',
        },
        {
          heading: 'Lỗi 3: Tin tuyệt đối vào AI',
          body: 'AI có thể sai, đặc biệt với số liệu, công thức Toán/Lý/Hóa và sự kiện lịch sử. Quy tắc vàng: bất kỳ thông tin quan trọng nào cũng cần đối chiếu với sách giáo khoa.',
          tips: ['Đối chiếu phần quan trọng với SGK', 'Cẩn thận với công thức, số liệu và trích dẫn', 'Yêu cầu AI nêu căn cứ và phần chưa chắc chắn'],
        },
      ],
    },
  },
  {
    id: 6,
    title: 'Cách kiểm chứng phản hồi của AI',
    tag: 'Tư duy phản biện',
    tagColor: 'warning',
    desc: 'Nhận diện phần đáng nghi và đối chiếu thông tin quan trọng trước khi sử dụng.',
    readTime: '6 phút',
    featured: false,
    icon: TrendingUp,
    content: {
      intro: 'AI có thể trình bày trôi chảy dù thông tin còn thiếu hoặc sai. Cách viết tự tin không phải là bằng chứng về độ chính xác.',
      sections: [
        {
          heading: 'Những phần cần kiểm tra kỹ',
          body: 'Số liệu, công thức, ngày tháng, tên riêng, trích dẫn và điều kiện áp dụng đều có thể bị thiếu hoặc nhầm. Hãy đánh dấu từng ý quan trọng thay vì chỉ đọc toàn bộ câu trả lời một lần.',
          tips: ['Cẩn thận với con số cụ thể', 'Kiểm tra công thức và điều kiện áp dụng', 'Yêu cầu nêu nguồn hoặc căn cứ có thể đối chiếu'],
        },
        {
          heading: 'Quy trình kiểm chứng 3 bước',
          body: '1) Đối chiếu với SGK ngay khi nhận thông tin quan trọng. 2) Yêu cầu AI nêu điểm chưa chắc để biết phần cần kiểm tra; lời tự xác nhận của AI không phải bằng chứng độc lập. 3) Tìm nguồn độc lập (thầy cô, tài liệu tham khảo chính thống).',
        },
      ],
    },
  },
];

export const allTags = ['Tất cả', 'Chiến lược', 'Kinh nghiệm', 'Tư duy phản biện'];

export const tagColorMap: Record<string, { bg: string; text: string }> = {
  primary: { bg: 'var(--color-primary-light)', text: 'var(--color-primary-text)' },
  accent: { bg: 'var(--color-accent-light)', text: 'var(--color-accent)' },
  warning: { bg: 'color-mix(in srgb, var(--color-warning) 12%, transparent)', text: 'var(--color-warning)' },
  success: { bg: 'color-mix(in srgb, var(--color-success) 12%, transparent)', text: 'var(--color-success)' },
};
