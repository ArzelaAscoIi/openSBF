'use client';

interface CertificateCardProps {
  exam: 'SBF Binnen' | 'SBF See';
  color: 'gold' | 'seafoam';
}

export function CertificateCard({ exam, color }: CertificateCardProps) {
  const accentColor = color === 'gold' ? 'var(--gold)' : 'var(--seafoam)';
  const accentBg =
    color === 'gold' ? 'rgba(188, 147, 50, 0.07)' : 'rgba(38, 136, 164, 0.07)';
  const accentBorder =
    color === 'gold' ? 'rgba(188, 147, 50, 0.30)' : 'rgba(38, 136, 164, 0.30)';

  return (
    <div
      className="relative rounded-xl overflow-hidden px-6 py-8 sm:px-10"
      style={{
        background: accentBg,
        border: `1px solid ${accentBorder}`,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div
          className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{
            background: `color-mix(in srgb, ${accentColor} 15%, transparent)`,
            border: `2px solid ${accentColor}`,
          }}
        >
          ⚓
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: accentColor }}>
            Glückwunsch
          </div>
          <h3
            className="text-xl sm:text-2xl font-bold leading-tight mb-1"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
          >
            Du hast alle {exam}-Fragen gemeistert
          </h3>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Jede Frage wurde 3× korrekt beantwortet. Du bist bereit für die Prüfung.
          </p>
        </div>

        <div
          className="shrink-0 text-center px-5 py-4 rounded-xl"
          style={{
            background: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
            border: `1px solid ${accentBorder}`,
          }}
        >
          <div
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: accentColor }}
          >
            {exam}
          </div>
          <div className="text-4xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}>
            100%
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Prüfungsreif
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />
    </div>
  );
}
