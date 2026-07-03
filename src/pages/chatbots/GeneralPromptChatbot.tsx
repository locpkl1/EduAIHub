import { ClipboardCheck } from 'lucide-react';
import ChatbotPage from '../../components/ChatbotPage';
import { useAuth } from '../../contexts/AuthContext';
import { buildUserLearningContext } from '../../lib/userContext';

const STARTERS = [
  'Đánh giá prompt này: "Giải thích bài này cho tôi"',
  'Chấm prompt của em theo thang 10 và chỉ ra cách sửa',
  'Prompt của em thiếu gì để AI trả lời tốt hơn?',
  'Hãy viết lại prompt này thành phiên bản rõ ràng hơn',
];

export default function PromptEvaluatorChatbot() {
  const { profile, displayName } = useAuth();
  const userContext = buildUserLearningContext(profile, displayName);

  return (
    <ChatbotPage
      title="Đánh Giá Prompt Của Bạn"
      subtitle="Chấm điểm, góp ý và nâng cấp prompt bạn tự viết"
      icon={<ClipboardCheck size={20} style={{ color: 'var(--color-accent)' }} />}
      accentColor="var(--color-accent)"
      botKey="prompt-evaluator"
      autoSavePrompts
      userContext={userContext}
      starterPrompts={STARTERS}
    />
  );
}
