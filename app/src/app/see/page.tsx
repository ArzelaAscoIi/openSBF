'use client';

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
    />
  );
}
