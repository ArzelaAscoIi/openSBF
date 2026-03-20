'use client';

import Link from 'next/link';
import type { Topic } from '@/lib/types';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface TopicCardProps {
  topic: Topic;
  passed: number;
  total: number;
  percentage: number;
  isPassed: boolean;
  exam: 'binnen' | 'see';
}

export function TopicCard({ topic, passed, total, percentage, isPassed, exam }: TopicCardProps) {
  return (
    <Link
      href={`/ueben/${exam}/${topic.id}`}
      className="block p-4 rounded-xl transition-all nautical-card"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5 shrink-0">{topic.icon}</span>
          <div>
            <h3 className="text-sm font-semibold leading-snug" style={{ color: 'var(--white)' }}>
              {topic.name}
            </h3>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--muted)' }}>
              {topic.description}
            </p>
          </div>
        </div>
        {isPassed && (
          <span
            className="shrink-0 text-xs font-medium px-2 py-0.5 rounded"
            style={{
              background: 'rgba(18, 184, 112, 0.12)',
              color: 'var(--green-signal)',
              border: '1px solid rgba(18, 184, 112, 0.25)',
            }}
          >
            Bestanden
          </span>
        )}
      </div>

      <ProgressBar
        value={percentage}
        size="sm"
        color={isPassed ? 'green' : 'gold'}
        className="mb-2"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {passed} / {total} Fragen
        </span>
        <span
          className="text-xs font-medium tabular-nums"
          style={{ color: isPassed ? 'var(--green-signal)' : 'var(--muted)' }}
        >
          {percentage}%
        </span>
      </div>
    </Link>
  );
}
