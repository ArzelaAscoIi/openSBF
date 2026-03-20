'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, ChevronRightIcon, ArrowLeftIcon, MapIcon, CalculatorIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { navAufgaben, NavAufgabe, NavQuestion, QTyp } from '@/data/nav-aufgaben';

// ─── tiny helpers ────────────────────────────────────────────────────────────

function norm(deg: number) {
  return ((deg % 360) + 360) % 360;
}

function fmtDeg(n: number) {
  return `${norm(n).toString().padStart(3, '0')}°`;
}

function fmtMin(min: number) {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h > 0) return `${h} h ${m} min`;
  return `${m} min`;
}

function addMinutes(uhr: string, min: number) {
  const [h, m] = uhr.split(':').map(Number);
  const total = h * 60 + m + Math.round(min);
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')} Uhr`;
}

// ─── badge helpers ────────────────────────────────────────────────────────────

const TYPE_META: Record<QTyp, { label: string; color: string }> = {
  chart:    { label: 'Kartenlesung',    color: 'rgba(251,191,36,0.15)' },
  karte:    { label: 'Seekarte',        color: 'rgba(156,163,175,0.12)' },
  mgk:      { label: 'Berechnung MgK', color: 'rgba(52,211,153,0.15)' },
  rwk:      { label: 'Berechnung rwK', color: 'rgba(52,211,153,0.15)' },
  peilung:  { label: 'Peilung',        color: 'rgba(96,165,250,0.15)' },
  zeit:     { label: 'Zeit',           color: 'rgba(167,139,250,0.15)' },
  ankunft:  { label: 'Ankunftszeit',   color: 'rgba(167,139,250,0.15)' },
  speed:    { label: 'Geschwindigkeit',color: 'rgba(167,139,250,0.15)' },
  koppelort:{ label: 'Koppelort',      color: 'rgba(251,146,60,0.15)' },
  bv:       { label: 'Besteckversetzung', color: 'rgba(251,146,60,0.15)' },
  info:     { label: 'Wissen',         color: 'rgba(148,163,184,0.12)' },
};

// ─── inline calculator components ────────────────────────────────────────────

function FormulaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="font-mono text-white text-sm">{value}</span>
    </div>
  );
}

function CalcBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm">
      {children}
    </div>
  );
}

function MgkCalculator({ q }: { q: NavQuestion }) {
  const { rwk = 0, dev = 0, mw = 0 } = q;
  const mgk = norm(rwk - dev - mw);
  return (
    <CalcBox>
      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2 font-medium">Formel: MgK = rwK − D − Mw</p>
      <FormulaRow label="rwK (aus Seekarte)" value={fmtDeg(rwk)} />
      <FormulaRow label={`Ablenkung D ${dev >= 0 ? '+' : ''}${dev}°`} value={`− ${Math.abs(dev)}°`} />
      <FormulaRow label={`Missweisung Mw ${mw >= 0 ? '+' : ''}${mw}°`} value={`− ${Math.abs(mw)}°`} />
      <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center">
        <span className="text-seafoam-300 font-medium">Ergebnis: MgK</span>
        <span className="font-mono text-seafoam-300 text-base font-semibold">{fmtDeg(mgk)}</span>
      </div>
    </CalcBox>
  );
}

function RwkCalculator({ q }: { q: NavQuestion }) {
  const { kk = 0, dev = 0, mw = 0 } = q;
  const rwk = norm(kk + dev + mw);
  return (
    <CalcBox>
      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2 font-medium">Formel: rwK = KK + D + Mw</p>
      <FormulaRow label="KK (gesteuert auf Kompass)" value={fmtDeg(kk)} />
      <FormulaRow label={`Ablenkung D ${dev >= 0 ? '+' : ''}${dev}°`} value={`+ ${Math.abs(dev)}°`} />
      <FormulaRow label={`Missweisung Mw ${mw >= 0 ? '+' : ''}${mw}°`} value={`+ ${Math.abs(mw)}°`} />
      <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center">
        <span className="text-seafoam-300 font-medium">Ergebnis: rwK</span>
        <span className="font-mono text-seafoam-300 text-base font-semibold">{fmtDeg(rwk)}</span>
      </div>
    </CalcBox>
  );
}

