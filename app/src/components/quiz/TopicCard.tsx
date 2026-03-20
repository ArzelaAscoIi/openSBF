'use client';

import Link from 'next/link';
import type { Topic } from '@/lib/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';

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
      className="block p-5 rounded-xl transition-all duration-200 hover:scale-[1.02] nautical-card"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{topic.icon}</span>
          <div>
            <h3 className="font-semibold text-sm leading-tight" style={{ color: 'var(--white)' }}>
              {topic.name}
            </h3>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--muted)' }}>
              {topic.description}
            </p>
          </div>
        </div>
        {isPassed && (
          <Badge variant="green" size="sm" className="shrink-0">
            ✓ Bestanden
          </Badge>
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
          {passed} / {total} Fragen bestanden
        </span>
        <span
          className="text-xs font-semibold"
          style={{ color: isPassed ? 'var(--green-signal)' : 'var(--gold)' }}
        >
          {percentage}%
        </span>
      </div>
    </Link>
  );
}
