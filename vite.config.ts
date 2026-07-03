import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { cozeApiPlugin } from './vite-plugin-coze-api';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      cozeApiPlugin(() => ({
        COZE_API_KEY: env.COZE_API_KEY,
        COZE_API_TOKEN: env.COZE_API_TOKEN,
        COZE_API_BASE_URL: env.COZE_API_BASE_URL,
        COZE_PROMPT_THINKING_BOT_ID: env.COZE_PROMPT_THINKING_BOT_ID,
        COZE_AI_GUIDE_BOT_ID: env.COZE_AI_GUIDE_BOT_ID,
        COZE_STUDY_PROMPT_BOT_ID: env.COZE_STUDY_PROMPT_BOT_ID,
        COZE_PROMPT_EVALUATOR_BOT_ID: env.COZE_PROMPT_EVALUATOR_BOT_ID,
        COZE_GENERAL_PROMPT_BOT_ID: env.COZE_GENERAL_PROMPT_BOT_ID,
        COZE_BOT_ID: env.COZE_BOT_ID,
        COZE_BOT_ID_AI_GUIDE: env.COZE_BOT_ID_AI_GUIDE,
        COZE_BOT_ID_STUDY_PROMPT: env.COZE_BOT_ID_STUDY_PROMPT,
        COZE_BOT_ID_GENERAL_PROMPT: env.COZE_BOT_ID_GENERAL_PROMPT,
        COZE_API_BASE: env.COZE_API_BASE,
      })),
    ],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      allowedHosts: ['sb-5zhhuatm2jiq.vercel.run'],
    },
  };
});
