/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  MapPin, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  ArrowRight,
  Zap,
  DollarSign
} from 'lucide-react';
import { MetalType, Currency, Transaction, MetalHolding } from '../types';

interface DashboardViewProps {
  selectedCurrency: Currency;
  portfolioBalance: number;
  holdings: MetalHolding[];
  transactions: Transaction[];
  onNavigateToTab: (tab: any) => void;
}

export default function DashboardView({
  selectedCurrency,
  portfolioBalance,
  holdings,
  transactions,
  onNavigateToTab
}: DashboardViewProps) {
  const [tickerOffset, setTickerOffset] = useState(0);

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

  // Calculate total metals holdings value in selected currency
  const totalHoldingsSGD = holdings.reduce((sum, h) => sum + h.value, 0);
  const totalAssetsSGD = totalHoldingsSGD + portfolioBalance;
  const convertedTotalAssets = totalAssetsSGD * currencyRate;
  const convertedHoldingsValue = totalHoldingsSGD * currencyRate;
  const convertedCashValue = portfolioBalance * currencyRate;

  // Weight calculators
  const totalGoldKg = holdings.filter(h => h.metal === MetalType.GOLD).reduce((sum, h) => sum + h.weight, 0);
  const totalSilverKg = holdings.filter(h => h.metal === MetalType.SILVER).reduce((sum, h) => sum + h.weight, 0);

  // Asset allocation circular percentages
  const goldRatio = totalHoldingsSGD > 0 
    ? (holdings.filter(h => h.metal === MetalType.GOLD).reduce((sum, h) => sum + h.value, 0) / totalHoldingsSGD) * 100 
    : 100;
  
  const silverRatio = 100 - goldRatio;

  // Live ticker scroll items
  const tickerItems = [
    { name: 'Gold Spot', price: 5834.19, change: '+1.64%', up: true },
    { name: 'Silver Spot', price: 48.24, change: '+2.12%', up: true },
    { name: 'Platinum', price: 1024.50, change: '-0.32%', up: false },
    { name: 'Palladium', price: 1114.20, change: '+0.88%', up: true },
    { name: 'Gold SG Freeport', price: 5842.10, change: '+1.71%', up: true },
    { name: 'Gold Swiss Vault', price: 5838.05, change: '+1.62%', up: true },
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic News Ticker bar */}
      <div className="bg-zinc-950/70 py-2 px-4 rounded-xl border border-zinc-900 overflow-hidden relative flex items-center">
        <div className="absolute left-0 top-0 bottom-0 px-3 bg-yellow-500 text-zinc-950 text-[10px] font-extrabold flex items-center uppercase tracking-wider z-10 select-none">
          Live Ticker
        </div>
        
        {/* Scrolling text simulator */}
        <div className="flex-1 overflow-hidden ml-20">
          <div className="flex items-center gap-12 animate-marquee whitespace-nowrap text-[12px] font-medium font-mono text-zinc-400">
            {tickerItems.concat(tickerItems).map((tick, i) => (
              <div key={i} className="inline-flex items-center gap-2">
                <span className="text-white font-semibold">{tick.name}</span>
                <span className="text-zinc-350">{currencySign}{(tick.price * currencyRate).toFixed(2)}</span>
                <span className={`inline-flex items-center ${tick.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tick.up ? '▲' : '▼'} {tick.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header and Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Overview</h1>
          <p className="text-xs text-zinc-500 font-medium mt-1">
            Institutional Physical Wealth management system
          </p>
        </div>

        {/* Dynamic Action Shortcut links */}
        <div className="flex gap-2">
          <button
            onClick={() => onNavigateToTab('trading')}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(234,179,8,0.2)] cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Quick Trade</span>
          </button>
          <button
            onClick={() => onNavigateToTab('wallet')}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
          >
            <span>Fund Wallet</span>
          </button>
        </div>
      </div>

      {/* Overview Analytics Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: Total Assets */}
        <div className="bg-zinc-950/40 p-5 rounded-2xl border border-zinc-900 hover:border-zinc-800 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Total Net Worth</span>
          <p className="text-2xl font-bold text-white tracking-tight mt-1.5 font-mono">
            {currencySign}{convertedTotalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="font-semibold">+2.15% (24h)</span>
          </div>
        </div>

        {/* Stat 2: Precious Metals Holding value */}
        <div className="bg-zinc-950/40 p-5 rounded-2xl border border-zinc-900 hover:border-zinc-800 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Vaulted Metal Value</span>
          <p className="text-2xl font-bold text-yellow-400 tracking-tight mt-1.5 font-mono">
            {currencySign}{convertedHoldingsValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-2">
            <span className="text-zinc-650">•</span>
            <span>Allocated Bars: <strong className="text-zinc-300 font-medium">{holdings.length}</strong></span>
          </div>
        </div>

        {/* Stat 3: Cash balance indicator */}
        <div className="bg-zinc-950/40 p-5 rounded-2xl border border-zinc-900 hover:border-zinc-800 transition-all group relative overflow-hidden">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Free Cash Balance</span>
          <p className="text-2xl font-bold text-white tracking-tight mt-1.5 font-mono">
            {currencySign}{convertedCashValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-2">
            <span>Ready for investment deployment</span>
          </div>
        </div>

        {/* Stat 4: Total physical weights */}
        <div className="bg-zinc-950/40 p-5 rounded-2xl border border-zinc-900 hover:border-zinc-800 transition-all group relative overflow-hidden">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Accumulated Weights</span>
          <p className="text-lg font-bold text-white tracking-tight mt-1.5 font-mono">
            Gold: {totalGoldKg.toFixed(2)} kg
          </p>
          <p className="text-xs font-semibold text-zinc-500 mt-0.5">
            Silver: {totalSilverKg.toFixed(1)} kg
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Visual Allocation split & bar statistics (Left) */}
        <div className="lg:col-span-4 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">Portfolio Allocation</h2>
            <p className="text-[11px] text-zinc-550 mt-0.5">Physical alloy distribution ratio</p>
          </div>

          {/* Custom SVG ring chart representing weights ratio */}
          <div className="flex items-center justify-center py-6 relative">
            <svg viewBox="0 0 120 120" className="w-28 h-28 transform -rotate-90">
              {/* Outer track */}
              <circle cx="60" cy="60" r="50" fill="transparent" stroke="#18181b" strokeWidth="8" />
              
              {/* Gold arc stroke */}
              <circle 
                cx="60" cy="60" r="50" 
                fill="transparent" 
                stroke="#eab308" 
                strokeWidth="10" 
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - goldRatio / 100)}`}
                strokeLinecap="round"
              />
              
              {/* Silver arc stroke (offset to start where Gold ends) */}
              <circle 
                cx="60" cy="60" r="50" 
                fill="transparent" 
                stroke="#9ca3af" 
                strokeWidth="6" 
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - silverRatio / 100)}`}
                transform={`rotate(${(goldRatio / 100) * 360} 60 60)`}
                strokeLinecap="round"
              />
            </svg>

            {/* Centered detail percentage overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-2.5">
              <span className="text-base font-bold text-white font-mono">{goldRatio.toFixed(0)}%</span>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-500">Gold Allocation</span>
            </div>
          </div>

          {/* Allocation details legends list */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="text-zinc-400">Gold bars</span>
              </div>
              <span className="font-mono text-white font-semibold">{goldRatio.toFixed(1)}%</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                <span className="text-zinc-400">Silver bars</span>
              </div>
              <span className="font-mono text-white font-semibold">{silverRatio.toFixed(1)}%</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-550 pt-2 border-t border-zinc-900/60 font-mono">
              <span>Updated: Real-time Live spot</span>
              <span className="text-yellow-500">SGD/oz basis</span>
            </div>
          </div>
        </div>

        {/* Recent ledger transactions panel with filters (Right) */}
        <div className="lg:col-span-8 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">Recent Activity Log</h2>
              <p className="text-[11px] text-zinc-550 mt-0.5">Your past transactional operations</p>
            </div>
            <button 
              onClick={() => onNavigateToTab('statement')}
              className="text-xs font-semibold text-yellow-400 hover:text-yellow-350 flex items-center gap-1 cursor-pointer"
            >
              <span>View ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-zinc-900/80 text-[10px] font-mono text-zinc-500 uppercase tracking-widest pb-2">
                  <th className="py-2.5 font-semibold">ID</th>
                  <th className="py-2.5 font-semibold">Type</th>
                  <th className="py-2.5 font-semibold">Asset/Form</th>
                  <th className="py-2.5 font-semibold">Amount</th>
                  <th className="py-2.5 font-semibold">Valuation</th>
                  <th className="py-2.5 font-semibold">Status</th>
                  <th className="py-2.5 font-semibold text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/40 text-xs text-zinc-200">
                {transactions.slice(0, 4).map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-900/20 group">
                    <td className="py-3 font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      #{tx.id.replace('tx-', '')}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] uppercase tracking-wide font-extrabold ${
                        tx.type === 'Buy' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/10' :
                        tx.type === 'Sell' ? 'bg-orange-500/10 text-orange-400' :
                        tx.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 font-medium">
                      {tx.metal ? `${tx.metal} (${tx.unit || 'oz'})` : 'Cash Currency'}
                    </td>
                    <td className="py-3 font-mono font-medium">
                      {tx.metal ? `${tx.amount} kg` : `${currencySign}${(tx.amount * currencyRate).toLocaleString('en-US')}`}
                    </td>
                    <td className="py-3 font-mono text-zinc-300">
                      {currencySign}{(tx.currencyValue * currencyRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3">
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-zinc-500 font-mono text-[10px]">
                      {tx.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Strategic Vault Location checklist maps visualization card bottom */}
      <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-3xl relative overflow-hidden">
        {/* Glow vector map outline in backing */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-400 fill-current">
            <path d="M10 20 H30 V40 H10 Z M50 10 H70 V30 H50 Z M40 60 H60 V80 H40 Z M70 50 H90 V70 H70 Z" />
          </svg>
        </div>

        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LBMA High Security Standards</span>
          </div>
          
          <h2 className="text-lg font-bold text-white tracking-tight">Globally Diversified Custody Locations</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Your physical holdings are securely distributed across maximum-security, high-grade vaults in Singapore Freeport, Switzerland Zurich, and London UK. Each bar is strictly allocated with verifiable unique LBMA serial marks.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-1 text-center">
            <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
              <MapPin className="w-4 h-4 text-yellow-500 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-white">Singapore</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Le Freeport (SG)</p>
            </div>
            <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
              <MapPin className="w-4 h-4 text-yellow-500 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-white">Switzerland</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Zurich (CH)</p>
            </div>
            <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
              <MapPin className="w-4 h-4 text-zinc-400 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-zinc-400">United Kingdom</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">London (UK)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
