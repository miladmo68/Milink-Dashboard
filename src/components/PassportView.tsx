/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, 
  MapPin, 
  Cpu, 
  QrCode, 
  FileCheck, 
  Layers,
  Fingerprint,
  RotateCw,
  Printer
} from 'lucide-react';
import { MetalHolding, MetalType } from '../types';

interface PassportProps {
  holdings: MetalHolding[];
  userProfile: any;
}

export default function PassportView({
  holdings,
  userProfile
}: PassportProps) {
  
  const [selectedBarId, setSelectedBarId] = useState<string>(holdings[0]?.id || '');
  const activeBar = holdings.find(h => h.id === selectedBarId) || holdings[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Passport Digital Certificates</h1>
          <p className="text-xs text-zinc-500 font-medium mt-1">Verifiable physical metal ownership tokens and blockchain certification</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition-all select-none cursor-pointer"
        >
          <Printer className="w-4 h-4 text-zinc-400" />
          <span>Print Certificate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Selected Bar selector (Left Column) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 space-y-3">
            <span className="text-[11px] font-mono text-zinc-505 uppercase tracking-wider block">Allocated bullions list</span>
            
            {holdings.map((hold) => (
              <button
                key={hold.id}
                onClick={() => setSelectedBarId(hold.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-center justify-between cursor-pointer ${
                  selectedBarId === hold.id 
                    ? 'bg-zinc-900 border-yellow-500/50 text-white' 
                    : 'bg-transparent border-zinc-905 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                }`}
              >
                <div className="space-y-1">
                  <p className="font-bold underline">{hold.serialNumber}</p>
                  <p className="text-[11px] text-zinc-500 font-mono">{hold.weight} kg {hold.metal}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                  <span>View token</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Passport Certificate detailed Card (Center/Right) */}
        <div className="lg:col-span-8">
          {activeBar ? (
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden">
              
              {/* Premium geometric gold background outline for a passport feel */}
              <div className="absolute top-0 right-0 w-80 h-80 opacity-[0.03] pointer-events-none text-yellow-500">
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M 50 5 L 50 95 M 5 50 L 95 50" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>

              {/* Passport Header Title */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b border-zinc-900">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-yellow-400" />
                    <span className="text-[11px] font-mono text-yellow-500 uppercase tracking-widest">Ownership Passport certificate</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">Legal Deed of Allocated Bullion</h2>
                </div>

                <div className="bg-zinc-900 px-4 py-2 rounded-xl text-right font-mono self-start sm:self-center border border-zinc-805">
                  <p className="text-[9px] text-zinc-500 uppercase">Certificate Token ID</p>
                  <p className="text-sm font-bold text-yellow-400">TKN-AU-{activeBar.serialNumber}</p>
                </div>
              </div>

              {/* Deed details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-350">
                <div className="space-y-4">
                  <div>
                    <span className="text-zinc-505 font-mono text-[10px] uppercase block">Owner Beneficiary Name</span>
                    <strong className="text-sm text-white font-semibold mt-1 block">{userProfile.name}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-505 font-mono text-[10px] uppercase block">Custodial Vault Location</span>
                    <strong className="text-sm text-zinc-200 mt-1 block flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      {activeBar.location}
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-505 font-mono text-[10px] uppercase block">Blockchain Record Signature Hash</span>
                    <strong className="text-[10px] font-mono text-zinc-400 mt-1 block truncate">
                      SHA256: e82f1b0a9cb3{activeBar.id}4bd19c8f1a23e9fbcd5ac1ef
                    </strong>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-zinc-505 font-mono text-[10px] uppercase block">Physical Alloy specs</span>
                    <strong className="text-sm text-white font-semibold mt-1 block">{activeBar.metal} Gold bar</strong>
                    <span className="text-[10px] text-zinc-400 mt-0.5 block">{activeBar.purity}</span>
                  </div>
                  <div>
                    <span className="text-zinc-505 font-mono text-[10px] uppercase block">Registered Net Weight</span>
                    <strong className="text-sm text-yellow-300 font-mono font-bold mt-1 block">
                      {activeBar.weight} kg ({(activeBar.weight * 32.1507).toFixed(3)} fine troy ounces)
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-505 font-mono text-[10px] uppercase block">Registry Assay Verification</span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 mt-1 font-semibold border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded-lg">
                      <FileCheck className="w-3.5 h-3.5" />
                      LBMA Global Registry Certified Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Audit QR Validator stamps footer */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-5 border-t border-zinc-900 mt-6 text-xs text-zinc-500">
                <div className="flex items-center gap-3">
                  {/* Decorative QR box */}
                  <div className="w-14 h-14 rounded-lg bg-white p-1 flex items-center justify-center flex-shrink-0 animate-pulse">
                    <QrCode className="w-12 h-12 text-zinc-950" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-[10px] text-zinc-400">SCAN METADATA SIGNATURE</p>
                    <p className="text-[10px] leading-relaxed">
                      This QR anchors the token deed directly onto the underlying LBMA vault series database.
                    </p>
                  </div>
                </div>
                
                <div className="text-center sm:text-right font-mono text-[10px] space-y-0.5 uppercase tracking-wider text-zinc-500">
                  <p>Refiner Vault stamp signed</p>
                  <p className="font-bold text-white uppercase mt-0.5">MiLink Ledger Corp.</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center p-8 bg-zinc-950/40 border border-zinc-900 rounded-3xl min-h-[300px] flex items-center justify-center">
              <p className="text-zinc-500 text-sm">No allocated physical metal holdings found.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
