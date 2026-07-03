export type CozeBotKey = 'prompt-thinking' | 'study-prompt' | 'prompt-evaluator';

export type UserLearningContext = {
  displayName?: string;
  grade?: string;
  school?: string;
  personalBackground?: string;
  strengths?: string[];
  weaknesses?: string[];
  commonProblems?: string[];
  goals?: string[];
  preferredLearningStyle?: string;
  aiExperienceLevel?: string;
};

export type StudyContext = {
  grade?: string;
  subject?: string;
  textbookSeries?: string;
  chapter?: string;
  lesson?: string;
  learningGoal?: string;
  currentLevel?: string;
};

export type CallCozePayload = {
  message: string;
  botKey: CozeBotKey;
  conversationId?: string | null;
  userId?: string | null;
  userContext?: UserLearningContext;
  studyContext?: StudyContext;
  metaData?: Record<string, string>;
};

export type CallCozeResult = {
  content: string;
  conversation_id: string;
  chat_id?: string;
};

type CozeApiResponse = Partial<CallCozeResult> & {
  error?: string;
};

const VALID_BOT_KEYS: CozeBotKey[] = ['prompt-thinking', 'study-prompt', 'prompt-evaluator'];

export async function callCoze(payload: CallCozePayload): Promise<CallCozeResult> {
  const message = payload.message?.trim();

  if (!message) {
    throw new Error('Vui lòng nhập tin nhắn trước khi gửi.');
  }

  if (!VALID_BOT_KEYS.includes(payload.botKey)) {
    throw new Error('Chatbot không hợp lệ. Vui lòng tải lại trang và thử lại.');
  }

  const res = await fetch('/api/coze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      message,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as CozeApiResponse;

  if (!res.ok) {
    throw new Error(data.error ?? `Không thể kết nối chatbot (${res.status}). Vui lòng thử lại sau.`);
  }

  if (!data.content || !data.conversation_id) {
    throw new Error('Phản hồi không hợp lệ từ API.');
  }

  return {
    content: data.content,
    conversation_id: data.conversation_id,
    chat_id: data.chat_id,
  };
}
