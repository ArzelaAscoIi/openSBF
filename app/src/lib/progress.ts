import type { UserProgress, QuestionProgress, ExamType, Question, ExamResult } from './types';

const STORAGE_KEY = 'opensbf_progress';
const CORRECT_THRESHOLD = 3;

function emptyProgress(): UserProgress {
  return { questions: {}, topics: {}, pruefungsboegen: {}, lastUpdated: new Date().toISOString() };
}

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return emptyProgress();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyProgress();
  const parsed = JSON.parse(raw) as UserProgress;
  // backfill for older stored data that predates the pruefungsboegen field
  if (!parsed.pruefungsboegen) parsed.pruefungsboegen = {};
  return parsed;
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
    wrongCount: isCorrect ? (existing?.wrongCount ?? 0) : (existing?.wrongCount ?? 0) + 1,
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

export function getQuestionWrongCount(progress: UserProgress, questionId: number, exam: ExamType): number {
  const key = getQuestionKey(questionId, exam);
  return progress.questions[key]?.wrongCount ?? 0;
}

export const HARD_QUESTIONS_LIMIT = 20;

export function getHardestQuestions(
  progress: UserProgress,
  exam: ExamType,
  allQuestions: Question[],
  limit = HARD_QUESTIONS_LIMIT,
): Question[] {
  return allQuestions
    .map((q) => ({ question: q, wrongCount: progress.questions[getQuestionKey(q.id, exam)]?.wrongCount ?? 0 }))
    .filter(({ wrongCount }) => wrongCount > 0)
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, limit)
    .map(({ question }) => question);
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

export function exportProgress(): string {
  const progress = loadProgress();
  return JSON.stringify(progress, null, 2);
}

export function mergeProgress(current: UserProgress, imported: UserProgress): UserProgress {
  const merged: UserProgress['questions'] = { ...current.questions };

  for (const [key, importedQ] of Object.entries(imported.questions)) {
    const existing = merged[key];
    merged[key] = {
      ...importedQ,
      correctCount: Math.max(importedQ.correctCount, existing?.correctCount ?? 0),
      wrongCount: Math.max(importedQ.wrongCount ?? 0, existing?.wrongCount ?? 0),
    };
  }

  // Merge exam results: combine arrays, deduplicate by takenAt
  const mergedPb: UserProgress['pruefungsboegen'] = { ...(current.pruefungsboegen ?? {}) };
  for (const [key, results] of Object.entries(imported.pruefungsboegen ?? {})) {
    const existingResults = mergedPb[key] ?? [];
    const existingTimes = new Set(existingResults.map((r) => r.takenAt));
    const newResults = results.filter((r) => !existingTimes.has(r.takenAt));
    mergedPb[key] = [...existingResults, ...newResults].sort((a, b) =>
      a.takenAt.localeCompare(b.takenAt),
    );
  }

  return {
    questions: merged,
    topics: {},
    pruefungsboegen: mergedPb,
    lastUpdated: new Date().toISOString(),
  };
}

export function validateImport(raw: string): UserProgress | null {
  try {
    const parsed = JSON.parse(raw) as UserProgress;
    if (typeof parsed !== 'object' || !parsed.questions) return null;
    return parsed;
  } catch {
    return null;
  }
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

// ---------------------------------------------------------------------------
// Prüfungsbögen exam result persistence
// ---------------------------------------------------------------------------

export function pruefungsbogenKey(nummer: number): string {
  return `see_pb_${String(nummer).padStart(2, '0')}`;
}

export function saveExamResult(result: ExamResult, nummer: number): void {
  const progress = loadProgress();
  const key = pruefungsbogenKey(nummer);
  const existing = progress.pruefungsboegen[key] ?? [];
  const updated: UserProgress = {
    ...progress,
    pruefungsboegen: {
      ...progress.pruefungsboegen,
      [key]: [...existing, result],
    },
  };
  saveProgress(updated);
}

export function getExamResults(progress: UserProgress, nummer: number): ExamResult[] {
  return progress.pruefungsboegen[pruefungsbogenKey(nummer)] ?? [];
}

export function getBestExamResult(progress: UserProgress, nummer: number): ExamResult | null {
  const results = getExamResults(progress, nummer);
  if (results.length === 0) return null;
  return results.reduce((best, r) => (r.correct > best.correct ? r : best), results[0]);
}

export function getLastExamResult(progress: UserProgress, nummer: number): ExamResult | null {
  const results = getExamResults(progress, nummer);
  return results.length > 0 ? results[results.length - 1] : null;
}
