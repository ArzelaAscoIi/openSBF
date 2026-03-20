'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Math utilities ────────────────────────────────────────────────────────────

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;
const norm = (d: number) => ((d % 360) + 360) % 360;

/** Nautical course + length → SVG offset vector (0°=North=up, clockwise) */
function courseXY(angleDeg: number, len: number) {
  return { x: Math.sin(toRad(angleDeg)) * len, y: -Math.cos(toRad(angleDeg)) * len };
}

/** SVG offset vector → nautical course (degrees) */
function xyCourse(x: number, y: number) {
  return norm(toDeg(Math.atan2(x, -y)));
}

/** Speed of a vector */
const vecLen = (x: number, y: number) => Math.sqrt(x * x + y * y);

/** Abdrift: signed difference KüG - SK, normalized to [-180, 180] */
function abdrift(kug: number, sk: number) {
  return ((kug - sk + 540) % 360) - 180;
}

// ─── SVG: Arrow helper ─────────────────────────────────────────────────────────

function Arrow({
  x1, y1, x2, y2, color, dash = false, width = 2.5,
}: {
  x1: number; y1: number; x2: number; y2: number;
  color: string; dash?: boolean; width?: number;
}) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = vecLen(dx, dy);
  if (len < 2) return null;
  const ux = dx / len, uy = dy / len;
  const hLen = 11, sp = 0.38;
  const cs = Math.cos(sp), sn = Math.sin(sp);
  const h1x = x2 - hLen * (ux * cs - uy * sn);
  const h1y = y2 - hLen * (uy * cs + ux * sn);
  const h2x = x2 - hLen * (ux * cs + uy * sn);
  const h2y = y2 - hLen * (uy * cs - ux * sn);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={width} strokeLinecap="round"
        strokeDasharray={dash ? '8 5' : undefined} />
      <polygon points={`${x2},${y2} ${h1x},${h1y} ${h2x},${h2y}`} fill={color} />
    </g>
  );
}

// ─── SVG: Compass Rose ────────────────────────────────────────────────────────

function CompassRose({ courses }: { courses: { angle: number; color: string }[] }) {
  const cx = 160, cy = 160, r = 125;
  return (
    <svg viewBox="0 0 320 320" className="w-full select-none">
      <circle cx={cx} cy={cy} r={r + 16} fill="var(--navy)" stroke="var(--border)" strokeWidth={1} />
      {[1, 0.66, 0.33].map((f) => (
        <circle key={f} cx={cx} cy={cy} r={r * f} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
      ))}

      {/* Tick marks */}
      {Array.from({ length: 72 }, (_, i) => i * 5).map((deg) => {
        const isCard = deg % 90 === 0;
        const isInt = deg % 45 === 0 && !isCard;
        const isTen = deg % 10 === 0;
        const innerR = isCard ? r - 22 : isInt ? r - 16 : isTen ? r - 11 : r - 7;
        const x1 = cx + r * Math.sin(toRad(deg));
        const y1 = cy - r * Math.cos(toRad(deg));
        const x2 = cx + innerR * Math.sin(toRad(deg));
        const y2 = cy - innerR * Math.cos(toRad(deg));
        return (
          <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={isCard ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.14)'}
            strokeWidth={isCard ? 1.5 : 0.75} />
        );
      })}

      {/* Cardinal labels */}
      {([{ a: 0, l: 'N' }, { a: 45, l: 'NE' }, { a: 90, l: 'E' }, { a: 135, l: 'SE' },
        { a: 180, l: 'S' }, { a: 225, l: 'SW' }, { a: 270, l: 'W' }, { a: 315, l: 'NW' }] as { a: number; l: string }[])
        .map(({ a, l }) => (
          <text key={a}
            x={cx + (r + 28) * Math.sin(toRad(a))} y={cy - (r + 28) * Math.cos(toRad(a))}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={a % 90 === 0 ? 14 : 10} fontWeight={a % 90 === 0 ? '700' : '500'}
            fill={a % 90 === 0 ? 'var(--gold)' : 'rgba(255,255,255,0.4)'}
            fontFamily="Inter, sans-serif"
          >{l}</text>
        ))}

      {/* Inner degree labels */}
      {[30, 60, 120, 150, 210, 240, 300, 330].map((a) => (
        <text key={a}
          x={cx + (r - 30) * Math.sin(toRad(a))} y={cy - (r - 30) * Math.cos(toRad(a))}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={7.5} fill="rgba(255,255,255,0.2)" fontFamily="Inter, sans-serif"
        >{a}°</text>
      ))}

      {/* Center */}
      <circle cx={cx} cy={cy} r={4} fill="var(--navy-light)" stroke="rgba(255,255,255,0.35)" strokeWidth={1} />

      {/* Course arrows */}
      {courses.map(({ angle, color }, idx) => {
        const v = courseXY(norm(angle), r * 0.72);
        const ax = cx + v.x, ay = cy + v.y;
        return <Arrow key={idx} x1={cx} y1={cy} x2={ax} y2={ay} color={color} />;
      })}
    </svg>
  );
}

