import React, { useState } from 'react';
import { 
  Compass, 
  Cpu, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Binary, 
  FileText,
  Clock
} from 'lucide-react';

interface VectorPoint {
  id: string;
  title: string;
  category: 'Auth' | 'Database' | 'Payment' | 'AI';
  x: number;
  y: number;
  similarity: number;
}

export default function SovereignAiSim() {
  const allPoints: VectorPoint[] = [
    { id: '1', title: 'Next.js 15 Server Action CSRF Protection', category: 'Auth', x: 25, y: 35, similarity: 0.94 },
    { id: '2', title: 'Optimistic UI useOptimistic Hook Ledger', category: 'Payment', x: 75, y: 40, similarity: 0.91 },
    { id: '3', title: 'PostgreSQL Connection Pooling in Serverless', category: 'Database', x: 45, y: 70, similarity: 0.62 },
    { id: '4', title: 'WebAssembly SIMD Vector Indexing Worker', category: 'AI', x: 80, y: 80, similarity: 0.88 },
    { id: '5', title: 'Session Cookie Encryption with Edge Middleware', category: 'Auth', x: 30, y: 25, similarity: 0.85 },
    { id: '6', title: 'Stripe Webhook Replay Idempotency Key', category: 'Payment', x: 70, y: 30, similarity: 0.79 },
  ];

  const [query, setQuery] = useState('how to build secure server actions with optimistic rollback');
  const [latencyMs, setLatencyMs] = useState(3.4);
  const [activePoint, setActivePoint] = useState<VectorPoint>(allPoints[0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLatencyMs(Number((2.5 + Math.random() * 2).toFixed(1)));
    const randomPick = allPoints[Math.floor(Math.random() * allPoints.length)];
    setActivePoint(randomPick);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar & Privacy Badge */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query semantic memory..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-mono text-xs font-medium transition active:scale-95 flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" /> Vector Search
          </button>
        </form>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side WASM
            </span>
            <span>• Zero bytes sent to cloud LLM</span>
          </div>
          <div className="flex items-center gap-1 text-amber-300">
            <Clock className="w-3 h-3" /> WASM Cosine Latency: <span className="font-bold">{latencyMs}ms</span>
          </div>
        </div>
      </div>

      {/* 2D Semantic Scatter Projection & Generative UI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2D Projection Canvas */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5 text-indigo-400" />
              WASM Vector Space (384-D Projected to 2D)
            </span>
            <span className="text-[10px] text-indigo-400">PCA / UMAP</span>
          </div>

          <div className="h-64 bg-slate-900/50 border border-slate-800/80 rounded-lg relative p-4">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-20">
              <div className="border-r border-b border-slate-700" />
              <div className="border-r border-b border-slate-700" />
              <div className="border-r border-b border-slate-700" />
              <div className="border-b border-slate-700" />
            </div>

            {/* Scatter Points */}
            {allPoints.map((pt) => {
              const isSelected = pt.id === activePoint.id;
              return (
                <button
                  key={pt.id}
                  onClick={() => setActivePoint(pt)}
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition ${
                    isSelected ? 'z-20 scale-125' : 'z-10 hover:scale-110'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition shadow-lg ${
                    isSelected 
                      ? 'bg-indigo-500 border-white ring-4 ring-indigo-500/30' 
                      : 'bg-slate-800 border-indigo-400'
                  }`} />
                  <span className="absolute left-5 top-0 whitespace-nowrap text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-slate-300 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    {pt.title}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 mt-3 font-mono">
            Click any vector cluster node to trigger Edge RSC Generative UI widget rendering.
          </p>
        </div>

        {/* Dynamic Edge Generative UI Card */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Streamed Generative UI Widget
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                Match: {(activePoint.similarity * 100).toFixed(0)}%
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-3">
              <div className="flex items-center gap-2 text-indigo-300">
                <FileText className="w-4 h-4" />
                <span className="font-bold">{activePoint.title}</span>
              </div>

              <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                Rendered on-the-fly via Next.js React Server Component Streaming based on local vector intent match.
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                <span>Category Tag:</span>
                <span className="text-white font-semibold">{activePoint.category}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert(`Copied Next.js RSC Generative Component for: ${activePoint.title}`)}
            className="w-full mt-4 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-mono text-xs transition active:scale-95"
          >
            Inspect Generative RSC Template
          </button>
        </div>
      </div>
    </div>
  );
}
