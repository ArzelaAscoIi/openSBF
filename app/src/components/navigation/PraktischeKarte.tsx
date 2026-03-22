'use client';

import React, { useRef, useCallback, useState } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

// ── Chart coordinate system ──────────────────────────────────────────────────
// Area: 53°35'N–54°25'N, 7°00'E–8°53'E  →  1200 × 900 px
// Scale: isotropic at 54°N  (1 nm = 18 px)
const CW = 1200;
const CH = 900;
const MAX_LAT = 54.417;
const MIN_LON = 7.0;
const PX_LAT = CH / ((54.417 - 53.583) * 60); // 18 px / arcmin
const PX_LON = PX_LAT * Math.cos((54 * Math.PI) / 180); // 10.58 px / arcmin

function _cx(lon: number) {
  return (lon - MIN_LON) * 60 * PX_LON;
}
function _cy(lat: number) {
  return (MAX_LAT - lat) * 60 * PX_LAT;
}
function p(lon: number, lat: number) {
  return `${_cx(lon).toFixed(0)},${_cy(lat).toFixed(0)}`;
}
function pts(...c: [number, number][]) {
  return c.map(([lo, la]) => p(lo, la)).join(' ');
}

// ── Types ────────────────────────────────────────────────────────────────────
type MarkType = 'sw' | 'nc' | 'sc' | 'ec' | 'red' | 'grn' | 'yel' | 'lt' | 'lm';
type DrawTool = 'pencil' | 'line' | 'erase';

interface NavMark {
  id: string;
  lon: number;
  lat: number;
  type: MarkType;
  label: string;
  sub?: string;
  tasks?: number[];
}
interface Pt {
  x: number;
  y: number;
}
interface DrawPath {
  type: DrawTool;
  pts: Pt[];
  color: string;
  width: number;
}

// ── Navigation marks data ────────────────────────────────────────────────────
const MARKS: NavMark[] = [
  // Safe water / Ansteuerungstonne (sw)
  { id: 'ST',      lon: 7.913, lat: 53.936, type: 'sw', label: 'ST',             sub: 'Iso.W.8s ●', tasks: [1,7,10,12,13] },
  { id: 'AccEe',   lon: 7.485, lat: 53.787, type: 'sw', label: 'Accumer Ee',     sub: 'Iso.W.8s ●', tasks: [3,4] },
  { id: 'OtzBal',  lon: 7.310, lat: 53.830, type: 'sw', label: 'Otzumer Balje',  sub: 'Iso.W.4s ●', tasks: [4,5] },
  { id: 'NordE',   lon: 8.367, lat: 54.017, type: 'sw', label: 'Norderelbe',     sub: 'Iso.W',       tasks: [14] },
  { id: 'SuePiep', lon: 8.283, lat: 54.008, type: 'sw', label: 'Süderpiep',      sub: 'Iso.W',       tasks: [14] },
  // Lighthouses (lt)
  { id: 'LtAW',    lon: 8.125, lat: 53.860, type: 'lt', label: 'Alte Weser',     sub: 'Oc.WRG.33m.23sm\nHorn Mo(AL)60s', tasks: [6,9,10,11,15] },
  { id: 'LtTeg',   lon: 8.223, lat: 53.800, type: 'lt', label: 'Tegeler Plate',  sub: 'Fl.W.20m',    tasks: [11] },
  { id: 'LtNW',    lon: 8.497, lat: 53.920, type: 'lt', label: 'Neuwerk',        sub: 'Fl(3)WRG.20s.38m', tasks: [9,14,15] },
  // Cardinal marks
  { id: 'NGN',     lon: 7.958, lat: 53.883, type: 'nc', label: 'NGN',            sub: 'Q',           tasks: [6,7,10] },
  { id: 'WTillN',  lon: 8.112, lat: 53.968, type: 'nc', label: 'Westertill-N',   sub: 'VQ',          tasks: [6] },
  { id: 'HelgO',   lon: 7.892, lat: 54.150, type: 'ec', label: 'Helgoland-O',    sub: 'VQ(3).5s',    tasks: [2,13] },
  { id: 'DuneS',   lon: 7.992, lat: 54.158, type: 'sc', label: 'Düne-S',         sub: 'Q(6)+Fl.15s', tasks: [13] },
  // Red lateral marks (red)
  { id: 'A2',      lon: 7.980, lat: 53.922, type: 'red', label: 'A2',                           tasks: [6,7,10] },
  { id: 'A10',     lon: 8.107, lat: 53.877, type: 'red', label: 'A10',                          tasks: [10] },
  { id: 'T4aNW',   lon: 7.867, lat: 53.875, type: 'red', label: '4a',    sub: 'Fl(3)R.13s',     tasks: [1,12] },
  { id: 'T10W',    lon: 7.890, lat: 53.833, type: 'red', label: '10',                           tasks: [12] },
  { id: 'T13NR',   lon: 8.470, lat: 53.973, type: 'red', label: '13/Neuwerk-Reede1',            tasks: [14] },
  { id: 'T8N',     lon: 8.333, lat: 53.958, type: 'red', label: '8',                            tasks: [14] },
  { id: 'TG16',    lon: 7.800, lat: 54.000, type: 'red', label: 'TG16/Reede', sub: 'Iso(3)R.12s', tasks: [8] },
  { id: 'T6E',     lon: 8.133, lat: 54.033, type: 'red', label: '6',                            tasks: [9] },
  { id: 'T14E',    lon: 8.017, lat: 54.108, type: 'red', label: '14',                           tasks: [9] },
  // Yellow special marks (yel)
  { id: 'AER2',    lon: 8.115, lat: 54.058, type: 'yel', label: 'Außenelbe-Reede 2', sub: 'Iso(3)Y.12s', tasks: [7] },
  { id: 'AER4',    lon: 8.113, lat: 54.075, type: 'yel', label: 'Außenelbe-Reede 4', sub: 'Fl.Y.4s',     tasks: [2] },
  { id: 'E2',      lon: 7.728, lat: 54.120, type: 'yel', label: 'E2',                           tasks: [8] },
  { id: 'E3',      lon: 7.923, lat: 54.060, type: 'yel', label: 'E3',                           tasks: [13] },
  // Green lateral marks (grn)
  { id: 'Jade1b',  lon: 7.733, lat: 53.873, type: 'grn', label: '1b/Jade1',  sub: 'Int.G.4s',   tasks: [3,5] },
  { id: 'T5NW',    lon: 7.952, lat: 53.852, type: 'grn', label: '5',         sub: 'Iso(2)G.9s', tasks: [11] },
  { id: 'TG15',    lon: 7.608, lat: 53.975, type: 'grn', label: 'TG15',                         tasks: [3] },
  { id: 'TG17',    lon: 7.747, lat: 53.983, type: 'grn', label: 'TG17/Weser1',                  tasks: [3] },
  { id: 'TG19',    lon: 7.743, lat: 53.917, type: 'grn', label: 'TG19/Weser 2',                 tasks: [1] },
  { id: 'T1E',     lon: 8.218, lat: 53.987, type: 'grn', label: '1',         sub: 'Fl.G',       tasks: [15] },
  // Landmarks (lm)
  { id: 'WTLang',  lon: 7.500, lat: 53.742, type: 'lm', label: 'Wasserturm\nLangeoog',          tasks: [5] },
  { id: 'KSpiek',  lon: 7.700, lat: 53.758, type: 'lm', label: 'Kirche\nSpiekeroog',            tasks: [4] },
];