function PeilungCalculator({ q }: { q: NavQuestion }) {
  const entries = q.peilungen ?? [];
  return (
    <CalcBox>
      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2 font-medium">Formel: rwP = MgP + D + Mw</p>
      {entries.map((p, i) => (
        <div key={i} className="mb-3 last:mb-0">
          <p className="text-white/80 text-xs mb-1 font-medium">{p.name}</p>
          <div className="pl-3 border-l border-white/10">
            <FormulaRow label="MgP (gemessen)" value={fmtDeg(p.mgp)} />
            <FormulaRow label={`D ${p.dev >= 0 ? '+' : ''}${p.dev}°`} value={`+ ${Math.abs(p.dev)}°`} />
            <FormulaRow label={`Mw ${p.mw >= 0 ? '+' : ''}${p.mw}°`} value={`+ ${Math.abs(p.mw)}°`} />
            <div className="mt-1 pt-1 border-t border-white/10 flex justify-between items-center">
              <span className="text-blue-300 font-medium text-xs">rwP</span>
              <span className="font-mono text-blue-300 font-semibold">{fmtDeg(p.rwp)}</span>
            </div>
          </div>
        </div>
      ))}
    </CalcBox>
  );
}

function ZeitCalculator({ q }: { q: NavQuestion }) {
  const { distanz = 0, speed = 1 } = q;
  const min = (distanz / speed) * 60;
  return (
    <CalcBox>
      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2 font-medium">Formel: t = (Distanz / v) × 60</p>
      <FormulaRow label="Distanz" value={`${distanz} sm`} />
      <FormulaRow label="Fahrt über Grund" value={`${speed} kn`} />
      <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center">
        <span className="text-purple-300 font-medium">Ergebnis</span>
        <span className="font-mono text-purple-300 text-base font-semibold">{fmtMin(min)}</span>
      </div>
    </CalcBox>
  );
}

function AnkunftCalculator({ q }: { q: NavQuestion }) {
  const { distanz = 0, speed = 1, startUhr = '00:00' } = q;
  const min = (distanz / speed) * 60;
  const ankunft = addMinutes(startUhr, min);
  return (
    <CalcBox>
      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2 font-medium">Formel: Ankunft = Start + t</p>
      <FormulaRow label="Startzeit" value={startUhr + ' Uhr'} />
      <FormulaRow label="Distanz" value={`${distanz} sm`} />
      <FormulaRow label="Fahrt über Grund" value={`${speed} kn`} />
      <FormulaRow label="Fahrzeit" value={fmtMin(min)} />
      <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center">
        <span className="text-purple-300 font-medium">Ankunft</span>
        <span className="font-mono text-purple-300 text-base font-semibold">{ankunft}</span>
      </div>
    </CalcBox>
  );
}

function SpeedCalculator({ q }: { q: NavQuestion }) {
  const { distanz = 0, zeitMin = 1 } = q;
  const v = distanz / (zeitMin / 60);
  return (
    <CalcBox>
      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2 font-medium">Formel: v = Distanz / t</p>
      <FormulaRow label="Distanz" value={`${distanz} sm`} />
      <FormulaRow label="Zeit" value={fmtMin(zeitMin)} />
      <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center">
        <span className="text-purple-300 font-medium">Geschwindigkeit</span>
        <span className="font-mono text-purple-300 text-base font-semibold">{v.toFixed(1)} kn</span>
      </div>
    </CalcBox>
  );
}

function KoppelortInfo({ q }: { q: NavQuestion }) {
  const { rwk = 0, speed = 0, zeitMin = 0, startUhr = '' } = q;
  const distanz = speed * (zeitMin / 60);
  return (
    <CalcBox>
      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2 font-medium">Koppelortberechnung</p>
      <FormulaRow label="Kurs (rwK)" value={fmtDeg(rwk)} />
      <FormulaRow label="Fahrt über Grund" value={`${speed} kn`} />
      <FormulaRow label="Fahrzeit" value={fmtMin(zeitMin)} />
      <FormulaRow label="zurückgelegte Distanz" value={`${distanz.toFixed(1)} sm`} />
      {startUhr && <FormulaRow label="Von Position um" value={startUhr + ' Uhr'} />}
      <p className="mt-2 text-xs text-orange-300/80 pt-2 border-t border-white/10">
        In der Prüfung: Koppellinie in die Seekarte einzeichnen und Position ablesen.
      </p>
    </CalcBox>
  );
}

