'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  loadProgress,
  getExamOverallProgress,
  isQuestionPassed,
  resetProgress,
} from '@/lib/progress';
import { binnenTopics, seeTopics, getAllBinnenQuestions, getAllSeeQuestions } from '@/data/topics';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { UserProgress, ExamType } from '@/lib/types';

const CORRECT_THRESHOLD = 3;

interface ExamStats {
  totalQuestions: number;
  answeredQuestions: number;
  passedQuestions: number;
  totalTopics: number;
  passedTopics: number;
  percentage: number;
  recentAnswers: number;
}

function computeExamStats(
  progress: UserProgress,
  questions: { id: number }[],
  topics: { id: string; questionIds: number[] }[],
  exam: ExamType,
  sinceMs: number,
): ExamStats {
  const now = Date.now();
  let answeredQuestions = 0;
  let passedQuestions = 0;
  let recentAnswers = 0;

  for (const q of questions) {
    const key = `${exam}_${q.id}`;
    const entry = progress.questions[key];
    if (!entry) continue;
    answeredQuestions++;
    if (entry.correctCount >= CORRECT_THRESHOLD) passedQuestions++;
    if (now - new Date(entry.lastAnswered).getTime() <= sinceMs) recentAnswers++;
  }

  let passedTopics = 0;
  for (const topic of topics) {
    const allPassed = topic.questionIds.every((id) => isQuestionPassed(progress, id, exam));
    if (allPassed && topic.questionIds.length > 0) passedTopics++;
  }

  const totalQuestions = questions.length;
  const overall = getExamOverallProgress(progress, questions.map((q) => q.id), exam);

  return {
    totalQuestions,
    answeredQuestions,
    passedQuestions,
    totalTopics: topics.length,
    passedTopics,
    percentage: overall.percentage,
    recentAnswers,
  };
}

function getLastActiveDate(progress: UserProgress): Date | null {
  const dates = Object.values(progress.questions).map((q) => new Date(q.lastAnswered).getTime());
  if (dates.length === 0) return null;
  return new Date(Math.max(...dates));
}

