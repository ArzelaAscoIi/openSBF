import Link from 'next/link';
import { tutorials } from '@/data/tutorials';

export default function LernenPage() {
  const bothTutorials = tutorials.filter((t) => t.exam === 'both');
  const binnenTutorials = tutorials.filter((t) => t.exam === 'binnen');
  const seeTutorials = tutorials.filter((t) => t.exam === 'see');

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy-deep)' }}>
      <div
        className="border-b px-4 py-10"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-4xl mx-auto">
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
            Wissen & Theorie
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Kurze, prägnante Erklärungen zu den wichtigsten Themen der SBF-Prüfung
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        <Section title="Allgemeine Themen" sub="Binnen & See" tutorials={bothTutorials} />
        <Section title="SBF Binnen" tutorials={binnenTutorials} />
        <Section title="SBF See" tutorials={seeTutorials} accent="sea" />
      </div>
    </div>
  );
}

function Section({
  title,
  sub,
  tutorials,
  accent = 'gold',
}: {
  title: string;
  sub?: string;
  tutorials: { id: string; title: string; exam: string }[];
  accent?: 'gold' | 'sea';
}) {
  return (
    <section>
      <div className="flex items-baseline gap-2 mb-4">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
          {title}
        </h2>
        {sub && (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {sub}
          </span>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {tutorials.map((t) => (
          <Link
            key={t.id}
            href={`/lernen/${t.id}`}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-white/5"
            style={{
              background: 'var(--navy)',
              border: '1px solid var(--border)',
              color: 'var(--white)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{
                background: accent === 'sea' ? 'var(--seafoam)' : 'var(--gold)',
              }}
            />
            <span className="text-sm">{t.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
