'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TopicCard } from '@/components/quiz/TopicCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { binnenTopics, getAllBinnenQuestions } from '@/data/topics';
import { loadProgress, getTopicProgress, isTopicPassed, getExamOverallProgress } from '@/lib/progress';

export default function BinnenPage() {
  const [progressData, setProgressData] = useState<
    Record<string, { passed: number; total: number; percentage: number; isPassed: boolean }>
  >({});
  const [overall, setOverall] = useState({ passed: 0, total: 0, percentage: 0 });

  useEffect(() => {
    const progress = loadProgress();
    const allIds = getAllBinnenQuestions().map((q) => q.id);
    setOverall(getExamOverallProgress(progress, allIds, 'binnen'));

    const data: typeof progressData = {};
    binnenTopics.forEach((topic) => {
      const tp = getTopicProgress(progress, topic.questionIds, 'binnen');
      data[topic.id] = { ...tp, isPassed: isTopicPassed(progress, topic.questionIds, 'binnen') };
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
          borderBottom: '1px solid rgba(200, 169, 81, 0.1)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-dark))' }}
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
                <span className="text-4xl">🏞️</span>
                <h1
                  className="text-4xl font-bold"
                  style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
                >
                  SBF Binnen
                </h1>
              </div>
              <p style={{ color: 'var(--muted)' }}>
                Sportbootführerschein Binnenschifffahrtsstraßen
              </p>
            </div>
            <div
              className="px-5 py-3 rounded-xl text-center"
              style={{
                background: 'rgba(200, 169, 81, 0.1)',
                border: '1px solid rgba(200, 169, 81, 0.2)',
              }}
            >
              <div className="text-2xl font-bold" style={{ color: 'var(--gold)' }}>
                {passedTopics} / {binnenTopics.length}
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
          {binnenTopics
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
                  exam="binnen"
                />
              );
            })}
        </div>

        {/* Info box */}
        <div
          className="mt-10 p-5 rounded-xl"
          style={{
            background: 'rgba(17, 34, 64, 0.5)',
            border: '1px solid rgba(200, 169, 81, 0.1)',
          }}
        >
          <h3 className="font-semibold mb-2" style={{ color: 'var(--gold)' }}>
            ℹ️ So funktioniert die Prüfungsvorbereitung
          </h3>
          <ul className="text-sm space-y-1.5" style={{ color: 'var(--muted)' }}>
            <li>• Jede Frage hat 4 Antwortmöglichkeiten – nur eine ist richtig (immer Antwort A im Original)</li>
            <li>• Du musst jede Frage <strong style={{ color: 'var(--gold)' }}>3× richtig</strong> beantworten um sie zu bestehen</li>
            <li>• Ein Thema gilt als bestanden, wenn alle Fragen darin bestanden sind</li>
            <li>• Dein Fortschritt wird automatisch in deinem Browser gespeichert</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
