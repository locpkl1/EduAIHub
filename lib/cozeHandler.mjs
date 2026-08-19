const POLL_INTERVAL_MS = 1000;
const POLL_TIMEOUT_MS = 60000;
const COZE_FETCH_TIMEOUT_MS = 20000;

const BOT_KEYS = ['prompt-thinking', 'study-prompt', 'prompt-evaluator'];
const LEGACY_BOT_KEYS = ['ai-guide', 'general-prompt'];
const ALL_BOT_KEYS = [...BOT_KEYS, ...LEGACY_BOT_KEYS];
const NOT_PROVIDED = 'Chưa cung cấp';
const NOT_SELECTED = 'Chưa chọn';
const DEFAULT_BOOK_SERIES = 'Kết nối tri thức với cuộc sống';

function readEnv(...names) {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  return undefined;
}

function createPublicError(message, statusCode = 500) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function getCozeApiToken() {
  return readEnv('COZE_API_KEY', 'COZE_API_TOKEN');
}

function getCozeApiBase() {
  return (readEnv('COZE_API_BASE_URL', 'COZE_API_BASE') ?? 'https://api.coze.com').replace(/\/$/, '');
}

function resolveBotId(botKey) {
  const map = {
    'prompt-thinking': readEnv('COZE_PROMPT_THINKING_BOT_ID'),
    'study-prompt': readEnv('COZE_STUDY_PROMPT_BOT_ID', 'COZE_BOT_ID_STUDY_PROMPT'),
    'prompt-evaluator': readEnv('COZE_PROMPT_EVALUATOR_BOT_ID'),
    'ai-guide': readEnv('COZE_PROMPT_THINKING_BOT_ID', 'COZE_AI_GUIDE_BOT_ID', 'COZE_BOT_ID_AI_GUIDE'),
    'general-prompt': readEnv('COZE_PROMPT_EVALUATOR_BOT_ID', 'COZE_GENERAL_PROMPT_BOT_ID', 'COZE_BOT_ID_GENERAL_PROMPT'),
  };

  return map[botKey] ?? readEnv('COZE_BOT_ID');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function stringArray(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim())
    : [];
}

function sanitizeRecord(value) {
  if (!isRecord(value)) return {};

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, item]) => typeof key === 'string' && key.trim() && item != null)
      .map(([key, item]) => [key.trim(), String(item).slice(0, 500)])
  );
}

function buildCozeCustomVariables({ userContext, studyContext }) {
  const user = isRecord(userContext) ? userContext : {};
  const study = isRecord(studyContext) ? studyContext : {};
  const read = (source, key) => (typeof source[key] === 'string' && source[key].trim() ? source[key].trim() : '');

  return {
    student_name: read(user, 'displayName') || NOT_PROVIDED,
    grade: read(study, 'grade') || read(user, 'grade') || NOT_PROVIDED,
    school: read(user, 'school') || NOT_PROVIDED,

    personal_background: read(user, 'personalBackground') || NOT_PROVIDED,
    strengths: stringArray(user.strengths).join(', ') || NOT_PROVIDED,
    weaknesses: stringArray(user.weaknesses).join(', ') || NOT_PROVIDED,
    common_problems: stringArray(user.commonProblems).join(', ') || NOT_PROVIDED,
    learning_goals: stringArray(user.goals).join(', ') || NOT_PROVIDED,
    preferred_learning_style: read(user, 'preferredLearningStyle') || NOT_PROVIDED,
    ai_experience_level: read(user, 'aiExperienceLevel') || NOT_PROVIDED,

    subject: read(study, 'subject') || NOT_SELECTED,
    textbook_series: DEFAULT_BOOK_SERIES,
    knowledge_area: read(study, 'knowledgeArea') || read(study, 'chapter') || NOT_SELECTED,
    topic: read(study, 'topic') || read(study, 'lesson') || NOT_SELECTED,
    chapter: read(study, 'chapter') || read(study, 'knowledgeArea') || NOT_SELECTED,
    lesson: read(study, 'lesson') || read(study, 'topic') || NOT_SELECTED,
    study_learning_goal: read(study, 'learningGoal') || NOT_PROVIDED,
    current_level: read(study, 'currentLevel') || NOT_PROVIDED,
  };
}

