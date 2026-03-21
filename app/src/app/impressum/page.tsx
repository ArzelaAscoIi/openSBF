import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Impressum – openSBF',
};

export default function ImpressumPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link
        href="/"
        className="text-xs uppercase tracking-widest mb-8 inline-block hover:underline"
        style={{ color: 'var(--muted)' }}
      >
        ← Zurück
      </Link>

      <h1
        className="text-3xl font-bold mb-2"
        style={{ fontFamily: 'Playfair Display, serif', color: 'var(--gold)' }}
      >
        Impressum
      </h1>
      <p className="text-xs mb-10" style={{ color: 'var(--muted)' }}>
        Angaben gemäß § 5 TMG
      </p>

      <div
        className="rounded-lg p-6 mb-6 text-sm leading-relaxed space-y-1"
        style={{ background: 'var(--navy)', border: '1px solid var(--border)', color: 'var(--white)' }}
      >
        <p className="font-semibold">Kristof</p>
        {/* TODO: Add your full name, street address, postal code, city */}
        <p style={{ color: 'var(--muted)' }}>[Straße und Hausnummer]</p>
        <p style={{ color: 'var(--muted)' }}>[PLZ] [Ort]</p>
        <p style={{ color: 'var(--muted)' }}>Deutschland</p>
      </div>

      <div className="text-sm space-y-3 mb-10" style={{ color: 'var(--muted)' }}>
        <p>
          <span className="font-medium" style={{ color: 'var(--white)' }}>Kontakt:</span>{' '}
          {/* TODO: Add your contact email or GitHub profile link */}
          <a
            href="https://github.com/ArzelaAscoIi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: 'var(--seafoam-light)' }}
          >
            github.com/ArzelaAscoIi
          </a>
        </p>
      </div>

      <div
        className="rounded-lg p-6 text-sm leading-relaxed space-y-4"
        style={{ background: 'var(--navy)', border: '1px solid var(--border)', color: 'var(--muted)' }}
      >
        <div>
          <p className="font-semibold mb-1" style={{ color: 'var(--white)' }}>
            Haftungsausschluss
          </p>
          <p>
            openSBF ist ein privates, nicht-kommerzielles Hobbyprojekt. Die bereitgestellten Inhalte dienen
            ausschließlich der allgemeinen Information und Prüfungsvorbereitung. Für die Richtigkeit,
            Vollständigkeit und Aktualität der Inhalte wird keine Gewähr übernommen. Maßgeblich sind stets die
            aktuellen offiziellen Unterlagen auf{' '}
            <a
              href="https://www.elwis.de"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: 'var(--seafoam-light)' }}
            >
              elwis.de
            </a>
            .
          </p>
        </div>

        <div>
          <p className="font-semibold mb-1" style={{ color: 'var(--white)' }}>
            Keine offizielle Affiliation
          </p>
          <p>
            Dieses Projekt steht in keinerlei Verbindung mit dem Bundesministerium für Digitales und Verkehr
            (BMDV), ELWIS, dem Deutschen Motoryachtverband (DMYV), dem Deutschen Segler-Verband (DSV) oder
            anderen offiziellen Stellen.
          </p>
        </div>

        <div>
          <p className="font-semibold mb-1" style={{ color: 'var(--white)' }}>
            Urheberrecht
          </p>
          <p>
            Der Code steht unter der{' '}
            <a
              href="https://github.com/ArzelaAscoIi/openSBF/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: 'var(--seafoam-light)' }}
            >
              MIT-Lizenz
            </a>
            . Die verwendeten Fragenkataloge basieren auf amtlichem Material des BMDV und sind gemäß § 5 Abs. 1
            UrhG (amtliche Werke) nicht urheberrechtlich geschützt.
          </p>
        </div>

        <div>
          <p className="font-semibold mb-1" style={{ color: 'var(--white)' }}>
            Datenschutz
          </p>
          <p>
            Diese Website speichert keinerlei personenbezogene Daten auf einem Server. Der Lernfortschritt wird
            ausschließlich lokal im <code className="px-1 rounded" style={{ background: 'var(--navy-muted)' }}>localStorage</code> deines Browsers gespeichert und
            verlässt dein Gerät nicht. Es werden keine Cookies gesetzt, keine Tracking-Tools und keine
            Analysetools eingesetzt.
          </p>
        </div>
      </div>
    </div>
  );
}
