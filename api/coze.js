import { handleCozeRequest } from '../lib/cozeHandler.mjs';

async function readJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) return {};

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const result = await handleCozeRequest(body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Coze function error:', error);
    const statusCode = error instanceof SyntaxError ? 400 : error?.statusCode ?? 500;
    res.status(statusCode).json({
      error: error instanceof SyntaxError
        ? 'Invalid JSON body.'
        : error instanceof Error ? error.message : 'Unknown Coze API error.',
    });
  }
}
