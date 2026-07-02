export type CozeBotKey = 'ai-guide' | 'study-prompt' | 'general-prompt';

export type CozeApiResponse = {
  content?: string;
  conversation_id?: string;
  error?: string;
};

export async function callCoze(
  message: string,
  options?: {
    conversationId?: string | null;
    botKey?: CozeBotKey;
    userId?: string | null;
  }
): Promise<{ content: string; conversation_id: string }> {
  const res = await fetch('/api/coze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      conversation_id: options?.conversationId,
      bot_key: options?.botKey,
      user_id: options?.userId,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as CozeApiResponse;
  if (!res.ok) throw new Error(data.error ?? `API error ${res.status}`);
  if (!data.content || !data.conversation_id) {
    throw new Error('Phản hồi không hợp lệ từ API');
  }
  return { content: data.content, conversation_id: data.conversation_id };
}
