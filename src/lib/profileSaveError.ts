const LEARNING_CONTEXT_SCHEMA_MARKERS = [
  'column does not exist',
  'could not find the column',
  'schema cache',
  'personal_background',
  'strengths',
  'weaknesses',
  'common_problems',
  'learning_goals',
  'preferred_learning_style',
  'ai_experience_level',
  'onboarding_completed',
];

function readErrorText(error: unknown): string {
  if (!error) return '';

  const parts: string[] = [];
  if (error instanceof Error) parts.push(error.message);

  if (typeof error === 'object') {
    const record = error as Record<string, unknown>;
    for (const key of ['message', 'details', 'hint', 'code']) {
      const value = record[key];
      if (typeof value === 'string') parts.push(value);
    }
  }

  try {
    parts.push(JSON.stringify(error));
  } catch {
    parts.push(String(error));
  }

  return parts.join(' ').toLowerCase();
}

export function getProfileSaveErrorMessage(error: unknown): string {
  const errorText = readErrorText(error);
  const isMissingLearningContextColumn = LEARNING_CONTEXT_SCHEMA_MARKERS.some((marker) =>
    errorText.includes(marker)
  );

  if (isMissingLearningContextColumn) {
    return 'Cơ sở dữ liệu chưa có đủ cột hồ sơ học tập. Hãy chạy migration profiles_learning_context trên Supabase rồi thử lại.';
  }

  return 'Không thể lưu hồ sơ học tập. Vui lòng kiểm tra kết nối hoặc thử lại.';
}