async function cozeFetch(path, options) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), COZE_FETCH_TIMEOUT_MS);
  let response;

  try {
    response = await fetch(`${getCozeApiBase()}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${getCozeApiToken()}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw createPublicError('Coze API timed out. Please try again.', 504);
    }
    throw createPublicError('Could not connect to Coze API. Please try again.', 502);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    console.error('Coze API error response:', response.status, response.statusText);
    throw createPublicError(
      `Coze API request failed (${response.status}). Check the server Coze environment variables.`,
      502
    );
  }

  const data = await response.json();
  if (typeof data?.code === 'number' && data.code !== 0) {
    const detail = typeof data.msg === 'string'
      ? data.msg
      : typeof data.message === 'string' ? data.message : 'Unknown Coze API error.';
    console.error('Coze API logical error:', data.code, detail);
    throw createPublicError(
      'Chatbot chưa thể kết nối với dịch vụ AI. Vui lòng kiểm tra cấu hình máy chủ và thử lại.',
      502
    );
  }

  return data;
}

async function createChat({ message, existingConversationId, botId, userId, customVariables, metaData }) {
  const body = {
    bot_id: botId,
    user_id: userId,
    stream: false,
    auto_save_history: true,
    additional_messages: [{ role: 'user', type: 'question', content_type: 'text', content: message }],
    custom_variables: customVariables,
  };

  const cleanMetaData = sanitizeRecord(metaData);
  if (Object.keys(cleanMetaData).length > 0) {
    body.meta_data = cleanMetaData;
  }

  const trimmedConversationId =
    typeof existingConversationId === 'string' && existingConversationId.trim()
      ? existingConversationId.trim()
      : '';
  const chatPath = trimmedConversationId
    ? `/v3/chat?${new URLSearchParams({ conversation_id: trimmedConversationId }).toString()}`
    : '/v3/chat';

  const data = await cozeFetch(chatPath, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const chatId = data?.data?.id;
  const conversationId = data?.data?.conversation_id;

  if (!chatId || !conversationId) {
    throw createPublicError('Dịch vụ AI trả về dữ liệu không hợp lệ. Vui lòng thử lại.', 502);
  }

  return { chatId, conversationId };
}

async function waitForChatCompletion(chatId, conversationId) {
  const start = Date.now();

  while (true) {
    if (Date.now() - start > POLL_TIMEOUT_MS) {
      throw createPublicError('Chatbot phản hồi quá lâu. Vui lòng thử lại.', 504);
    }

    const params = new URLSearchParams({
      chat_id: chatId,
      conversation_id: conversationId,
    });

    const data = await cozeFetch(`/v3/chat/retrieve?${params.toString()}`, {
      method: 'GET',
    });

    const status = data?.data?.status;

    if (status === 'completed') return;
    if (status === 'in_progress' || status === 'created') {
      await sleep(POLL_INTERVAL_MS);
      continue;
    }
    if (status === 'failed') {
      throw createPublicError('Chatbot không thể hoàn tất phản hồi. Vui lòng thử lại.', 502);
    }

    console.error('Unexpected Coze chat status:', status);
    throw createPublicError('Dịch vụ AI trả về trạng thái không hợp lệ. Vui lòng thử lại.', 502);
  }
}

async function listMessages(chatId, conversationId) {
  const params = new URLSearchParams({
    chat_id: chatId,
    conversation_id: conversationId,
  });

  const data = await cozeFetch(`/v3/chat/message/list?${params.toString()}`, {
    method: 'GET',
  });

  return Array.isArray(data?.data) ? data.data : [];
}

export async function handleCozeRequest(body) {
  if (!getCozeApiToken()) {
    throw createPublicError(
      'Missing COZE_API_KEY or COZE_API_TOKEN on the server. Add the server-only Coze token in Vercel Project Settings, then redeploy.'
    );
  }

  if (!isRecord(body)) {
    throw createPublicError('Invalid request body.', 400);
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const botKey = typeof body.botKey === 'string' ? body.botKey : body.bot_key;
  const existingConversationId =
    typeof body.conversationId === 'string' ? body.conversationId : body.conversation_id;
  const userId = typeof body.userId === 'string' ? body.userId : body.user_id;
  const userContext = isRecord(body.userContext) ? body.userContext : undefined;
  const studyContext = isRecord(body.studyContext) ? body.studyContext : undefined;
  const metaData = isRecord(body.metaData) ? body.metaData : body.meta_data;

  if (!message) {
    throw createPublicError('Missing message.', 400);
  }

  if (!botKey || typeof botKey !== 'string' || !ALL_BOT_KEYS.includes(botKey)) {
    throw createPublicError(`Invalid botKey. Allowed: ${BOT_KEYS.join(', ')}`, 400);
  }

  const botId = resolveBotId(botKey);
  if (!botId) {
    throw createPublicError(
      'Missing Coze bot ID on the server. Add COZE_PROMPT_THINKING_BOT_ID, COZE_STUDY_PROMPT_BOT_ID, and COZE_PROMPT_EVALUATOR_BOT_ID in Vercel Project Settings.'
    );
  }

  const cozeUserId =
    typeof userId === 'string' && userId.trim()
      ? userId.trim().slice(0, 64)
      : 'eduai_guest';

  const customVariables = buildCozeCustomVariables({ userContext, studyContext });
  if (process.env.COZE_DEBUG_CONTEXT === 'true') {
    console.log('[EduAIHub Coze Context]', {
      botKey,
      hasStudentName: Boolean(customVariables.student_name && customVariables.student_name !== NOT_PROVIDED),
      grade: customVariables.grade,
      hasSchool: Boolean(customVariables.school && customVariables.school !== NOT_PROVIDED),
      subject: customVariables.subject,
      textbookSeries: customVariables.textbook_series,
      variableKeys: Object.keys(customVariables),
    });
  }

  const { chatId, conversationId } = await createChat({
    message,
    existingConversationId,
    botId,
    userId: cozeUserId,
    customVariables,
    metaData,
  });

  await waitForChatCompletion(chatId, conversationId);

  const messages = await listMessages(chatId, conversationId);
  const answer = [...messages].reverse().find((item) => item.role === 'assistant' && item.type === 'answer');

  if (typeof answer?.content !== 'string' || !answer.content.trim()) {
    throw createPublicError('Chatbot chưa tạo được câu trả lời. Vui lòng thử gửi lại.', 502);
  }

  return {
    content: answer.content.trim(),
    conversation_id: conversationId,
    chat_id: chatId,
  };
}
