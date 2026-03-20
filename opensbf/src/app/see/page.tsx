'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TopicCard } from '@/components/quiz/TopicCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { seeTopics, getAllSeeQuestions } from '@/data/topics';
import { loadProgress, getTopicProgress, isTopicPassed, getExamOverallProgress } from '@/lib/progress';

export default function SeePage() {
  const [progressData, setProgressData] = useState<
    Record<string, { passed: number; total: number; percentage: number; isPassed: boolean }>
  >({});
  const [overall, setOverall] = useState({ passed: 0, total: 0, percentage: 0 });

  useEffect(() => {
    const progress = loadProgress();
    const allIds = getAllSeeQuestions().map((q) => q.id);
    setOverall(getExamOverallProgress(progress, allIds, 'see'));

    const data: typeof progressData = {};
    seeTopics.forEach((topic) => {
      const tp = getTopicProgress(progress, topic.questionIds, 'see');
      data[topic.id] = { ...tp, isPassed: isTopicPassed(progress, topic.questionIds, 'see') };
    });
    setProgressData(data);
  }, []);

  const passedTopics = Object.values(progressData).filter((p) => p.isPassed).length;

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy-deep)' }}>
      {/* Header */}
      <div
        className="relative py-16 px-4 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(5, 14, 26, 0.8) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(78, 184, 184, 0.15)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, #0a3d6b, var(--seafoam), #0a3d6b)' }}
        />
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--muted)' }}>
              ← Start
            </Link>
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🌊</span>
                <h1
                  className="text-4xl font-bold"
                  style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
                >
                  SBF See
                </h1>
              </div>
              <p style={{ color: 'var(--muted)' }}>
                Sportbootführerschein Seeschifffahrtsstraßen
              </p>
            </div>
            <div
              className="px-5 py-3 rounded-xl text-center"
              style={{
                background: 'rgba(78, 184, 184, 0.1)',
                border: '1px solid rgba(78, 184, 184, 0.2)',
              }}
            >
              <div className="text-2xl font-bold" style={{ color: 'var(--seafoam)' }}>
                {passedTopics} / {seeTopics.length}
              </div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                Themen bestanden
              </div>
            </div>
          </div>

          <div className="mt-6 max-w-md">
            <ProgressBar
              value={overall.percentage}
              showLabel
              label={`${overall.passed} von ${overall.total} Fragen bestanden`}
              size="lg"
              color="seafoam"
              animated={overall.percentage > 0 && overall.percentage < 100}
            />
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--white)' }}>
            Themengebiete
          </h2>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            3× richtig = bestanden
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {seeTopics
            .filter((t) => (progressData[t.id]?.total ?? 0) > 0)
            .map((topic) => {
              const pd = progressData[topic.id] ?? { passed: 0, total: 0, percentage: 0, isPassed: false };
              return (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  passed={pd.passed}
                  total={pd.total}
                  percentage={pd.percentage}
                  isPassed={pd.isPassed}
                  exam="see"
                />
              );
            })}
        </div>

        <div
          className="mt-10 p-5 rounded-xl"
          style={{
            background: 'rgba(17, 34, 64, 0.5)',
            border: '1px solid rgba(78, 184, 184, 0.1)',
          }}
        >
          <h3 className="font-semibold mb-2" style={{ color: 'var(--seafoam)' }}>
            ℹ️ Besonderheiten SBF See
          </h3>
          <ul className="text-sm space-y-1.5" style={{ color: 'var(--muted)' }}>
            <li>• Basisfragen (1–72) sind identisch mit SBF Binnen</li>
            <li>• Spezifische Fragen See umfassen KVR, Seezeichen, Schallzeichen und Navigation</li>
            <li>• Navigationsaufgaben erfordern Kenntnisse in Kursberechnung und Kompasskorrektur</li>
            <li>• 3× richtig pro Frage für einen bestandenen Themenblock</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
