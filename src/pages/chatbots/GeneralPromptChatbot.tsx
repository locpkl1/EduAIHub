import { MessageSquare } from 'lucide-react';
import ChatbotPage from '../../components/ChatbotPage';

const SYSTEM_CONTEXT = `Bạn là chatbot hướng dẫn tạo prompt đa dụng với AI.
Nhiệm vụ:
- Hướng dẫn cách viết prompt hiệu quả cho bất kỳ mục đích nào
- Giải thích các kỹ thuật prompt: few-shot, role prompting, cấu trúc ngữ cảnh, định dạng đầu ra
- Sửa và cải thiện prompt của người dùng nếu được yêu cầu
- Chia sẻ ví dụ prompt thực tế và giải thích tại sao chúng hoạt động
- Không giới hạn chủ đề — từ học thuật, sáng tạo, công việc, đến cuộc sống hằng ngày`;

const STARTERS = [
  'Cách viết prompt để AI giải thích rõ hơn?',
  'Sửa prompt này: "Viết một email"',
  'Few-shot prompting là gì? Cho ví dụ',
  'Tạo prompt để AI đóng vai giáo viên dạy tôi',
];

export default function GeneralPromptChatbot() {
  return (
    <ChatbotPage
      title="Tạo Prompt Đa Dụng"
      subtitle="Chat tự do để luyện cách tạo prompt cho nhiều mục đích khác nhau"
      icon={<MessageSquare size={20} style={{ color: 'var(--color-accent)' }} />}
      accentColor="var(--color-accent)"
      botKey="general-prompt"
      systemContext={SYSTEM_CONTEXT}
      starterPrompts={STARTERS}
    />
  );
}