function BvInfo() {
  return (
    <CalcBox>
      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2 font-medium">Besteckversetzung</p>
      <p className="text-xs text-orange-300/80">
        Vergleich zwischen dem Koppelort (berechnet) und dem durch Peilung ermittelten tatsächlichen Standort.
        Ergebnis: Richtung und Distanz der Versetzung.
      </p>
      <p className="mt-2 text-xs text-slate-400">Format: BV = Kurs° − Distanz sm</p>
    </CalcBox>
  );
}

function ChartInfo() {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
      <MapIcon className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
      <p className="text-xs text-amber-300/80">
        Diese Frage erfordert Kartenlesung auf der <strong>Übungskarte D49</strong>.
        In der Prüfung: Wert von der Seekarte ablesen oder einmessen.
        Die offizielle Lösung aus dem ELWIS-Fragenkatalog ist unten sichtbar.
      </p>
    </div>
  );
}

function KarteInfo() {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-lg border border-slate-500/20 bg-slate-500/5 p-3">
      <MapIcon className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
      <p className="text-xs text-slate-400">
        Diese Aufgabe wird in der Prüfung auf der <strong>Seekarte D49</strong> eingetragen.
        Führe die Eintragung auf deiner Übungskarte durch.
      </p>
    </div>
  );
}

// ─── inline calculator dispatcher ────────────────────────────────────────────

function InlineCalc({ q }: { q: NavQuestion }) {
  if (q.typ === 'mgk') return <MgkCalculator q={q} />;
  if (q.typ === 'rwk') return <RwkCalculator q={q} />;
  if (q.typ === 'peilung') return <PeilungCalculator q={q} />;
  if (q.typ === 'zeit') return <ZeitCalculator q={q} />;
  if (q.typ === 'ankunft') return <AnkunftCalculator q={q} />;
  if (q.typ === 'speed') return <SpeedCalculator q={q} />;
  if (q.typ === 'koppelort') return <KoppelortInfo q={q} />;
  if (q.typ === 'bv') return <BvInfo />;
  if (q.typ === 'chart') return <ChartInfo />;
  if (q.typ === 'karte') return <KarteInfo />;
  return null;
}

// ─── question card ────────────────────────────────────────────────────────────

