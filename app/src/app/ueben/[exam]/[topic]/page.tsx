'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
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

type QuestionView = {
  options: { key: AnswerKey; text: string; originalKey: AnswerKey }[];
  selectedAnswer: AnswerKey | null;
  isRevealed: boolean;
};

type QuizState = {
  progress: UserProgress;
  questions: Question[];
  currentIdx: number;
  view: QuestionView;
};

function makeView(question: Question): QuestionView {
  const options = shuffleArray(
    question.answers.map((a) => ({ key: a.key as AnswerKey, text: a.text, originalKey: a.key as AnswerKey })),
  );
  return { options, selectedAnswer: null, isRevealed: false };
}

function initQuizState(topicId: string, exam: ExamType, initialQ: number): QuizState {
  const progress = loadProgress();
  const topicQuestions = getTopicQuestions(topicId, exam);
  const unpassed = topicQuestions.filter((q) => !isQuestionPassed(progress, q.id, exam));
  const questions = shuffleArray(unpassed.length > 0 ? unpassed : topicQuestions);
  const currentIdx = initialQ > 0 && initialQ < questions.length ? initialQ : 0;
  const view = questions[currentIdx] ? makeView(questions[currentIdx]) : { options: [], selectedAnswer: null, isRevealed: false };
  return { progress, questions, currentIdx, view };
}

