'use client';

import { useState, use, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { seePruefungsboegen } from '@/data/pruefungsboegen';
import { getAllSeeQuestions } from '@/data/topics';
import { saveExamResult } from '@/lib/progress';
import type { Question, AnswerKey, ExamResult } from '@/lib/types';

const PASS_MAX_WRONG = 3; // official SBF See: max 3 wrong out of 30
const BASIS_MAX_ID = 72;  // question IDs 1–72 are Basisfragen

function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

type ShuffledOption = { key: AnswerKey; text: string; originalKey: AnswerKey };

interface QuestionEntry {
  question: Question;
  options: ShuffledOption[];
  isBasis: boolean;
}

type Answers = Record<number, AnswerKey>; // questionId → chosen key

function buildEntries(questionIds: number[]): QuestionEntry[] {
  const allQuestions = getAllSeeQuestions();
  const questionMap = new Map(allQuestions.map((q) => [q.id, q]));
  const entries: QuestionEntry[] = [];
  for (const id of questionIds) {
    const q = questionMap.get(id);
    if (!q) continue;
    entries.push({
      question: q,
      options: shuffleArray(q.answers.map((a) => ({ key: a.key, text: a.text, originalKey: a.key }))),
      isBasis: id <= BASIS_MAX_ID,
    });
  }
  return entries;
}

// ---------------------------------------------------------------------------
// Result screen
// ---------------------------------------------------------------------------

interface ResultsProps {
  entries: QuestionEntry[];
  answers: Answers;
  nummer: number;
  onRetry: () => void;
}

function ResultsScreen({ entries, answers, nummer, onRetry }: ResultsProps): React.ReactElement {
  const numStr = String(nummer).padStart(2, '0');

  const basis    = entries.filter((e) => e.isBasis);
  const specific = entries.filter((e) => !e.isBasis);

  const countCorrect = (list: QuestionEntry[]): number =>
    list.filter((e) => answers[e.question.id] === e.question.correctAnswer).length;

  const basisCorrect    = countCorrect(basis);
  const specificCorrect = countCorrect(specific);
  const totalCorrect    = basisCorrect + specificCorrect;
  const totalWrong      = entries.length - totalCorrect;
  const passed          = totalWrong <= PASS_MAX_WRONG;

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: 'var(--navy-deep)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Summary card */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{
            background: 'var(--navy)',
            border: `1px solid ${passed ? 'rgba(18,184,112,0.30)' : 'rgba(232,68,68,0.30)'}`,
          }}
        >
          <div className="flex items-start gap-4 mb-5">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
              style={{
                background: passed ? 'rgba(18,184,112,0.12)' : 'rgba(232,68,68,0.12)',
                color: passed ? 'var(--green-signal)' : 'var(--red-signal)',
              }}
            >
              {passed ? '✓' : '✗'}
            </div>
            <div>
              <h1
                className="text-xl font-bold"
                style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
              >
                {passed ? 'Bestanden' : 'Nicht bestanden'} — Bogen {numStr}
              </h1>
              <p className="text-sm mt-0.5" style={{ color: passed ? 'var(--green-signal)' : 'var(--red-signal)' }}>
                {passed
                  ? totalWrong === 0
                    ? 'Fehlerlos — perfekt!'
                    : `Nur ${totalWrong} Fehler — gut gemacht!`
                  : `${totalWrong} Fehler — max. ${PASS_MAX_WRONG} erlaubt`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Gesamt',     value: `${totalCorrect}/30`,         color: passed ? 'var(--green-signal)' : 'var(--red-signal)' },
              { label: 'Basisfragen',    value: `${basisCorrect}/${basis.length}`,    color: basisCorrect === basis.length ? 'var(--green-signal)' : basisCorrect >= basis.length - 1 ? 'var(--gold)' : 'var(--red-signal)' },
              { label: 'Spezifisch', value: `${specificCorrect}/${specific.length}`, color: specificCorrect === specific.length ? 'var(--green-signal)' : specificCorrect >= specific.length - 2 ? 'var(--gold)' : 'var(--red-signal)' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-3 rounded-lg text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
              >
                <div className="text-xl font-bold tabular-nums" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={onRetry}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--seafoam)', color: 'var(--white)' }}
            >
              Nochmals versuchen
            </button>
            <Link
              href="/see/pruefungsboegen"
              className="w-full py-2.5 rounded-lg text-sm font-medium text-center transition-opacity hover:opacity-80"
              style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)' }}
            >
              Alle Prüfungsbögen
            </Link>
          </div>
        </div>

        {/* Question-by-question review */}
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--muted)' }}>
          Auswertung aller Fragen
        </h2>
        <div className="space-y-3">
          {entries.map((entry, idx) => {
            const chosen  = answers[entry.question.id];
            const correct = entry.question.correctAnswer;
            const isRight = chosen === correct;

            return (
              <div
                key={entry.question.id}
                className="rounded-xl p-5"
                style={{
                  background: 'var(--navy)',
                  border: `1px solid ${isRight ? 'rgba(18,184,112,0.18)' : 'rgba(232,68,68,0.18)'}`,
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className="shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{
                      background: isRight ? 'rgba(18,184,112,0.15)' : 'rgba(232,68,68,0.15)',
                      color: isRight ? 'var(--green-signal)' : 'var(--red-signal)',
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          background: entry.isBasis ? 'rgba(188,147,50,0.10)' : 'rgba(38,136,164,0.10)',
                          color: entry.isBasis ? 'var(--gold)' : 'var(--seafoam-light)',
                        }}
                      >
                        {entry.isBasis ? 'Basis' : 'Spezifisch'}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>#{entry.question.id}</span>
                    </div>
                    <p className="text-sm font-medium leading-snug" style={{ color: 'var(--white)' }}>
                      {entry.question.text}
                    </p>
                  </div>
                </div>

                {entry.question.imagePath && (
                  <div className="mb-3 flex justify-center">
                    <Image
                      src={entry.question.imagePath}
                      alt={entry.question.imageDescription ?? ''}
                      width={300}
                      height={200}
                      className="rounded-lg max-h-36 w-auto object-contain"
                      style={{ background: 'white', padding: '6px', border: '1px solid var(--border)' }}
                    />
                  </div>
                )}

                <div className="space-y-1.5 ml-9">
                  {entry.options.map((opt) => {
                    const isCorrectOpt = opt.originalKey === correct;
                    const isChosenOpt  = opt.key === chosen;
                    let bg    = 'transparent';
                    let color = 'var(--muted)';
                    let border = 'var(--border)';
                    if (isCorrectOpt) { bg = 'rgba(18,184,112,0.10)'; color = 'var(--green-signal)'; border = 'rgba(18,184,112,0.30)'; }
                    else if (isChosenOpt && !isCorrectOpt) { bg = 'rgba(232,68,68,0.10)'; color = 'var(--red-signal)'; border = 'rgba(232,68,68,0.30)'; }

                    return (
                      <div
                        key={opt.key}
                        className="flex items-start gap-2 px-3 py-2 rounded-lg text-xs leading-snug"
                        style={{ background: bg, border: `1px solid ${border}`, color }}
                      >
                        {isCorrectOpt && <span className="shrink-0 mt-px">✓</span>}
                        {isChosenOpt && !isCorrectOpt && <span className="shrink-0 mt-px">✗</span>}
                        {!isCorrectOpt && !isChosenOpt && <span className="shrink-0 mt-px opacity-30">○</span>}
                        <span>{opt.text}</span>
                      </div>
                    );
                  })}
                </div>

                {!isRight && entry.question.hint && (
                  <p className="mt-3 ml-9 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                    💡 {entry.question.hint}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exam screen (all questions, no per-question feedback)
// ---------------------------------------------------------------------------

interface ExamScreenProps {
  entries: QuestionEntry[];
  nummer: number;
  onSubmit: (answers: Answers, entries: QuestionEntry[]) => void;
}

function ExamScreen({ entries, nummer, onSubmit }: ExamScreenProps): React.ReactElement {
  const [answers, setAnswers] = useState<Answers>({});
  const numStr = String(nummer).padStart(2, '0');
  const answered = Object.keys(answers).length;
  const total    = entries.length;
  const allAnswered = answered === total;

  const handleSelect = (questionId: number, key: AnswerKey): void => {
    setAnswers((prev) => ({ ...prev, [questionId]: key }));
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy-deep)' }}>
      {/* Sticky header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 border-b"
        style={{ background: 'rgba(6,12,24,0.95)', borderColor: 'var(--border)', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/see/pruefungsboegen"
              className="text-xs transition-opacity hover:opacity-70"
              style={{ color: 'var(--muted)' }}
            >
              ← Bögen
            </Link>
            <span className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
              Prüfungsbogen {numStr}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs tabular-nums" style={{ color: answered < total ? 'var(--muted)' : 'var(--green-signal)' }}>
              {answered}/{total} beantwortet
            </span>
            <button
              onClick={() => { if (allAnswered) onSubmit(answers, entries); }}
              disabled={!allAnswered}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: allAnswered ? 'var(--seafoam)' : 'rgba(255,255,255,0.05)',
                color: allAnswered ? 'var(--white)' : 'rgba(255,255,255,0.25)',
                cursor: allAnswered ? 'pointer' : 'not-allowed',
              }}
            >
              Abgeben
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mt-2">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(answered / total) * 100}%`, background: 'var(--seafoam)' }}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {entries.map((entry, idx) => {
          const chosen = answers[entry.question.id];
          return (
            <div
              key={entry.question.id}
              className="rounded-xl p-5"
              style={{
                background: 'var(--navy)',
                border: `1px solid ${chosen ? 'rgba(38,136,164,0.25)' : 'var(--border)'}`,
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <span
                  className="shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-semibold mt-0.5"
                  style={{
                    background: chosen ? 'rgba(38,136,164,0.20)' : 'rgba(255,255,255,0.06)',
                    color: chosen ? 'var(--seafoam-light)' : 'var(--muted)',
                  }}
                >
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        background: entry.isBasis ? 'rgba(188,147,50,0.08)' : 'rgba(38,136,164,0.08)',
                        color: entry.isBasis ? 'var(--gold)' : 'var(--seafoam-light)',
                      }}
                    >
                      {entry.isBasis ? 'Basis' : 'Spezifisch'}
                    </span>
                  </div>

                  {entry.question.imagePath && (
                    <div className="mb-3 flex justify-center">
                      <Image
                        src={entry.question.imagePath}
                        alt={entry.question.imageDescription ?? ''}
                        width={320}
                        height={240}
                        className="rounded-lg max-h-40 w-auto object-contain"
                        style={{ background: 'white', padding: '6px', border: '1px solid var(--border)' }}
                      />
                    </div>
                  )}

                  {entry.question.hasImage && !entry.question.imagePath && entry.question.imageDescription && (
                    <div
                      className="mb-3 px-3 py-2 rounded text-xs"
                      style={{ background: 'rgba(38,136,164,0.08)', border: '1px solid rgba(38,136,164,0.20)', color: 'var(--seafoam-light)' }}
                    >
                      {entry.question.imageDescription}
                    </div>
                  )}

                  <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--white)' }}>
                    {entry.question.text}
                  </p>
                </div>
              </div>

              <div className="space-y-2 ml-9">
                {entry.options.map((opt, i) => {
                  const isChosen = chosen === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelect(entry.question.id, opt.key)}
                      className="flex items-start gap-3 p-3 rounded-lg border w-full text-left transition-all"
                      style={{
                        borderColor: isChosen ? 'var(--seafoam)' : 'var(--border)',
                        background: isChosen ? 'rgba(38,136,164,0.12)' : 'transparent',
                      }}
                    >
                      <span
                        className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-semibold mt-0.5"
                        style={{
                          background: isChosen ? 'var(--seafoam)' : 'rgba(255,255,255,0.06)',
                          color: isChosen ? 'white' : 'var(--muted)',
                        }}
                      >
                        {['A', 'B', 'C', 'D'][i]}
                      </span>
                      <span className="text-sm leading-relaxed" style={{ color: isChosen ? 'var(--white)' : 'rgba(232,238,246,0.80)' }}>
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Bottom submit */}
        <div className="pt-4 pb-8">
          <button
            onClick={() => { if (allAnswered) onSubmit(answers, entries); }}
              disabled={!allAnswered}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: allAnswered ? 'var(--seafoam)' : 'rgba(255,255,255,0.05)',
              color: allAnswered ? 'var(--white)' : 'rgba(255,255,255,0.25)',
              cursor: allAnswered ? 'pointer' : 'not-allowed',
              border: allAnswered ? 'none' : '1px solid var(--border)',
            }}
          >
            {allAnswered
              ? 'Prüfung abgeben →'
              : `Noch ${total - answered} Frage${total - answered !== 1 ? 'n' : ''} offen`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface PageParams {
  nummer: string;
}

export default function PruefungsbogenExamPage({
  params,
}: {
  params: Promise<PageParams>;
}): React.ReactElement {
  const { nummer: nummerStr } = use(params);
  const nummer = parseInt(nummerStr, 10);
  const pb = seePruefungsboegen.find((p) => p.nummer === nummer);

  if (!pb) notFound();

  const [entries, setEntries] = useState<QuestionEntry[]>(() => buildEntries(pb.questionIds));
  const [submittedAnswers, setSubmittedAnswers] = useState<Answers | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (answers: Answers, examEntries: QuestionEntry[]): void => {
    const basis    = examEntries.filter((e) => e.isBasis);
    const specific = examEntries.filter((e) => !e.isBasis);
    const countCorrect = (list: QuestionEntry[]): number =>
      list.filter((e) => answers[e.question.id] === e.question.correctAnswer).length;
    const basisCorrect    = countCorrect(basis);
    const specificCorrect = countCorrect(specific);
    const totalCorrect    = basisCorrect + specificCorrect;

    const result: ExamResult = {
      takenAt: new Date().toISOString(),
      correct: totalCorrect,
      wrong: examEntries.length - totalCorrect,
      total: examEntries.length,
      basisCorrect,
      basisTotal: basis.length,
      specificCorrect,
      specificTotal: specific.length,
      passed: examEntries.length - totalCorrect <= PASS_MAX_WRONG,
    };
    saveExamResult(result, nummer);
    setSubmittedAnswers(answers);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRetry = (): void => {
    setEntries(buildEntries(pb.questionIds));
    setSubmittedAnswers(null);
    topRef.current?.scrollIntoView({ behavior: 'instant' });
  };

  return (
    <div ref={topRef}>
      {submittedAnswers ? (
        <ResultsScreen
          entries={entries}
          answers={submittedAnswers}
          nummer={nummer}
          onRetry={handleRetry}
        />
      ) : (
        <ExamScreen
          entries={entries}
          nummer={nummer}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
