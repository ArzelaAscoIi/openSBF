'use client';

import { useRef, useState } from 'react';
import { exportProgress, loadProgress, mergeProgress, saveProgress, validateImport } from '@/lib/progress';

type Status = 'idle' | 'success' | 'error';

export function ProgressSync() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<Status>('idle');
  const [importMessage, setImportMessage] = useState('');

  function handleExport() {
    const json = exportProgress();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `opensbf-fortschritt-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const raw = ev.target?.result as string;
      const imported = validateImport(raw);

      if (!imported) {
        setImportStatus('error');
        setImportMessage('Ungültige Datei – bitte eine gültige OpenSBF-Exportdatei wählen.');
        return;
      }

      const current = loadProgress();
      const merged = mergeProgress(current, imported);
      saveProgress(merged);

      const importedCount = Object.keys(imported.questions).length;
      setImportStatus('success');
      setImportMessage(`${importedCount} Fragen importiert. Seite neu laden, um Fortschritt zu sehen.`);
    };
    reader.readAsText(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'var(--navy)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
            Fortschritt synchronisieren
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Exportiere deinen Lernstand als Datei und importiere ihn auf einem anderen Gerät.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 flex items-center gap-1.5"
          style={{ background: 'var(--gold)', color: 'var(--navy-deepest)' }}
        >
          <span>↓</span> Exportieren
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 flex items-center gap-1.5"
          style={{
            background: 'transparent',
            border: '1px solid var(--border-hover)',
            color: 'var(--white)',
          }}
        >
          <span>↑</span> Importieren
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleImport}
        />
      </div>

      {importStatus !== 'idle' && (
        <p
          className="mt-3 text-xs"
          style={{ color: importStatus === 'success' ? 'var(--green-signal)' : 'var(--red-signal)' }}
        >
          {importMessage}
          {importStatus === 'success' && (
            <button
              onClick={() => window.location.reload()}
              className="ml-2 underline opacity-80 hover:opacity-100"
            >
              Jetzt neu laden
            </button>
          )}
        </p>
      )}
    </div>
  );
}