export default function QuizPage() {
  const params = useParams();
  const exam = params.exam as ExamType;
  const topicId = params.topic as string;

  const initialQ = typeof window !== 'undefined' ? parseInt(new URLSearchParams(window.location.search).get('q') ?? '0', 10) : 0;

  const [{ progress, questions, currentIdx, view }, setQuiz] = useState<QuizState>(() =>
    initQuizState(topicId, exam, initialQ),
  );
  const { options: shuffledOptions, selectedAnswer, isRevealed } = view;

  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0, total: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (questions.length === 0) return;
    window.history.replaceState(null, '', `?q=${currentIdx}`);
  }, [currentIdx, questions.length]);

  const handleSelect = useCallback(
    (key: AnswerKey) => {
      if (isRevealed) return;

      const currentQuestion = questions[currentIdx];
      const isCorrect = key === currentQuestion.correctAnswer;
      const updatedProgress = recordAnswer(progress, currentQuestion.id, exam, isCorrect);
      saveProgress(updatedProgress);

      setQuiz((prev) => ({
        ...prev,
        progress: updatedProgress,
        view: { ...prev.view, selectedAnswer: key, isRevealed: true },
      }));
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
      const newQuestions = shuffleArray(unpassed);
      setQuiz((prev) => ({ ...prev, questions: newQuestions, currentIdx: 0, view: makeView(newQuestions[0]) }));
      return;
    }
    setQuiz((prev) => ({
      ...prev,
      currentIdx: prev.currentIdx + 1,
      view: makeView(prev.questions[prev.currentIdx + 1]),
    }));
  }, [currentIdx, questions, topicId, exam, progress]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isRevealed) {
        handleNext();
        return;
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
          <div
            className="w-10 h-10 rounded-full mx-auto mb-4"
            style={{ background: 'var(--navy)', border: '1px solid var(--border)' }}
          />
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Lade Fragen…</p>
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
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/${exam}`}
            className="text-xs font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--muted)' }}
          >
            ← {exam === 'binnen' ? 'SBF Binnen' : 'SBF See'}
          </Link>
          {sessionStats.total > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span
                className="px-2 py-0.5 rounded"
                style={{ background: 'rgba(18, 184, 112, 0.10)', color: 'var(--green-signal)' }}
              >
                {sessionStats.correct} ✓
              </span>
              <span
                className="px-2 py-0.5 rounded"
                style={{ background: 'rgba(232, 68, 68, 0.10)', color: 'var(--red-signal)' }}
              >
                {sessionStats.wrong} ✗
              </span>
            </div>
          )}
        </div>

        {/* Topic + progress */}
        <div className="mb-5">
          <h1 className="text-base font-semibold mb-2" style={{ color: 'var(--white)' }}>
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
          className="rounded-xl p-6 mb-3"
          style={{
            background: 'var(--navy)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Meta row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Badge variant="muted" size="sm">#{currentQuestion.id}</Badge>
              {currentQuestion.hasImage && !currentQuestion.imagePath && (
                <Badge variant="blue" size="sm">{currentQuestion.imageDescription}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                {currentIdx + 1}/{questions.length}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: CORRECT_THRESHOLD }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full border transition-all"
                    style={{
                      background: i < correctCount ? 'var(--green-signal)' : 'transparent',
                      borderColor: i < correctCount ? 'var(--green-signal)' : 'rgba(255,255,255,0.15)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Question image */}
          {currentQuestion.imagePath && (
            <div className="mb-5 flex justify-center">
              <Image
                src={currentQuestion.imagePath}
                alt={currentQuestion.imageDescription ?? ''}
                width={400}
                height={300}
                className="rounded-lg max-h-48 w-auto object-contain"
                style={{
                  background: 'white',
                  padding: '8px',
                  border: '1px solid var(--border)',
                }}
              />
            </div>
          )}

          {/* Question text */}
          <h2 className="text-base font-medium leading-relaxed mb-6" style={{ color: 'var(--white)' }}>
            {currentQuestion.text}
          </h2>

          {/* Answer options */}
          <div className="space-y-2">
            {shuffledOptions.map((option, i) => {
              const isSelected = selectedAnswer === option.key;
              const isCorrectOption = option.originalKey === currentQuestion.correctAnswer;
              let className = 'answer-option flex items-start gap-3 p-3.5 rounded-lg border w-full text-left';
              let style: React.CSSProperties = {
                borderColor: 'var(--border)',
                background: 'transparent',
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
                  className={className}
                  style={style}
                  disabled={isRevealed}
                >
                  <span
                    className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-semibold mt-0.5"
                    style={{
                      background:
                        isRevealed && isCorrectOption
                          ? 'var(--green-signal)'
                          : isRevealed && isSelected && !isCorrectOption
                            ? 'var(--red-signal)'
                            : 'rgba(255,255,255,0.06)',
                      color:
                        isRevealed && (isCorrectOption || (isSelected && !isCorrectOption))
                          ? 'white'
                          : 'var(--muted)',
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
              className="mt-4 px-4 py-3 rounded-lg"
              style={{
                background:
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'rgba(18, 184, 112, 0.08)'
                    : 'rgba(232, 68, 68, 0.08)',
                border: `1px solid ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'rgba(18, 184, 112, 0.25)'
                    : 'rgba(232, 68, 68, 0.25)'
                }`,
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="text-sm font-medium"
                  style={{
                    color:
                      selectedAnswer === currentQuestion.correctAnswer
                        ? 'var(--green-signal)'
                        : 'var(--red-signal)',
                  }}
                >
                  {selectedAnswer === currentQuestion.correctAnswer
                    ? 'Richtig'
                    : `Falsch — Richtig wäre Antwort ${['A', 'B', 'C', 'D'][shuffledOptions.findIndex((o) => o.originalKey === currentQuestion.correctAnswer)]}`}
                </span>
                <button
                  onClick={handleNext}
                  className="shrink-0 px-4 py-1.5 rounded-md text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{
                    background: 'var(--gold)',
                    color: 'var(--navy-deepest)',
                  }}
                >
                  Weiter →
                </button>
              </div>
              {selectedAnswer !== currentQuestion.correctAnswer && currentQuestion.hint && (
                <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {currentQuestion.hint}
                </p>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs" style={{ color: 'rgba(106, 136, 168, 0.4)' }}>
          1–4 auswählen · Enter = weiter
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
  const accuracy = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--navy-deep)' }}>
      <div
        className="max-w-sm w-full p-8 rounded-xl"
        style={{
          background: 'var(--navy)',
          border: '1px solid rgba(18, 184, 112, 0.25)',
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl mb-5 mx-auto"
          style={{ background: 'rgba(18, 184, 112, 0.12)', color: 'var(--green-signal)' }}
        >
          ✓
        </div>

        <h2
          className="text-xl font-bold mb-1 text-center"
          style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
        >
          Thema bestanden
        </h2>
        <p className="text-sm mb-7 text-center" style={{ color: 'var(--muted)' }}>
          {topicName}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-7">
          {[
            { label: 'Richtig',    value: sessionStats.correct, color: 'var(--green-signal)' },
            { label: 'Falsch',     value: sessionStats.wrong,   color: 'var(--red-signal)' },
            { label: 'Genauigkeit', value: `${accuracy}%`,      color: 'var(--gold)' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-3 rounded-lg text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
            >
              <div className="text-xl font-bold tabular-nums" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href={`/${exam}`}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-center transition-opacity hover:opacity-90"
            style={{ background: 'var(--gold)', color: 'var(--navy-deepest)' }}
          >
            Zur Übersicht
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
            }}
          >
            Nochmals üben
          </button>
        </div>
      </div>
    </div>
  );
}
