import { Lightbulb } from 'lucide-react';
import ChatbotPage from '../../components/ChatbotPage';
import { useAuth } from '../../contexts/AuthContext';
import { buildUserLearningContext } from '../../lib/userContext';

const STARTERS = [
  'Prompt là gì và vì sao nó quan trọng khi dùng AI?',
  'Dạy em cách viết prompt tốt theo từng bước',
  'Làm sao để hỏi AI mà không bị phụ thuộc?',
  'Cho em một bài tập luyện viết prompt trong 10 phút',
];

export default function PromptThinkingChatbot() {
  const { profile, displayName } = useAuth();
  const userContext = buildUserLearningContext(profile, displayName);

  return (
    <ChatbotPage
      title="Học Tư Duy Prompt Với AI"
      subtitle="Hiểu cách tạo prompt tốt, đặt bối cảnh rõ và học chủ động với AI"
      icon={<Lightbulb size={20} style={{ color: 'var(--color-primary)' }} />}
      botKey="prompt-thinking"
      userContext={userContext}
      starterPrompts={STARTERS}
    />
  );
}
