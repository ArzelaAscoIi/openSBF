'use client';

import Link from 'next/link';
import { ExamTopicsPage } from '@/components/quiz/ExamTopicsPage';
import { seeTopics, getAllSeeQuestions } from '@/data/topics';

const explanationItems = (
  <>
    <li>Basisfragen (1–72) sind identisch mit SBF Binnen</li>
    <li>Spezifische Fragen umfassen KVR, Seezeichen, Schallzeichen und Navigation</li>
    <li>
      Beantworte jede Frage{' '}
      <span style={{ color: 'var(--white)' }}>3× richtig</span>, um sie zu bestehen — gehe dafür
      alle Themengebiete durch
    </li>
    <li>
      Falsch beantwortete Fragen werden{' '}
      <span style={{ color: 'var(--white)' }}>dauerhaft gezählt</span> — unter{' '}
      <span style={{ color: 'var(--white)' }}>Problemfragen</span> findest du gezielte
      Wiederholungen für deine häufigsten Fehler
    </li>
    <li>Dein Fortschritt wird automatisch im Browser gespeichert</li>
  </>
);

const pruefungsboegensLink = (
  <Link
    href="/see/pruefungsboegen"
    className="flex items-center justify-between p-4 rounded-xl transition-opacity hover:opacity-80"
    style={{
      background: 'rgba(38, 136, 164, 0.07)',
      border: '1px solid rgba(38, 136, 164, 0.22)',
    }}
  >
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
        style={{ background: 'rgba(38, 136, 164, 0.15)', color: 'var(--seafoam-light)' }}
      >
        📋
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--white)' }}>
          Prüfungsbögen üben
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          15 offizielle Bögen · je 30 Fragen · Prüfungssimulation
        </p>
      </div>
    </div>
    <span className="text-xs" style={{ color: 'var(--muted)' }}>→</span>
  </Link>
);

export default function SeePage(): React.ReactElement {
  return (
    <ExamTopicsPage
      exam="see"
      topics={seeTopics}
      getAllQuestions={getAllSeeQuestions}
      title="SBF See"
      subtitle="Sportbootführerschein Seeschifffahrtsstraßen"
      accentColor="seafoam"
      explanationContent={explanationItems}
      quickLinks={pruefungsboegensLink}
    />
  );
}