// ─── SVG: Vector Triangle ─────────────────────────────────────────────────────

function VectorTriangleSVG({
  steuerkurs, fdw, stromkurs, stromstaerke,
}: {
  steuerkurs: number; fdw: number; stromkurs: number; stromstaerke: number;
}) {
  const size = 300;
  const cx = size / 2, cy = size / 2;
  const maxSpeed = Math.max(fdw, stromstaerke, 0.1);
  const scale = (size / 2 - 52) / maxSpeed;

  const bv = courseXY(steuerkurs, fdw * scale);
  const cv = courseXY(stromkurs, stromstaerke * scale);
  const gv = { x: bv.x + cv.x, y: bv.y + cv.y };

  const O = { x: cx, y: cy };
  const B = { x: cx + bv.x, y: cy + bv.y };
  const G = { x: cx + gv.x, y: cy + gv.y };

  function midLabel(p1: { x: number; y: number }, p2: { x: number; y: number }, offset: number) {
    const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
    const dx = p2.x - p1.x, dy = p2.y - p1.y;
    const len = vecLen(dx, dy) || 1;
    return { x: mx - (dy / len) * offset, y: my + (dx / len) * offset };
  }

  const boatLabel = midLabel(O, B, 18);
  const stormLabel = midLabel(B, G, 18);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full select-none">
      <rect width={size} height={size} fill="var(--navy)" rx={12} />
      {/* Grid */}
      {[-60, 0, 60].map((i) => (
        <g key={i}>
          <line x1={cx + i} y1={10} x2={cx + i} y2={size - 10}
            stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
          <line x1={10} y1={cy + i} x2={size - 10} y2={cy + i}
            stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
        </g>
      ))}
      <text x={cx} y={13} textAnchor="middle" fontSize={9}
        fill="rgba(255,255,255,0.25)" fontFamily="Inter">N ↑</text>

      {/* Vectors */}
      <Arrow x1={O.x} y1={O.y} x2={B.x} y2={B.y} color="var(--seafoam)" />
      <Arrow x1={B.x} y1={B.y} x2={G.x} y2={G.y} color="var(--red-signal)" />
      <Arrow x1={O.x} y1={O.y} x2={G.x} y2={G.y} color="var(--gold)" dash />

      {/* Vector labels */}
      {fdw > 0 && (
        <text x={boatLabel.x} y={boatLabel.y} textAnchor="middle" dominantBaseline="middle"
          fontSize={8.5} fill="var(--seafoam)" fontFamily="Inter" fontWeight="600">
          SK {norm(steuerkurs)}° / {fdw} kn
        </text>
      )}
      {stromstaerke > 0 && (
        <text x={stormLabel.x} y={stormLabel.y} textAnchor="middle" dominantBaseline="middle"
          fontSize={8.5} fill="var(--red-signal)" fontFamily="Inter" fontWeight="600">
          Strom {norm(stromkurs)}° / {stromstaerke} kn
        </text>
      )}

      {/* Dots */}
      <circle cx={O.x} cy={O.y} r={4} fill="rgba(255,255,255,0.4)" />
      <circle cx={B.x} cy={B.y} r={3} fill="var(--seafoam)" fillOpacity={0.6} />
      <circle cx={G.x} cy={G.y} r={5} fill="var(--gold)" />
    </svg>
  );
}

