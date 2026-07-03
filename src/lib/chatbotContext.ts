import type { StudyContext, UserLearningContext } from './cozeClient';

const NOT_PROVIDED = 'Chưa cung cấp';
const NOT_SELECTED = 'Chưa chọn';

export function buildCozeCustomVariables(args: {
  userContext?: UserLearningContext;
  studyContext?: StudyContext;
}): Record<string, string> {
  const user = args.userContext;
  const study = args.studyContext;

  return {
    student_name: user?.displayName || NOT_PROVIDED,
    grade: study?.grade || user?.grade || NOT_PROVIDED,
    school: user?.school || NOT_PROVIDED,

    personal_background: user?.personalBackground || NOT_PROVIDED,
    strengths: user?.strengths?.join(', ') || NOT_PROVIDED,
    weaknesses: user?.weaknesses?.join(', ') || NOT_PROVIDED,
    common_problems: user?.commonProblems?.join(', ') || NOT_PROVIDED,
    learning_goals: user?.goals?.join(', ') || NOT_PROVIDED,
    preferred_learning_style: user?.preferredLearningStyle || NOT_PROVIDED,
    ai_experience_level: user?.aiExperienceLevel || NOT_PROVIDED,

    subject: study?.subject || NOT_SELECTED,
    textbook_series: study?.textbookSeries || NOT_SELECTED,
    chapter: study?.chapter || NOT_SELECTED,
    lesson: study?.lesson || NOT_SELECTED,
    study_learning_goal: study?.learningGoal || NOT_PROVIDED,
    current_level: study?.currentLevel || NOT_PROVIDED,
  };
}