function formatRelativeDate(date: Date): string {
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Heute';
  if (days === 1) return 'Gestern';
  if (days < 7) return `vor ${days} Tagen`;
  if (days < 30) return `vor ${Math.floor(days / 7)} Wochen`;
  return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

function StatCard({ label, value, sub, accent = false }: StatCardProps) {
  return (
    <div
      className="rounded-xl px-4 py-4"
      style={{
        background: accent ? 'rgba(188, 147, 50, 0.08)' : 'var(--navy)',
        border: `1px solid ${accent ? 'rgba(188, 147, 50, 0.2)' : 'var(--border)'}`,
      }}
    >
      <div
        className="text-2xl font-bold tabular-nums"
        style={{ color: accent ? 'var(--gold)' : 'var(--white)' }}
      >
        {value}
      </div>
      <div className="text-xs font-medium mt-1" style={{ color: 'var(--white)' }}>
        {label}
      </div>
      {sub && (
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

interface ExamSectionProps {
  title: string;
  icon: string;
  href: string;
  stats: ExamStats;
}

function ExamSection({ title, icon, href, stats }: ExamSectionProps) {
  const isPerfect = stats.passedQuestions === stats.totalQuestions && stats.totalQuestions > 0;

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'var(--navy)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{icon}</span>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
              {title}
            </h3>
            {isPerfect && (
              <span
                className="text-xs font-medium"
                style={{ color: 'var(--green-signal)' }}
              >
                ✓ Abgeschlossen
              </span>
            )}
          </div>
        </div>
        <Link
          href={href}
          className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: 'var(--gold-light)', border: '1px solid rgba(188,147,50,0.25)' }}
        >
          Üben →
        </Link>
      </div>

      <ProgressBar
        value={stats.percentage}
        showLabel
        label={`${stats.passedQuestions} von ${stats.totalQuestions} Fragen bestanden`}
        size="md"
        color={isPerfect ? 'green' : 'gold'}
        animated={stats.percentage > 0 && stats.percentage < 100}
      />

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="text-center">
          <div
            className="text-lg font-bold tabular-nums"
            style={{ color: 'var(--white)' }}
          >
            {stats.answeredQuestions}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Bearbeitet
          </div>
        </div>
        <div className="text-center border-x" style={{ borderColor: 'var(--border)' }}>
          <div
            className="text-lg font-bold tabular-nums"
            style={{ color: 'var(--gold)' }}
          >
            {stats.passedQuestions}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Bestanden
          </div>
        </div>
        <div className="text-center">
          <div
            className="text-lg font-bold tabular-nums"
            style={{ color: 'var(--seafoam-light)' }}
          >
            {stats.passedTopics}/{stats.totalTopics}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Themen
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  }

  function handleResetProgress() {
    resetProgress();
    setProgress(loadProgress());
    setShowResetConfirm(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--navy-deep)' }}>
        <div className="text-sm" style={{ color: 'var(--muted)' }}>Wird geladen…</div>
      </div>
    );
  }

  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  const binnenQuestions = getAllBinnenQuestions();
  const seeQuestions = getAllSeeQuestions();

  const binnenStats = computeExamStats(progress, binnenQuestions, binnenTopics, 'binnen', SEVEN_DAYS_MS);
  const seeStats = computeExamStats(progress, seeQuestions, seeTopics, 'see', SEVEN_DAYS_MS);

  const totalPassed = binnenStats.passedQuestions + seeStats.passedQuestions;
  const totalQuestions = binnenStats.totalQuestions + seeStats.totalQuestions;
  const recentTotal = binnenStats.recentAnswers + seeStats.recentAnswers;
  const lastActive = getLastActiveDate(progress);
  const totalAnswered = binnenStats.answeredQuestions + seeStats.answeredQuestions;

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy-deep)' }}>
      <div
        className="border-b px-4 py-10"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="text-xs font-medium mb-6 inline-block transition-opacity hover:opacity-70"
            style={{ color: 'var(--muted)' }}
          >
            ← Start
          </Link>
          <h1
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
          >
            Mein Profil
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Dein persönlicher Lernfortschritt auf einen Blick
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Account section */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
            Konto
          </h2>
          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--navy)', border: '1px solid var(--border)' }}
          >
            {user ? (
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: 'rgba(188,147,50,0.15)', color: 'var(--gold)' }}
                  >
                    {user.email?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
                      {user.email}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      Fortschritt wird automatisch synchronisiert
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
                  style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
                >
                  <span>→</span>
                  Abmelden
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
                    Nicht angemeldet
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    Melde dich an, um deinen Fortschritt geräteübergreifend zu speichern
                  </div>
                </div>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: 'var(--gold)', color: '#030810' }}
                >
                  ⚓ Anmelden
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Overview stats */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
            Gesamtübersicht
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Bestanden"
              value={totalPassed}
              sub={`von ${totalQuestions} Fragen`}
              accent
            />
            <StatCard
              label="Bearbeitet"
              value={totalAnswered}
              sub="Fragen angefasst"
            />
            <StatCard
              label="Letzte 7 Tage"
              value={recentTotal}
              sub="Fragen geübt"
            />
            <StatCard
              label="Zuletzt aktiv"
              value={lastActive ? formatRelativeDate(lastActive) : '—'}
              sub={lastActive
                ? lastActive.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })
                : 'Noch keine Aktivität'}
            />
          </div>
        </section>

        {/* Per-exam sections */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
            Prüfungsfortschritt
          </h2>
          <div className="space-y-3">
            <ExamSection
              title="SBF Binnen"
              icon="🚢"
              href="/binnen"
              stats={binnenStats}
            />
            <ExamSection
              title="SBF See"
              icon="⛵"
              href="/see"
              stats={seeStats}
            />
          </div>
        </section>

        {/* Activity breakdown */}
        {totalAnswered > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
              Aktivität
            </h2>
            <div
              className="rounded-xl p-5"
              style={{ background: 'var(--navy)', border: '1px solid var(--border)' }}
            >
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                      🚢 SBF Binnen
                    </span>
                    <span className="text-xs tabular-nums" style={{ color: 'var(--muted)' }}>
                      {binnenStats.recentAnswers} in letzten 7 Tagen
                    </span>
                  </div>
                  <ProgressBar
                    value={binnenStats.passedQuestions}
                    max={binnenStats.totalQuestions}
                    size="sm"
                    color="gold"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      {binnenStats.passedQuestions} bestanden
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      {binnenStats.percentage}%
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                      ⛵ SBF See
                    </span>
                    <span className="text-xs tabular-nums" style={{ color: 'var(--muted)' }}>
                      {seeStats.recentAnswers} in letzten 7 Tagen
                    </span>
                  </div>
                  <ProgressBar
                    value={seeStats.passedQuestions}
                    max={seeStats.totalQuestions}
                    size="sm"
                    color="seafoam"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      {seeStats.passedQuestions} bestanden
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      {seeStats.percentage}%
                    </span>
                  </div>
                </div>
              </div>

              {progress.lastUpdated && (
                <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>
                    Zuletzt synchronisiert:{' '}
                    {new Date(progress.lastUpdated).toLocaleString('de-DE', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Danger zone */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
            Daten
          </h2>
          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--navy)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--white)' }}>
                  Fortschritt zurücksetzen
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  Löscht alle lokal gespeicherten Antworten unwiderruflich
                </div>
              </div>
              {showResetConfirm ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
                    style={{ color: 'var(--muted)' }}
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleResetProgress}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
                    style={{ background: 'var(--red-signal)', color: 'var(--white)' }}
                  >
                    Ja, zurücksetzen
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
                  style={{
                    color: 'var(--red-signal)',
                    border: '1px solid rgba(232, 68, 68, 0.3)',
                  }}
                >
                  Zurücksetzen
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