// ── Mark symbol component ────────────────────────────────────────────────────
function MarkSvg({ m, highlight }: { m: NavMark; highlight?: boolean }) {
  const x = _cx(m.lon);
  const y = _cy(m.lat);

  const body = (() => {
    switch (m.type) {
      case 'sw':
        return (
          <>
            <circle cx={x} cy={y} r={6} fill="#fff" stroke="#cc0055" strokeWidth={1.5} />
            <line x1={x} y1={y - 3} x2={x} y2={y + 3} stroke="#cc0055" strokeWidth={2} />
            <circle cx={x} cy={y - 9} r={3} fill="#cc0055" />
          </>
        );
      case 'nc':
        return (
          <>
            <polygon points={`${x},${y - 9} ${x - 5},${y + 1} ${x + 5},${y + 1}`} fill="#1a1a1a" />
            <polygon points={`${x},${y + 9} ${x - 5},${y - 1} ${x + 5},${y - 1}`} fill="#daa520" />
            <polygon points={`${x - 3},${y - 16} ${x + 3},${y - 16} ${x},${y - 10}`} fill="#1a1a1a" />
            <polygon points={`${x - 3},${y - 12} ${x + 3},${y - 12} ${x},${y - 10}`} fill="#daa520" />
          </>
        );
      case 'sc':
        return (
          <>
            <polygon points={`${x},${y - 9} ${x - 5},${y + 1} ${x + 5},${y + 1}`} fill="#daa520" />
            <polygon points={`${x},${y + 9} ${x - 5},${y - 1} ${x + 5},${y - 1}`} fill="#1a1a1a" />
            <polygon points={`${x - 3},${y - 9} ${x + 3},${y - 9} ${x},${y - 15}`} fill="#daa520" />
            <polygon points={`${x - 3},${y - 5} ${x + 3},${y - 5} ${x},${y - 11}`} fill="#daa520" />
          </>
        );
      case 'ec':
        return (
          <>
            <rect x={x - 5} y={y - 9} width={10} height={6} fill="#daa520" />
            <rect x={x - 5} y={y - 3} width={10} height={6} fill="#1a1a1a" />
            <rect x={x - 5} y={y + 3} width={10} height={6} fill="#daa520" />
            <polygon points={`${x - 3},${y - 15} ${x + 3},${y - 15} ${x},${y - 9}`} fill="#1a1a1a" />
            <polygon points={`${x - 3},${y - 20} ${x + 3},${y - 20} ${x},${y - 15}`} fill="#daa520" />
          </>
        );
      case 'red':
        return (
          <polygon
            points={`${x},${y - 9} ${x - 5.5},${y + 4} ${x + 5.5},${y + 4}`}
            fill="#cc2222"
            stroke="#990000"
            strokeWidth={0.5}
          />
        );
      case 'grn':
        return (
          <polygon
            points={`${x},${y + 9} ${x - 5.5},${y - 4} ${x + 5.5},${y - 4}`}
            fill="#228b22"
            stroke="#005500"
            strokeWidth={0.5}
          />
        );
      case 'yel':
        return (
          <path
            d={`M${x},${y - 8} L${x + 8},${y} L${x},${y + 8} L${x - 8},${y} Z`}
            fill="#daa520"
            stroke="#a07010"
            strokeWidth={0.5}
          />
        );
      case 'lt':
        return (
          <>
            <circle cx={x} cy={y} r={8} fill="none" stroke="#c04000" strokeWidth={2} />
            <circle cx={x} cy={y} r={2.5} fill="#c04000" />
            <line x1={x} y1={y - 8} x2={x} y2={y - 15} stroke="#c04000" strokeWidth={2} />
            <circle cx={x} cy={y - 18} r={4} fill="#ffaa00" stroke="#c04000" strokeWidth={1} />
          </>
        );
      case 'lm':
        return (
          <>
            <circle cx={x} cy={y} r={3} fill="#555" />
            <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke="#555" strokeWidth={1} />
            <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke="#555" strokeWidth={1} />
          </>
        );
    }
  })();

  const labelLines = m.label.split('\n');
  const yOff = m.type === 'lt' ? 22 : 15;

  return (
    <g opacity={highlight ? 1 : 0.9}>
      {highlight && (
        <circle cx={x} cy={y} r={14} fill="rgba(255,220,0,0.25)" stroke="rgba(255,200,0,0.6)" strokeWidth={1.5} />
      )}
      {body}
      {labelLines.map((line, i) => (
        <text
          key={i}
          x={x}
          y={y + yOff + i * 8}
          textAnchor="middle"
          fontSize={7}
          fontFamily="Arial, sans-serif"
          fill="#1a2a3a"
          fontWeight={m.type === 'lt' ? 'bold' : 'normal'}
        >
          {line}
        </text>
      ))}
      {m.sub && (
        <text
          x={x}
          y={y + yOff + labelLines.length * 8}
          textAnchor="middle"
          fontSize={6}
          fontFamily="Arial, sans-serif"
          fill="#4a5a6a"
          fontStyle="italic"
        >
          {m.sub.split('\n')[0]}
        </text>
      )}
    </g>
  );
}

