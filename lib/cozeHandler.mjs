const POLL_INTERVAL_MS = 1000;
const POLL_TIMEOUT_MS = 60000;

const BOT_KEYS = ['ai-guide', 'study-prompt', 'general-prompt'];

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

function getCozeApiBase() {
  return (readEnv('COZE_API_BASE_URL', 'COZE_API_BASE') ?? 'https://api.coze.com').replace(/\/$/, '');
}

function resolveBotId(botKey) {
  const map = {
    'ai-guide': readEnv('COZE_AI_GUIDE_BOT_ID', 'COZE_BOT_ID_AI_GUIDE'),
    'study-prompt': readEnv('COZE_STUDY_PROMPT_BOT_ID', 'COZE_BOT_ID_STUDY_PROMPT'),
    'general-prompt': readEnv('COZE_GENERAL_PROMPT_BOT_ID', 'COZE_BOT_ID_GENERAL_PROMPT'),
  };
  if (botKey && map[botKey]) return map[botKey];
  return readEnv('COZE_BOT_ID');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function cozeFetch(path, options) {
  const response = await fetch(`${getCozeApiBase()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${readEnv('COZE_API_KEY')}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    console.error('Coze API error response:', response.status, response.statusText, errorText.slice(0, 1000));
    throw createPublicError(
      `Coze API request failed (${response.status}). Check the server Coze environment variables.`,
      502
    );
  }

  return response.json();
}

async function createChat(userMessage, existingConversationId, botId, userId) {
  const body = {
    bot_id: botId,
    user_id: userId,
    stream: false,
    auto_save_history: true,
    additional_messages: [{ role: 'user', content: userMessage, content_type: 'text' }],
  };

  if (existingConversationId) {
    body.conversation_id = existingConversationId;
  }

  const data = await cozeFetch('/v3/chat', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const chatId = data?.data?.id;
  const conversationId = data?.data?.conversation_id;

  if (!chatId || !conversationId) {
    throw new Error(`Coze create chat response missing id/conversation_id: ${JSON.stringify(data)}`);
  }

  return { chatId, conversationId };
}

async function waitForChatCompletion(chatId, conversationId) {
  const start = Date.now();

  while (true) {
    if (Date.now() - start > POLL_TIMEOUT_MS) {
      throw new Error('Coze chat timed out after 60 seconds.');
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
      throw new Error(`Coze chat failed: ${JSON.stringify(data)}`);
    }

    throw new Error(`Unexpected Coze chat status "${String(status)}": ${JSON.stringify(data)}`);
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
  if (!readEnv('COZE_API_KEY')) {
    throw createPublicError(
      'Missing COZE_API_KEY on the server. Add it in Vercel Project Settings → Environment Variables (without VITE_ prefix), then redeploy.'
    );
  }

  const { message, conversation_id: existingConversationId, bot_key: botKey, user_id: userId } = body ?? {};

  if (!message || typeof message !== 'string') {
    const err = new Error('Missing message.');
    err.statusCode = 400;
    throw err;
  }

  const botId = resolveBotId(typeof botKey === 'string' ? botKey : undefined);
  if (!botId) {
    throw createPublicError(
      'Missing Coze bot ID on the server. Add COZE_AI_GUIDE_BOT_ID, COZE_STUDY_PROMPT_BOT_ID, and COZE_GENERAL_PROMPT_BOT_ID in Vercel Project Settings → Environment Variables.'
    );
  }

  if (botKey && !BOT_KEYS.includes(botKey)) {
    const err = new Error(`Invalid bot_key. Allowed: ${BOT_KEYS.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }

  const cozeUserId =
    typeof userId === 'string' && userId.trim()
      ? userId.trim().slice(0, 64)
      : 'eduai_guest';

  const { chatId, conversationId } = await createChat(message, existingConversationId, botId, cozeUserId);
  await waitForChatCompletion(chatId, conversationId);

  const messages = await listMessages(chatId, conversationId);
  const answer = messages.find((item) => item.role === 'assistant' && item.type === 'answer');

  if (!answer?.content) {
    throw new Error(`Assistant answer not found: ${JSON.stringify(messages)}`);
  }

  return {
    content: answer.content,
    conversation_id: conversationId,
  };
}
