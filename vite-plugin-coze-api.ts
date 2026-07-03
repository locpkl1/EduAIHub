import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleCozeRequest } from './lib/cozeHandler.mjs';

type CozeEnv = Record<string, string | undefined>;

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export function cozeApiPlugin(getEnv: () => CozeEnv): Plugin {
  return {
    name: 'coze-api-dev',
    configureServer(devServer) {
      devServer.middlewares.use('/api/coze', async (req, res) => {
        if (req.method !== 'POST') {
          sendJson(res, 405, { error: 'Method not allowed' });
          return;
        }

        const prev: CozeEnv = {};
        const env = getEnv();
        for (const key of Object.keys(env)) {
          prev[key] = process.env[key];
          if (env[key]) process.env[key] = env[key];
        }

        try {
          const body = await readJsonBody(req);
          const result = await handleCozeRequest(body);
          sendJson(res, 200, result);
        } catch (error: unknown) {
          const err = error as { statusCode?: number };
          console.error('Coze dev middleware error:', error);
          sendJson(res, error instanceof SyntaxError ? 400 : err.statusCode ?? 500, {
            error: error instanceof SyntaxError
              ? 'Invalid JSON body.'
              : error instanceof Error ? error.message : 'Unknown Coze API error.',
          });
        } finally {
          for (const key of Object.keys(prev)) {
            if (prev[key] === undefined) {
              delete process.env[key];
            } else {
              process.env[key] = prev[key];
            }
          }
        }
      });
    },
  };
}
