import Link from 'next/link';
import { tutorials } from '@/data/tutorials';

export default function LernenPage() {
  const bothTutorials = tutorials.filter((t) => t.exam === 'both');
  const binnenTutorials = tutorials.filter((t) => t.exam === 'binnen');
  const seeTutorials = tutorials.filter((t) => t.exam === 'see');

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: 'var(--navy-deep)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <Link href="/" className="text-sm mb-6 block hover:opacity-70 transition-opacity" style={{ color: 'var(--muted)' }}>
            ← Start
          </Link>
          <h1
            className="text-4xl font-bold mb-3"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
          >
            📖 Wissen & Theorie
          </h1>
          <p style={{ color: 'var(--muted)' }}>
            Kurze, prägnante Erklärungen zu den wichtigsten Themen der SBF-Prüfung
          </p>
        </div>

        {/* Both */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--gold)' }}>
            🚢 Allgemeine Themen (Binnen & See)
          </h2>
          <TutorialGrid tutorials={bothTutorials} />
        </section>

        {/* Binnen */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--gold)' }}>
            🏞️ SBF Binnen
          </h2>
          <TutorialGrid tutorials={binnenTutorials} />
        </section>

        {/* See */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--seafoam)' }}>
            🌊 SBF See
          </h2>
          <TutorialGrid tutorials={seeTutorials} />
        </section>
      </div>
    </div>
  );
}

function TutorialGrid({ tutorials }: { tutorials: { id: string; title: string; exam: string }[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {tutorials.map((t) => (
        <Link
          key={t.id}
          href={`/lernen/${t.id}`}
          className="p-4 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] nautical-card"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
            style={{ background: 'rgba(200, 169, 81, 0.15)', color: 'var(--gold)' }}
          >
            📄
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--white)' }}>
            {t.title}
          </span>
        </Link>
      ))}
    </div>
  );
}