// ── Compass rose ─────────────────────────────────────────────────────────────
function CompassRose({ x, y, r, mw }: { x: number; y: number; r: number; mw: number }) {
  const dirs8 = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="rgba(250,250,245,0.88)" stroke="#2a3a4a" strokeWidth={0.8} />
      {Array.from({ length: 72 }, (_, i) => {
        const deg = i * 5;
        const rad = ((deg - 90) * Math.PI) / 180;
        const inner = r * (deg % 30 === 0 ? 0.68 : deg % 10 === 0 ? 0.78 : 0.86);
        return (
          <line
            key={deg}
            x1={x + inner * Math.cos(rad)}
            y1={y + inner * Math.sin(rad)}
            x2={x + r * Math.cos(rad)}
            y2={y + r * Math.sin(rad)}
            stroke="#2a3a4a"
            strokeWidth={deg % 30 === 0 ? 1.2 : 0.7}
          />
        );
      })}
      {dirs8.map((dir, i) => {
        const deg = i * 45;
        const rad = ((deg - 90) * Math.PI) / 180;
        return (
          <text
            key={dir}
            x={x + r * 0.58 * Math.cos(rad)}
            y={y + r * 0.58 * Math.sin(rad)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={dir.length === 1 ? 10 : 7}
            fontWeight="bold"
            fill="#1a2a3a"
          >
            {dir}
          </text>
        );
      })}
      {/* True north arrow */}
      <polygon
        points={`${x},${y - r * 0.9} ${x - 3},${y - r * 0.72} ${x + 3},${y - r * 0.72}`}
        fill="#1a2a3a"
      />
      {/* Magnetic north arrow (mw degrees offset) */}
      {mw !== 0 && (
        <line
          x1={x}
          y1={y}
          x2={x + r * 0.82 * Math.sin((mw * Math.PI) / 180)}
          y2={y - r * 0.82 * Math.cos((mw * Math.PI) / 180)}
          stroke="#cc4400"
          strokeWidth={1.5}
          strokeDasharray="4,2"
        />
      )}
      <circle cx={x} cy={y} r={3} fill="#1a2a3a" />
      <text x={x} y={y + r + 11} textAnchor="middle" fontSize={7.5} fill="#cc4400" fontStyle="italic">
        {`Mw ≈ ${mw}° E`}
      </text>
      <text x={x} y={y + r + 20} textAnchor="middle" fontSize={6.5} fill="#666">
        {'WGS 84 · 2012'}
      </text>
    </g>
  );
}

// ── Scale bar ─────────────────────────────────────────────────────────────────
function ScaleBar({ x, y }: { x: number; y: number }) {
  const smPx = PX_LAT; // 1 nm = 18 px
  const segments = [0, 5, 10, 15, 20];
  const totalPx = 20 * smPx;
  return (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={x + i * 5 * smPx}
          y={y - 5}
          width={5 * smPx}
          height={5}
          fill={i % 2 === 0 ? '#1a2a3a' : '#fff'}
          stroke="#1a2a3a"
          strokeWidth={0.5}
        />
      ))}
      {segments.map((sm) => (
        <g key={sm}>
          <line x1={x + sm * smPx} y1={y - 6} x2={x + sm * smPx} y2={y + 3} stroke="#1a2a3a" strokeWidth={0.8} />
          <text x={x + sm * smPx} y={y + 11} textAnchor="middle" fontSize={7} fill="#1a2a3a">
            {sm}
          </text>
        </g>
      ))}
      <text x={x + totalPx / 2} y={y + 20} textAnchor="middle" fontSize={7} fill="#1a2a3a">
        Seemeilen (sm)
      </text>
    </g>
  );
}