// ─── Input component ──────────────────────────────────────────────────────────

function NumInput({
  label, value, onChange, min = 0, max = 359, step = 1, unit = '°', hint,
}: {
  label: string; value: number; onChange: (n: number) => void;
  min?: number; max?: number; step?: number; unit?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number" value={value} min={min} max={max} step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-24 px-3 py-2 rounded-lg text-sm font-mono tabular-nums outline-none"
          style={{
            background: 'var(--navy-muted)', border: '1px solid var(--border)',
            color: 'var(--white)', WebkitAppearance: 'none',
          } as React.CSSProperties}
        />
        <span className="text-sm" style={{ color: 'var(--muted)' }}>{unit}</span>
        {hint && <span className="text-xs" style={{ color: 'var(--muted)' }}>{hint}</span>}
      </div>
    </div>
  );
}

// ─── Result value display ─────────────────────────────────────────────────────

function ResultValue({
  label, value, unit = '°', color = 'var(--gold)',
}: {
  label: string; value: string | number; unit?: string; color?: string;
}) {
  return (
    <div className="text-center p-4 rounded-xl" style={{ background: 'var(--navy-muted)', border: '1px solid var(--border)' }}>
      <div className="text-2xl font-bold tabular-nums" style={{ color }}>
        {value}{unit}
      </div>
      <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  );
}

// ─── Practice problems ────────────────────────────────────────────────────────

const kompassProblems = [
  {
    question: 'KK = 035°, Ablenkung = +3°, Missweisung = +2°',
    hint: 'RWK = KK + Ablenkung + Missweisung',
    solution: 'RWK = 035° + 3° + 2° = 040°',
    answer: 40,
  },
  {
    question: 'KK = 170°, Ablenkung = −4°, Missweisung = +7°',
    hint: 'RWK = KK + Ablenkung + Missweisung',
    solution: 'RWK = 170° − 4° + 7° = 173°',
    answer: 173,
  },
  {
    question: 'RWK = 090°, Ablenkung = +5°, Missweisung = −3°',
    hint: 'KK = RWK − Ablenkung − Missweisung',
    solution: 'KK = 090° − 5° − (−3°) = 090° − 5° + 3° = 088°',
    answer: 88,
  },
  {
    question: 'KK = 280°, Ablenkung = −2°, Missweisung = +6°',
    hint: 'RWK = KK + Ablenkung + Missweisung',
    solution: 'RWK = 280° − 2° + 6° = 284°',
    answer: 284,
  },
  {
    question: 'RWK = 315°, Ablenkung = −6°, Missweisung = +4°',
    hint: 'KK = RWK − Ablenkung − Missweisung',
    solution: 'KK = 315° − (−6°) − 4° = 315° + 6° − 4° = 317°',
    answer: 317,
  },
];

