'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TopicCard } from '@/components/quiz/TopicCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { seeTopics, getAllSeeQuestions } from '@/data/topics';
import { loadProgress, getTopicProgress, isTopicPassed, getExamOverallProgress } from '@/lib/progress';
import { useAuth } from '@/hooks/useAuth';

const FREE_TOPICS_LIMIT = 1;

type TopicProgressEntry = { passed: number; total: number; percentage: number; isPassed: boolean };

function computeProgress() {
  const progress = loadProgress();
  const allIds = getAllSeeQuestions().map((q) => q.id);
  const data: Record<string, TopicProgressEntry> = {};
  seeTopics.forEach((topic) => {
    const tp = getTopicProgress(progress, topic.questionIds, 'see');
    data[topic.id] = { ...tp, isPassed: isTopicPassed(progress, topic.questionIds, 'see') };
  });
  return { overall: getExamOverallProgress(progress, allIds, 'see'), progressData: data };
}

export default function SeePage() {
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
                SBF See
              </h1>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Sportbootführerschein Seeschifffahrtsstraßen
              </p>
            </div>

            <div
              className="px-4 py-2.5 rounded-lg text-center"
              style={{
                background: 'rgba(38, 136, 164, 0.08)',
                border: '1px solid rgba(38, 136, 164, 0.18)',
              }}
            >
              <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--seafoam)' }}>
                {passedTopics} / {seeTopics.length}
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
              color="seafoam"
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
              background: 'rgba(38, 136, 164, 0.08)',
              border: '1px solid rgba(38, 136, 164, 0.25)',
            }}
          >
            <span style={{ color: 'var(--seafoam)' }}>🔒</span>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Nur das erste Thema ist ohne Konto verfügbar.{' '}
              <Link href="/auth/login" className="underline" style={{ color: 'var(--seafoam)' }}>
                Jetzt anmelden
              </Link>{' '}
              um alle {seeTopics.length} Themen freizuschalten.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          {seeTopics
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
                  exam="see"
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
            Besonderheiten SBF See
          </h3>
          <ul className="text-xs space-y-2" style={{ color: 'var(--muted)' }}>
            <li>Basisfragen (1–72) sind identisch mit SBF Binnen</li>
            <li>Spezifische Fragen umfassen KVR, Seezeichen, Schallzeichen und Navigation</li>
            <li>Navigationsaufgaben erfordern Kenntnisse in Kursberechnung und Kompasskorrektur</li>
            <li>
              <span style={{ color: 'var(--white)' }}>3× richtig</span> pro Frage für einen bestandenen Themenblock
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
