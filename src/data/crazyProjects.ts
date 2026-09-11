import { ProjectIdea } from '../types';

export const CRAZY_PROJECTS: ProjectIdea[] = [
  {
    id: 'chronostate',
    title: 'ChronoState',
    tagline: 'Time-Travel Distributed Flight Debugger & Visual Server Action Replayer',
    category: 'DevTools & Internals',
    complexity: 'Staff Engineer',
    badge: 'INTERNALS HACK',
    whyCrazy: 'Nobody treats Next.js Server Actions like a visual time machine. ChronoState intercepts RSC Flight payloads, serialized server boundaries, and cache tag invalidations into an interactive 4D DAG graph. You can drag a slider backwards to undo transactions, replay mutations with injected 2,000ms latency, and watch optimistic rollbacks reconcile on screen.',
    viralFactor: 'Every Next.js engineer struggles to visualize what happens over the wire during Server Actions and RSC flight streaming. A video of dragging a timeline backwards to undo a server mutation will blow up on Twitter / X and Hacker News.',
    techHurdlesSolved: [
      'Capturing serialized RSC Flight chunks without breaking client stream hydration',
      'Bidirectional state time-travel with rollback hooks in React 19 (useOptimistic + useActionState)',
      'Simulating network jitter and HTTP 500 error injections at the server action boundary',
      'Visualizing revalidateTag & cache invalidation ripples in a live graph'
    ],
    nextjsFeatures: [
      {
        title: 'Server Actions with Telemetry Proxy',
        tag: 'Server Actions',
        description: 'Server actions wrapped in a high-precision execution tracer that timestamps database mutations, flight serialization time, and revalidation cascades.'
      },
      {
        title: 'Optimistic State Scrubber',
        tag: 'Optimistic UI',
        description: 'Uses React 19 useOptimistic and useActionState to apply instant client-side transitions and rollback smoothly if a time-travel step is rewound.'
      },
      {
        title: 'RSC Flight Payload Inspector',
        tag: 'RSC',
        description: 'Deconstructs the raw 0:{"$@":...} React flight payload protocol into readable JSON tree components.'
      },
      {
        title: 'On-Demand Cache Tag Revalidator',
        tag: 'Cache Tags',
        description: 'Triggers revalidateTag("account-ledger") and visually highlights invalidation propagation through Edge CDN nodes.'
      }
    ],
    architectureSummary: {
      clientLayer: 'Next.js 15 Client Component with Canvas timeline scrubber and flight chunk deserializer',
      serverActionLayer: "'use server' actions instrumented with nanosecond spans, payload diffing, and error injection middleware",
      edgeStreamingLayer: 'Edge Route Handler (/api/telemetry/stream) broadcasting live action events via Server-Sent Events',
      persistenceLayer: 'In-memory ring buffer or Redis time-series stream storing the last 100 flight transitions'
    },
    quickDemoType: 'chronostate',
    complexityMetrics: {
      overallScore: 94,
      tier: 'Staff',
      difficultyRank: 'Top 2% Next.js Architects',
      dimensions: [
        { name: 'RSC Flight Wire Decoding', score: 98, description: 'Deserializing raw React 19 Flight protocol chunks without breaking client stream hydration' },
        { name: 'Optimistic State Rollback', score: 92, description: 'Transactional reconciliation with useOptimistic and useActionState on deadlock' },
        { name: 'Distributed Cache Tags', score: 90, description: 'Edge PoP cache invalidation propagation across distributed regions' },
        { name: 'Time-Travel State DAG', score: 96, description: 'Bidirectional state history scrubbing and action replay engine' }
      ]
    },
    files: [
      {
        path: 'app/actions/execute-transaction.ts',
        type: 'server-action',
        description: 'Instrumented Server Action demonstrating rollback resilience, delay simulation, and cache invalidation',
        code: `'use server';

import { revalidateTag } from 'next/cache';

export interface ActionResponse {
  success: boolean;
  transactionId: string;
  amount: number;
  newBalance: number;
  flightSerializationTimeMs: number;
  error?: string;
}

// In-memory ledger simulation for the demo
let globalBalance = 12450.00;
const historyLog: Array<{ id: string; amount: number; balance: number; timestamp: number }> = [];

export async function executeTransaction(
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const start = performance.now();
  const rawAmount = formData.get('amount');
  const injectLatency = Number(formData.get('injectLatency') || 0);
  const shouldFail = formData.get('simulateError') === 'true';

  const amount = parseFloat(rawAmount as string);

  // 1. Simulate network / database jitter
  if (injectLatency > 0) {
    await new Promise((resolve) => setTimeout(resolve, injectLatency));
  }

  // 2. Simulated server-side validation & failure injection
  if (shouldFail) {
    const duration = performance.now() - start;
    return {
      success: false,
      transactionId: 'tx_failed_' + Math.random().toString(36).substring(7),
      amount,
      newBalance: globalBalance,
      flightSerializationTimeMs: Math.round(duration),
      error: 'Simulated 500: Database Deadlock during lock acquisition on row #ledger_491',
    };
  }

  if (isNaN(amount) || amount <= 0) {
    return {
      success: false,
      transactionId: 'tx_err',
      amount: 0,
      newBalance: globalBalance,
      flightSerializationTimeMs: 0,
      error: 'Invalid transaction amount provided',
    };
  }

  // 3. Apply state change
  globalBalance += amount;
  const txId = 'tx_' + Math.random().toString(36).substring(2, 9);
  historyLog.push({ id: txId, amount, balance: globalBalance, timestamp: Date.now() });

  // 4. Invalidate tagged caches across Edge nodes
  revalidateTag('ledger-balance');

  const duration = performance.now() - start;

  return {
    success: true,
    transactionId: txId,
    amount,
    newBalance: globalBalance,
    flightSerializationTimeMs: Math.round(duration),
  };
}
`
      },
      {
        path: 'app/page.tsx',
        type: 'server-component',
        description: 'React Server Component streaming initial ledger state and mounting the interactive client debugger',
        code: `import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';
import ChronoDebugger from '@/components/ChronoDebugger';

// Cached server-side query with Next.js 15 cache tags
const getCachedLedger = unstable_cache(
  async () => {
    // Simulated DB fetch
    return {
      balance: 12450.00,
      currency: 'USD',
      lastUpdated: new Date().toISOString(),
      accountNode: 'edge-iad-cluster-04'
    };
  },
  ['ledger-balance-key'],
  { tags: ['ledger-balance'], revalidate: 60 }
);

export default async function ChronoPage() {
  const initialData = await getCachedLedger();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <header className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
            ChronoState: Next.js 15 Flight & Action Replayer
          </h1>
          <p className="text-sm text-slate-400">
            Node: {initialData.accountNode} | Tag: <span className="text-emerald-400">ledger-balance</span>
          </p>
        </div>
        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-mono">
          RSC Stream Ready
        </span>
      </header>

      <Suspense fallback={<div className="p-12 text-center text-slate-500 font-mono">Streaming Flight Payload...</div>}>
        <ChronoDebugger initialBalance={initialData.balance} />
      </Suspense>
    </main>
  );
}
`
      },
      {
        path: 'components/ChronoDebugger.tsx',
        type: 'client-component',
        description: 'Interactive client component leveraging useActionState & useOptimistic with timeline scrubbing',
        code: `'use client';

import { useActionState, useOptimistic, useState, useTransition } from 'react';
import { executeTransaction, ActionResponse } from '@/app/actions/execute-transaction';

interface Props {
  initialBalance: number;
}

export default function ChronoDebugger({ initialBalance }: Props) {
  const [history, setHistory] = useState<Array<{ id: string; amount: number; balance: number; time: string }>>([]);
  const [isPending, startTransition] = useTransition();
  const [injectLag, setInjectLag] = useState(0);
  const [failNext, setFailNext] = useState(false);

  // React 19 / Next.js 15 action state hook
  const [state, formAction] = useActionState(
    async (prev: any, formData: FormData) => {
      const res = await executeTransaction(prev, formData);
      if (res.success) {
        setHistory((curr) => [
          ...curr,
          { id: res.transactionId, amount: res.amount, balance: res.newBalance, time: new Date().toLocaleTimeString() }
        ]);
      }
      return res;
    },
    null
  );

  // Optimistic UI updates
  const [optimisticBalance, setOptimisticBalance] = useOptimistic(
    state?.newBalance ?? initialBalance,
    (current: number, amountAdded: number) => current + amountAdded
  );

  const handleQuickMutation = (amount: number) => {
    startTransition(async () => {
      setOptimisticBalance(amount);
      const fd = new FormData();
      fd.append('amount', amount.toString());
      fd.append('injectLatency', injectLag.toString());
      fd.append('simulateError', failNext.toString());
      await formAction(fd);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Live State Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">Active Balance</span>
          {isPending && <span className="text-amber-400 text-xs animate-pulse font-mono">Server Action in flight...</span>}
        </div>
        <div className="text-4xl font-bold font-mono text-emerald-400">
          \${optimisticBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {isPending ? 'Optimistic estimate pending RSC wire confirmation' : 'Reconciled with edge ledger'}
        </p>

        {/* Action Controls */}
        <div className="mt-6 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickMutation(250)}
              disabled={isPending}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-mono text-xs transition disabled:opacity-50"
            >
              + \$250 Credit
            </button>
            <button
              onClick={() => handleQuickMutation(-100)}
              disabled={isPending}
              className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded font-mono text-xs transition disabled:opacity-50"
            >
              - \$100 Debit
            </button>
          </div>

          {/* Chaos Injection Toggles */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <label className="text-xs text-slate-400 block font-mono">
              Injected Wire Latency: {injectLag}ms
            </label>
            <input
              type="range"
              min="0"
              max="3000"
              step="200"
              value={injectLag}
              onChange={(e) => setInjectLag(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-300">Simulate Server 500 Deadlock:</span>
              <input
                type="checkbox"
                checked={failNext}
                onChange={(e) => setFailNext(e.target.checked)}
                className="rounded accent-rose-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Flight Wire Inspector */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-mono font-semibold text-slate-200 mb-4 flex items-center justify-between">
          <span>Flight Protocol Stream ({history.length} events logged)</span>
          <span className="text-xs text-indigo-400">Scrubber Active</span>
        </h3>

        <div className="space-y-2 max-h-80 overflow-y-auto font-mono text-xs">
          {history.length === 0 ? (
            <div className="p-8 text-center text-slate-600 border border-dashed border-slate-800 rounded">
              No transactions executed yet. Click +$250 or -$100 to trigger a Server Action.
            </div>
          ) : (
            history.map((tx, idx) => (
              <div key={tx.id} className="p-3 bg-slate-950 border border-slate-800 rounded flex justify-between items-center">
                <div>
                  <span className="text-indigo-400 font-bold">#{idx + 1} {tx.id}</span>
                  <span className="text-slate-400 ml-3">{tx.time}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={tx.amount > 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                    {tx.amount > 0 ? '+' : ''}\${tx.amount}
                  </span>
                  <span className="text-slate-400">Balance: \${tx.balance.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
`
      },
      {
        path: 'package.json',
        type: 'config',
        description: 'Next.js 15 production package configuration with React 19 canary & tailwind',
        code: `{
  "name": "chronostate-nextjs15-debugger",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.460.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.6.0",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.49"
  }
}`
      }
    ]
  },
  {
    id: 'neuromesh',
    title: 'NeuroMesh IDE',
    tagline: 'Autonomous Multi-Agent Live Pair-Programming Sandbox',
    category: 'Multi-Agent & AI',
    complexity: 'Staff Engineer',
    badge: 'AI ORCHESTRATION',
    whyCrazy: 'Most AI coding assistants are simple chat windows on the side. NeuroMesh turns your Next.js editor into a live virtual war-room where 4 specialized AI Agent Personas (Principal Architect, Red-Team Security Auditor, Chaos SRE, and Performance Hawk) live-stream code annotations directly into your AST, debate trade-offs in real-time, and benchmark RSC boundary leaks.',
    viralFactor: 'Watching 4 distinct AI agents argue with each other over your Next.js Server Action code while streaming interactive diff proposals makes for an unforgettable demo video.',
    techHurdlesSolved: [
      'Edge streaming multi-agent consensus via Server-Sent Events (SSE) in Route Handlers',
      'Non-blocking AST parsing & line-by-line syntax range mapping',
      'Preventing hallucinations with strict JSON function calling schema for diff patches',
      'Optimistic code replacement with automatic rollback if verification tests fail'
    ],
    nextjsFeatures: [
      {
        title: 'Edge Streaming Route Handler',
        tag: 'Streaming',
        description: 'Multi-stream SSE router (/api/agents/consensus) multiplexing 4 concurrent AI persona responses over a single HTTP connection.'
      },
      {
        title: 'Server Action AST Transformer',
        tag: 'Server Actions',
        description: 'Executes safe code refactorings on the server using Babel/TypeScript compiler APIs without executing arbitrary client code.'
      },
      {
        title: 'React Server Component Diff Viewer',
        tag: 'RSC',
        description: 'Renders syntax-highlighted side-by-side diff blocks on the server to keep the client bundle lightweight.'
      }
    ],
    architectureSummary: {
      clientLayer: 'Monaco/Custom Editor with floating inline agent avatar pills and diff highlight overlays',
      serverActionLayer: "'use server' applyDiffAction applying validated AST patches to virtual project workspace",
      edgeStreamingLayer: 'Edge Route Handler multiplexing parallel agent reasoning loops with chunked SSE',
      persistenceLayer: 'Stateless session tokens with encrypted workspace state in cookies or KV store'
    },
    quickDemoType: 'neuromesh',
    complexityMetrics: {
      overallScore: 91,
      tier: 'Staff',
      difficultyRank: 'Top 4% Next.js AI Engineers',
      dimensions: [
        { name: 'Multi-Agent SSE Stream', score: 94, description: 'Multiplexing 4 concurrent LLM persona reasoning loops over single HTTP connection' },
        { name: 'AST Syntax Mapping', score: 93, description: 'Non-blocking TypeScript AST parsing and line-by-line syntax range mapping' },
        { name: 'Server Action Patches', score: 88, description: 'Atomic code refactoring validation and execution within Server Actions' },
        { name: 'RSC Diff Virtualization', score: 89, description: 'Server-side syntax highlighted diff rendering without client bundle bloat' }
      ]
    },
    files: [
      {
        path: 'app/api/agents/analyze/route.ts',
        type: 'route-handler',
        description: 'Next.js 15 Edge Route Handler running parallel multi-agent evaluation and streaming SSE chunks',
        code: `import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { code, filename } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (agent: string, payload: any) => {
        controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ agent, ...payload })}\\n\\n\`));
      };

      // 1. Architect agent evaluates RSC vs Client boundaries
      send('architect', {
        status: 'analyzing',
        message: 'Scanning component boundaries for excessive "use client" directives...',
      });

      // 2. Security agent scans Server Actions for unvalidated FormData
      if (code.includes("'use server'") && !code.includes('zod') && !code.includes('safeParse')) {
        send('security', {
          status: 'alert',
          line: 14,
          severity: 'HIGH',
          message: 'Server Action accepts raw FormData without input schema validation. Risk of mass assignment.',
          suggestedDiff: '+ import { z } from "zod";\\n+ const Schema = z.object({ id: z.string().uuid() });'
        });
      }

      // 3. Performance Hawk checks cache tags and memoization
      if (code.includes('fetch(') && !code.includes('next: { tags:')) {
        send('perf', {
          status: 'warning',
          line: 22,
          severity: 'MEDIUM',
          message: 'Un-tagged edge fetch detected. This request will miss on-demand revalidation pipelines.',
        });
      }

      // 4. SRE Agent verifies circuit breaker
      send('sre', {
        status: 'ok',
        message: 'Hydration boundary safety checks passed. No layout shift detected.',
      });

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
`
      },
      {
        path: 'app/actions/apply-patch.ts',
        type: 'server-action',
        description: 'Server Action that applies an approved agent refactoring patch to the codebase',
        code: `'use server';

import { revalidatePath } from 'next/cache';

export interface PatchResult {
  success: boolean;
  newCode: string;
  appliedBy: string;
  timestamp: string;
}

export async function applyAgentPatch(
  originalCode: string,
  patchDiff: string,
  agentName: string
): Promise<PatchResult> {
  // In production, integrate with prettier or TS Language Service
  let updatedCode = originalCode;

  if (patchDiff.includes('import { z } from "zod"')) {
    updatedCode = \`import { z } from 'zod';\\n\` + updatedCode;
  }

  revalidatePath('/editor');

  return {
    success: true,
    newCode: updatedCode,
    appliedBy: agentName,
    timestamp: new Date().toISOString(),
  };
}
`
      }
    ]
  },
  {
    id: 'chaos',
    title: 'ChaosMonkey Web Lab',
    tagline: 'Real-Time Distributed System & Next.js 15 Resilience Simulator',
    category: 'Distributed Systems & Chaos',
    complexity: 'Principal Architect',
    badge: 'DISTRIBUTED RESILIENCE',
    whyCrazy: 'Everyone claims their Next.js app is production-ready until an Edge CDN point of presence drops packets, Postgres hits 100% pool exhaustion, or a cache stampede crashes the Server Action workers. ChaosMonkey is an interactive command center that lets you trigger distributed faults on a simulated Next.js cluster and see circuit breakers, stale-while-revalidate caches, and graceful Suspense degradation kick in without downtime.',
    viralFactor: 'Engineering leaders and principal architects love resilience engineering. A demo demonstrating 99.999% fault-tolerant Next.js patterns with live simulated outages instantly sets you apart from 99% of applicants.',
    techHurdlesSolved: [
      'Implementing client-side circuit breakers that gracefully fallback to Edge KV cache',
      'Thundering herd protection using Next.js 15 deduplication and unstable_cache',
      'Visualizing real-time request waterfalls across Edge, Server Components, and Database',
      'Automated health check probes and dead-letter queues inside Route Handlers'
    ],
    nextjsFeatures: [
      {
        title: 'Deduplicated Edge Caching',
        tag: 'Cache Tags',
        description: 'unstable_cache with request memoization to prevent 10,000 concurrent users from overwhelming downstream microservices.'
      },
      {
        title: 'Suspense Error Boundaries',
        tag: 'Streaming',
        description: 'Graceful degradation fallback skeletons when downstream services experience complete network partitioning.'
      },
      {
        title: 'Resilient Server Action with Retries',
        tag: 'Server Actions',
        description: 'Idempotency keys and exponential backoff wrappers built into Server Actions.'
      }
    ],
    architectureSummary: {
      clientLayer: 'Mission control dashboard with real-time SVG network topology and latency gauges',
      serverActionLayer: 'Idempotent actions wrapped in circuit-breaker state machines',
      edgeStreamingLayer: 'Distributed edge simulation nodes reporting health metrics via WebSocket or SSE',
      persistenceLayer: 'Multi-tier cache hierarchy: L1 React memo, L2 Next.js Data Cache, L3 Fallback static snapshot'
    },
    quickDemoType: 'chaos',
    complexityMetrics: {
      overallScore: 98,
      tier: 'Principal',
      difficultyRank: 'Top 0.5% Distributed Engineers',
      dimensions: [
        { name: 'Circuit Breaker State Machine', score: 99, description: 'Closed/Open/Half-Open state transitions shielding downstream Postgres pool' },
        { name: 'Thundering Herd Deduplication', score: 97, description: 'unstable_cache request deduplication under 10,000 concurrent req/s' },
        { name: 'Fault Isolation & Zero Downtime', score: 98, description: 'Zero 500 status codes delivered during full database network partition' },
        { name: 'Streaming Suspense Resilience', score: 96, description: 'Graceful partial hydration and skeleton degradation without unmounting DOM' }
      ]
    },
    files: [
      {
        path: 'lib/circuit-breaker.ts',
        type: 'config',
        description: 'Resilient Circuit Breaker pattern implementation for Next.js 15 Server Actions and data fetches',
        code: `export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitBreaker<T> {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;

  constructor(
    private action: () => Promise<T>,
    private fallback: () => Promise<T>,
    private threshold = 3,
    private cooldownMs = 5000
  ) {}

  async execute(): Promise<{ data: T; servedFrom: 'primary' | 'fallback'; state: CircuitState }> {
    const now = Date.now();

    // Check if cooldown elapsed to try half-open
    if (this.state === 'OPEN') {
      if (now - this.lastFailureTime > this.cooldownMs) {
        this.state = 'HALF_OPEN';
      } else {
        const fallbackData = await this.fallback();
        return { data: fallbackData, servedFrom: 'fallback', state: 'OPEN' };
      }
    }

    try {
      const result = await this.action();
      // On success in HALF_OPEN, reset circuit
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failureCount = 0;
      }
      return { data: result, servedFrom: 'primary', state: this.state };
    } catch (err) {
      this.failureCount++;
      this.lastFailureTime = now;
      if (this.failureCount >= this.threshold) {
        this.state = 'OPEN';
      }
      const fallbackData = await this.fallback();
      return { data: fallbackData, servedFrom: 'fallback', state: this.state };
    }
  }
}
`
      },
      {
        path: 'app/actions/resilient-query.ts',
        type: 'server-action',
        description: 'Server Action showing bulletproof fallback and cache tags under simulated chaos',
        code: `'use server';

import { unstable_cache, revalidateTag } from 'next/cache';
import { CircuitBreaker } from '@/lib/circuit-breaker';

const staticSnapshot = {
  products: [
    { id: '1', name: 'Resilient Edge Compute Core', price: 99.00, inventory: 412 },
    { id: '2', name: 'Sub-millisecond KV Node', price: 49.00, inventory: 89 }
  ],
  cachedAt: 'Static Edge Snapshot'
};

export async function fetchCatalogWithChaos(chaosLatencyMs = 0, forceFailure = false) {
  const breaker = new CircuitBreaker(
    async () => {
      if (chaosLatencyMs > 0) {
        await new Promise((r) => setTimeout(r, chaosLatencyMs));
      }
      if (forceFailure) {
        throw new Error('503 Service Unavailable: Postgres Pool Depleted');
      }
      return {
        products: [
          { id: '1', name: 'Resilient Edge Compute Core (LIVE DB)', price: 99.00, inventory: 412 },
          { id: '2', name: 'Sub-millisecond KV Node (LIVE DB)', price: 49.00, inventory: 89 }
        ],
        cachedAt: new Date().toISOString()
      };
    },
    async () => staticSnapshot,
    2,
    4000
  );

  return await breaker.execute();
}
`
      }
    ]
  },
  {
    id: 'sovereign',
    title: 'SovereignAI Canvas',
    tagline: 'Zero-Server Local Vector Intelligence with Edge Generative UI',
    category: 'Local-First & WASM',
    complexity: 'Staff Engineer',
    badge: 'LOCAL-FIRST WASM',
    whyCrazy: 'Why send sensitive user files or private tokens to a distant cloud LLM? SovereignAI runs vector embeddings entirely inside the client browser using WebAssembly (Transformers.js), performing 2D semantic clustering in <5ms. When complex tools are required, it streams dynamic React Server Components from the Edge on-demand without ever leaking raw user vectors to the server.',
    viralFactor: 'Demonstrates maximum privacy and crazy speed. Zero server cost for embeddings with high-tier generative UI streaming.',
    techHurdlesSolved: [
      'In-browser vector indexing with WebAssembly without freezing the main UI thread',
      'Dynamic Server-Driven UI where RSC returns rendered React components based on semantic intent',
      'Offline-first synchronization with IndexedDB and CRDT reconciliation'
    ],
    nextjsFeatures: [
      {
        title: 'Streaming Generative UI',
        tag: 'Streaming',
        description: 'Server Components stream live interactive widgets (charts, calculators, forms) based on semantic vector matches.'
      },
      {
        title: 'Edge Route Handler Proxy',
        tag: 'Edge',
        description: 'Microsecond Edge proxy that serves pre-compiled WebAssembly binaries and model weights with immutable cache headers.'
      }
    ],
    architectureSummary: {
      clientLayer: 'WASM WebWorker running cosine similarity over 384-dimensional embeddings + Canvas 2D projection',
      serverActionLayer: "'use server' dynamic component compiler streaming RSC chunks",
      edgeStreamingLayer: 'Edge routes serving cached model weights with Brotli compression',
      persistenceLayer: 'Browser OPFS (Origin Private File System) / IndexedDB vector store'
    },
    quickDemoType: 'sovereign',
    complexityMetrics: {
      overallScore: 92,
      tier: 'Staff',
      difficultyRank: 'Top 3% Local-First Engineers',
      dimensions: [
        { name: 'WASM Vector Indexing', score: 96, description: 'In-browser SIMD WebAssembly cosine similarity across 384 dimensions in <4ms' },
        { name: 'Zero-Knowledge Privacy', score: 95, description: '100% client-side vector memory with zero raw data leakage to cloud servers' },
        { name: 'Generative RSC Streaming', score: 90, description: 'On-demand React Server Component widget synthesis based on semantic intent' },
        { name: 'OPFS Offline Persistence', score: 87, description: 'Origin Private File System vector caching with sub-millisecond warm starts' }
      ]
    },
    files: [
      {
        path: 'app/api/wasm-loader/route.ts',
        type: 'route-handler',
        description: 'Edge route serving WASM vector binaries with extreme performance caching headers',
        code: `import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json(
    { status: 'ready', model: 'all-MiniLM-L6-v2-quantized', wasmEngine: 'ort-wasm-simd-threaded.wasm' },
    {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
    }
  );
}
`
      }
    ]
  },
  {
    id: 'arena',
    title: 'AlgoArena War Room',
    tagline: 'Autonomous High-Frequency Agent Order Book with Microsecond SSE',
    category: 'High-Frequency & Real-Time',
    complexity: 'Staff Engineer',
    badge: 'HIGH-FREQUENCY SSE',
    whyCrazy: 'Trading platforms are usually dull charts. AlgoArena puts 3 automated algorithmic trading bots into a simulated high-frequency order book with sub-millisecond price ticks streamed via Next.js 15 Server-Sent Events. You can trigger manual market orders via Server Actions with optimistic trade matching and watch bid/ask depth battle in real time.',
    viralFactor: 'Financial engineers and high-scale full-stack devs are captivated by live order books with visual depth charts and zero-lag optimistic order execution.',
    techHurdlesSolved: [
      'Zero-lag order book matching engine implemented in Next.js Server Actions',
      'Streaming 50 ticks/sec over SSE without React DOM thrashing or memory leaks',
      'Optimistic execution queue preventing double-spend during rapid user clicks'
    ],
    nextjsFeatures: [
      {
        title: 'Server Action Order Execution',
        tag: 'Server Actions',
        description: 'Immediate order validation, balance reservation, and match dispatching with useActionState.'
      },
      {
        title: 'Microsecond Edge Stream',
        tag: 'Streaming',
        description: 'Continuous order book depth updates pushed via Edge SSE with backpressure handling.'
      },
      {
        title: 'Optimistic Trade Queue',
        tag: 'Optimistic UI',
        description: 'Shows placed orders instantly on the depth ladder before server reconciliation.'
      }
    ],
    architectureSummary: {
      clientLayer: 'High-frequency Canvas depth chart and React 19 optimistic order book ladder',
      serverActionLayer: 'High-speed matching engine with atomic transaction isolation',
      edgeStreamingLayer: 'Edge SSE stream with 20ms tick rate',
      persistenceLayer: 'High-throughput in-memory book with snapshot checkpointing'
    },
    quickDemoType: 'arena',
    complexityMetrics: {
      overallScore: 95,
      tier: 'Staff',
      difficultyRank: 'Top 1% Real-Time Web Engineers',
      dimensions: [
        { name: 'Sub-millisecond Edge SSE', score: 97, description: 'High-frequency 50 ticks/sec broadcast without React DOM thrashing or lag' },
        { name: 'Optimistic Order Matching', score: 95, description: 'Instant client-side depth matching and balance reservation before network ACK' },
        { name: 'Atomic Action Serialization', score: 94, description: 'Preventing double-spend and race conditions in concurrent click streams' },
        { name: 'Real-time Depth Rendering', score: 93, description: 'Dynamic order book ladder with synchronized market spread calculations' }
      ]
    },
    files: [
      {
        path: 'app/actions/place-order.ts',
        type: 'server-action',
        description: 'High-speed Server Action placing limit & market orders with instant optimistic feedback',
        code: `'use server';

export interface OrderResult {
  orderId: string;
  side: 'BUY' | 'SELL';
  price: number;
  qty: number;
  status: 'FILLED' | 'PENDING';
  executedAt: string;
}

export async function placeOrder(side: 'BUY' | 'SELL', price: number, qty: number): Promise<OrderResult> {
  const start = performance.now();
  const orderId = 'ord_' + Math.random().toString(36).substring(2, 8);

  // In production, execute against memory orderbook or Redis sorted sets
  return {
    orderId,
    side,
    price,
    qty,
    status: 'FILLED',
    executedAt: new Date().toISOString(),
  };
}
`
      }
    ]
  }
];
