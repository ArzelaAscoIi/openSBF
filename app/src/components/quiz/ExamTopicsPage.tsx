'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TopicCard } from '@/components/quiz/TopicCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/hooks/useAuth';
import {
  loadProgress,
  getTopicProgress,
  isTopicPassed,
  getExamOverallProgress,
  getHardestQuestions,
} from '@/lib/progress';
import type { ExamType, Topic, Question, AccentColor, TopicProgressEntry } from '@/lib/types';

const FREE_TOPICS_LIMIT = 1;

interface ExamTopicsPageProps {
  exam: ExamType;
  topics: Topic[];
  getAllQuestions: () => Question[];
  title: string;
  subtitle: string;
  accentColor: AccentColor;
  explanationContent: React.ReactNode;
}

function computeExamProgress(
  exam: ExamType,
  topics: Topic[],
  getAllQuestions: () => Question[],
): { overall: { passed: number; total: number; percentage: number }; progressData: Record<string, TopicProgressEntry>; hardCount: number } {
  const progress = loadProgress();
  const allQuestions = getAllQuestions();
  const allIds = allQuestions.map((q) => q.id);
  const progressData: Record<string, TopicProgressEntry> = {};

  topics.forEach((topic) => {
    const tp = getTopicProgress(progress, topic.questionIds, exam);
    progressData[topic.id] = { ...tp, isPassed: isTopicPassed(progress, topic.questionIds, exam) };
  });

  const hardCount = getHardestQuestions(progress, exam, allQuestions).length;
  return { overall: getExamOverallProgress(progress, allIds, exam), progressData, hardCount };
}

export function ExamTopicsPage({
  exam,
  topics,
  getAllQuestions,
  title,
  subtitle,
  accentColor,
  explanationContent,
}: ExamTopicsPageProps): React.ReactElement {
  const [{ overall, progressData, hardCount }] = useState(() =>
    computeExamProgress(exam, topics, getAllQuestions),
  );
  const { user, loading } = useAuth();

  const passedTopics = Object.values(progressData).filter((p) => p.isPassed).length;

  const accentVar = accentColor === 'gold' ? 'var(--gold)' : 'var(--seafoam)';
  const accentBg = accentColor === 'gold' ? 'rgba(188, 147, 50, 0.08)' : 'rgba(38, 136, 164, 0.08)';
  const accentBorder = accentColor === 'gold' ? 'rgba(188, 147, 50, 0.18)' : 'rgba(38, 136, 164, 0.18)';
  const lockBannerBorder = accentColor === 'gold' ? 'rgba(188, 147, 50, 0.25)' : 'rgba(38, 136, 164, 0.25)';

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy-deep)' }}>
      <div className="border-b px-4 py-10" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="text-xs font-medium mb-6 inline-block transition-opacity hover:opacity-70"
            style={{ color: 'var(--muted)' }}
          >
            ← Start
          </Link>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1
                className="text-3xl font-bold mb-1"
                style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
              >
                {title}
              </h1>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {subtitle}
              </p>
            </div>

            <div
              className="px-4 py-2.5 rounded-lg text-center"
              style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
            >
              <div className="text-xl font-bold tabular-nums" style={{ color: accentVar }}>
                {passedTopics} / {topics.length}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                Themen bestanden
              </div>
            </div>
          </div>

          <div className="mt-6 max-w-sm">
            <ProgressBar
              value={overall.percentage}
              showLabel
              label={`${overall.passed} von ${overall.total} Fragen`}
              size="md"
              color={accentColor}
              animated={overall.percentage > 0 && overall.percentage < 100}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
            Themengebiete
          </h2>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            3× richtig = bestanden
          </span>
        </div>

        {!loading && !user && (
          <div
            className="mb-5 px-4 py-3 rounded-lg flex items-center gap-3"
            style={{ background: accentBg, border: `1px solid ${lockBannerBorder}` }}
          >
            <span style={{ color: accentVar }}>🔒</span>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Nur das erste Thema ist ohne Konto verfügbar.{' '}
              <Link href="/auth/login" className="underline" style={{ color: accentVar }}>
                Jetzt anmelden
              </Link>{' '}
              um alle {topics.length} Themen freizuschalten.
            </p>
          </div>
        )}

        {hardCount > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--white)' }}>
              Deine Problemfragen
            </h2>
            <Link
              href={`/ueben/${exam}/schwierige-fragen`}
              className="flex items-center justify-between p-4 rounded-xl transition-opacity hover:opacity-80"
              style={{
                background: 'rgba(232, 68, 68, 0.07)',
                border: '1px solid rgba(232, 68, 68, 0.22)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                  style={{ background: 'rgba(232, 68, 68, 0.12)', color: 'var(--red-signal)' }}
                >
                  ✗
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                    Problemfragen wiederholen
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {hardCount} {hardCount === 1 ? 'Frage' : 'Fragen'} häufig falsch beantwortet
                  </p>
                </div>
              </div>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>→</span>
            </Link>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          {topics
            .filter((t) => (progressData[t.id]?.total ?? 0) > 0)
            .map((topic, index) => {
              const pd = progressData[topic.id] ?? { passed: 0, total: 0, percentage: 0, isPassed: false };
              const isLocked = !loading && !user && index >= FREE_TOPICS_LIMIT;
              return (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  passed={pd.passed}
                  total={pd.total}
                  percentage={pd.percentage}
                  isPassed={pd.isPassed}
                  exam={exam}
                  locked={isLocked}
                />
              );
            })}
        </div>

        <div
          className="mt-8 p-5 rounded-xl"
          style={{ background: 'var(--navy)', border: '1px solid var(--border)' }}
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--white)' }}>
            So funktioniert die Prüfungsvorbereitung
          </h3>
          <ul className="text-xs space-y-2" style={{ color: 'var(--muted)' }}>
            {explanationContent}
          </ul>
        </div>
      </div>
    </div>
  );
}
