import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { ComplexityMetrics } from '../types';
import { Gauge, ShieldCheck, Zap, Info, Award } from 'lucide-react';

interface ComplexityGaugeProps {
  metrics?: ComplexityMetrics;
  projectTitle: string;
}

export default function ComplexityGauge({ metrics, projectTitle }: ComplexityGaugeProps) {
  const [activeDimension, setActiveDimension] = useState<number | null>(null);

  // Fallback if custom synthesized project doesn't have explicit metrics
  const resolvedMetrics: ComplexityMetrics = useMemo(() => {
    if (metrics) return metrics;
    return {
      overallScore: 88,
      tier: 'Staff',
      difficultyRank: 'Top 5% Next.js Engineers',
      dimensions: [
        { name: 'Server Actions Boundary', score: 89, description: 'High-frequency mutation handling and optimistic state updates' },
        { name: 'Streaming RSC Hydration', score: 86, description: 'Edge-rendered server component streaming without layout shift' },
        { name: 'Distributed Cache Tags', score: 85, description: 'Targeted cache invalidation via revalidateTag across Edge nodes' },
        { name: 'Zero-Lag Concurrency', score: 92, description: 'Race-condition prevention and atomic transaction isolation' },
      ],
    };
  }, [metrics]);

  const score = resolvedMetrics.overallScore;

  // D3 Gauge Calculations
  const { bgArcPath, valueArcPath, needleCoords, ticks } = useMemo(() => {
    const width = 280;
    const height = 160;
    const radius = 110;
    const innerRadius = 88;
    const center = { x: width / 2, y: height - 20 };

    // Angle range: -120 deg to +120 deg (in radians: -2/3 pi to +2/3 pi)
    const minAngle = -Math.PI * 0.65;
    const maxAngle = Math.PI * 0.65;

    const angleScale = d3.scaleLinear()
      .domain([0, 100])
      .range([minAngle, maxAngle])
      .clamp(true);

    const arcGenerator = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(6);

    // Background track arc
    const bgArc = arcGenerator({
      startAngle: minAngle,
      endAngle: maxAngle,
      innerRadius,
      outerRadius: radius,
    });

    // Score value arc
    const valueArc = arcGenerator({
      startAngle: minAngle,
      endAngle: angleScale(score),
      innerRadius,
      outerRadius: radius,
    });

    // Indicator Needle / Pip coordinates
    const targetAngle = angleScale(score) - Math.PI / 2; // adjust for SVG coordinate system (0 is at 3 o'clock)
    const needleDistance = (innerRadius + radius) / 2;
    const pipX = center.x + needleDistance * Math.cos(targetAngle);
    const pipY = center.y + needleDistance * Math.sin(targetAngle);

    // Minor & Major Tick marks along arc
    const tickValues = [0, 25, 50, 75, 100];
    const tickMarks = tickValues.map((val) => {
      const a = angleScale(val) - Math.PI / 2;
      const x1 = center.x + (innerRadius - 4) * Math.cos(a);
      const y1 = center.y + (innerRadius - 4) * Math.sin(a);
      const x2 = center.x + (radius + 4) * Math.cos(a);
      const y2 = center.y + (radius + 4) * Math.sin(a);
      const labelX = center.x + (innerRadius - 16) * Math.cos(a);
      const labelY = center.y + (innerRadius - 16) * Math.sin(a);
      return { val, x1, y1, x2, y2, labelX, labelY };
    });

    return {
      bgArcPath: bgArc || '',
      valueArcPath: valueArc || '',
      needleCoords: { x: pipX, y: pipY },
      ticks: tickMarks,
    };
  }, [score]);

  // Color mapping based on score
  const tierColor = useMemo(() => {
    if (score >= 95) return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', gradient: 'from-purple-500 via-indigo-500 to-rose-500' };
    if (score >= 90) return { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', gradient: 'from-cyan-500 via-indigo-500 to-purple-500' };
    if (score >= 80) return { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', gradient: 'from-emerald-500 via-cyan-500 to-indigo-500' };
    return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', gradient: 'from-emerald-500 to-cyan-500' };
  }, [score]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 font-mono">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-2">
              Architectural Complexity Score
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${tierColor.bg} ${tierColor.text} ${tierColor.border}`}>
                {resolvedMetrics.tier} TIER
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Evaluated against Staff & Principal Next.js 15 production benchmarks
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Difficulty Rank: <strong className="text-slate-200">{resolvedMetrics.difficultyRank}</strong></span>
        </div>
      </div>

      {/* Main Grid: D3 Gauge Arc on Left, Dimensional Vectors on Right */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* D3 Radial Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <svg
            viewBox="0 0 280 160"
            className="w-full max-w-[260px] h-auto overflow-visible select-none"
            aria-label={`Complexity score: ${score} out of 100`}
          >
            <defs>
              {/* Radial gradient for the arc */}
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="85%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>

              {/* Glow filter for the pointer */}
              <filter id="gaugeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Background Arc */}
            <path
              d={bgArcPath}
              fill="#1e293b"
              className="transition-all duration-500"
              transform="translate(140, 140)"
            />

            {/* Value Arc (D3 computed) */}
            <path
              d={valueArcPath}
              fill="url(#gaugeGradient)"
              className="transition-all duration-700 ease-out"
              transform="translate(140, 140)"
            />

            {/* Tick Marks */}
            {ticks.map((t) => (
              <g key={t.val}>
                <line
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <text
                  x={t.labelX}
                  y={t.labelY}
                  fill="#64748b"
                  fontSize="8"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="monospace"
                >
                  {t.val}
                </text>
              </g>
            ))}

            {/* Active Indicator Pip with Glow */}
            <circle
              cx={needleCoords.x}
              cy={needleCoords.y}
              r="7"
              fill="#ffffff"
              stroke="#6366f1"
              strokeWidth="3"
              filter="url(#gaugeGlow)"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center Score Readout */}
          <div className="text-center -mt-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {score}
              </span>
              <span className="text-slate-500 text-sm font-semibold">/100</span>
            </div>
            <div className="text-[11px] font-bold text-indigo-300 mt-0.5">
              {score >= 95 ? 'Principal & Staff Benchmark' : 'High-Concurrence Staff Grade'}
            </div>
          </div>
        </div>

        {/* 4 Dimensional Technical Vector Bars */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between pb-1">
            <span>Engineering Dimension Vectors</span>
            <span className="text-slate-500 text-[10px]">Click vector for technical breakdown</span>
          </div>

          <div className="space-y-2.5">
            {resolvedMetrics.dimensions.map((dim, idx) => {
              const isSelected = activeDimension === idx;
              return (
                <div
                  key={dim.name}
                  onClick={() => setActiveDimension(isSelected ? null : idx)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-950 border-indigo-500/80 ring-1 ring-indigo-500/30 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <Zap className={`w-3.5 h-3.5 ${dim.score >= 95 ? 'text-amber-400' : 'text-indigo-400'}`} />
                      <span className="font-semibold text-slate-200">{dim.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{dim.score}</span>
                      <span className="text-[10px] text-slate-500">/100</span>
                    </div>
                  </div>

                  {/* D3-proportioned progress track */}
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${
                        dim.score >= 95
                          ? 'from-indigo-500 via-purple-500 to-rose-500'
                          : 'from-cyan-500 to-indigo-500'
                      }`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>

                  {/* Expandable technical challenge note */}
                  {isSelected && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-indigo-300 flex items-start gap-1.5 animate-in fade-in duration-200">
                      <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{dim.description}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
