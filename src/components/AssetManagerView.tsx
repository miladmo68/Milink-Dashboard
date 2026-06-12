/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building, 
  Percent, 
  Award, 
  Bookmark, 
  HelpCircle,
  TrendingUp,
  Sliders,
  CheckCircle,
  Plus
} from 'lucide-react';
import { Currency, ManagedProduct } from '../types';

interface AssetManagerProps {
  selectedCurrency: Currency;
  products: ManagedProduct[];
  setProducts: React.Dispatch<React.SetStateAction<ManagedProduct[]>>;
  portfolioBalance: number;
  setPortfolioBalance: React.Dispatch<React.SetStateAction<number>>;
}

export default function AssetManagerView({
  selectedCurrency,
  products,
  setProducts,
  portfolioBalance,
  setPortfolioBalance,
}: AssetManagerProps) {
  
  const [selectedProduct, setSelectedProduct] = useState<ManagedProduct | null>(null);
  const [investAmt, setInvestAmt] = useState<string>('15000');
  const [investSuccessMsg, setInvestSuccessMsg] = useState<string | null>(null);

  const currencySign = {
    [Currency.SGD]: 'S$',
    [Currency.USD]: '$',
    [Currency.EUR]: '€',
    [Currency.GBP]: '£'
  }[selectedCurrency];

  const currencyRate = {
    [Currency.SGD]: 1.0,
    [Currency.USD]: 0.74,
    [Currency.EUR]: 0.68,
    [Currency.GBP]: 0.58
  }[selectedCurrency];

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const amt = parseFloat(investAmt);
    if (!amt || amt <= 0) return;

    // Convert amount to SGD base
    const sgdBorrowAmount = amt / currencyRate;

    if (sgdBorrowAmount > portfolioBalance) {
      alert('Insufficient wallet funds to make this allocation.');
      return;
    }

    // Process investment allocations
    setPortfolioBalance(prev => prev - sgdBorrowAmount);
    setProducts(prev => prev.map(p => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          amountInvested: p.amountInvested + amt,
        };
      }
      return p;
    }));

    setInvestSuccessMsg(`Successfully allocated ${currencySign}${amt.toLocaleString()} to ${selectedProduct.name}.`);
    setInvestAmt('15000');
    setTimeout(() => {
      setInvestSuccessMsg(null);
      setSelectedProduct(null);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Structured Asset Manager</h1>
        <p className="text-xs text-zinc-500 font-medium mt-1">Allocate liquid capital into high-yield, premium physical-gold trusts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Products cards listing (Left Column) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => (
              <div 
                key={p.id}
                className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 hover:border-yellow-500/20 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{p.type}</span>
                    <span className="text-xs font-bold text-yellow-400 font-mono flex items-center gap-1 bg-yellow-550/10 px-2 py-0.5 rounded border border-yellow-500/10">
                      <TrendingUp className="w-3 h-3 text-yellow-500" />
                      {p.targetYield}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight">{p.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                      Risk Profile: 
                      <strong className={`font-semibold ${
                        p.riskProfile === 'Conservative' ? 'text-emerald-400' :
                        p.riskProfile === 'Moderate' ? 'text-amber-400' : 'text-orange-400'
                      }`}>{p.riskProfile}</strong>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-900/60 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-zinc-500 text-[10px] block">Amount Invested:</span>
                      <strong className="text-zinc-200 mt-0.5 block font-mono">
                        {currencySign}{(p.amountInvested * currencyRate).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">Unrealized P&L:</span>
                      <strong className={`mt-0.5 block font-mono ${p.unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-450'}`}>
                        {p.unrealizedPnL >= 0 ? '+' : ''}{p.unrealizedPnL.toFixed(2)} SGD
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between mt-4 border-t border-zinc-900/60">
                  <span className="text-[10px] font-mono text-zinc-500">Min: {currencySign}{(p.minInvestment * currencyRate).toLocaleString()}</span>
                  
                  <button
                    onClick={() => { setSelectedProduct(p); setInvestSuccessMsg(null); }}
                    className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer select-none transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Allocate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invest/Allocate Interactive Tool overlay (Right) */}
        <div className="lg:col-span-4">
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 space-y-4 h-full flex flex-col justify-between">
            {selectedProduct ? (
              <form onSubmit={handleAllocate} className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3.5">
                  <span className="text-[11px] font-mono text-yellow-500 uppercase tracking-wider block">Investment Desk</span>
                  <h2 className="text-sm font-semibold text-white tracking-tight">{selectedProduct.name} Allocation</h2>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Set the capital allocation to move free available Cash balance to this yield-maximizing fund.
                  </p>

                  <div className="space-y-1 bg-zinc-900 p-3 rounded-xl border border-zinc-805/60 text-xs">
                    <span className="text-zinc-500">Free cash deployed limit:</span>
                    <strong className="text-white block font-mono text-sm mt-0.5">
                      {currencySign}{(portfolioBalance * currencyRate).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>

                  {/* Input Investment amount */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-405 block">Allocation Amount ({selectedCurrency})</label>
                    <input 
                      type="number"
                      min={selectedProduct.minInvestment * currencyRate}
                      max={portfolioBalance * currencyRate}
                      value={investAmt}
                      onChange={(e) => setInvestAmt(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-805 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white outline-none focus:border-yellow-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  {investSuccessMsg && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs font-semibold leading-normal">
                      {investSuccessMsg}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      className="flex-1 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold text-xs cursor-pointer shadow-lg"
                    >
                      Confirm Allocation
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center p-6 space-y-3 min-h-[220px] flex flex-col justify-center items-center">
                <Bookmark className="w-8 h-8 text-zinc-700 stroke-[1.5]" />
                <p className="text-xs font-semibold text-zinc-405 select-none">No active desk selected</p>
                <p className="text-[10px] text-zinc-650 max-w-[200px] leading-relaxed mx-auto">
                  Select a precious metals yield card on the left list and click "Allocate" to deploy capital.
                </p>
              </div>
            )}

            <div className="bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-900 text-[10px] font-mono text-zinc-550 leading-relaxed">
              <strong>Bailment Isolation Setup:</strong> Structured yield positions remain secured and isolated from custodial credit exposure, backed legally by equivalent aggregate vault commodity units.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
