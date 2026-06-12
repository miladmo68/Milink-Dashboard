/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  FileText, 
  HelpCircle,
  Award,
  Lock
} from 'lucide-react';
import { Currency, InsurancePolicy } from '../types';

interface ProtectionProps {
  selectedCurrency: Currency;
  policies: InsurancePolicy[];
}

export default function ProtectionView({
  selectedCurrency,
  policies
}: ProtectionProps) {
  
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

  const auditChecklist = [
    { label: 'Lloyd\'s All-Risks Specie Insurance fully certified', checked: true },
    { label: 'Vault operators hold Class-A precious metal warehouse certification', checked: true },
    { label: 'Independently audited thrice-annually by Bureau Veritas inspection specialists', checked: true },
    { label: 'Weight, series metrics, and assays individually registered', checked: true },
    { label: 'Seismic movement trackers and thermal alarm sensors actively monitored', checked: true },
    { label: 'Bailment custodial setup isolates bullion balance from balance sheets legal claims', checked: true },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Protection & Insurance</h1>
        <p className="text-xs text-zinc-500 font-medium mt-1">Multi-layered security audits and risk insurance mitigation protocols</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Insurance Coverage Overview (Left) */}
        <div className="lg:col-span-7 bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Specie Coverage Certification</span>
            </div>

            {policies.map((pol) => (
              <div key={pol.policyNumber} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Active certified policy ID</span>
                    <strong className="text-zinc-150 text-base font-mono font-bold">{pol.policyNumber}</strong>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 rounded">
                    {pol.status}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Primary Insurer Broker</span>
                  <p className="text-sm font-semibold text-white">{pol.provider}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-850 text-xs">
                  <div>
                    <span className="text-zinc-500 text-[10px] block">Sum insured coverage:</span>
                    <strong className="text-sm font-mono text-yellow-400 font-bold mt-1">
                      {currencySign}{(pol.coverageAmount * currencyRate).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] block">Annual Policy premium:</span>
                    <strong className="text-sm font-mono text-zinc-300 font-semibold mt-1">
                      {currencySign}{(pol.annualPremium * currencyRate).toLocaleString('en-US', { maximumFractionDigits: 0 })}/year
                    </strong>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-zinc-550 text-[10px] font-mono uppercase tracking-widest block mb-1.5">Underwritten Assets covered:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {pol.assetsCovered.map((asset, i) => (
                      <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-900">
                        • {asset}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900/30 p-3 rounded-xl border border-zinc-900 mt-6 text-[11px] text-zinc-500">
            * Note: Sum insured coverage levels are scaled dynamically alongside daily spot prices updates.
          </div>
        </div>

        {/* Audit checklist & Security specs (Right) */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 space-y-6 h-full flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-yellow-500 uppercase tracking-wider block">Audits & Vault standards</span>
              <h2 className="text-sm font-semibold text-white tracking-tight">Institutional Safety Audit Report</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Our operations undergo rigid inspections to verify asset custody alignment.
              </p>
            </div>

            {/* Checklist lists items */}
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {auditChecklist.map((item, id) => (
                <div key={id} className="flex gap-2.5 items-start text-xs text-zinc-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-805/60 space-y-1 text-center font-mono">
              <p className="text-[10px] text-zinc-505 uppercase tracking-wider">Independent Inspecting Auditor</p>
              <p className="text-xs font-bold text-white uppercase tracking-wide">Bureau Veritas Inspection Inc.</p>
              <p className="text-[10px] text-yellow-500">Audit Stamp APPROVED - June 2026</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
