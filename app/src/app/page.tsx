'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { loadProgress, getExamOverallProgress } from '@/lib/progress';
import { getAllBinnenQuestions, getAllSeeQuestions } from '@/data/topics';

export default function HomePage() {
  const [binnenPct, setBinnenPct] = useState(0);
  const [seePct, setSeePct] = useState(0);

  useEffect(() => {
    const progress = loadProgress();
    const binnenIds = getAllBinnenQuestions().map((q) => q.id);
    const seeIds = getAllSeeQuestions().map((q) => q.id);
    setBinnenPct(getExamOverallProgress(progress, binnenIds, 'binnen').percentage);
    setSeePct(getExamOverallProgress(progress, seeIds, 'see').percentage);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy-deep)' }}>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        {/* Background decorations */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 20% 50%, rgba(200, 169, 81, 0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(78, 184, 184, 0.05) 0%, transparent 50%)',
          }}
        />
        <div
          className="absolute top-10 right-10 text-9xl opacity-5 select-none pointer-events-none"
          style={{ fontSize: '20rem', lineHeight: 1 }}
        >
          ⚓
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-8"
            style={{
              background: 'rgba(200, 169, 81, 0.1)',
              border: '1px solid rgba(200, 169, 81, 0.3)',
              color: 'var(--gold)',
            }}
          >
            <span>⚓</span>
            <span>Kostenlose Prüfungsvorbereitung</span>
          </div>

          <h1
            className="text-5xl sm:text-7xl font-black mb-6 leading-tight"
            style={{
              fontFamily: 'Playfair Display, serif',
              background: 'linear-gradient(135deg, #f8f9fa 0%, var(--gold-light) 50%, var(--gold) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Open
            <span style={{ color: 'var(--gold)', WebkitTextFillColor: 'var(--gold)' }}>SBF</span>
          </h1>

          <p className="text-xl sm:text-2xl mb-4 font-light" style={{ color: 'rgba(248, 249, 250, 0.85)' }}>
            Deine Lernplattform für den
          </p>
          <p
            className="text-2xl sm:text-3xl font-semibold mb-10"
            style={{ color: 'var(--seafoam)', fontFamily: 'Playfair Display, serif' }}
          >
            Sportbootführerschein Binnen & See
          </p>

          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-12" style={{ color: 'var(--muted)' }}>
            Alle offiziellen Prüfungsfragen aus dem ELWIS-Katalog (Stand August 2023), strukturiert nach
            Themen mit Lerntracking und Erklärungen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/binnen"
              className="px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                color: 'var(--navy-deepest)',
                boxShadow: '0 4px 20px rgba(200, 169, 81, 0.3)',
              }}
            >
              🏞️ SBF Binnen
            </Link>
            <Link
              href="/see"
              className="px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #0a3d6b, var(--navy-muted))',
                color: 'var(--white)',
                border: '1px solid rgba(78, 184, 184, 0.3)',
                boxShadow: '0 4px 20px rgba(78, 184, 184, 0.15)',
              }}
            >
              🌊 SBF See
            </Link>
          </div>
        </div>
      </section>

      {/* Progress overview */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div
            className="p-6 rounded-2xl nautical-card"
            style={{ transition: 'all 0.3s ease' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                  SBF Binnen
                </h3>
                <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
                  Binnenschifffahrtsstraßen
                </p>
              </div>
              <span className="text-3xl">🏞️</span>
            </div>
            <ProgressBar value={binnenPct} showLabel label="Gesamtfortschritt" className="mb-4" />
            <Link
              href="/binnen"
              className="w-full block text-center py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
              style={{
                background: 'rgba(200, 169, 81, 0.15)',
                border: '1px solid rgba(200, 169, 81, 0.3)',
                color: 'var(--gold)',
              }}
            >
              Weiterlernen →
            </Link>
          </div>

          <div className="p-6 rounded-2xl nautical-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                  SBF See
                </h3>
                <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
                  Seeschifffahrtsstraßen
                </p>
              </div>
              <span className="text-3xl">🌊</span>
            </div>
            <ProgressBar value={seePct} showLabel label="Gesamtfortschritt" color="seafoam" className="mb-4" />
            <Link
              href="/see"
              className="w-full block text-center py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
              style={{
                background: 'rgba(78, 184, 184, 0.1)',
                border: '1px solid rgba(78, 184, 184, 0.3)',
                color: 'var(--seafoam)',
              }}
            >
              Weiterlernen →
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            {
              icon: '📚',
              title: 'Alle Fragen',
              text: 'Vollständiger offizieller Fragenkatalog nach ELWIS-Standard (August 2023)',
            },
            {
              icon: '🎯',
              title: '3× Richtig',
              text: 'Jede Frage muss 3× korrekt beantwortet werden – so lernt man nachhaltig',
            },
            {
              icon: '📖',
              title: 'Erklärungen',
              text: 'Kurze deutsche Erklärungen zu Lichtern, Zeichen, Regeln und Navigation',
            },
            {
              icon: '📊',
              title: 'Fortschritt',
              text: 'Dein Lernfortschritt wird lokal gespeichert – keine Anmeldung nötig',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-xl"
              style={{
                background: 'rgba(17, 34, 64, 0.6)',
                border: '1px solid rgba(200, 169, 81, 0.1)',
              }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h4 className="font-semibold mb-1.5 text-sm" style={{ color: 'var(--white)' }}>
                {f.title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                {f.text}
              </p>
            </div>
          ))}
        </div>

        {/* Quick links to tutorials */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(17, 34, 64, 0.8), rgba(30, 58, 95, 0.8))',
            border: '1px solid rgba(200, 169, 81, 0.15)',
          }}
        >
          <h2
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--gold)' }}
          >
            Theorie & Wissen
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
            Kurze Erklärungen zu den wichtigsten Themen – zum Lesen und Verstehen
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: '/lernen/lichter-grundlagen', label: '💡 Lichterführung Grundlagen' },
              { href: '/lernen/lichter-see', label: '🚢 Lichter nach KVR' },
              { href: '/lernen/ausweichregeln-kvr', label: '↔️ Ausweichregeln KVR' },
              { href: '/lernen/ausweichregeln-binnen', label: '🚤 Ausweichregeln Binnen' },
              { href: '/lernen/seezeichen', label: '🔴 Seezeichen & Betonnung' },
              { href: '/lernen/navigation-grundlagen', label: '🧭 Navigation' },
              { href: '/lernen/schallzeichen-see', label: '📣 Schallzeichen See' },
              { href: '/lernen/schallzeichen-binnen', label: '🔊 Schallzeichen Binnen' },
              { href: '/lernen/sicherheit-ausruestung', label: '🦺 Sicherheit' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
                style={{
                  background: 'rgba(200, 169, 81, 0.05)',
                  border: '1px solid rgba(200, 169, 81, 0.15)',
                  color: 'var(--white)',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
