import React, { useState } from 'react';
import { 
  History, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Clock, 
  Sliders,
  Terminal,
  Activity
} from 'lucide-react';
import { ChronoStateEvent } from '../../types';

export default function ChronoStateSim() {
  const initialEvents: ChronoStateEvent[] = [
    {
      id: 'evt-001',
      timestamp: '10:14:02.108',
      type: 'RSC_STREAM',
      label: 'Initial Root RSC Stream Hydrated',
      durationMs: 14,
      payload: { node: 'edge-iad-01', cacheTag: 'ledger-balance', rscBytes: 2840 },
      stateSnapshot: { balance: 12450.00, pendingCount: 0, activeSession: 'usr_staff_77', status: 'Reconciled' }
    },
    {
      id: 'evt-002',
      timestamp: '10:14:05.420',
      type: 'SERVER_ACTION',
      label: 'executeTransaction(+$500.00)',
      durationMs: 78,
      payload: { action: 'executeTransaction', amount: 500, txId: 'tx_98a3b1' },
      stateSnapshot: { balance: 12950.00, pendingCount: 0, activeSession: 'usr_staff_77', status: 'Reconciled' }
    },
    {
      id: 'evt-003',
      timestamp: '10:14:08.910',
      type: 'TAG_REVALIDATION',
      label: 'revalidateTag("ledger-balance")',
      durationMs: 8,
      payload: { edgePopsInvalidated: ['iad1', 'fra1', 'nrt1'], staleCacheEvicted: true },
      stateSnapshot: { balance: 12950.00, pendingCount: 0, activeSession: 'usr_staff_77', status: 'Reconciled' }
    }
  ];

  const [events, setEvents] = useState<ChronoStateEvent[]>(initialEvents);
  const [currentStep, setCurrentStep] = useState<number>(initialEvents.length - 1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [injectedLatency, setInjectedLatency] = useState(300);
  const [simulateError, setSimulateError] = useState(false);
  const [customAmount, setCustomAmount] = useState('750');
  const [optimisticFlash, setOptimisticFlash] = useState<string | null>(null);

  const activeSnapshot = events[currentStep]?.stateSnapshot ?? {
    balance: 12450.00,
    pendingCount: 0,
    activeSession: 'usr_staff_77',
    status: 'Reconciled'
  };

  const handleTriggerAction = async (amount: number) => {
    if (isProcessing) return;

    setIsProcessing(true);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    const txId = 'tx_' + Math.random().toString(36).substring(2, 8);

    // 1. Instantly trigger Optimistic transition
    setOptimisticFlash(amount > 0 ? `+$${amount}` : `-$${Math.abs(amount)}`);

    // Simulated network delay
    await new Promise((r) => setTimeout(r, injectedLatency));

    if (simulateError) {
      // Failed action -> rollback
      const errorEvent: ChronoStateEvent = {
        id: `evt-${(events.length + 1).toString().padStart(3, '0')}`,
        timestamp: timeStr,
        type: 'ERROR',
        label: `Action Deadlock (500 Error Injected)`,
        durationMs: injectedLatency + 12,
        payload: {
          error: 'SIMULATED_POSTGRES_LOCK_TIMEOUT',
          detail: 'Transaction rolled back automatically by useOptimistic reconciliation boundary.',
          attemptedAmount: amount
        },
        stateSnapshot: {
          balance: activeSnapshot.balance,
          pendingCount: 0,
          activeSession: 'usr_staff_77',
          status: 'Rolled Back'
        }
      };

      setEvents((prev) => [...prev, errorEvent]);
      setCurrentStep(events.length);
      setIsProcessing(false);
      setOptimisticFlash('ROLLBACK TRIGGERED');
      setTimeout(() => setOptimisticFlash(null), 2500);
      return;
    }

    // Successful action
    const newBal = activeSnapshot.balance + amount;
    const actionEvent: ChronoStateEvent = {
      id: `evt-${(events.length + 1).toString().padStart(3, '0')}`,
      timestamp: timeStr,
      type: 'SERVER_ACTION',
      label: `executeTransaction(${amount > 0 ? '+' : ''}$${amount.toFixed(2)})`,
      durationMs: injectedLatency + 34,
      payload: {
        action: 'executeTransaction',
        amount,
        txId,
        serializedFlightSize: '312 bytes',
        revalidateTag: 'ledger-balance'
      },
      stateSnapshot: {
        balance: newBal,
        pendingCount: 0,
        activeSession: 'usr_staff_77',
        status: 'Reconciled'
      }
    };

    setEvents((prev) => [...prev, actionEvent]);
    setCurrentStep(events.length);
    setIsProcessing(false);
    setTimeout(() => setOptimisticFlash(null), 1200);
  };

  const handleReset = () => {
    setEvents(initialEvents);
    setCurrentStep(initialEvents.length - 1);
    setOptimisticFlash(null);
  };

  const currentEvent = events[currentStep];

  return (
    <div className="space-y-6">
      {/* Top Banner with Interactive Value & State */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ledger State Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              State at Step #{currentStep + 1}
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              activeSnapshot.status === 'Rolled Back' 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {activeSnapshot.status}
            </span>
          </div>

          <div className="text-3xl font-bold font-mono tracking-tight text-white flex items-center gap-3">
            <span>${activeSnapshot.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            {optimisticFlash && (
              <span className={`text-xs px-2 py-1 rounded font-mono animate-bounce ${
                optimisticFlash.includes('ROLLBACK') ? 'bg-rose-600 text-white' : 'bg-emerald-500 text-slate-950 font-bold'
              }`}>
                {optimisticFlash}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-2">
            <span>Flight Wire Status:</span>
            {isProcessing ? (
              <span className="text-amber-400 flex items-center gap-1 animate-pulse">
                <Clock className="w-3 h-3" /> Server Action In Flight ({injectedLatency}ms)...
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Stream Synced
              </span>
            )}
          </p>

          {/* Background decorative glow */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Action Controls Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Dispatch Server Action
            </span>
            <span className="text-[10px] text-slate-500">'use server'</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleTriggerAction(500)}
              disabled={isProcessing}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-mono text-xs font-medium transition shadow-sm active:scale-95"
            >
              +$500 Credit
            </button>
            <button
              onClick={() => handleTriggerAction(-250)}
              disabled={isProcessing}
              className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-lg font-mono text-xs font-medium transition shadow-sm active:scale-95"
            >
              -$250 Debit
            </button>
          </div>

          <div className="flex gap-2 mt-2">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Amount"
              className="w-24 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleTriggerAction(parseFloat(customAmount) || 100)}
              disabled={isProcessing}
              className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-mono text-xs transition active:scale-95"
            >
              Mutate Ledger
            </button>
          </div>
        </div>

        {/* Chaos Injection Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              Wire Chaos Injection
            </span>
            <span className="text-[10px] text-purple-400 font-bold">Chaos Mode</span>
          </div>

          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Injected Wire Latency:</span>
                <span className="text-amber-400 font-semibold">{injectedLatency}ms</span>
              </div>
              <input
                type="range"
                min="0"
                max="2500"
                step="100"
                value={injectedLatency}
                onChange={(e) => setInjectedLatency(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={simulateError}
                onChange={(e) => setSimulateError(e.target.checked)}
                className="rounded accent-rose-500 w-3.5 h-3.5"
              />
              <span className="flex items-center gap-1 text-rose-400">
                <AlertTriangle className="w-3 h-3" /> Simulate Server 500 Deadlock
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Time-Travel Interactive Scrubber */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h4 className="text-sm font-semibold font-mono text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              Time-Travel DAG Scrubber
            </h4>
            <p className="text-xs text-slate-400 font-mono">
              Drag the scrubber to inspect previous states or replay Server Actions backwards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-1 rounded-md">
              Step {currentStep + 1} of {events.length}
            </span>
            <button
              onClick={handleReset}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition"
              title="Reset Timeline"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Scrubber slider and ticks */}
        <div className="py-2">
          <input
            type="range"
            min="0"
            max={events.length - 1}
            value={currentStep}
            onChange={(e) => setCurrentStep(Number(e.target.value))}
            className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />

          {/* Stepper Dots */}
          <div className="flex justify-between mt-3 px-1">
            {events.map((evt, idx) => {
              const isSelected = idx === currentStep;
              const isErr = evt.type === 'ERROR';
              return (
                <button
                  key={evt.id}
                  onClick={() => setCurrentStep(idx)}
                  className={`flex flex-col items-center gap-1 group transition ${
                    isSelected ? 'scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 transition ${
                    isErr 
                      ? 'bg-rose-500 border-rose-300' 
                      : evt.type === 'TAG_REVALIDATION' 
                      ? 'bg-purple-500 border-purple-300' 
                      : isSelected 
                      ? 'bg-indigo-500 border-white' 
                      : 'bg-slate-700 border-slate-500'
                  }`} />
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
                    #{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Flight Payload & Event Deconstruction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Selected Step Event Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3">
            <span className="text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Event Metadata: {currentEvent?.id}
            </span>
            <span className="text-slate-500">{currentEvent?.timestamp}</span>
          </div>

          <div className="space-y-2 text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-500">Operation:</span>
              <span className="text-white font-semibold">{currentEvent?.label}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-500">Event Class:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${
                currentEvent?.type === 'ERROR' ? 'bg-rose-500/20 text-rose-300' : 'bg-indigo-500/20 text-indigo-300'
              }`}>
                {currentEvent?.type}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-500">Round-trip Span:</span>
              <span className="text-amber-300 font-semibold">{currentEvent?.durationMs}ms</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Active Ledger Balance:</span>
              <span className="text-emerald-400 font-bold">${currentEvent?.stateSnapshot.balance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Raw Flight Protocol Wire Stream */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3">
            <span className="text-slate-400 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Raw React 19 Flight Wire Chunk
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
              protocol: rsc-flight
            </span>
          </div>

          <div className="bg-slate-900/90 rounded p-3 text-[11px] leading-relaxed text-slate-300 overflow-x-auto">
            {currentEvent?.type === 'SERVER_ACTION' && (
              <pre className="text-emerald-400">
{`0:["$@1",["$","div",null,{"className":"balance-sync"}]]
1:{"actionId":"executeTransaction","txId":"${currentEvent.payload.txId}"}
2:{"newBalance":${currentEvent.stateSnapshot.balance},"status":"OK"}
3:{"revalidateTags":["ledger-balance"]}`}
              </pre>
            )}

            {currentEvent?.type === 'ERROR' && (
              <pre className="text-rose-400">
{`0:["$@error",{"digest":"NEXT_ACTION_ERROR_500"}]
1:{"message":"Simulated DB Lock Deadlock"}
2:{"reconciledOptimisticRollback":true}`}
              </pre>
            )}

            {currentEvent?.type === 'TAG_REVALIDATION' && (
              <pre className="text-purple-400">
{`0:{"tag":"ledger-balance","edgeCdnInvalidated":true}
1:{"staleCacheEvicted":true,"edgePops":["iad1","fra1","nrt1"]}`}
              </pre>
            )}

            {currentEvent?.type === 'RSC_STREAM' && (
              <pre className="text-indigo-300">
{`0:D"$RootLayout"
1:S"react.suspense"
2:I["(app-pages-browser)/./app/page.tsx",["app/page"],"ChronoPage"]
3:{"initialBalance":12450.00,"node":"edge-iad-01"}`}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
