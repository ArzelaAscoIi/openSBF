import type { UserProgress, QuestionProgress, ExamType } from './types';

const STORAGE_KEY = 'opensbf_progress';
const CORRECT_THRESHOLD = 3;

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return { questions: {}, topics: {}, lastUpdated: new Date().toISOString() };
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { questions: {}, topics: {}, lastUpdated: new Date().toISOString() };
  }
  return JSON.parse(raw) as UserProgress;
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  progress.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getQuestionKey(questionId: number, exam: ExamType): string {
  return `${exam}_${questionId}`;
}

export function recordAnswer(
  progress: UserProgress,
  questionId: number,
  exam: ExamType,
  isCorrect: boolean,
): UserProgress {
  const key = getQuestionKey(questionId, exam);
  const existing = progress.questions[key];

  const updated: QuestionProgress = {
    questionId,
    exam,
    correctCount: isCorrect ? (existing?.correctCount ?? 0) + 1 : existing?.correctCount ?? 0,
    lastAnswered: new Date().toISOString(),
  };

  return {
    ...progress,
    questions: {
      ...progress.questions,
      [key]: updated,
    },
    lastUpdated: new Date().toISOString(),
  };
}

export function isQuestionPassed(progress: UserProgress, questionId: number, exam: ExamType): boolean {
  const key = getQuestionKey(questionId, exam);
  return (progress.questions[key]?.correctCount ?? 0) >= CORRECT_THRESHOLD;
}

export function getQuestionCorrectCount(progress: UserProgress, questionId: number, exam: ExamType): number {
  const key = getQuestionKey(questionId, exam);
  return progress.questions[key]?.correctCount ?? 0;
}

export function getTopicProgress(
  progress: UserProgress,
  questionIds: number[],
  exam: ExamType,
): { passed: number; total: number; percentage: number } {
  const total = questionIds.length;
  const passed = questionIds.filter((id) => isQuestionPassed(progress, id, exam)).length;
  return { passed, total, percentage: total > 0 ? Math.round((passed / total) * 100) : 0 };
}

export function isTopicPassed(
  progress: UserProgress,
  questionIds: number[],
  exam: ExamType,
): boolean {
  return questionIds.every((id) => isQuestionPassed(progress, id, exam));
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function resetTopicProgress(
  progress: UserProgress,
  questionIds: number[],
  exam: ExamType,
): UserProgress {
  const updatedQuestions = { ...progress.questions };
  questionIds.forEach((id) => {
    const key = getQuestionKey(id, exam);
    delete updatedQuestions[key];
  });
  return { ...progress, questions: updatedQuestions };
}

export function getExamOverallProgress(
  progress: UserProgress,
  allQuestionIds: number[],
  exam: ExamType,
): { passed: number; total: number; percentage: number } {
  return getTopicProgress(progress, allQuestionIds, exam);
}
