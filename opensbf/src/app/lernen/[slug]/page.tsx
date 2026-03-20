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

  const examLabel = tutorial.exam === 'both' ? 'Binnen & See' : tutorial.exam === 'binnen' ? 'SBF Binnen' : 'SBF See';
  const examColor = tutorial.exam === 'see' ? 'var(--seafoam)' : 'var(--gold)';

  const allTutorials = tutorials;
  const currentIdx = allTutorials.findIndex((t) => t.id === slug);
  const prev = currentIdx > 0 ? allTutorials[currentIdx - 1] : null;
  const next = currentIdx < allTutorials.length - 1 ? allTutorials[currentIdx + 1] : null;

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: 'var(--navy-deep)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--muted)' }}>
          <Link href="/" className="hover:opacity-70 transition-opacity">Start</Link>
          <span>›</span>
          <Link href="/lernen" className="hover:opacity-70 transition-opacity">Wissen</Link>
          <span>›</span>
          <span style={{ color: 'var(--white)' }}>{tutorial.title}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <span
            className="inline-block text-xs px-3 py-1 rounded-full mb-4"
            style={{ background: `${examColor}20`, color: examColor, border: `1px solid ${examColor}40` }}
          >
            {examLabel}
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
          >
            {tutorial.title}
          </h1>
        </div>

        {/* Content */}
        <div
          className="rounded-2xl p-6 sm:p-8 mb-8"
          style={{
            background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-muted) 100%)',
            border: '1px solid rgba(200, 169, 81, 0.15)',
          }}
        >
          <TutorialContent content={tutorial.content} />
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          {prev ? (
            <Link
              href={`/lernen/${prev.id}`}
              className="flex-1 p-4 rounded-xl text-sm transition-all hover:scale-[1.02]"
              style={{
                background: 'rgba(17, 34, 64, 0.6)',
                border: '1px solid rgba(200, 169, 81, 0.1)',
                color: 'var(--muted)',
              }}
            >
              <div className="text-xs mb-1">← Vorheriges</div>
              <div style={{ color: 'var(--white)' }}>{prev.title}</div>
            </Link>
          ) : <div className="flex-1" />}

          {next ? (
            <Link
              href={`/lernen/${next.id}`}
              className="flex-1 p-4 rounded-xl text-sm text-right transition-all hover:scale-[1.02]"
              style={{
                background: 'rgba(17, 34, 64, 0.6)',
                border: '1px solid rgba(200, 169, 81, 0.1)',
                color: 'var(--muted)',
              }}
            >
              <div className="text-xs mb-1">Nächstes →</div>
              <div style={{ color: 'var(--white)' }}>{next.title}</div>
            </Link>
          ) : <div className="flex-1" />}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/lernen"
            className="text-sm transition-opacity hover:opacity-70"
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
                  style={{ color: 'var(--gold)', borderColor: 'rgba(200, 169, 81, 0.3)' }}
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr
                key={ri}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
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
          <h2 key={i} className="text-xl font-bold mt-6 mb-3" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--gold)' }}>
            {line.slice(3)}
          </h2>,
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-base font-semibold mt-4 mb-2" style={{ color: 'var(--seafoam)' }}>
            {line.slice(4)}
          </h3>,
        );
      } else if (line.startsWith('---')) {
        elements.push(
          <hr key={i} className="my-5" style={{ borderColor: 'rgba(200, 169, 81, 0.15)' }} />,
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <p key={i} className="text-sm mb-1.5 flex gap-2" style={{ color: 'rgba(248, 249, 250, 0.85)' }}>
            <span style={{ color: 'var(--gold)', flexShrink: 0 }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
          </p>,
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={i}
            className="px-4 py-3 rounded-lg mb-3 text-sm italic"
            style={{
              borderLeft: '3px solid var(--gold)',
              background: 'rgba(200, 169, 81, 0.08)',
              color: 'rgba(248, 249, 250, 0.8)',
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
            style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--seafoam)', fontFamily: 'monospace' }}
          >
            {codeLines.join('\n')}
          </pre>,
        );
      } else if (line === '') {
        elements.push(<div key={i} className="h-2" />);
      } else {
        elements.push(
          <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(248, 249, 250, 0.85)' }}>
            <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          </p>,
        );
      }
    }
    i++;
  }

  if (inTable) {
    flushTable(tableBuffer, `table-end`);
  }

  return <div>{elements}</div>;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, `<strong style="color:var(--white);font-weight:600">$1</strong>`)
    .replace(/\*(.+?)\*/g, `<em>$1</em>`);
}