const kursDreieckProblems = [
  {
    question: 'Steuerkurs 090°, FdW 5 kn — Strom fließt nach 180° mit 2 kn',
    hint: 'Vektoren addieren: Boot + Strom = Kurs über Grund',
    solution: 'KüG ≈ 112°, FüG ≈ 5,4 kn (Abdrift +22° nach Stb)',
    sk: 90, fdw: 5, stromkurs: 180, stromstaerke: 2,
  },
  {
    question: 'Steuerkurs 000°, FdW 6 kn — Strom fließt nach 090° mit 3 kn',
    hint: 'Strom schiebt nach Steuerbord (Ost)',
    solution: 'KüG ≈ 027°, FüG ≈ 6,7 kn (Abdrift +27° nach Stb)',
    sk: 0, fdw: 6, stromkurs: 90, stromstaerke: 3,
  },
  {
    question: 'Steuerkurs 045°, FdW 5 kn — Strom fließt nach 270° mit 2 kn',
    hint: 'Strom schiebt nach Backbord (West) — reduziert die Abdrift',
    solution: 'KüG ≈ 024°, FüG ≈ 3,9 kn (Abdrift −21° nach Bb)',
    sk: 45, fdw: 5, stromkurs: 270, stromstaerke: 2,
  },
  {
    question: 'Steuerkurs 180°, FdW 4 kn — Strom fließt nach 270° mit 3 kn',
    hint: 'Strom von Osten schiebt nach Backbord',
    solution: 'KüG ≈ 143°, FüG = 5,0 kn (Abdrift −37° nach Bb)',
    sk: 180, fdw: 4, stromkurs: 270, stromstaerke: 3,
  },
];

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = 'kompass' | 'kursdreieck' | 'ueben';

// ─── Kompasskorrektur Tab ─────────────────────────────────────────────────────

