/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  ChevronDown, 
  Download, 
  Filter, 
  ArrowRightLeft,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Transaction, Currency } from '../types';

interface StatementProps {
  transactions: Transaction[];
  selectedCurrency: Currency;
}

export default function StatementView({
  transactions,
  selectedCurrency
}: StatementProps) {
  
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [exportProgress, setExportProgress] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

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


  // Filter transactions
  const filteredTx = transactions.filter(tx => {
    const matchesSearch = tx.metal?.toLowerCase().includes(search.toLowerCase()) || 
                          tx.type.toLowerCase().includes(search.toLowerCase()) ||
                          (tx.unit && tx.unit.toLowerCase().includes(search.toLowerCase())) ||
                          tx.id.toLowerCase().includes(search.toLowerCase());
    
    if (filterType === 'All') return matchesSearch;
    return matchesSearch && tx.type === filterType;
  });

  const triggerExport = (format: 'CSV' | 'PDF') => {
    setExportProgress(true);
    setExportNotice(null);
    setTimeout(() => {
      setExportProgress(false);
      setExportNotice(`Success! Decrypted transaction statement ledger has been downloaded as milink_statement_${Date.now()}.${format.toLowerCase()}.`);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Statements</h1>
          <p className="text-xs text-zinc-500 font-medium mt-1">Audit, export, and examine your full precious metal transaction ledgers</p>
        </div>
        
        {/* Export buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => triggerExport('CSV')}
            disabled={exportProgress}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-805 rounded-xl text-zinc-305 text-xs font-semibold select-none cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={() => triggerExport('PDF')}
            disabled={exportProgress}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-805 rounded-xl text-zinc-305 text-xs font-semibold select-none cursor-pointer disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate PDF</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 text-xs font-medium rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {exportProgress && (
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Compiling encrypted vault keys and ledger records...</span>
            <span className="font-mono text-yellow-400">Processing</span>
          </div>
          <div className="w-full h-1 bg-zinc-800 roundedoverflow-hidden">
            <div className="h-full bg-yellow-500 rounded animate-marquee" style={{ width: '60%' }} />
          </div>
        </div>
      )}

      {/* Filter and search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input 
            type="text"
            placeholder="Search by ID, metal, or trade type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-805 rounded-xl pl-9 pr-4 py-2 text-xs text-white"
          />
        </div>

        {/* Filter type */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Category:</span>
          </span>
          <div className="flex gap-1.5">
            {['All', 'Buy', 'Sell', 'Deposit', 'Withdraw'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  filterType === type 
                    ? 'bg-yellow-500 text-zinc-950' 
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-805'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-5 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-zinc-900 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              <th className="py-3">Unique ID</th>
              <th className="py-3">Transaction Category</th>
              <th className="py-3">Commodity unit weight</th>
              <th className="py-3">Price Conversion rate</th>
              <th className="py-3">Summary Valuation</th>
              <th className="py-3">Legality Status</th>
              <th className="py-3 text-right">Settlement timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/60 text-xs text-zinc-200">
            {filteredTx.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-550">
                  No matching transaction ledger events found in statements trace.
                </td>
              </tr>
            ) : (
              filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-900/10">
                  <td className="py-3.5 font-mono text-zinc-500">
                    #{tx.id}
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      tx.type === 'Buy' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/10' :
                      tx.type === 'Sell' ? 'bg-orange-500/10 text-orange-450' :
                      tx.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-300'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3.5 font-semibold">
                    {tx.metal ? `${tx.metal} (${tx.unit || 'oz'})` : 'Cash Equivalent'}
                  </td>
                  <td className="py-3.5 font-mono text-zinc-300">
                    {tx.metal ? `${tx.amount} kg` : `${currencySign}${(tx.amount * currencyRate).toLocaleString('en-US')}`}
                  </td>
                  <td className="py-3.5 font-mono font-bold text-white">
                    {currencySign}{(tx.currencyValue * currencyRate).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 text-zinc-305">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-mono text-[10px] text-zinc-500">
                    {tx.date}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
