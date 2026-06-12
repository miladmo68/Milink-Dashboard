/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Coins, 
  HelpCircle, 
  Percent, 
  ArrowRight, 
  CheckCircle, 
  ShieldAlert,
  Sliders,
  DollarSign
} from 'lucide-react';
import { Currency, CollateralLoan, MetalHolding, MetalType } from '../types';

interface CollateralViewProps {
  holdings: MetalHolding[];
  selectedCurrency: Currency;
  loans: CollateralLoan[];
  setLoans: React.Dispatch<React.SetStateAction<CollateralLoan[]>>;
  portfolioBalance: number;
  setPortfolioBalance: React.Dispatch<React.SetStateAction<number>>;
}

export default function CollateralView({
  holdings,
  selectedCurrency,
  loans,
  setLoans,
  portfolioBalance,
  setPortfolioBalance,
}: CollateralViewProps) {
  
  // States
  const [borrowAmount, setBorrowAmount] = useState<string>('15000');
  const [ltv, setLtv] = useState<number>(50); // initial Loan-to-Value %
  const [success, setSuccess] = useState(false);

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

  // Calculate maximum borrow capability based on Available Gold weight
  const goldHoldingsForCollateral = holdings.filter(h => h.metal === MetalType.GOLD && h.status === 'Available');
  const totalCollateralValueSGD = goldHoldingsForCollateral.reduce((sum, h) => sum + h.value, 0);
  const totalCollateralValueSelectedVal = totalCollateralValueSGD * currencyRate;

  // Max borrow limit is typically capped at LTV max 75%
  const maxBorrowLimit = totalCollateralValueSelectedVal * (ltv / 100);

  const handleBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(borrowAmount);
    if (!amountVal || amountVal <= 0) return;

    if (amountVal > maxBorrowLimit) {
      alert(`Borrow amount exceeds maximum calculated capacity for your selected LTV coefficient.`);
      return;
    }

    // Process loan
    const baseSgdCreditValue = amountVal / currencyRate;

    // Create new loan record
    const newLoan: CollateralLoan = {
      id: `l-${Math.round(Math.random() * 90000 + 10000)}`,
      amountBorrowed: amountVal,
      currency: selectedCurrency,
      interestRate: ltv > 60 ? 5.2 : ltv > 40 ? 3.5 : 2.8, // dynamic rate
      ltv: ltv,
      collateralWeight: goldHoldingsForCollateral.reduce((sum, h) => sum + h.weight, 0),
      collateralValue: totalCollateralValueSGD,
      dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 180 days loan
      status: 'Active',
    };

    setLoans(prev => [...prev, newLoan]);
    setPortfolioBalance(prev => prev + baseSgdCreditValue);
    setSuccess(true);
    setBorrowAmount('');

    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Collateral Lending</h1>
        <p className="text-xs text-zinc-500 font-medium mt-1">Unlock fast liquidity against your allocated gold bullion</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Interactive Loan Console (Left) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6">
          <form onSubmit={handleBorrow} className="space-y-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[11px] font-mono text-yellow-500 uppercase tracking-wider block">Gold Backed Credit Calculator</span>

              {/* Total Gold Available Assets summary */}
              <div className="bg-zinc-900/60 rounded-xl p-4 border border-zinc-850/60 flex justify-between items-center text-xs">
                <div>
                  <span className="text-zinc-500 block">Available Gold collateral:</span>
                  <p className="text-lg font-bold text-white mt-1">
                    {goldHoldingsForCollateral.reduce((sum, h) => sum + h.weight, 0).toFixed(2)} kg
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-zinc-505 block">Current Market valuation:</span>
                  <p className="text-lg font-semibold text-yellow-400 mt-1 font-mono">
                    {currencySign}{totalCollateralValueSelectedVal.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>

              {/* LTV percentage metric parameter slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-semibold">Select Loan-to-Value (LTV) coefficient:</span>
                  <span className="font-mono font-bold text-yellow-500">{ltv}%</span>
                </div>
                
                <input 
                  type="range"
                  min="20"
                  max="75"
                  value={ltv}
                  onChange={(e) => setLtv(parseInt(e.target.value))}
                  className="w-full accent-yellow-500 h-1 bg-zinc-850 rounded cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>20% (Conservative, lowest rate)</span>
                  <span>75% (Maximum regulatory cap)</span>
                </div>
              </div>

              {/* Dynamic Rate feedback and Borrow limit */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-1 border-y border-zinc-900 py-3">
                <div>
                  <span className="text-zinc-505 block">Calculated Borrow limit:</span>
                  <p className="text-base font-extrabold text-white mt-0.5 font-mono">
                    {currencySign}{maxBorrowLimit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <span className="text-zinc-505 block">Dynamic Interest rate (p.a.):</span>
                  <p className="text-base font-extrabold text-emerald-400 mt-0.5 font-mono">
                    {(ltv > 60 ? 5.2 : ltv > 40 ? 3.5 : 2.8).toFixed(1)}% p.a.
                  </p>
                </div>
              </div>

              {/* Input Borrow Amount */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-zinc-405 block">Desired Borrow Amount ({selectedCurrency})</label>
                <div className="relative">
                  <input 
                    type="number"
                    max={maxBorrowLimit}
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono font-bold text-white outline-none focus:border-yellow-500/50"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono font-bold">
                    {selectedCurrency}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="space-y-3 pt-6">
              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
                  <CheckCircle className="w-4.5 h-4.5 flex-shrink-0" />
                  <span>Your cash lending has been processed! Money credited instantly. Margin limit monitored.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={totalCollateralValueSGD <= 0}
                className="w-full py-4 rounded-xl font-semibold text-zinc-950 text-sm tracking-wide bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 hover:from-yellow-400 hover:to-yellow-250 disabled:opacity-40 disabled:pointer-events-none transition-all duration-300 text-center font-bold shadow-lg cursor-pointer"
              >
                Request Instant Liquidity Credit
              </button>
            </div>
          </form>
        </div>

        {/* Active Loan Listing Ledger (Right) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[11px] font-mono text-zinc-550 uppercase tracking-wider block">Active Loan Agreements</span>
              
              {loans.length === 0 ? (
                <div className="p-8 text-center text-zinc-550 space-y-1.5 border border-dashed border-zinc-900 rounded-xl mt-4">
                  <Coins className="w-8 h-8 text-zinc-800 mx-auto stroke-[1.5]" />
                  <p className="text-xs font-semibold">No active debt</p>
                  <p className="text-[10px] leading-relaxed select-none">Borrow cash instantly of up to 75% LTV using precious vault reserves.</p>
                </div>
              ) : (
                loans.map(loan => (
                  <div key={loan.id} className="bg-zinc-900 border border-zinc-805/80 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-mono font-extrabold text-yellow-500">Active Accord #{loan.id}</span>
                      <span className="text-[10px] bg-yellow-500/15 text-yellow-500 font-bold px-2 py-0.5 rounded">
                        LTV: {loan.ltv}%
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-zinc-400">
                        <span>Principal borrowed:</span>
                        <strong className="font-mono text-white">{loan.currency} {loan.amountBorrowed.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between text-zinc-405">
                        <span>Rate:</span>
                        <strong className="font-mono text-emerald-400">{loan.interestRate}% p.a.</strong>
                      </div>
                      <div className="flex justify-between text-zinc-410">
                        <span>Collateral Weight:</span>
                        <strong className="font-mono font-medium text-zinc-200">{loan.collateralWeight} kg gold</strong>
                      </div>
                      <div className="flex justify-between text-zinc-415">
                        <span>Pay Term limit:</span>
                        <strong className="font-mono font-medium text-zinc-300">{loan.dueDate}</strong>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-900 text-[10px] font-mono text-zinc-500 flex gap-2">
              <ShieldAlert className="w-4 h-4 text-zinc-650 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                Vault positions under collateral contracts are legally encumbered and locked from sell operations. Maintain LTV below 85% to mitigate margin call auto-liquidation risks.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
