import Link from 'next/link';

export function Footer() {
  return (
    <footer
      className="mt-16 border-t"
      style={{ borderColor: 'var(--border)', background: 'var(--navy-deepest)' }}
    >
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--gold)' }}>
              openSBF
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
              Kostenloses, inoffizielles Lernwerkzeug für den Sportbootführerschein. Kein kommerzielles Angebot.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--gold)' }}>
              Projekt
            </p>
            <ul className="space-y-2 text-xs" style={{ color: 'var(--muted)' }}>
              <li>
                <a
                  href="https://github.com/ArzelaAscoIi/openSBF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-colors"
                  style={{ color: 'var(--seafoam-light)' }}
                >
                  GitHub – Quellcode
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ArzelaAscoIi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-colors"
                  style={{ color: 'var(--seafoam-light)' }}
                >
                  Autor: ArzelaAscoIi
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ArzelaAscoIi/openSBF/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-colors"
                  style={{ color: 'var(--seafoam-light)' }}
                >
                  Fehler melden / Mitmachen
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--gold)' }}>
              Rechtliches
            </p>
            <ul className="space-y-2 text-xs" style={{ color: 'var(--muted)' }}>
              <li>
                <Link
                  href="/impressum"
                  className="hover:underline transition-colors"
                  style={{ color: 'var(--seafoam-light)' }}
                >
                  Impressum
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ArzelaAscoIi/openSBF/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-colors"
                  style={{ color: 'var(--seafoam-light)' }}
                >
                  MIT-Lizenz
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="border-t pt-6 text-xs leading-relaxed"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
        >
          <p className="mb-2">
            <strong style={{ color: 'var(--white)' }}>Kein offizielles Angebot.</strong>{' '}
            openSBF ist ein privates Hobbyprojekt und steht in keinerlei Verbindung mit dem Bundesministerium für
            Digitales und Verkehr (BMDV), ELWIS, dem DMYV, dem DSV oder anderen offiziellen Stellen. Die Nutzung
            erfolgt auf eigene Verantwortung. Für die Richtigkeit der Inhalte wird keine Gewähr übernommen.
          </p>
          <p>
            Fragenkataloge basieren auf amtlichem Material des BMDV (
            <a
              href="https://www.elwis.de"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: 'var(--seafoam-light)' }}
            >
              elwis.de
            </a>
            ) und sind gemäß § 5 UrhG nicht urheberrechtlich geschützt. Quellcode lizenziert unter MIT.
          </p>
        </div>
      </div>
    </footer>
  );
}
