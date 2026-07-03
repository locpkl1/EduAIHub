# EduAI-Hub Chatbot System

## Bot Roles

EduAI-Hub uses three Coze-hosted chatbot personas. Persona, system prompt, rubric, and response style should be configured inside Coze, not in the frontend.

| Bot key | Display name | Role |
|---|---|---|
| `prompt-thinking` | Học Tư Duy Prompt Với AI | Teach students how to think about prompts, understand prompt structure, and use AI for active learning. |
| `study-prompt` | Gợi Ý Prompt Học Tập | Suggest, critique, and create study prompts using grade, subject, textbook series, chapter, lesson, level, and goal context. |
| `prompt-evaluator` | Đánh Giá Prompt Của Bạn | Score student-written prompts, identify strengths and weaknesses, rewrite improved versions, and explain why. |

Legacy keys are accepted only by the server during migration:

- `ai-guide` maps to `prompt-thinking`.
- `general-prompt` maps to `prompt-evaluator`.

New frontend code should use the new bot keys only.

## `/api/coze` Payload

The frontend calls only the local API proxy:

```ts
type CallCozePayload = {
  message: string;
  botKey: 'prompt-thinking' | 'study-prompt' | 'prompt-evaluator';
  conversationId?: string | null;
  userId?: string | null;
  userContext?: UserLearningContext;
  studyContext?: StudyContext;
  metaData?: Record<string, string>;
};
```

The browser never calls Coze directly and never receives a Coze API token.

## User Context

```ts
type UserLearningContext = {
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
```

The helper `buildUserLearningContext(profile, displayName)` converts the Supabase profile into this shape.

## Study Context

```ts
type StudyContext = {
  grade?: string;
  subject?: string;
  textbookSeries?: string;
  chapter?: string;
  lesson?: string;
  learningGoal?: string;
  currentLevel?: string;
};
```

The study prompt bot receives this context from the sidebar form.

## Coze Custom Variables

`/api/coze` flattens `userContext` and `studyContext` into `custom_variables` before calling Coze. The original user message is sent unchanged in `additional_messages`.

Frontend `systemContext` is deprecated. Coze prompt/persona should live in Coze so the app can pass clean user messages plus structured context.

## Required Environment Variables

Server-only:

- `COZE_API_KEY` or `COZE_API_TOKEN`
- `COZE_PROMPT_THINKING_BOT_ID`
- `COZE_STUDY_PROMPT_BOT_ID`
- `COZE_PROMPT_EVALUATOR_BOT_ID`
- `COZE_API_BASE_URL` optional, defaults to `https://api.coze.com`
- `COZE_BOT_ID` optional fallback

Legacy fallback bot IDs during migration:

- `COZE_AI_GUIDE_BOT_ID`
- `COZE_GENERAL_PROMPT_BOT_ID`
- `COZE_BOT_ID_AI_GUIDE`
- `COZE_BOT_ID_GENERAL_PROMPT`
- `COZE_BOT_ID_STUDY_PROMPT`

## Routes

New routes:

- `/ai-tools/hoc-tu-duy-prompt`
- `/ai-tools/goi-y-prompt-hoc-tap`
- `/ai-tools/danh-gia-prompt`

Legacy routes still map to the new bots:

- `/ai-tools/huong-dan-ai`
- `/ai-tools/prompt-hoc-tap`
- `/ai-tools/prompt-da-dung`

## Testing Checklist

1. Open each chatbot route and send a short message.
2. Confirm `/api/coze` receives `message`, `botKey`, `conversationId`, `userContext`, `studyContext`, and `metaData`.
3. Confirm Coze receives the original message only in `additional_messages`.
4. Confirm Coze receives flattened context in `custom_variables`.
5. Send a second message in the same session and verify `conversation_id` is reused.
6. Reload the page and verify up to 20 sessions are restored from localStorage.
7. For `study-prompt` and `prompt-evaluator`, verify generated prompts can be saved to `saved_prompts`.
8. Confirm guest users can chat but do not save prompts.

## Onboarding Profile

The profile onboarding modal now collects optional learning context:

- background
- strengths
- weaknesses
- common problems
- learning goals
- preferred learning style
- AI experience level

These fields personalize chatbot context. The app should not block if the user chooses to complete the profile later.