function KompassTab() {
  const [mode, setMode] = useState<'kk-to-rwk' | 'rwk-to-kk'>('kk-to-rwk');
  const [kk, setKk] = useState(45);
  const [dev, setDev] = useState(3);
  const [variation, setVariation] = useState(2);

  const rwk = norm(kk + dev + variation);
  const kkResult = norm(kk - dev - variation); // when mode = rwk-to-kk, kk is the input RWK

  const inputAngle = mode === 'kk-to-rwk' ? kk : kk;
  const outputAngle = mode === 'kk-to-rwk' ? rwk : kkResult;
  const inputLabel = mode === 'kk-to-rwk' ? 'KK' : 'RWK';
  const outputLabel = mode === 'kk-to-rwk' ? 'RWK' : 'KK';

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Controls */}
      <div className="space-y-6">
        {/* Mode toggle */}
        <div
          className="flex rounded-lg p-1 gap-1"
          style={{ background: 'var(--navy-muted)', border: '1px solid var(--border)' }}
        >
          {(['kk-to-rwk', 'rwk-to-kk'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all"
              style={{
                background: mode === m ? 'var(--navy-light)' : 'transparent',
                color: mode === m ? 'var(--white)' : 'var(--muted)',
                border: mode === m ? '1px solid var(--border-hover)' : '1px solid transparent',
              }}
            >
              {m === 'kk-to-rwk' ? 'KK → RWK' : 'RWK → KK'}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <NumInput
            label={`${inputLabel} — ${mode === 'kk-to-rwk' ? 'Kompasskurs' : 'Rechtweisender Kurs'}`}
            value={kk} onChange={setKk} min={0} max={359}
          />
          <NumInput
            label="Ablenkung (Deviation D)"
            value={dev} onChange={setDev} min={-30} max={30}
            hint="+ Ost, − West"
          />
          <NumInput
            label="Missweisung (Variation W)"
            value={variation} onChange={setVariation} min={-30} max={30}
            hint="+ Ost, − West"
          />
        </div>

        {/* Formula */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'var(--navy)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>Formel</p>
          <p className="text-sm font-mono" style={{ color: 'var(--white)' }}>
            {mode === 'kk-to-rwk'
              ? `RWK = ${kk}° + (${dev >= 0 ? '+' : ''}${dev}°) + (${variation >= 0 ? '+' : ''}${variation}°) = ${rwk}°`
              : `KK = ${kk}° − (${dev >= 0 ? '+' : ''}${dev}°) − (${variation >= 0 ? '+' : ''}${variation}°) = ${kkResult}°`}
          </p>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-3">
          <ResultValue
            label={inputLabel}
            value={inputAngle}
            color="var(--seafoam)"
          />
          <ResultValue
            label={outputLabel}
            value={outputAngle}
            color="var(--gold)"
          />
        </div>

        {/* Reference table */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'var(--navy)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>Kurskorrektur-Schema</p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {[
              { label: 'MK', sub: 'Magnetkurs', formula: 'KK + D' },
              { label: 'RWK', sub: 'Rechtweisend', formula: 'MK + W' },
              { label: 'KK', sub: 'Kompasskurs', formula: 'RWK − W − D' },
            ].map((item) => (
              <div key={item.label} className="p-2 rounded-lg" style={{ background: 'var(--navy-muted)' }}>
                <div className="font-bold" style={{ color: 'var(--white)' }}>{item.label}</div>
                <div style={{ color: 'var(--muted)' }}>{item.sub}</div>
                <div className="mt-1 font-mono text-xs" style={{ color: 'var(--gold)' }}>{item.formula}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compass */}
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>Kompassrose</p>
        <CompassRose courses={[
          { angle: inputAngle, color: 'var(--seafoam)' },
          { angle: outputAngle, color: 'var(--gold)' },
        ]} />
        <div className="flex justify-center gap-6 mt-3">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
            <span className="inline-block w-4 h-0.5" style={{ background: 'var(--seafoam)' }} />
            {inputLabel} {inputAngle}°
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
            <span className="inline-block w-4 h-0.5" style={{ background: 'var(--gold)' }} />
            {outputLabel} {outputAngle}°
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Kursdreieck Tab ──────────────────────────────────────────────────────────

function KursDreieckTab() {
  const [sk, setSk] = useState(90);
  const [fdw, setFdw] = useState(5);
  const [stromkurs, setStromkurs] = useState(180);
  const [stromstaerke, setStromstaerke] = useState(2);

  const bv = courseXY(sk, fdw);
  const cv = courseXY(stromkurs, stromstaerke);
  const gv = { x: bv.x + cv.x, y: bv.y + cv.y };
  const kug = Math.round(xyCourse(gv.x, gv.y));
  const fug = parseFloat(vecLen(gv.x, gv.y).toFixed(1));
  const ab = parseFloat(abdrift(kug, sk).toFixed(1));

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Controls */}
      <div className="space-y-5">
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>
            Boot — Kurs durchs Wasser
          </p>
          <div className="grid grid-cols-2 gap-4">
            <NumInput label="Steuerkurs (SK)" value={sk} onChange={setSk} min={0} max={359} />
            <NumInput label="Fahrt d. Wasser" value={fdw} onChange={setFdw} min={0} max={30} step={0.5} unit="kn" />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>
            Strom — Richtung & Stärke
          </p>
          <div className="grid grid-cols-2 gap-4">
            <NumInput label="Stromkurs (fließt nach)" value={stromkurs} onChange={setStromkurs} min={0} max={359} />
            <NumInput label="Stromstärke" value={stromstaerke} onChange={setStromstaerke} min={0} max={10} step={0.5} unit="kn" />
          </div>
        </div>

        {/* Results */}
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>Ergebnis</p>
          <div className="grid grid-cols-3 gap-3">
            <ResultValue label="KüG" value={kug} color="var(--gold)" />
            <ResultValue label="FüG" value={fug} unit=" kn" color="var(--green-signal)" />
            <ResultValue
              label={`Abdrift ${ab > 0 ? '(Stb)' : ab < 0 ? '(Bb)' : ''}`}
              value={ab > 0 ? `+${ab}` : ab}
              color={ab === 0 ? 'var(--muted)' : ab > 0 ? 'var(--seafoam)' : 'var(--red-signal)'}
            />
          </div>
        </div>

        {/* Legend */}
        <div
          className="p-4 rounded-xl space-y-2"
          style={{ background: 'var(--navy)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>Legende</p>
          {[
            { color: 'var(--seafoam)', label: 'Steuerkurs + FdW', desc: 'Kurs durchs Wasser' },
            { color: 'var(--red-signal)', label: 'Stromvektor', desc: 'Richtung & Stärke des Stroms' },
            { color: 'var(--gold)', label: 'KüG (gestrichelt)', desc: 'Resultierender Kurs über Grund' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-xs">
              <span className="w-6 h-0.5 shrink-0" style={{ background: item.color }} />
              <span style={{ color: 'var(--white)' }}>{item.label}</span>
              <span style={{ color: 'var(--muted)' }}>— {item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vector triangle */}
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>Kursdreieck</p>
        <VectorTriangleSVG
          steuerkurs={sk} fdw={fdw} stromkurs={stromkurs} stromstaerke={stromstaerke}
        />
        <p className="text-xs text-center mt-3" style={{ color: 'var(--muted)' }}>
          Vektoren: SK + Strom = KüG
        </p>
      </div>
    </div>
  );
}

// ─── Übungsaufgaben Tab ───────────────────────────────────────────────────────

function UebenTab() {
  const [type, setType] = useState<'kompass' | 'kursdreieck'>('kompass');
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const problems = type === 'kompass' ? kompassProblems : kursDreieckProblems;

  const toggleReveal = (i: number) =>
    setRevealed((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="space-y-6">
      {/* Type toggle */}
      <div
        className="flex rounded-lg p-1 gap-1 max-w-sm"
        style={{ background: 'var(--navy-muted)', border: '1px solid var(--border)' }}
      >
        {(['kompass', 'kursdreieck'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setType(t); setRevealed({}); }}
            className="flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all"
            style={{
              background: type === t ? 'var(--navy-light)' : 'transparent',
              color: type === t ? 'var(--white)' : 'var(--muted)',
              border: type === t ? '1px solid var(--border-hover)' : '1px solid transparent',
            }}
          >
            {t === 'kompass' ? 'Kompasskorrektur' : 'Kursdreieck'}
          </button>
        ))}
      </div>

      {/* Problems */}
      <div className="space-y-3">
        {problems.map((p, i) => (
          <div
            key={i}
            className="p-5 rounded-xl"
            style={{ background: 'var(--navy)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{ background: 'rgba(188,147,50,0.12)', color: 'var(--gold)', border: '1px solid rgba(188,147,50,0.2)' }}
                  >
                    Aufgabe {i + 1}
                  </span>
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--white)' }}>
                  {p.question}
                </p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  Hinweis: {p.hint}
                </p>

                {revealed[i] && (
                  <div
                    className="mt-3 px-4 py-3 rounded-lg text-sm font-mono"
                    style={{
                      background: 'rgba(18,184,112,0.08)',
                      border: '1px solid rgba(18,184,112,0.2)',
                      color: 'var(--green-signal)',
                    }}
                  >
                    {p.solution}
                  </div>
                )}
              </div>

              <button
                onClick={() => toggleReveal(i)}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                style={{
                  background: revealed[i] ? 'rgba(255,255,255,0.06)' : 'var(--gold)',
                  color: revealed[i] ? 'var(--muted)' : 'var(--navy-deepest)',
                }}
              >
                {revealed[i] ? 'Verbergen' : 'Lösung'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        className="p-4 rounded-xl text-xs"
        style={{ background: 'var(--navy)', border: '1px solid var(--border)', color: 'var(--muted)' }}
      >
        Übe die Aufgaben zuerst mit dem Rechner im jeweiligen Tab — erst dann die Lösung aufdecken.
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NavigationPage() {
  const [tab, setTab] = useState<Tab>('kompass');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'kompass', label: 'Kompasskorrektur' },
    { id: 'kursdreieck', label: 'Kursdreieck' },
    { id: 'ueben', label: 'Übungsaufgaben' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy-deep)' }}>
      {/* Header */}
      <div className="border-b px-4 py-10" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto">
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
            Navigation
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Interaktive Rechner für Kompasskorrektur und Kursdreieck (Strömungsdreieck) — SBF See
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
                style={{
                  borderColor: tab === t.id ? 'var(--gold)' : 'transparent',
                  color: tab === t.id ? 'var(--white)' : 'var(--muted)',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {tab === 'kompass' && <KompassTab />}
        {tab === 'kursdreieck' && <KursDreieckTab />}
        {tab === 'ueben' && <UebenTab />}
      </div>
    </div>
  );
}
