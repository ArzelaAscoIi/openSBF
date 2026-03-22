'use client';

import { useState } from 'react';
import Link from 'next/link';
import { seePruefungsboegen } from '@/data/pruefungsboegen';
import { loadProgress, getBestExamResult, getLastExamResult } from '@/lib/progress';
import type { ExamResult, UserProgress } from '@/lib/types';

const PASS_MAX_WRONG = 3;

interface PbCardProps {
  nummer: number;
  best: ExamResult | null;
  last: ExamResult | null;
}

function PbCard({ nummer, best, last }: PbCardProps): React.ReactElement {
  const numStr = String(nummer).padStart(2, '0');
  const attempted = last !== null;
  const passed    = best?.passed ?? false;

  let borderColor = 'var(--border)';
  if (attempted) borderColor = passed ? 'rgba(18,184,112,0.25)' : 'rgba(232,68,68,0.20)';

  return (
    <Link
      href={`/see/pruefungsboegen/${nummer}`}
      className="group flex flex-col rounded-xl p-4 transition-all hover:opacity-90"
      style={{ background: 'var(--navy)', border: `1px solid ${borderColor}` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Bogen</span>
          <div
            className="text-2xl font-bold tabular-nums"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--seafoam-light)' }}
          >
            {numStr}
          </div>
        </div>

        {attempted && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold mt-0.5"
            style={{
              background: passed ? 'rgba(18,184,112,0.12)' : 'rgba(232,68,68,0.10)',
              color: passed ? 'var(--green-signal)' : 'var(--red-signal)',
            }}
          >
            {passed ? 'Bestanden' : 'Nicht best.'}
          </span>
        )}
      </div>

      {attempted && best ? (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: 'var(--muted)' }}>Bestes Ergebnis</span>
            <span
              className="font-semibold tabular-nums"
              style={{ color: best.passed ? 'var(--green-signal)' : 'var(--red-signal)' }}
            >
              {best.correct}/30
            </span>
          </div>
          {last !== best && (
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: 'var(--muted)' }}>Letzter Versuch</span>
              <span
                className="tabular-nums"
                style={{ color: last!.passed ? 'var(--green-signal)' : 'rgba(232,68,68,0.80)' }}
              >
                {last!.correct}/30
              </span>
            </div>
          )}
          {/* mini progress bar */}
          <div
            className="mt-2 h-1 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${(best.correct / 30) * 100}%`,
                background: best.passed ? 'var(--green-signal)' : 'var(--red-signal)',
              }}
            />
          </div>
        </div>
      ) : (
        <span className="text-xs" style={{ color: 'rgba(106,136,168,0.5)' }}>
          Noch nicht versucht
        </span>
      )}
    </Link>
  );
}

export default function PruefungsboegePage(): React.ReactElement {
  const [progress] = useState<UserProgress | null>(() => {
    if (typeof window === 'undefined') return null;
    return loadProgress();
  });

  const attempted  = seePruefungsboegen.filter((pb) =>
    progress ? (getBestExamResult(progress, pb.nummer) !== null) : false,
  ).length;
  const passedCount = seePruefungsboegen.filter((pb) =>
    progress ? (getBestExamResult(progress, pb.nummer)?.passed === true) : false,
  ).length;

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: 'var(--navy-deep)' }}>
      <div className="max-w-2xl mx-auto">
        <Link
          href="/see"
          className="text-xs font-medium transition-opacity hover:opacity-70 mb-8 inline-block"
          style={{ color: 'var(--muted)' }}
        >
          ← SBF See
        </Link>

        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
          >
            Prüfungsbögen
          </h1>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
            15 offizielle Prüfungsbögen nach ELWIS-Fragenkatalog — je 30 Fragen.
            Bestanden bei max. {PASS_MAX_WRONG} Fehlern (≥{30 - PASS_MAX_WRONG}/30 richtig).
          </p>

          {progress !== null && attempted > 0 && (
            <div
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm"
              style={{ background: 'var(--navy)', border: '1px solid var(--border)' }}
            >
              <div className="text-center">
                <div className="font-bold tabular-nums" style={{ color: 'var(--white)' }}>
                  {attempted}/15
                </div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>versucht</div>
              </div>
              <div className="w-px self-stretch" style={{ background: 'var(--border)' }} />
              <div className="text-center">
                <div className="font-bold tabular-nums" style={{ color: passedCount > 0 ? 'var(--green-signal)' : 'var(--muted)' }}>
                  {passedCount}/15
                </div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>bestanden</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {seePruefungsboegen.map((pb) => (
            <PbCard
              key={pb.nummer}
              nummer={pb.nummer}
              best={progress ? getBestExamResult(progress, pb.nummer) : null}
              last={progress ? getLastExamResult(progress, pb.nummer) : null}
            />
          ))}
        </div>

        <div
          className="mt-8 px-4 py-3 rounded-lg text-xs leading-relaxed"
          style={{
            background: 'rgba(38, 136, 164, 0.06)',
            border: '1px solid rgba(38, 136, 164, 0.15)',
            color: 'var(--muted)',
          }}
        >
          Einer dieser 15 Bögen wird in der Prüfung vorgelegt. Antworten erscheinen in
          zufälliger Reihenfolge — erst nach Abgabe werden alle Ergebnisse gezeigt.
          Zusätzlich zur schriftlichen Prüfung ist eine Navigationsaufgabe auf Karte D49 zu lösen.
        </div>
      </div>
    </div>
  );
}
