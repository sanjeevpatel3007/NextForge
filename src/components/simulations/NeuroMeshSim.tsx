import React, { useState } from 'react';
import { 
  Bot, 
  ShieldAlert, 
  Zap, 
  Flame, 
  Check, 
  Sparkles, 
  FileCode, 
  ArrowRight,
  Code2,
  RefreshCw
} from 'lucide-react';
import { AgentFeedback } from '../../types';

export default function NeuroMeshSim() {
  const initialCode = `'use server';

import { db } from '@/lib/db';

export async function transferFunds(formData: FormData) {
  // Vulnerable to unvalidated input & missing cache tags
  const recipientId = formData.get('recipientId');
  const amount = Number(formData.get('amount'));

  // Direct unvalidated database call
  const result = await db.query(
    \`UPDATE accounts SET balance = balance - \${amount} WHERE id = '\${recipientId}'\`
  );

  return { success: true, txId: 'tx_9982' };
}`;

  const patchedCode = `'use server';

import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { db } from '@/lib/db';

const TransferSchema = z.object({
  recipientId: z.string().uuid(),
  amount: z.number().positive().max(100000),
});

export async function transferFunds(prevState: any, formData: FormData) {
  const parsed = TransferSchema.safeParse({
    recipientId: formData.get('recipientId'),
    amount: Number(formData.get('amount')),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }

  // Parameterized query prevents SQL injection
  const result = await db.query(
    'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
    [parsed.data.amount, parsed.data.recipientId]
  );

  revalidateTag('user-balance');
  return { success: true, txId: 'tx_' + crypto.randomUUID() };
}`;

  const [code, setCode] = useState(initialCode);
  const [isReviewing, setIsReviewing] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isPatched, setIsPatched] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'security' | 'architecture' | 'performance'>('all');

  const agentReviews: AgentFeedback[] = [
    {
      id: 'sec-1',
      agentId: 'RedSec',
      line: 11,
      type: 'security',
      message: 'CRITICAL: Raw template literal string interpolation in SQL query. Immediate SQL injection vector.',
      suggestedDiff: 'Use parameterized queries: db.query("... WHERE id = $1", [recipientId])',
      timestamp: 'Just now'
    },
    {
      id: 'arch-1',
      agentId: 'ArchLead',
      line: 6,
      type: 'warning',
      message: 'Server Action signature missing prevState parameter required for React 19 useActionState binding.',
      suggestedDiff: 'export async function transferFunds(prevState: any, formData: FormData)',
      timestamp: 'Just now'
    },
    {
      id: 'perf-1',
      agentId: 'PerfHawk',
      line: 16,
      type: 'perf',
      message: 'Missing revalidateTag("user-balance") call. Edge CDN nodes will serve stale cached balance.',
      suggestedDiff: 'revalidateTag("user-balance");',
      timestamp: 'Just now'
    },
    {
      id: 'sre-1',
      agentId: 'ChaosSRE',
      line: 7,
      type: 'insight',
      message: 'No boundary validation on negative or NaN amounts. Potential infinite money generation vulnerability.',
      suggestedDiff: 'Integrate Zod schema with .positive() validator',
      timestamp: 'Just now'
    }
  ];

  const handleRunReview = () => {
    setIsReviewing(true);
    setTimeout(() => {
      setIsReviewing(false);
      setHasReviewed(true);
    }, 900);
  };

  const handleApplyPatch = () => {
    setCode(patchedCode);
    setIsPatched(true);
  };

  const handleReset = () => {
    setCode(initialCode);
    setHasReviewed(false);
    setIsPatched(false);
  };

  return (
    <div className="space-y-6">
      {/* Persona Header Roster */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white">ArchLead</div>
            <div className="text-[10px] text-slate-400">RSC & Next.js 15</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white">RedSec</div>
            <div className="text-[10px] text-slate-400">Security Red-Team</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white">PerfHawk</div>
            <div className="text-[10px] text-slate-400">Edge & Cache Tags</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white">ChaosSRE</div>
            <div className="text-[10px] text-slate-400">Fault Tolerance</div>
          </div>
        </div>
      </div>

      {/* Editor & Review Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Virtual Code Editor */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
          <div className="bg-slate-900/80 px-4 py-2.5 border-b border-slate-800 flex justify-between items-center">
            <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              app/actions/transfer.ts
              {isPatched && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Patched by NeuroMesh
                </span>
              )}
            </span>

            <div className="flex items-center gap-2">
              {isPatched ? (
                <button
                  onClick={handleReset}
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition"
                >
                  <RefreshCw className="w-3 h-3" /> Reset Code
                </button>
              ) : (
                <button
                  onClick={handleRunReview}
                  disabled={isReviewing}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded font-mono text-xs flex items-center gap-1.5 transition active:scale-95"
                >
                  {isReviewing ? (
                    <>
                      <Sparkles className="w-3 h-3 animate-spin" /> Agents Reviewing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" /> Stream Agent Review
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed max-h-[380px]">
            <pre className={isPatched ? 'text-emerald-300' : 'text-slate-300'}>
              {code}
            </pre>
          </div>
        </div>

        {/* Multi-Agent Live Feedback Panel */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-mono font-semibold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                Live Consensus Feed
              </h4>
              {hasReviewed && !isPatched && (
                <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded">
                  4 Issues Detected
                </span>
              )}
            </div>

            {!hasReviewed ? (
              <div className="py-12 px-4 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-lg">
                <Bot className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-50" />
                <p>Click "Stream Agent Review" to launch the 4 autonomous personas against this Next.js Server Action.</p>
              </div>
            ) : isPatched ? (
              <div className="py-8 px-4 text-center text-emerald-400 font-mono text-xs bg-emerald-950/20 border border-emerald-800/40 rounded-lg space-y-2">
                <Check className="w-8 h-8 mx-auto text-emerald-400" />
                <p className="font-semibold text-white">AST Refactor Complete!</p>
                <p className="text-slate-400 text-[11px]">
                  All 4 vulnerabilities resolved: Zod schema enforcement, SQL parameterization, useActionState signature, and Edge cache tag revalidation applied.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {agentReviews.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-lg border font-mono text-xs ${
                      item.type === 'security'
                        ? 'bg-rose-950/20 border-rose-900/40 text-rose-200'
                        : item.type === 'warning'
                        ? 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                        : item.type === 'perf'
                        ? 'bg-indigo-950/20 border-indigo-900/40 text-indigo-200'
                        : 'bg-slate-800/40 border-slate-700/40 text-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1 text-[10px] font-bold">
                      <span className="uppercase tracking-wider">{item.agentId} • Line {item.line}</span>
                      <span className="opacity-70">{item.type.toUpperCase()}</span>
                    </div>
                    <p className="text-[11px] leading-snug">{item.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {hasReviewed && !isPatched && (
            <div className="pt-4 border-t border-slate-800 mt-4">
              <button
                onClick={handleApplyPatch}
                className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-mono text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 shadow-md"
              >
                <Check className="w-3.5 h-3.5" /> Apply 4-Agent Auto-Refactor Patch
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
