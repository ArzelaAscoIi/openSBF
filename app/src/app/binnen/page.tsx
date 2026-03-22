'use client';

import { ExamTopicsPage } from '@/components/quiz/ExamTopicsPage';
import { binnenTopics, getAllBinnenQuestions } from '@/data/topics';

const explanationItems = (
  <>
    <li>Jede Frage hat 4 Antwortmöglichkeiten — nur eine ist richtig</li>
    <li>
      Beantworte jede Frage{' '}
      <span style={{ color: 'var(--white)' }}>3× richtig</span>, um sie zu bestehen — gehe dafür
      alle Themengebiete durch
    </li>
    <li>Ein Thema gilt als bestanden, wenn alle enthaltenen Fragen bestanden sind</li>
    <li>
      Falsch beantwortete Fragen werden{' '}
      <span style={{ color: 'var(--white)' }}>dauerhaft gezählt</span> — unter{' '}
      <span style={{ color: 'var(--white)' }}>Problemfragen</span> findest du gezielte
      Wiederholungen für deine häufigsten Fehler
    </li>
    <li>Dein Fortschritt wird automatisch im Browser gespeichert</li>
  </>
);

export default function BinnenPage(): React.ReactElement {
  return (
    <ExamTopicsPage
      exam="binnen"
      topics={binnenTopics}
      getAllQuestions={getAllBinnenQuestions}
      title="SBF Binnen"
      subtitle="Sportbootführerschein Binnenschifffahrtsstraßen"
      accentColor="gold"
      explanationContent={explanationItems}
    />
  );
}
