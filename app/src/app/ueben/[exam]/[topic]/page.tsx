'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Question, ExamType } from '@/lib/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { binnenTopics, seeTopics, getAllBinnenQuestions, getAllSeeQuestions } from '@/data/topics';
import {
  loadProgress,
  saveProgress,
  recordAnswer,
  isQuestionPassed,
  getQuestionCorrectCount,
  getTopicProgress,
  isTopicPassed,
} from '@/lib/progress';
import type { UserProgress } from '@/lib/types';

const CORRECT_THRESHOLD = 3;

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getTopicQuestions(topicId: string, exam: ExamType): Question[] {
  const topics = exam === 'binnen' ? binnenTopics : seeTopics;
  const allQuestions = exam === 'binnen' ? getAllBinnenQuestions() : getAllSeeQuestions();
  const topic = topics.find((t) => t.id === topicId);
  if (!topic) return [];
  return allQuestions.filter((q) => topic.questionIds.includes(q.id));
}

function getTopicName(topicId: string, exam: ExamType): string {
  const topics = exam === 'binnen' ? binnenTopics : seeTopics;
  return topics.find((t) => t.id === topicId)?.name ?? topicId;
}

type AnswerKey = 'a' | 'b' | 'c' | 'd';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const exam = params.exam as ExamType;
  const topicId = params.topic as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerKey | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [progress, setProgress] = useState<UserProgress>({ questions: {}, topics: {}, lastUpdated: '' });
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0, total: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<{ key: AnswerKey; text: string; originalKey: AnswerKey }[]>([]);

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);

    const topicQuestions = getTopicQuestions(topicId, exam);
    const unpassed = topicQuestions.filter((q) => !isQuestionPassed(p, q.id, exam));
    const workQueue = unpassed.length > 0 ? unpassed : topicQuestions;
    setQuestions(shuffleArray(workQueue));
    setCurrentIdx(0);
  }, [topicId, exam]);

  useEffect(() => {
    if (questions.length > 0 && questions[currentIdx]) {
      const q = questions[currentIdx];
      const mapped = q.answers.map((a) => ({
        key: a.key as AnswerKey,
        text: a.text,
        originalKey: a.key as AnswerKey,
      }));
      setShuffledOptions(shuffleArray(mapped));
      setSelectedAnswer(null);
      setIsRevealed(false);
    }
  }, [currentIdx, questions]);

  const handleSelect = useCallback(
    (key: AnswerKey) => {
      if (isRevealed) return;

      const currentQuestion = questions[currentIdx];
      const isCorrect = key === currentQuestion.correctAnswer;

      setSelectedAnswer(key);
      setIsRevealed(true);

      const updatedProgress = recordAnswer(progress, currentQuestion.id, exam, isCorrect);
      setProgress(updatedProgress);
      saveProgress(updatedProgress);

      setSessionStats((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        wrong: prev.wrong + (isCorrect ? 0 : 1),
        total: prev.total + 1,
      }));
    },
    [isRevealed, questions, currentIdx, progress, exam],
  );

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= questions.length) {
      const topicQuestions = getTopicQuestions(topicId, exam);
      if (isTopicPassed(progress, topicQuestions.map((q) => q.id), exam)) {
        setIsComplete(true);
        return;
      }
      const unpassed = topicQuestions.filter((q) => !isQuestionPassed(progress, q.id, exam));
      if (unpassed.length === 0) {
        setIsComplete(true);
        return;
      }
      setQuestions(shuffleArray(unpassed));
      setCurrentIdx(0);
      return;
    }
    setCurrentIdx((prev) => prev + 1);
  }, [currentIdx, questions.length, topicId, exam, progress]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isRevealed) {
        handleNext();
      }
      if (!isRevealed) {
        const map: Record<string, AnswerKey> = { '1': 'a', '2': 'b', '3': 'c', '4': 'd' };
        if (map[e.key]) handleSelect(map[e.key]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isRevealed, handleNext, handleSelect]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--navy-deep)' }}>
        <div className="text-center">
          <div className="text-4xl mb-4">⚓</div>
          <p style={{ color: 'var(--muted)' }}>Lade Fragen...</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return <CompletionScreen exam={exam} topicId={topicId} sessionStats={sessionStats} />;
  }

  const currentQuestion = questions[currentIdx];
  const correctCount = getQuestionCorrectCount(progress, currentQuestion.id, exam);
  const topicQuestions = getTopicQuestions(topicId, exam);
  const topicProgress = getTopicProgress(progress, topicQuestions.map((q) => q.id), exam);
  const totalQuestions = topicQuestions.length;

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: 'var(--navy-deep)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/${exam}`}
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: 'var(--muted)' }}
          >
            ← {exam === 'binnen' ? 'SBF Binnen' : 'SBF See'}
          </Link>
          <div className="flex items-center gap-3">
            {sessionStats.total > 0 && (
              <>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(76, 175, 130, 0.15)', color: 'var(--green-signal)' }}>
                  ✓ {sessionStats.correct}
                </span>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(224, 82, 82, 0.15)', color: 'var(--red-signal)' }}>
                  ✗ {sessionStats.wrong}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Topic title */}
        <div className="mb-6">
          <h1 className="text-lg font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}>
            {getTopicName(topicId, exam)}
          </h1>
          <ProgressBar
            value={topicProgress.percentage}
            size="sm"
            color={topicProgress.percentage === 100 ? 'green' : 'gold'}
            showLabel
            label={`${topicProgress.passed}/${totalQuestions} bestanden`}
          />
        </div>

        {/* Question card */}
        <div
          className="rounded-2xl p-6 mb-4"
          style={{
            background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-muted) 100%)',
            border: '1px solid rgba(200, 169, 81, 0.2)',
          }}
        >
          {/* Question counter + correct count */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'rgba(200, 169, 81, 0.1)', color: 'var(--gold)' }}>
              Frage {currentIdx + 1} von {questions.length}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: CORRECT_THRESHOLD }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full border transition-all"
                  style={{
                    background: i < correctCount ? 'var(--green-signal)' : 'transparent',
                    borderColor: i < correctCount ? 'var(--green-signal)' : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Question number badge */}
          <div className="mb-4">
            <Badge variant="muted" size="sm">
              Frage {currentQuestion.id}
            </Badge>
            {currentQuestion.hasImage && (
              <Badge variant="blue" size="sm" className="ml-2">
                🖼 {currentQuestion.imageDescription}
              </Badge>
            )}
          </div>

          {/* Question text */}
          <h2 className="text-lg font-semibold leading-relaxed mb-6" style={{ color: 'var(--white)' }}>
            {currentQuestion.text}
          </h2>

          {/* Answer options */}
          <div className="space-y-3">
            {shuffledOptions.map((option, i) => {
              const isSelected = selectedAnswer === option.key;
              const isCorrectOption = option.originalKey === currentQuestion.correctAnswer;
              let className = 'answer-option flex items-start gap-3 p-4 rounded-xl border';
              let style: React.CSSProperties = {
                borderColor: 'rgba(200, 169, 81, 0.15)',
                background: 'rgba(255,255,255,0.03)',
              };

              if (isRevealed) {
                className += ' disabled';
                if (isCorrectOption) {
                  className += ' correct';
                  style = {};
                } else if (isSelected && !isCorrectOption) {
                  className += ' wrong';
                  style = {};
                }
              }

              return (
                <button
                  key={option.key}
                  onClick={() => handleSelect(option.key)}
                  className={`w-full text-left ${className}`}
                  style={style}
                  disabled={isRevealed}
                >
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{
                      background: isRevealed && isCorrectOption
                        ? 'var(--green-signal)'
                        : isRevealed && isSelected && !isCorrectOption
                          ? 'var(--red-signal)'
                          : 'rgba(200, 169, 81, 0.15)',
                      color: isRevealed && (isCorrectOption || (isSelected && !isCorrectOption))
                        ? 'white'
                        : 'var(--gold)',
                    }}
                  >
                    {['A', 'B', 'C', 'D'][i]}
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: 'var(--white)' }}>
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isRevealed && (
            <div
              className="mt-4 p-3 rounded-lg flex items-center justify-between gap-3"
              style={{
                background: selectedAnswer === currentQuestion.correctAnswer
                  ? 'rgba(76, 175, 130, 0.1)'
                  : 'rgba(224, 82, 82, 0.1)',
                border: `1px solid ${selectedAnswer === currentQuestion.correctAnswer ? 'rgba(76, 175, 130, 0.3)' : 'rgba(224, 82, 82, 0.3)'}`,
              }}
            >
              <span
                className="text-sm font-medium"
                style={{
                  color: selectedAnswer === currentQuestion.correctAnswer
                    ? 'var(--green-signal)'
                    : 'var(--red-signal)',
                }}
              >
                {selectedAnswer === currentQuestion.correctAnswer
                  ? `✓ Richtig! (${Math.min(correctCount + 1, CORRECT_THRESHOLD)}/${CORRECT_THRESHOLD})`
                  : `✗ Falsch – Richtig wäre Antwort A`}
              </span>
              <button
                onClick={handleNext}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                style={{
                  background: 'var(--gold)',
                  color: 'var(--navy-deepest)',
                }}
              >
                Weiter →
              </button>
            </div>
          )}
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-xs" style={{ color: 'rgba(143, 168, 200, 0.4)' }}>
          Tastatur: 1-4 auswählen · Enter = weiter
        </p>
      </div>
    </div>
  );
}