// ── Static SVG chart ──────────────────────────────────────────────────────────
function ChartSvg({ highlightTask, highlightMarkIds }: { highlightTask?: number; highlightMarkIds?: string[] }) {
  // Grid lines every 10' (major) and 2' (minor)
  const majorLat: number[] = [];
  const majorLon: number[] = [];
  const minorLat: number[] = [];
  const minorLon: number[] = [];
  for (let lat = 53.583; lat <= 54.417; lat += 10 / 60) majorLat.push(lat);
  for (let lon = 7.0; lon <= 8.89; lon += 10 / 60) majorLon.push(lon);
  for (let lat = 53.583; lat <= 54.417; lat += 2 / 60) {
    if (Math.round(lat * 60) % 10 !== 0) minorLat.push(lat);
  }
  for (let lon = 7.0; lon <= 8.89; lon += 2 / 60) {
    if (Math.round(lon * 60) % 10 !== 0) minorLon.push(lon);
  }

  return (
    <svg
      width={CW}
      height={CH}
      viewBox={`0 0 ${CW} ${CH}`}
      style={{ display: 'block', fontFamily: 'Arial, sans-serif' }}
    >
      <defs>
        <pattern id="watt-stipple" patternUnits="userSpaceOnUse" width={5} height={5}>
          <circle cx={2.5} cy={2.5} r={0.8} fill="#78a878" />
        </pattern>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#1a2a3a" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* ── Sea background ── */}
      <rect x={0} y={0} width={CW} height={CH} fill="#c4dff0" />

      {/* Slightly deeper open North Sea (top area) */}
      <rect x={0} y={0} width={CW} height={_cy(53.900)} fill="#b2d0e8" />

      {/* ── Watt (tidal flats): south of island chain ── */}
      <rect x={0} y={_cy(53.900)} width={CW} height={CH - _cy(53.900)} fill="#c0e0b4" />
      {/* Watt stipple pattern */}
      <rect x={0} y={_cy(53.900)} width={CW} height={CH - _cy(53.900)} fill="url(#watt-stipple)" opacity={0.35} />

      {/* Open sea channels between islands (Seegaten) — paint blue over watt */}
      {/* Norderneyer Seegat */}
      <rect x={_cx(7.09)} y={_cy(53.90)} width={_cx(7.14) - _cx(7.09)} height={CH - _cy(53.900)} fill="#b2d0e8" />
      {/* Otzumer Balje (Norderney–Baltrum, ~7°17'–7°22'E) */}
      <rect x={_cx(7.270)} y={_cy(53.86)} width={_cx(7.340) - _cx(7.270)} height={CH - _cy(53.86)} fill="#b2d0e8" />
      {/* Accumer Ee (Baltrum–Langeoog, ~7°26'–7°28'E) */}
      <rect x={_cx(7.430)} y={_cy(53.87)} width={_cx(7.465) - _cx(7.430)} height={CH - _cy(53.87)} fill="#b2d0e8" />
      {/* Blaue Balg (Langeoog–Spiekeroog, ~7°37'–7°39'E) */}
      <rect x={_cx(7.628)} y={_cy(53.88)} width={_cx(7.638) - _cx(7.628)} height={CH - _cy(53.88)} fill="#b2d0e8" />
      {/* Harle (Spiekeroog–Wangerooge, ~7°48'–7°51'E) */}
      <rect x={_cx(7.808)} y={_cy(53.88)} width={_cx(7.848) - _cx(7.808)} height={CH - _cy(53.88)} fill="#b2d0e8" />
      {/* Jade mouth (Wangerooge–Mellum, ~8°01'–8°04'E) */}
      <rect x={_cx(8.010)} y={_cy(53.87)} width={_cx(8.067) - _cx(8.010)} height={CH - _cy(53.87)} fill="#b2d0e8" />
      {/* Outer Weser/Elbe approach */}
      <rect x={_cx(8.08)} y={_cy(53.87)} width={_cx(8.22) - _cx(8.08)} height={CH - _cy(53.87)} fill="#b2d0e8" />

      {/* ── Shallow water zones (near Tegeler Plate, Westerems) ── */}
      <ellipse cx={_cx(8.1)} cy={_cy(53.82)} rx={60} ry={35} fill="#aacce0" opacity={0.4} />
      <ellipse cx={_cx(7.93)} cy={_cy(53.85)} rx={55} ry={30} fill="#aacce0" opacity={0.35} />

      {/* ── Mainland coast strip ── */}
      <rect x={0} y={_cy(53.617)} width={CW} height={CH - _cy(53.617)} fill="#eddea0" />
      <line x1={0} y1={_cy(53.617)} x2={CW} y2={_cy(53.617)} stroke="#a08020" strokeWidth={1.2} />

      {/* ── Island polygons ── */}
      {/* Juist (partly visible west) */}
      <polygon fill="#eedd98" stroke="#9a7818" strokeWidth={0.7}
        points={pts([6.98,53.698],[7.07,53.698],[7.065,53.713],[7.00,53.715])} />
      {/* Norderney */}
      <polygon fill="#eedd98" stroke="#9a7818" strokeWidth={0.7}
        points={pts([7.13,53.700],[7.23,53.698],[7.245,53.712],[7.23,53.722],[7.14,53.720],[7.118,53.708])} />
      {/* Baltrum */}
      <polygon fill="#eedd98" stroke="#9a7818" strokeWidth={0.7}
        points={pts([7.365,53.720],[7.413,53.720],[7.413,53.733],[7.365,53.733])} />
      {/* Langeoog – real extent ~7°28'–7°37'E, 53°43'–53°47'N */}
      <polygon fill="#eedd98" stroke="#9a7818" strokeWidth={0.7}
        points={pts([7.467,53.738],[7.530,53.730],[7.618,53.726],[7.628,53.748],[7.615,53.770],[7.590,53.778],[7.518,53.778],[7.468,53.762],[7.455,53.746])} />
      {/* Spiekeroog – real extent ~7°38'–7°48'E, 53°44'–53°48'N */}
      <polygon fill="#eedd98" stroke="#9a7818" strokeWidth={0.7}
        points={pts([7.638,53.745],[7.710,53.740],[7.793,53.740],[7.803,53.760],[7.790,53.778],[7.710,53.783],[7.648,53.763])} />
      {/* Wangerooge – real extent ~7°51'–8°01'E, 53°46'–53°50'N */}
      <polygon fill="#eedd98" stroke="#9a7818" strokeWidth={0.7}
        points={pts([7.852,53.770],[7.940,53.768],[7.990,53.768],[8.008,53.783],[8.000,53.800],[7.970,53.808],[7.870,53.808],[7.848,53.785])} />
      {/* Minsener Oog / Mellum (small island near Jade mouth) */}
      <ellipse cx={_cx(8.073)} cy={_cy(53.745)} rx={22} ry={15} fill="#eedd98" stroke="#9a7818" strokeWidth={0.7} />

      {/* Helgoland (reddish sandstone cliff) */}
      <polygon fill="#c0784c" stroke="#8a5020" strokeWidth={1.2}
        points={pts([7.860,54.160],[7.898,54.163],[7.915,54.180],[7.920,54.197],[7.905,54.205],[7.876,54.202],[7.860,54.188],[7.855,54.170])} />
      {/* Helgoland: cliff markings */}
      <polygon fill="#d0906a" stroke="none"
        points={pts([7.868,54.175],[7.898,54.172],[7.908,54.185],[7.900,54.200],[7.870,54.197])} />
      {/* Helgoland Düne (sandy flat) */}
      <ellipse cx={_cx(7.983)} cy={_cy(54.183)} rx={18} ry={9} fill="#eedd98" stroke="#9a7818" strokeWidth={0.7} />

      {/* Neuwerk (small square island) */}
      <rect x={_cx(8.479)} y={_cy(53.930)} width={25} height={22} rx={2} fill="#eedd98" stroke="#9a7818" strokeWidth={0.7} />
      {/* Scharhörn */}
      <ellipse cx={_cx(8.376)} cy={_cy(53.968)} rx={15} ry={8} fill="#eedd98" stroke="#9a7818" strokeWidth={0.7} />
      {/* Großer Vogelsand (sandbank) */}
      <ellipse cx={_cx(8.503)} cy={_cy(54.013)} rx={35} ry={14} fill="#eedd98" stroke="#9a7818" strokeWidth={0.5} opacity={0.7} />

      {/* ── Traffic Separation Scheme: VTG Jade Approach ── */}
      {/* Runs approx NNW–SSE, NW of Wangerooge, ~54°00'–09'N, 7°40'–55'E */}
      <polygon
        fill="rgba(160,160,240,0.22)"
        stroke="rgba(80,80,180,0.6)"
        strokeWidth={1}
        points={`${_cx(7.655)},${_cy(54.082)} ${_cx(7.712)},${_cy(54.082)} ${_cx(7.778)},${_cy(54.000)} ${_cx(7.720)},${_cy(54.000)}`}
      />
      {/* Separation zone */}
      <polygon
        fill="rgba(200,200,230,0.2)"
        stroke="none"
        points={`${_cx(7.712)},${_cy(54.082)} ${_cx(7.728)},${_cy(54.082)} ${_cx(7.793)},${_cy(54.000)} ${_cx(7.778)},${_cy(54.000)}`}
      />
      <polygon
        fill="rgba(160,160,240,0.22)"
        stroke="rgba(80,80,180,0.6)"
        strokeWidth={1}
        points={`${_cx(7.728)},${_cy(54.082)} ${_cx(7.785)},${_cy(54.082)} ${_cx(7.850)},${_cy(54.000)} ${_cx(7.793)},${_cy(54.000)}`}
      />
      {/* VTG label */}
      <text
        x={_cx(7.720)}
        y={_cy(54.042)}
        fontSize={7}
        fill="#4444aa"
        textAnchor="middle"
        transform={`rotate(-30, ${_cx(7.720)}, ${_cy(54.042)})`}
      >
        VTG Jade Approach
      </text>
      {/* Arrows indicating traffic direction */}
      <text x={_cx(7.685)} y={_cy(54.042)} fontSize={10} fill="#5555bb" textAnchor="middle">↑</text>
      <text x={_cx(7.758)} y={_cy(54.042)} fontSize={10} fill="#5555bb" textAnchor="middle">↓</text>

      {/* ── Fairway lines (dashed) ── */}
      {/* Alte Weser: Leuchtturm → ST */}
      <polyline
        points={`${_cx(8.125)},${_cy(53.860)} ${_cx(8.04)},${_cy(53.897)} ${_cx(7.913)},${_cy(53.936)}`}
        fill="none" stroke="#3070b0" strokeWidth={1.8} strokeDasharray="7,5" opacity={0.55}
      />
      {/* Neue Weser channel */}
      <polyline
        points={`${_cx(8.09)},${_cy(53.860)} ${_cx(7.95)},${_cy(53.870)} ${_cx(7.87)},${_cy(53.878)} ${_cx(7.77)},${_cy(53.930)} ${_cx(7.61)},${_cy(53.975)}`}
        fill="none" stroke="#3070b0" strokeWidth={1.8} strokeDasharray="7,5" opacity={0.55}
      />
      {/* Jade approach channel (north of Wangerooge → Harle entrance) */}
      <polyline
        points={`${_cx(7.735)},${_cy(53.870)} ${_cx(7.810)},${_cy(53.858)} ${_cx(7.870)},${_cy(53.848)}`}
        fill="none" stroke="#3070b0" strokeWidth={1.6} strokeDasharray="7,5" opacity={0.55}
      />
      {/* Elbe outer fairway */}
      <polyline
        points={`${_cx(8.218)},${_cy(53.987)} ${_cx(8.133)},${_cy(54.033)} ${_cx(8.017)},${_cy(54.108)}`}
        fill="none" stroke="#3070b0" strokeWidth={2} strokeDasharray="7,5" opacity={0.55}
      />
      {/* Neuwerk approach */}
      <polyline
        points={`${_cx(8.218)},${_cy(53.987)} ${_cx(8.333)},${_cy(53.958)} ${_cx(8.470)},${_cy(53.973)}`}
        fill="none" stroke="#3070b0" strokeWidth={1.5} strokeDasharray="7,5" opacity={0.5}
      />

      {/* ── Depth soundings ── */}
      {[
        { lon: 7.55,  lat: 54.10, d: '28' }, { lon: 7.40,  lat: 54.05, d: '18' },
        { lon: 7.75,  lat: 54.20, d: '42' }, { lon: 7.65,  lat: 54.15, d: '37' },
        { lon: 7.90,  lat: 54.25, d: '45' }, { lon: 7.95,  lat: 54.12, d: '35' },
        { lon: 8.20,  lat: 54.20, d: '22' }, { lon: 8.05,  lat: 54.00, d: '15' },
        { lon: 7.96,  lat: 53.92, d: '18,5' },{ lon: 8.11, lat: 53.96, d: '24' },
        { lon: 8.30,  lat: 53.97, d: '8'  }, { lon: 8.40,  lat: 54.06, d: '12' },
        { lon: 7.85,  lat: 53.95, d: '20' }, { lon: 7.70,  lat: 53.95, d: '15' },
        { lon: 7.80,  lat: 53.87, d: '8'  }, { lon: 8.15,  lat: 53.88, d: '12' },
        { lon: 7.38,  lat: 54.10, d: '25' }, { lon: 7.20,  lat: 54.15, d: '32' },
        { lon: 8.60,  lat: 54.10, d: '18' }, { lon: 8.70,  lat: 53.98, d: '10' },
      ].map((d, i) => (
        <text key={i} x={_cx(d.lon)} y={_cy(d.lat)} fontSize={7} fill="#2a4a6a" textAnchor="middle" fontStyle="italic">
          {d.d}
        </text>
      ))}

      {/* ── Wracks ── */}
      {[
        { lon: 7.683, lat: 54.175, depth: '53,6' },
        { lon: 7.733, lat: 53.812, depth: '3,7' },
        { lon: 7.720, lat: 53.807, depth: '1,4' },
      ].map((w, i) => (
        <g key={i} transform={`translate(${_cx(w.lon)}, ${_cy(w.lat)})`}>
          <line x1={-7} y1={0} x2={7} y2={0} stroke="#444" strokeWidth={1} />
          <line x1={-5} y1={3} x2={5} y2={3} stroke="#444" strokeWidth={1} />
          <line x1={0} y1={-6} x2={0} y2={7} stroke="#444" strokeWidth={1} />
          <text x={10} y={4} fontSize={6.5} fill="#2a4a6a" fontStyle="italic">{w.depth}</text>
        </g>
      ))}

      {/* Obstn (Schifffahrtshindernis) — task 15 */}
      <g transform={`translate(${_cx(8.157)}, ${_cy(53.938)})`}>
        <text x={0} y={1} fontSize={6} textAnchor="middle" dominantBaseline="middle" fill="#aa4400" fontStyle="italic">Obstn</text>
        <text x={0} y={9} fontSize={5.5} textAnchor="middle" fill="#aa4400" fontStyle="italic">9,7</text>
      </g>

      {/* Stromraute (current diamond) — task 3 */}
      <g transform={`translate(${_cx(7.613)}, ${_cy(53.825)})`}>
        <path d="M 0,-9 L 9,0 L 0,9 L -9,0 Z" fill="none" stroke="#555" strokeWidth={1} />
        <text x={0} y={1} fontSize={7} textAnchor="middle" dominantBaseline="middle" fill="#555" fontWeight="bold">A</text>
      </g>

      {/* ── Minor grid (every 2') ── */}
      {minorLon.map((lon, i) => (
        <line key={`ml${i}`} x1={_cx(lon)} y1={0} x2={_cx(lon)} y2={CH} stroke="#88a4b8" strokeWidth={0.3} strokeDasharray="2,5" opacity={0.5} />
      ))}
      {minorLat.map((lat, i) => (
        <line key={`mla${i}`} x1={0} y1={_cy(lat)} x2={CW} y2={_cy(lat)} stroke="#88a4b8" strokeWidth={0.3} strokeDasharray="2,5" opacity={0.5} />
      ))}

      {/* ── Major grid (every 10') ── */}
      {majorLon.map((lon, i) => (
        <line key={`gl${i}`} x1={_cx(lon)} y1={0} x2={_cx(lon)} y2={CH} stroke="#5878a0" strokeWidth={0.6} opacity={0.55} />
      ))}
      {majorLat.map((lat, i) => (
        <line key={`gla${i}`} x1={0} y1={_cy(lat)} x2={CW} y2={_cy(lat)} stroke="#5878a0" strokeWidth={0.6} opacity={0.55} />
      ))}

      {/* ── Grid labels ── */}
      {majorLon.map((lon, i) => {
        const deg = Math.floor(lon);
        const min = Math.round((lon - deg) * 60);
        const label = `${deg}°${String(min).padStart(2, '0')}' E`;
        return (
          <g key={`ll${i}`}>
            <text x={_cx(lon)} y={13} textAnchor="middle" fontSize={8} fill="#1a2a3a">{label}</text>
            <text x={_cx(lon)} y={CH - 4} textAnchor="middle" fontSize={8} fill="#1a2a3a">{label}</text>
          </g>
        );
      })}
      {majorLat.map((lat, i) => {
        const deg = Math.floor(lat);
        const min = Math.round((lat - deg) * 60);
        const label = `${deg}°${String(min).padStart(2, '0')}' N`;
        return (
          <g key={`lal${i}`}>
            <text x={8} y={_cy(lat) + 4} textAnchor="start" fontSize={8} fill="#1a2a3a">{label}</text>
            <text x={CW - 8} y={_cy(lat) + 4} textAnchor="end" fontSize={8} fill="#1a2a3a">{label}</text>
          </g>
        );
      })}

      {/* ── Navigation marks ── */}
      {MARKS.map((m) => (
        <MarkSvg
          key={m.id}
          m={m}
          highlight={
            highlightMarkIds
              ? highlightMarkIds.includes(m.id)
              : highlightTask !== undefined && (m.tasks?.includes(highlightTask) ?? false)
          }
        />
      ))}

      {/* ── Geographic names ── */}
      {[
        { lon: 7.543, lat: 53.752, label: 'LANGEOOG',               size: 8.5, italic: true },
        { lon: 7.717, lat: 53.758, label: 'SPIEKEROOG',              size: 8.5, italic: true },
        { lon: 7.928, lat: 53.787, label: 'WANGEROOGE',              size: 8.5, italic: true },
        { lon: 7.885, lat: 54.185, label: 'HELGOLAND',               size: 9,   italic: false },
        { lon: 8.498, lat: 53.918, label: 'NEUWERK',                 size: 8,   italic: true },
        { lon: 7.500, lat: 54.290, label: 'NORDSEE / DEUTSCHE BUCHT', size: 11, italic: true },
        { lon: 7.700, lat: 53.660, label: 'WATT',                    size: 10,  italic: true },
        { lon: 8.300, lat: 53.660, label: 'WATT',                    size: 9,   italic: true },
        { lon: 8.140, lat: 53.740, label: 'Jade/Weser Mündungen',    size: 8,   italic: true },
      ].map((lbl, i) => (
        <text
          key={i}
          x={_cx(lbl.lon)}
          y={_cy(lbl.lat)}
          textAnchor="middle"
          fontSize={lbl.size}
          fill="#1a2a3a"
          fontStyle={lbl.italic ? 'italic' : 'normal'}
          fontWeight={lbl.italic ? 'normal' : 'bold'}
          opacity={0.55}
          letterSpacing={1}
        >
          {lbl.label}
        </text>
      ))}

      {/* ── Compass rose ── */}
      <CompassRose x={_cx(7.23)} y={_cy(54.285)} r={54} mw={1} />

      {/* ── Scale bar ── */}
      <ScaleBar x={55} y={CH - 22} />

      {/* ── Chart title / frame box ── */}
      <g filter="url(#shadow)">
        <rect x={CW - 248} y={5} width={243} height={64} fill="rgba(252,252,248,0.92)" stroke="#1a2a3a" strokeWidth={0.8} />
        <text x={CW - 126} y={20} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#1a2a3a">ÜBUNGSKARTE – D 49</text>
        <text x={CW - 126} y={31} textAnchor="middle" fontSize={7.5} fill="#1a2a3a">Mündungen der Jade, Weser und Elbe</text>
        <text x={CW - 126} y={41} textAnchor="middle" fontSize={7} fill="#555">INT 1463 · Maßstab ca. 1 : 165 000</text>
        <text x={CW - 126} y={51} textAnchor="middle" fontSize={6.5} fill="#555">WGS 84 · Missweisung 0°–1° E (2012)</text>
        <text x={CW - 126} y={62} textAnchor="middle" fontSize={7} fill="#bb2200" fontStyle="italic">Für die Navigation nicht zu verwenden</text>
      </g>

      {/* ── Chart border ── */}
      <rect x={0} y={0} width={CW} height={CH} fill="none" stroke="#1a2a3a" strokeWidth={2} />
    </svg>
  );
}

