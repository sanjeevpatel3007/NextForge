import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Globe, 
  Cpu, 
  AlertOctagon, 
  ShieldCheck, 
  Zap, 
  Activity,
  Sliders
} from 'lucide-react';

export default function ChaosMonkeySim() {
  const [dbSevered, setDbSevered] = useState(false);
  const [latencyInjection, setLatencyInjection] = useState(false);
  const [stampedeActive, setStampedeActive] = useState(false);
  const [circuitState, setCircuitState] = useState<'CLOSED' | 'OPEN' | 'HALF_OPEN'>('CLOSED');
  const [reqRate, setReqRate] = useState(140);
  const [servedFrom, setServedFrom] = useState<'Primary Postgres' | 'L2 Edge Cache' | 'L3 Static Fallback'>('Primary Postgres');

  const handleToggleDb = () => {
    const next = !dbSevered;
    setDbSevered(next);
    if (next) {
      setCircuitState('OPEN');
      setServedFrom('L3 Static Fallback');
    } else {
      setCircuitState('HALF_OPEN');
      setServedFrom('Primary Postgres');
      setTimeout(() => setCircuitState('CLOSED'), 2000);
    }
  };

  const handleToggleStampede = () => {
    const next = !stampedeActive;
    setStampedeActive(next);
    if (next) {
      setReqRate(9400);
      setServedFrom('L2 Edge Cache');
    } else {
      setReqRate(140);
      if (!dbSevered) setServedFrom('Primary Postgres');
    }
  };

  return (
    <div className="space-y-6">
      {/* Resilience Telemetry & Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 mb-1">Circuit Breaker State</div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              circuitState === 'CLOSED' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500 animate-ping'
            }`} />
            <span className={`text-lg font-mono font-bold ${
              circuitState === 'CLOSED' ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {circuitState}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">
            {circuitState === 'CLOSED' ? 'Traffic flowing to live DB' : 'Fallback active, shielding Postgres'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 mb-1">Served Response Source</div>
          <div className="text-sm font-mono font-bold text-white flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{servedFrom}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">Zero 500 errors returned</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 mb-1">Throughput / Ingress</div>
          <div className="text-lg font-mono font-bold text-indigo-400">
            {reqRate.toLocaleString()} <span className="text-xs font-normal text-slate-400">req/s</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">
            {stampedeActive ? 'Deduplicating via Next.js unstable_cache' : 'Normal baseline traffic'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 mb-1">P99 Edge Latency</div>
          <div className="text-lg font-mono font-bold text-amber-400">
            {latencyInjection ? '1,840ms' : dbSevered ? '12ms (Fallback)' : '42ms'}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">Round-trip to client browser</p>
        </div>
      </div>

      {/* Interactive Cluster Topology */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
        <h4 className="text-xs font-mono font-semibold text-slate-300 mb-6 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            Live Next.js 15 Topology & Fault Isolation
          </span>
          <span className="text-[10px] text-slate-500 font-normal">Real-time Node Health</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Node 1: Edge CDN IAD */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col items-center text-center">
            <Globe className="w-8 h-8 text-cyan-400 mb-2" />
            <div className="text-xs font-mono font-bold text-white">Edge-IAD</div>
            <div className="text-[10px] text-slate-400">Middleware & PoP</div>
            <span className="mt-2 text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
              ONLINE
            </span>
          </div>

          {/* Node 2: Edge CDN FRA */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col items-center text-center">
            <Globe className="w-8 h-8 text-cyan-400 mb-2" />
            <div className="text-xs font-mono font-bold text-white">Edge-FRA</div>
            <div className="text-[10px] text-slate-400">Middleware & PoP</div>
            <span className="mt-2 text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
              ONLINE
            </span>
          </div>

          {/* Node 3: RSC Worker Fleet */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col items-center text-center">
            <Cpu className="w-8 h-8 text-indigo-400 mb-2" />
            <div className="text-xs font-mono font-bold text-white">RSC Fleet</div>
            <div className="text-[10px] text-slate-400">Server Components</div>
            <span className={`mt-2 text-[10px] px-2 py-0.5 rounded font-mono ${
              stampedeActive ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {stampedeActive ? 'LOAD 82%' : 'LOAD 14%'}
            </span>
          </div>

          {/* Node 4: Edge KV Cache */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col items-center text-center">
            <Server className="w-8 h-8 text-purple-400 mb-2" />
            <div className="text-xs font-mono font-bold text-white">Edge KV Tier</div>
            <div className="text-[10px] text-slate-400">Cache Tags & SWR</div>
            <span className="mt-2 text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
              HIT RATIO 99%
            </span>
          </div>

          {/* Node 5: Postgres Primary */}
          <div className={`rounded-lg p-4 flex flex-col items-center text-center border transition ${
            dbSevered ? 'bg-rose-950/40 border-rose-800' : 'bg-slate-900 border-slate-800'
          }`}>
            <Database className={`w-8 h-8 mb-2 ${dbSevered ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`} />
            <div className="text-xs font-mono font-bold text-white">Postgres DB</div>
            <div className="text-[10px] text-slate-400">Primary Ledger</div>
            <span className={`mt-2 text-[10px] px-2 py-0.5 rounded font-mono ${
              dbSevered ? 'bg-rose-500/20 text-rose-400 font-bold' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {dbSevered ? 'SEVERED (DOWN)' : 'HEALTHY'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Chaos Levers */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <h4 className="text-xs font-mono font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          Inject Chaos Faults (Test Next.js 15 Resilience Patterns)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleToggleDb}
            className={`p-3 rounded-lg border font-mono text-xs text-left transition flex items-center justify-between ${
              dbSevered
                ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                {dbSevered ? 'Reconnect DB' : 'Sever Database Link'}
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">Trips Circuit Breaker to OPEN</div>
            </div>
            <span className="text-[11px] font-bold">{dbSevered ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setLatencyInjection(!latencyInjection)}
            className={`p-3 rounded-lg border font-mono text-xs text-left transition flex items-center justify-between ${
              latencyInjection
                ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Inject 1800ms Jitter
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">Tests React Suspense Streaming</div>
            </div>
            <span className="text-[11px] font-bold">{latencyInjection ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleToggleStampede}
            className={`p-3 rounded-lg border font-mono text-xs text-left transition flex items-center justify-between ${
              stampedeActive
                ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Cache Stampede (10k req/s)
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">Tests unstable_cache deduplication</div>
            </div>
            <span className="text-[11px] font-bold">{stampedeActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
