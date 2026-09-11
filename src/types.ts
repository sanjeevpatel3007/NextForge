export type CrazyCategory = 
  | 'DevTools & Internals'
  | 'Distributed Systems & Chaos'
  | 'Multi-Agent & AI'
  | 'Local-First & WASM'
  | 'High-Frequency & Real-Time';

export type ComplexityLevel = 'Staff Engineer' | 'Principal Architect' | 'Viral Open-Source' | 'Senior Fullstack';

export interface NextJsCodeFile {
  path: string;
  type: 'server-action' | 'server-component' | 'client-component' | 'route-handler' | 'config' | 'readme' | 'hook';
  description: string;
  code: string;
}

export interface NextJsFeatureHighlight {
  title: string;
  tag: 'RSC' | 'Server Actions' | 'Streaming' | 'Edge' | 'Optimistic UI' | 'Cache Tags';
  description: string;
}

export interface ComplexityMetrics {
  overallScore: number; // 0-100
  tier: 'Senior' | 'Staff' | 'Principal' | 'Legendary';
  difficultyRank: string; // e.g. "Top 2% Next.js Engineers"
  dimensions: {
    name: string;
    score: number; // 0-100
    description: string;
  }[];
}

export interface ProjectIdea {
  id: string;
  title: string;
  tagline: string;
  category: CrazyCategory;
  complexity: ComplexityLevel;
  badge: string;
  whyCrazy: string;
  viralFactor: string;
  techHurdlesSolved: string[];
  nextjsFeatures: NextJsFeatureHighlight[];
  architectureSummary: {
    clientLayer: string;
    serverActionLayer: string;
    edgeStreamingLayer: string;
    persistenceLayer: string;
  };
  files: NextJsCodeFile[];
  quickDemoType: 'chronostate' | 'neuromesh' | 'chaos' | 'sovereign' | 'arena';
  complexityMetrics?: ComplexityMetrics;
}

export interface ChronoStateEvent {
  id: string;
  timestamp: string;
  type: 'SERVER_ACTION' | 'RSC_STREAM' | 'TAG_REVALIDATION' | 'OPTIMISTIC_APPLY' | 'ROLLBACK' | 'ERROR';
  label: string;
  durationMs: number;
  payload: Record<string, any>;
  stateSnapshot: {
    balance: number;
    pendingCount: number;
    activeSession: string;
    status: string;
  };
}

export interface AgentPersona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  bias: string;
}

export interface AgentFeedback {
  id: string;
  agentId: string;
  line: number;
  type: 'warning' | 'insight' | 'security' | 'perf';
  message: string;
  suggestedDiff?: string;
  timestamp: string;
}

export interface ChaosNode {
  id: string;
  name: string;
  type: 'Edge-Region-1' | 'Edge-Region-2' | 'RSC-Worker' | 'Postgres-Primary' | 'KV-Cache';
  status: 'healthy' | 'degraded' | 'failed';
  latency: number; // ms
  requestsPerSec: number;
  errorRate: number; // %
}