// ── Drawing canvas hook ───────────────────────────────────────────────────────
function useDrawing(tool: DrawTool, color: string, lineWidth: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathsRef = useRef<DrawPath[]>([]);
  const isDrawing = useRef(false);
  const startPt = useRef<Pt>({ x: 0, y: 0 });
  const livePts = useRef<Pt[]>([]);
  const previewPt = useRef<Pt | null>(null);
  const [version, setVersion] = useState(0);

  const redrawAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pathsRef.current.forEach((path) => {
      if (path.pts.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(path.pts[0].x, path.pts[0].y);
      path.pts.forEach((pt) => ctx.lineTo(pt.x, pt.y));
      ctx.stroke();
    });
    if (tool === 'line' && previewPt.current) {
      const s = startPt.current;
      const e = previewPt.current;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.setLineDash([6, 4]);
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(e.x, e.y);
      ctx.stroke();
      ctx.setLineDash([]);
      const dx = e.x - s.x;
      const dy = e.y - s.y;
      const bearing = (((Math.atan2(dx, -dy) * 180) / Math.PI) + 360) % 360;
      const distSm = (Math.sqrt(dx * dx + dy * dy) / PX_LAT).toFixed(1);
      const label = `${bearing.toFixed(0)}°  ${distSm} sm`;
      ctx.font = 'bold 11px monospace';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(10,22,40,0.75)';
      ctx.strokeText(label, e.x + 8, e.y - 6);
      ctx.fillStyle = '#cc2200';
      ctx.fillText(label, e.x + 8, e.y - 6);
    }
  }, [tool, color, lineWidth]);

  const getPos = useCallback((e: React.PointerEvent<HTMLCanvasElement>): Pt => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (CW / rect.width),
      y: (e.clientY - rect.top) * (CH / rect.height),
    };
  }, []);

  const onDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const pt = getPos(e);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      if (tool === 'erase') {
        pathsRef.current = pathsRef.current.slice(0, -1);
        setVersion((v) => v + 1);
        return;
      }
      isDrawing.current = true;
      startPt.current = pt;
      livePts.current = [pt];
    },
    [tool, getPos],
  );

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current) return;
      const pt = getPos(e);
      if (tool === 'pencil') {
        livePts.current.push(pt);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const lp = livePts.current;
        if (lp.length >= 2) {
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = lineWidth;
          ctx.lineCap = 'round';
          ctx.moveTo(lp[lp.length - 2].x, lp[lp.length - 2].y);
          ctx.lineTo(lp[lp.length - 1].x, lp[lp.length - 1].y);
          ctx.stroke();
        }
      } else if (tool === 'line') {
        previewPt.current = pt;
        redrawAll();
      }
    },
    [tool, color, lineWidth, getPos, redrawAll],
  );

  const onUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current) return;
      isDrawing.current = false;
      const pt = getPos(e);
      if (tool === 'pencil' && livePts.current.length > 1) {
        pathsRef.current = [...pathsRef.current, { type: 'pencil', pts: [...livePts.current], color, width: lineWidth }];
        redrawAll();
      } else if (tool === 'line') {
        const dx = pt.x - startPt.current.x;
        const dy = pt.y - startPt.current.y;
        if (Math.sqrt(dx * dx + dy * dy) > 5) {
          pathsRef.current = [...pathsRef.current, { type: 'line', pts: [startPt.current, pt], color, width: lineWidth }];
        }
        previewPt.current = null;
        redrawAll();
      }
      livePts.current = [];
    },
    [tool, color, lineWidth, getPos, redrawAll],
  );

  const clear = useCallback(() => {
    pathsRef.current = [];
    previewPt.current = null;
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext('2d')?.clearRect(0, 0, CW, CH);
    setVersion((v) => v + 1);
  }, []);

  const undo = useCallback(() => {
    pathsRef.current = pathsRef.current.slice(0, -1);
    redrawAll();
    setVersion((v) => v + 1);
  }, [redrawAll]);

  return { canvasRef, onDown, onMove, onUp, clear, undo, version };
}

