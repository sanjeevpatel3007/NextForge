import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  DollarSign, 
  Bot, 
  Radio, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface OrderBookRow {
  price: number;
  size: number;
  total: number;
}

export default function AlgoArenaSim() {
  const [bids, setBids] = useState<OrderBookRow[]>([
    { price: 64280.50, size: 1.42, total: 1.42 },
    { price: 64280.00, size: 3.10, total: 4.52 },
    { price: 64279.50, size: 0.85, total: 5.37 },
    { price: 64278.00, size: 4.20, total: 9.57 },
  ]);

  const [asks, setAsks] = useState<OrderBookRow[]>([
    { price: 64281.50, size: 0.95, total: 0.95 },
    { price: 64282.00, size: 2.15, total: 3.10 },
    { price: 64283.00, size: 5.40, total: 8.50 },
    { price: 64284.50, size: 1.80, total: 10.30 },
  ]);

  const [recentTrades, setRecentTrades] = useState<Array<{ id: string; price: number; size: number; side: 'BUY' | 'SELL'; time: string }>>([
    { id: 'tr-1', price: 64281.00, size: 0.5, side: 'BUY', time: '10:14:12' },
    { id: 'tr-2', price: 64280.50, size: 1.2, side: 'SELL', time: '10:14:14' }
  ]);

  const [userOrders, setUserOrders] = useState<number>(0);
  const [optimisticMsg, setOptimisticMsg] = useState<string | null>(null);

  // Simulated SSE Price Tick update
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * 2;
      setBids((prev) =>
        prev.map((b) => ({
          ...b,
          price: Number((b.price + delta * 0.1).toFixed(2)),
          size: Number(Math.max(0.2, b.size + (Math.random() - 0.5) * 0.4).toFixed(2))
        }))
      );
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const handlePlaceOrder = (side: 'BUY' | 'SELL') => {
    const executedPrice = side === 'BUY' ? asks[0].price : bids[0].price;
    const executedSize = 0.5;
    const now = new Date().toLocaleTimeString();

    // Instant optimistic update
    setOptimisticMsg(`Optimistic ${side} @ $${executedPrice.toFixed(2)} [Server Action Executed]`);
    setUserOrders((c) => c + 1);

    setRecentTrades((prev) => [
      { id: 'tr-' + Math.random().toString(36).substring(2, 6), price: executedPrice, size: executedSize, side, time: now },
      ...prev.slice(0, 5)
    ]);

    setTimeout(() => setOptimisticMsg(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400 mb-1 flex items-center justify-between">
            <span>Next.js 15 SSE Stream</span>
            <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
              <Radio className="w-3 h-3 animate-ping" /> LIVE 50tps
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            ${bids[0]?.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">Simulated Edge Route Broadcast</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400 mb-1">AI Market Makers</div>
          <div className="text-lg font-mono font-bold text-indigo-400 flex items-center gap-1.5">
            <Bot className="w-4 h-4" /> 3 Bots Active
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">Arbitrage, Trend, FlashLiquidity</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400 mb-1">User Dispatched Actions</div>
          <div className="text-lg font-mono font-bold text-emerald-400">
            {userOrders} Orders Filled
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">useOptimistic instant settlement</p>
        </div>
      </div>

      {/* Order Book & Trade Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Order Book Depth */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800 text-slate-400">
            <span>Order Book Ladder</span>
            <span>Size (BTC)</span>
            <span>Total</span>
          </div>

          {/* Asks (Red) */}
          <div className="space-y-1 mb-3">
            {asks.slice().reverse().map((a, i) => (
              <div key={i} className="flex justify-between text-rose-400 py-1 px-2 rounded hover:bg-rose-950/20">
                <span className="font-semibold">${a.price.toFixed(2)}</span>
                <span className="text-slate-300">{a.size.toFixed(2)}</span>
                <span className="text-slate-500">{a.total.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Mid Market Spread */}
          <div className="py-2 px-3 my-2 bg-slate-900 rounded border border-slate-800 flex justify-between items-center text-slate-300">
            <span className="text-slate-400 text-[10px]">SPREAD: $1.00</span>
            <span className="font-bold text-white">${((bids[0].price + asks[0].price) / 2).toFixed(2)}</span>
            <span className="text-emerald-400 text-[10px]">Edge Node: NRT1</span>
          </div>

          {/* Bids (Green) */}
          <div className="space-y-1">
            {bids.map((b, i) => (
              <div key={i} className="flex justify-between text-emerald-400 py-1 px-2 rounded hover:bg-emerald-950/20">
                <span className="font-semibold">${b.price.toFixed(2)}</span>
                <span className="text-slate-300">{b.size.toFixed(2)}</span>
                <span className="text-slate-500">{b.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls & Recent Executions */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono font-semibold text-white mb-3 flex items-center justify-between">
              <span>Execute Instant Order</span>
              <span className="text-[10px] text-indigo-400">'use server'</span>
            </h4>

            {optimisticMsg && (
              <div className="mb-4 p-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-emerald-300 font-mono text-[11px] animate-pulse">
                {optimisticMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => handlePlaceOrder('BUY')}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-mono text-xs font-bold transition active:scale-95 flex items-center justify-center gap-1.5 shadow-md"
              >
                <TrendingUp className="w-4 h-4" /> Market Buy
              </button>
              <button
                onClick={() => handlePlaceOrder('SELL')}
                className="py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-mono text-xs font-bold transition active:scale-95 flex items-center justify-center gap-1.5 shadow-md"
              >
                <TrendingDown className="w-4 h-4" /> Market Sell
              </button>
            </div>

            <h5 className="text-[11px] font-mono font-semibold text-slate-400 mb-2">
              Recent Edge Matches
            </h5>

            <div className="space-y-1.5 font-mono text-xs">
              {recentTrades.map((tr) => (
                <div key={tr.id} className="p-2 bg-slate-950 border border-slate-800 rounded flex justify-between items-center text-[11px]">
                  <span className={tr.side === 'BUY' ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                    {tr.side} {tr.size} BTC
                  </span>
                  <span className="text-white">${tr.price.toFixed(2)}</span>
                  <span className="text-slate-500">{tr.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
