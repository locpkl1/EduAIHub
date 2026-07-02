import { ShieldCheck } from 'lucide-react';
import ChatbotPage from '../../components/ChatbotPage';

const SYSTEM_CONTEXT = `Bạn là chatbot hướng dẫn sử dụng AI trong học tập dành cho học sinh THPT Việt Nam.
Nhiệm vụ:
- Giải thích AI là gì và cách hoạt động (ngắn gọn, dễ hiểu)
- Hướng dẫn cách học chủ động cùng AI, không phụ thuộc
- Cảnh báo các lỗi thường gặp khi dùng AI (hallucination, thiếu tư duy phản biện)
- Gợi ý cách kiểm chứng thông tin từ AI
- Luôn khuyến khích tư duy độc lập`;

const STARTERS = [
  'AI là gì và tôi nên dùng nó như thế nào?',
  'AI có thể sai không? Khi nào cần kiểm chứng?',
  'Cách học Toán với AI mà không bị phụ thuộc?',
  'Hướng dẫn tôi ôn thi Lý lớp 12 với AI',
];

export default function AiGuideChatbot() {
  return (
    <ChatbotPage
      title="Hướng Dẫn Sử Dụng AI"
      subtitle="Học cách dùng AI đúng cách, kiểm chứng thông tin và giữ tư duy độc lập"
      icon={<ShieldCheck size={20} style={{ color: 'var(--color-primary)' }} />}
      botKey="ai-guide"
      systemContext={SYSTEM_CONTEXT}
      starterPrompts={STARTERS}
    />
  );
}