function QuestionCard({ q, defaultOpen }: { q: NavQuestion; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const [showAnswer, setShowAnswer] = useState(false);
  const meta = TYPE_META[q.typ];

  return (
    <div className="border border-white/8 rounded-xl overflow-hidden bg-white/[0.02]">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.03] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="shrink-0 w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-xs text-slate-400 font-mono">
          {q.nr}
        </span>
        <span className="flex-1 text-sm text-white/90 line-clamp-2 leading-snug">{q.frage.split('\n')[0]}</span>
        <span
          className="shrink-0 text-xs px-2 py-0.5 rounded font-medium"
          style={{ background: meta.color, color: 'rgba(255,255,255,0.7)' }}
        >
          {meta.label}
        </span>
        {open
          ? <ChevronDownIcon className="h-4 w-4 text-slate-400 shrink-0" />
          : <ChevronRightIcon className="h-4 w-4 text-slate-400 shrink-0" />
        }
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-white/8 pt-3">
          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{q.frage}</p>

          <InlineCalc q={q} />

          {!showAnswer ? (
            <button
              className="mt-3 text-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-300 hover:border-white/30 hover:text-white transition-colors"
              onClick={() => setShowAnswer(true)}
            >
              Lösung zeigen
            </button>
          ) : (
            <div className="mt-3 rounded-lg border border-seafoam-500/20 bg-seafoam-500/5 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircleIcon className="h-3.5 w-3.5 text-seafoam-400" />
                <span className="text-xs text-seafoam-400 font-medium uppercase tracking-wide">Offizielle Lösung (ELWIS)</span>
              </div>
              <p className="text-sm text-white/90 whitespace-pre-line leading-relaxed">{q.antwort}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── task detail ──────────────────────────────────────────────────────────────

function TaskDetail({ aufgabe }: { aufgabe: NavAufgabe }) {
  const [allOpen, setAllOpen] = useState(false);

  return (
    <div>
      <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-lg font-semibold text-white font-serif">
            Navigationsaufgabe {aufgabe.id}
          </h2>
          <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-2 py-1 rounded shrink-0">
            {aufgabe.datum}
          </span>
        </div>
        <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{aufgabe.szenario}</p>
        <div className="mt-3 pt-3 border-t border-white/8 flex flex-wrap gap-4 text-xs text-slate-400">
          <span>Übungskarte: <strong className="text-slate-300">D49 (Deutsche Bucht)</strong></span>
          <span>Missweisung: <strong className="text-seafoam-300 font-mono">{aufgabe.mw >= 0 ? '+' : ''}{aufgabe.mw}°</strong></span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-300">Aufgaben ({aufgabe.questions.length})</h3>
        <button
          className="text-xs text-slate-400 hover:text-white transition-colors"
          onClick={() => setAllOpen(!allOpen)}
        >
          {allOpen ? 'Alle schließen' : 'Alle öffnen'}
        </button>
      </div>

      <div className="space-y-2">
        {aufgabe.questions.map((q) => (
          <QuestionCard key={q.nr} q={q} defaultOpen={allOpen} />
        ))}
      </div>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function NavigationsaufgabenPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedTask = selectedId !== null ? navAufgaben.find((a) => a.id === selectedId) : null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy-deepest)' }}>
      {/* Header */}
      <div
        className="border-b"
        style={{ borderColor: 'var(--border)', background: 'var(--navy-deep)' }}
      >
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-1">
            <Link href="/navigation" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
            <h1 className="text-xl font-semibold text-white font-serif">Navigationsaufgaben</h1>
            <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">SBF See</span>
          </div>
          <p className="text-sm text-slate-400 ml-7">
            15 offizielle Prüfungsaufgaben mit interaktiven Berechnungen · Quelle: ELWIS (Stand August 2023)
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Legend */}
        <div className="mb-5 flex flex-wrap gap-2">
          {[
            { label: 'Kartenlesung', color: 'rgba(251,191,36,0.15)', text: 'amber' },
            { label: 'Berechnung', color: 'rgba(52,211,153,0.15)', text: 'seafoam' },
            { label: 'Peilung', color: 'rgba(96,165,250,0.15)', text: 'blue' },
            { label: 'Zeit/Geschw.', color: 'rgba(167,139,250,0.15)', text: 'purple' },
            { label: 'Koppelort', color: 'rgba(251,146,60,0.15)', text: 'orange' },
          ].map((item) => (
            <span
              key={item.label}
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: item.color, color: 'rgba(255,255,255,0.6)' }}
            >
              {item.label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Task grid */}
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2 font-medium">Aufgabe wählen</p>
            <div className="grid grid-cols-5 gap-1.5">
              {navAufgaben.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedId(a.id)}
                  className="aspect-square flex items-center justify-center rounded-lg border text-sm font-semibold transition-all"
                  style={
                    selectedId === a.id
                      ? { background: 'var(--gold)', borderColor: 'var(--gold)', color: '#0a1628' }
                      : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }
                  }
                >
                  {a.id}
                </button>
              ))}
            </div>

            {/* Info panel */}
            <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <InformationCircleIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-300">Prüfungshinweis</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Die Prüfung verwendet die <strong className="text-slate-300">Übungskarte D49</strong> (Jade, Weser, Elbe).
                Aus den 15 möglichen Fragetypen werden 9 Fragen je Aufgabe ausgewählt.
              </p>
              <div className="mt-3 space-y-1.5">
                {[
                  { icon: <MapIcon className="h-3.5 w-3.5" />, text: 'Kartenlesung: Karte D49 nötig' },
                  { icon: <CalculatorIcon className="h-3.5 w-3.5" />, text: 'Berechnung: Formel wird gezeigt' },
                  { icon: <CheckCircleIcon className="h-3.5 w-3.5" />, text: '"Lösung zeigen" für offiz. Antwort' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-slate-500">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task content */}
          <div>
            {selectedTask ? (
              <TaskDetail aufgabe={selectedTask} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-4">
                  <MapIcon className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Aufgabe auswählen</h3>
                <p className="text-sm text-slate-400 max-w-xs">
                  Wähle eine der 15 offiziellen Navigationsaufgaben aus dem Raster links, um sie interaktiv zu bearbeiten.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