function CompletionScreen({
  exam,
  topicId,
  sessionStats,
}: {
  exam: ExamType;
  topicId: string;
  sessionStats: { correct: number; wrong: number; total: number };
}) {
  const topicName = getTopicName(topicId, exam);
  const accuracy = sessionStats.total > 0
    ? Math.round((sessionStats.correct / sessionStats.total) * 100)
    : 0;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--navy-deep)' }}>
      <div
        className="max-w-md w-full p-8 rounded-2xl text-center"
        style={{
          background: 'linear-gradient(135deg, var(--navy), var(--navy-muted))',
          border: '1px solid rgba(76, 175, 130, 0.3)',
        }}
      >
        <div className="text-6xl mb-4">🏆</div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: 'Playfair Display, serif', color: 'var(--gold)' }}
        >
          Thema bestanden!
        </h2>
        <p className="text-lg mb-6" style={{ color: 'var(--white)' }}>
          {topicName}
        </p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Richtig', value: sessionStats.correct, color: 'var(--green-signal)' },
            { label: 'Falsch', value: sessionStats.wrong, color: 'var(--red-signal)' },
            { label: 'Genauigkeit', value: `${accuracy}%`, color: 'var(--gold)' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <div className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href={`/${exam}`}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
              color: 'var(--navy-deepest)',
            }}
          >
            ← Zurück zur Übersicht
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90"
            style={{
              background: 'rgba(200, 169, 81, 0.1)',
              border: '1px solid rgba(200, 169, 81, 0.2)',
              color: 'var(--gold)',
            }}
          >
            🔄 Nochmals üben
          </button>
        </div>
      </div>
    </div>
  );
}
