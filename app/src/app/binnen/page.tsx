'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TopicCard } from '@/components/quiz/TopicCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { binnenTopics, getAllBinnenQuestions } from '@/data/topics';
import { loadProgress, getTopicProgress, isTopicPassed, getExamOverallProgress } from '@/lib/progress';
import { useAuth } from '@/hooks/useAuth';

const FREE_TOPICS_LIMIT = 1;

type TopicProgressEntry = { passed: number; total: number; percentage: number; isPassed: boolean };

function computeProgress() {
  const progress = loadProgress();
  const allIds = getAllBinnenQuestions().map((q) => q.id);
  const data: Record<string, TopicProgressEntry> = {};
  binnenTopics.forEach((topic) => {
    const tp = getTopicProgress(progress, topic.questionIds, 'binnen');
    data[topic.id] = { ...tp, isPassed: isTopicPassed(progress, topic.questionIds, 'binnen') };
  });
  return { overall: getExamOverallProgress(progress, allIds, 'binnen'), progressData: data };
}

export default function BinnenPage() {
  const [{ overall, progressData }] = useState(computeProgress);
  const { user, loading } = useAuth();

  const passedTopics = Object.values(progressData).filter((p) => p.isPassed).length;

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy-deep)' }}>
      {/* Header */}
      <div
        className="border-b px-4 py-10"
        style={{ borderColor: 'var(--border)' }}
      >
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
                SBF Binnen
              </h1>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Sportbootführerschein Binnenschifffahrtsstraßen
              </p>
            </div>

            <div
              className="px-4 py-2.5 rounded-lg text-center"
              style={{
                background: 'rgba(188, 147, 50, 0.08)',
                border: '1px solid rgba(188, 147, 50, 0.18)',
              }}
            >
              <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--gold)' }}>
                {passedTopics} / {binnenTopics.length}
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
              animated={overall.percentage > 0 && overall.percentage < 100}
            />
          </div>
        </div>
      </div>

      {/* Topics */}
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
            style={{
              background: 'rgba(188, 147, 50, 0.08)',
              border: '1px solid rgba(188, 147, 50, 0.25)',
            }}
          >
            <span style={{ color: 'var(--gold)' }}>🔒</span>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Nur das erste Thema ist ohne Konto verfügbar.{' '}
              <Link href="/auth/login" className="underline" style={{ color: 'var(--gold)' }}>
                Jetzt anmelden
              </Link>{' '}
              um alle {binnenTopics.length} Themen freizuschalten.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          {binnenTopics
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
                  exam="binnen"
                  locked={isLocked}
                />
              );
            })}
        </div>

        <div
          className="mt-8 p-5 rounded-xl"
          style={{
            background: 'var(--navy)',
            border: '1px solid var(--border)',
          }}
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--white)' }}>
            So funktioniert die Prüfungsvorbereitung
          </h3>
          <ul className="text-xs space-y-2" style={{ color: 'var(--muted)' }}>
            <li>Jede Frage hat 4 Antwortmöglichkeiten — nur eine ist richtig</li>
            <li>
              Du musst jede Frage{' '}
              <span style={{ color: 'var(--white)' }}>3× richtig</span> beantworten, um sie zu bestehen
            </li>
            <li>Ein Thema gilt als bestanden, wenn alle Fragen darin bestanden sind</li>
            <li>Dein Fortschritt wird automatisch im Browser gespeichert</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
