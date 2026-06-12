/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  PlusCircle, 
  MinusCircle, 
  ArrowRightLeft, 
  CheckCircle, 
  Building,
  CreditCard,
  History,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Currency, Transaction } from '../types';

interface WalletViewProps {
  selectedCurrency: Currency;
  portfolioBalance: number;
  setPortfolioBalance: React.Dispatch<React.SetStateAction<number>>;
  transactions: Transaction[];
  onAddTransaction: (tx: Transaction) => void;
}

export default function WalletView({
  selectedCurrency,
  portfolioBalance,
  setPortfolioBalance,
  transactions,
  onAddTransaction,
}: WalletViewProps) {
  const [activeTab, setActiveTab] = useState<'Deposit' | 'Withdraw'>('Deposit');
  const [amount, setAmount] = useState<string>('5000');
  const [depositMethod, setDepositMethod] = useState<'Bank Wire' | 'Linked card'>('Bank Wire');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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

  const convertedBalance = portfolioBalance * currencyRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    // Convert input amount to SGD base
    const sgdEquivalent = val / currencyRate;

    if (activeTab === 'Withdraw') {
      if (sgdEquivalent > portfolioBalance) {
        alert('Insufficient wallet funds for this withdrawal amount.');
        return;
      }
      setPortfolioBalance(prev => prev - sgdEquivalent);
      onAddTransaction({
        id: `tx-${Math.round(Math.random() * 900000 + 100000)}`,
        type: 'Withdraw',
        amount: val,
        currencyValue: val,
        currency: selectedCurrency,
        status: 'Completed',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });
      setSuccessMsg(`Withdrawal of ${currencySign}${val.toLocaleString()} to your matched bank account was dispatched successfully.`);
    } else {
      // Deposit
      setPortfolioBalance(prev => prev + sgdEquivalent);
      onAddTransaction({
        id: `tx-${Math.round(Math.random() * 900000 + 100000)}`,
        type: 'Deposit',
        amount: val,
        currencyValue: val,
        currency: selectedCurrency,
        status: 'Completed',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });
      setSuccessMsg(`Deposit registration of ${currencySign}${val.toLocaleString()} via ${depositMethod} was executed and credited.`);
    }

    setAmount('');
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Wallet</h1>
        <p className="text-xs text-zinc-500 font-medium mt-1">Manage cash deposits and liquid gold payouts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Balance and Asset Status Cards (Left) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Main holding asset indicator */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider">Free Cash Liquid Balance</span>
              <p className="text-3xl font-extrabold font-mono text-white tracking-tight">
                {currencySign}{convertedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-zinc-400 mt-1">Holds fully liquid fiat credits ready for spot market deploy.</p>
            </div>

            {/* Simulated Currency Allocations list */}
            <div className="space-y-3.5 mt-8 border-t border-zinc-900 pt-5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-550 block">Currency Sub-Ledgers</span>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Singapore Dollar (SGD)</span>
                <span className="font-mono text-zinc-200">S${portfolioBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">US Dollar (USD equivalent)</span>
                <span className="font-mono text-zinc-300">${(portfolioBalance * 0.74).toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Euro (EUR equivalent)</span>
                <span className="font-mono text-zinc-350">€{(portfolioBalance * 0.68).toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Deposit/Withdraw Interaction Console (Center) */}
        <div className="lg:col-span-5">
          <form 
            onSubmit={handleSubmit}
            className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 space-y-5 h-full flex flex-col justify-between"
          >
            {/* Toggle bar between Deposit and Withdraw */}
            <div className="bg-zinc-900 p-1.5 rounded-xl flex gap-1 border border-zinc-850/60 max-w-sm">
              <button
                type="button"
                onClick={() => { setActiveTab('Deposit'); setSuccessMsg(null); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer text-center transition-all ${
                  activeTab === 'Deposit' 
                    ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Deposit Funds
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('Withdraw'); setSuccessMsg(null); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer text-center transition-all ${
                  activeTab === 'Withdraw' 
                    ? 'bg-zinc-800 border border-zinc-700 text-white' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Withdraw Funds
              </button>
            </div>

            {/* Inputs block */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400">Select Fiat Transfer Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDepositMethod('Bank Wire')}
                    className={`p-3 rounded-xl border flex flex-col gap-1.5 text-left transition-all ${
                      depositMethod === 'Bank Wire' 
                        ? 'bg-zinc-900 border-yellow-500/50 text-white' 
                        : 'bg-zinc-900/40 border-zinc-905 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Building className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-semibold">Bank Wire Transfer</span>
                    <span className="text-[10px] text-zinc-500 font-mono">No limit • 1-2 hours</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositMethod('Linked card')}
                    className={`p-3 rounded-xl border flex flex-col gap-1.5 text-left transition-all ${
                      depositMethod === 'Linked card' 
                        ? 'bg-zinc-900 border-yellow-500/50 text-white' 
                        : 'bg-zinc-900/40 border-zinc-905 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-semibold">Fast Card Payment</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Max $20,000 • Instant</span>
                  </button>
                </div>
              </div>

              {/* Amount input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400">Amount ({selectedCurrency})</label>
                <div className="relative">
                  <input 
                    type="number"
                    step="500"
                    min="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-base font-mono font-bold text-white pr-10 focus:border-yellow-500/50 outline-none"
                    placeholder="Enter amount"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-zinc-500">
                    {selectedCurrency}
                  </span>
                </div>
              </div>

              {/* Fee notice summary */}
              <div className="rounded-xl bg-zinc-900/80 p-3 flex gap-2 border border-zinc-850/60 text-[11px] text-zinc-400">
                <AlertCircle className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Both deposits and withdrawals processed under high security KYC audit. Zero deposit fees. Outbound wire withdrawal subject to physical metal dispatch verification fee (capped max 0.05%).
                </p>
              </div>
            </div>

            {/* Actions button */}
            <div className="space-y-3">
              {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-semibold text-zinc-950 text-sm tracking-wide bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 hover:from-yellow-400 hover:to-yellow-200 transition-all duration-300 shadow-[0_4px_24px_rgba(234,179,8,0.3)] hover:shadow-[0_4px_30px_rgba(234,179,8,0.45)] cursor-pointer text-center font-bold"
              >
                {activeTab === 'Deposit' ? 'Submit Deposit Request' : 'Process Cash Payout'}
              </button>
            </div>
          </form>
        </div>

        {/* Bank Credentials / Deposit Details card (Right) */}
        <div className="lg:col-span-3">
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 space-y-4 h-full">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">Wire Bank Credentials</span>
            
            <p className="text-xs text-zinc-400 leading-relaxed">
              To transfer via bank wire, use these credentials. Ensure to include your unique account references in the payment note.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Beneficiary Bank</p>
                <p className="font-semibold text-white mt-0.5">United Overseas Bank (UOB) Singapore</p>
              </div>
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Beneficiary Name</p>
                <p className="font-semibold text-white mt-0.5">MiLink Custody Pte. Ltd.</p>
              </div>
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Unique Payment reference</p>
                <p className="font-mono font-bold text-yellow-400 mt-0.5">MILINK-SG-81-1234567</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