// ── INT1 Legend ───────────────────────────────────────────────────────────────
function Int1Legend() {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-300 hover:text-white transition-colors"
      >
        <span className="font-medium">INT 1 – Seekartenzeichen (Auszug)</span>
        <span className="text-slate-500 text-xs">{open ? '▲ Schließen' : '▼ Öffnen'}</span>
      </button>
      {open && (
        <div className="px-4 pb-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
            <h4 className="text-xs font-semibold text-amber-300 mb-2">Tiefenfarben</h4>
            <div className="space-y-1.5">
              {[
                { color: '#b2d0e8', label: 'Tiefes Wasser' },
                { color: '#c4dff0', label: 'Flaches Wasser' },
                { color: '#c0e0b4', label: 'Watt (trockenfallend)' },
                { color: '#eedd98', label: 'Land / Inseln' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded border border-white/20 flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-xs text-slate-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
            <h4 className="text-xs font-semibold text-blue-300 mb-2">Lateralzeichen (IALA A)</h4>
            <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
              <div>🔺 <span className="text-red-400">Rote Tonne</span> = Backbordseite (einlaufend)</div>
              <div>🔻 <span className="text-green-400">Grüne Tonne</span> = Steuerbordseite (einlaufend)</div>
              <div>⬦ <span className="text-yellow-400">Gelbe Tonne</span> = Sonderzeichen (Sperrgebiet u.a.)</div>
              <div>● <span className="text-pink-400">Rot/Weiß-Tonne</span> = Ansteuerungstonne (Fahrwassermitte)</div>
            </div>
          </div>
          <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
            <h4 className="text-xs font-semibold text-yellow-300 mb-2">Kardinalzeichen</h4>
            <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
              <div>▲▲ <strong>Nord</strong>: Nördlich der Gefahrenstelle passieren</div>
              <div>▼▼ <strong>Süd</strong>: Südlich passieren</div>
              <div>►► <strong>Ost</strong>: Östlich passieren</div>
              <div>◄◄ <strong>West</strong>: Westlich passieren</div>
            </div>
          </div>
          <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">Sonstige Zeichen</h4>
            <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
              <div>⚓ <strong>Wrack</strong> (Tiefe in Metern darunter)</div>
              <div>◇ A&nbsp; <strong>Stromraute</strong> = Gezeitenstromangabe</div>
              <div><em>Obstn</em>&nbsp; <strong>Schifffahrtshindernis</strong></div>
              <div>⊙ <strong>Leuchtturm</strong> = Oc/Fl/Iso Sektorfst.</div>
              <div>━━━ Fahrwasserach­se (gestrichelt)</div>
              <div>▓▓ VTG = Verkehrstrennung</div>
            </div>
          </div>
          <div className="col-span-2 md:col-span-4 rounded-lg border border-white/8 bg-white/[0.02] p-3">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">Lichtercharakter-Abkürzungen</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-1 text-xs">
              {[
                ['Iso', 'Gleichfeuer (Licht = Dunkel)'],
                ['Fl', 'Blitzfeuer (kurzer Blitz)'],
                ['Oc', 'Unterbrochenes Feuer'],
                ['Q / VQ', 'Funkelfeuer / Schnelles Ff.'],
                ['Fl(3)', 'Dreiergruppen-Blitzfeuer'],
                ['Int', 'Unterbrochenes Feuer'],
                ['WRG', 'Weiß/Rot/Grün Sektoren'],
                ['Mo(AL)', 'Morsezeichen „A" + „L"'],
              ].map(([abbr, desc]) => (
                <div key={abbr} className="flex gap-1.5">
                  <span className="font-mono text-amber-300 shrink-0 w-14">{abbr}</span>
                  <span className="text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-white/8 text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Formel Kurse:</strong>&nbsp; rwK = KK + D + Mw &nbsp;|&nbsp; MgK = rwK − D − Mw &nbsp;|&nbsp; rwP = MgP + D + Mw
              &nbsp;&nbsp;(D = Ablenkung/Deviation, Mw = Missweisung der Seekarte)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const DRAW_COLORS = [
  { c: '#cc2200', label: 'Rot' },
  { c: '#1144cc', label: 'Blau' },
  { c: '#111111', label: 'Schwarz' },
  { c: '#006600', label: 'Grün' },
];

export default function PraktischeKarte({ highlightTask, highlightMarkIds }: { highlightTask?: number; highlightMarkIds?: string[] }) {
  const [tool, setTool] = useState<DrawTool>('line');
  const [color, setColor] = useState('#cc2200');
  const [lineWidth, setLineWidth] = useState(1.5);
  const [zoom, setZoom] = useState(0.78);

  const { canvasRef, onDown, onMove, onUp, clear, undo } = useDrawing(tool, color, lineWidth);

  const cursorStyle: Record<DrawTool, string> = {
    pencil: 'crosshair',
    line: 'crosshair',
    erase: 'cell',
  };

  const tools = [
    { t: 'pencil' as DrawTool, icon: '✏️', label: 'Freihand' },
    { t: 'line' as DrawTool, icon: '📐', label: 'Peilung' },
    { t: 'erase' as DrawTool, icon: '⌫', label: 'Rückgängig' },
  ];

  return (
    <div style={{ background: 'var(--navy-deepest)' }}>
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-3 px-4 py-2 border-b text-xs"
        style={{ borderColor: 'var(--border)', background: 'var(--navy-deep)' }}
      >
        <div className="flex items-center gap-1">
          {tools.map(({ t, icon, label }) => (
            <button
              key={t}
              onClick={() => setTool(t)}
              className={`px-2.5 py-1 rounded border transition-colors ${
                tool === t
                  ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                  : 'border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-white/15" />

        <div className="flex items-center gap-1.5">
          {DRAW_COLORS.map(({ c }) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              title={c}
              className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
              style={{ background: c, borderColor: color === c ? '#fff' : 'transparent' }}
            />
          ))}
        </div>

        <div className="w-px h-4 bg-white/15" />

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Stärke:</span>
          {[1, 1.5, 2.5].map((w) => (
            <button
              key={w}
              onClick={() => setLineWidth(w)}
              className={`px-2 py-0.5 rounded border ${
                lineWidth === w ? 'border-amber-400 text-amber-300' : 'border-white/10 text-slate-400'
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-white/15" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(1)))}
            className="p-1 rounded border border-white/10 text-slate-400 hover:text-white"
          >
            <MinusIcon className="h-3 w-3" />
          </button>
          <span className="text-slate-400 w-9 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(2.0, +(z + 0.1).toFixed(1)))}
            className="p-1 rounded border border-white/10 text-slate-400 hover:text-white"
          >
            <PlusIcon className="h-3 w-3" />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span
            className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide"
            style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.22)' }}
          >
            Beta
          </span>
          <button
            onClick={undo}
            className="px-2.5 py-1 rounded border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            ↩ Rückgängig
          </button>
          <button
            onClick={clear}
            className="px-2.5 py-1 rounded border border-red-500/30 text-red-400 hover:border-red-500/60 transition-colors"
          >
            Zeichnung löschen
          </button>
        </div>
      </div>

      {/* Hint bar */}
      <div className="px-4 py-1.5 text-xs text-slate-500 border-b" style={{ borderColor: 'var(--border)' }}>
        {tool === 'line'
          ? '📐 Klicken und ziehen → Peilung mit Kurs-Anzeige (in °) und Distanz (in sm)'
          : tool === 'pencil'
          ? '✏️ Freihand zeichnen – z.B. Positionen markieren oder Kurse einzeichnen'
          : '⌫ Klicken entfernt die zuletzt gezeichnete Linie'}
        {highlightMarkIds && highlightMarkIds.length > 0 && (
          <span className="ml-3 text-amber-400/70">
            · Gelb hervorgehoben = relevante Zeichen für diesen Schritt
          </span>
        )}
        {!highlightMarkIds && highlightTask !== undefined && (
          <span className="ml-3 text-amber-400/70">
            · Gelb hervorgehoben = Schifffahrtszeichen aus Aufgabe {highlightTask}
          </span>
        )}
      </div>

      {/* Chart area */}
      <div
        className="overflow-auto"
        style={{ maxHeight: 'calc(100vh - 220px)', background: '#111f35' }}
      >
        <div
          style={{
            transformOrigin: 'top left',
            transform: `scale(${zoom})`,
            width: CW,
            height: CH,
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <ChartSvg highlightTask={highlightTask} highlightMarkIds={highlightMarkIds} />
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              cursor: cursorStyle[tool],
            }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
          />
        </div>
      </div>

      {/* INT1 Legend */}
      <Int1Legend />
    </div>
  );
}
