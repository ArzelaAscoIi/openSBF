import { notFound } from 'next/navigation';
import Link from 'next/link';
import { tutorials } from '@/data/tutorials';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TutorialPage({ params }: Props) {
  const { slug } = await params;
  const tutorial = tutorials.find((t) => t.id === slug);

  if (!tutorial) {
    notFound();
  }

  const examLabel =
    tutorial.exam === 'both' ? 'Binnen & See' : tutorial.exam === 'binnen' ? 'SBF Binnen' : 'SBF See';
  const accentColor = tutorial.exam === 'see' ? 'var(--seafoam)' : 'var(--gold)';

  const currentIdx = tutorials.findIndex((t) => t.id === slug);
  const prev = currentIdx > 0 ? tutorials[currentIdx - 1] : null;
  const next = currentIdx < tutorials.length - 1 ? tutorials[currentIdx + 1] : null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy-deep)' }}>
      <div
        className="border-b px-4 py-6"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:opacity-70 transition-opacity">Start</Link>
            <span>/</span>
            <Link href="/lernen" className="hover:opacity-70 transition-opacity">Wissen</Link>
            <span>/</span>
            <span style={{ color: 'var(--white)' }}>{tutorial.title}</span>
          </div>

          <span
            className="inline-block text-xs px-2.5 py-0.5 rounded font-medium mb-3"
            style={{
              background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
              color: accentColor,
              border: `1px solid color-mix(in srgb, ${accentColor} 25%, transparent)`,
            }}
          >
            {examLabel}
          </span>

          <h1
            className="text-2xl sm:text-3xl font-bold leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
          >
            {tutorial.title}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Content */}
        <div
          className="rounded-xl p-6 sm:p-8 mb-8"
          style={{
            background: 'var(--navy)',
            border: '1px solid var(--border)',
          }}
        >
          <TutorialContent content={tutorial.content} />
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-3">
          {prev ? (
            <Link
              href={`/lernen/${prev.id}`}
              className="p-4 rounded-lg transition-colors hover:bg-white/5"
              style={{
                background: 'var(--navy)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>← Vorheriges</div>
              <div className="text-sm font-medium" style={{ color: 'var(--white)' }}>{prev.title}</div>
            </Link>
          ) : <div />}

          {next ? (
            <Link
              href={`/lernen/${next.id}`}
              className="p-4 rounded-lg text-right transition-colors hover:bg-white/5"
              style={{
                background: 'var(--navy)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Nächstes →</div>
              <div className="text-sm font-medium" style={{ color: 'var(--white)' }}>{next.title}</div>
            </Link>
          ) : <div />}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/lernen"
            className="text-xs transition-opacity hover:opacity-70"
            style={{ color: 'var(--muted)' }}
          >
            ← Alle Themen
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return tutorials.map((t) => ({ slug: t.id }));
}

function TutorialContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let tableBuffer: string[] = [];
  let inTable = false;
  let i = 0;

  const flushTable = (buf: string[], key: string) => {
    const rows = buf.map((line) =>
      line
        .split('|')
        .map((cell) => cell.trim())
        .filter(Boolean),
    );
    const header = rows[0];
    const body = rows.slice(2);
    elements.push(
      <div key={key} className="overflow-x-auto mb-5">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {header.map((cell, ci) => (
                <th
                  key={ci}
                  className="px-3 py-2 text-left text-xs font-semibold border-b"
                  style={{ color: 'var(--gold)', borderColor: 'var(--border)' }}
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} style={{ borderBottom: '1px solid var(--border)' }}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2 text-xs" style={{ color: 'var(--muted)' }}>
                    <span dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('|')) {
      if (!inTable) inTable = true;
      tableBuffer.push(line);
    } else {
      if (inTable) {
        flushTable(tableBuffer, `table-${i}`);
        tableBuffer = [];
        inTable = false;
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2
            key={i}
            className="text-lg font-bold mt-7 mb-3"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
          >
            {line.slice(3)}
          </h2>,
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-sm font-semibold mt-5 mb-2" style={{ color: 'var(--gold)' }}>
            {line.slice(4)}
          </h3>,
        );
      } else if (line.startsWith('---')) {
        elements.push(
          <hr key={i} className="my-5" style={{ borderColor: 'var(--border)' }} />,
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <p key={i} className="text-sm mb-1.5 flex gap-2.5" style={{ color: 'rgba(232, 238, 246, 0.8)' }}>
            <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full" style={{ background: 'var(--gold)', display: 'block' }} />
            <span dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
          </p>,
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={i}
            className="px-4 py-3 rounded-lg mb-3 text-sm"
            style={{
              borderLeft: '2px solid var(--gold)',
              background: 'rgba(188, 147, 50, 0.07)',
              color: 'rgba(232, 238, 246, 0.75)',
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
          </blockquote>,
        );
      } else if (line.startsWith('```')) {
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(
          <pre
            key={i}
            className="p-4 rounded-lg text-sm mb-4 overflow-x-auto"
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              color: 'var(--seafoam)',
              fontFamily: 'monospace',
              border: '1px solid var(--border)',
            }}
          >
            {codeLines.join('\n')}
          </pre>,
        );
      } else if (line === '') {
        elements.push(<div key={i} className="h-1" />);
      } else {
        elements.push(
          <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(232, 238, 246, 0.8)' }}>
            <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          </p>,
        );
      }
    }
    i++;
  }

  if (inTable) {
    flushTable(tableBuffer, 'table-end');
  }

  return <div>{elements}</div>;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, `<strong style="color:var(--white);font-weight:600">$1</strong>`)
    .replace(/\*(.+?)\*/g, `<em>$1</em>`);
}
