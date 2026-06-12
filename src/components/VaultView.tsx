/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Cpu, 
  Camera, 
  Lock, 
  HelpCircle,
  Eye,
  CheckCircle,
  Award
} from 'lucide-react';
import { MetalHolding, MetalType } from '../types';

interface VaultViewProps {
  holdings: MetalHolding[];
  selectedCurrency: any;
  portfolioBalance: number;
}

export default function VaultView({
  holdings,
  selectedCurrency,
  portfolioBalance
}: VaultViewProps) {
  const [activeCamera, setActiveCamera] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);

  const startCameraStream = (loc: string) => {
    setActiveCamera(loc);
    setStreaming(true);
    setTimeout(() => {
      setStreaming(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Vault Holdings</h1>
          <p className="text-xs text-zinc-500 font-medium mt-1">Audit, monitor, and inspect your allocated physical bars</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-1.5 text-zinc-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Full Legal Ownership Allocated</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Allocated Bars Grid (Left) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {holdings.map((hold) => (
              <div 
                key={hold.id}
                className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 hover:border-yellow-500/20 transition-all relative overflow-hidden group"
              >
                {/* Visual design representation of physical bar metal based on selection */}
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none ${hold.metal === MetalType.GOLD ? 'text-yellow-400' : 'text-zinc-400'}`}>
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                    <polygon points="20,80 30,20 70,20 80,80" />
                  </svg>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${hold.metal === MetalType.GOLD ? 'bg-yellow-500' : 'bg-zinc-400'}`} />
                    <span className="text-xs font-mono font-extrabold uppercase text-white">{hold.metal} Bar</span>
                  </div>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                    hold.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400' :
                    hold.status === 'Collateralized' ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {hold.status}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest block">Allocated bar Serial</span>
                    <strong className="text-base text-white tracking-wider font-mono uppercase">{hold.serialNumber}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1 border-t border-zinc-900/60 text-xs">
                    <div>
                      <span className="text-zinc-500 text-[10px] block">Weight (Purity)</span>
                      <p className="font-mono font-bold text-zinc-200 mt-0.5">{hold.weight} kg <span className="text-[10px] text-zinc-400 font-normal">({hold.purity})</span></p>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">Safe Custody</span>
                      <p className="font-semibold text-zinc-200 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        <span className="truncate">{hold.location.split(',')[0]}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Micro interactivity trigger */}
                <div className="flex justify-between items-center pt-4 mt-3 border-t border-zinc-900/60 text-[11px]">
                  <button 
                    onClick={() => startCameraStream(hold.location)}
                    className="text-yellow-500 hover:text-yellow-400 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Live CCTV Feed</span>
                  </button>
                  <span className="font-mono text-zinc-500">UOB Insured Ledger</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Security Feeds & Biometrics console mockup (Right) */}
        <div className="lg:col-span-4">
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-yellow-500 uppercase tracking-wider block">Vault Security Center</span>
              <h2 className="text-sm font-semibold text-white tracking-tight">Active Remote Sentinel Audit</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Trigger a micro security camera handshake to peer inside the Swiss or Singapore allocated lockboxes.
              </p>
            </div>

            {/* Video render feed console screen */}
            <div className="bg-black rounded-xl border border-zinc-900 relative aspect-video flex-1 flex flex-col items-center justify-center overflow-hidden min-h-[160px]">
              {activeCamera ? (
                <div className="absolute inset-0 p-3 flex flex-col justify-between font-mono text-[10px]">
                  {/* Camera overlays */}
                  <div className="flex justify-between items-center text-red-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-650 animate-ping" />
                      REC LIVE
                    </span>
                    <span>CAM_SH_1092</span>
                  </div>

                  {streaming ? (
                    <div className="space-y-1 text-center text-zinc-455 animate-pulse bg-zinc-900/40 p-4 rounded-xl">
                      <Cpu className="w-6 h-6 text-yellow-500 mx-auto animate-bounce" />
                      <p className="font-bold">Biometric handshaking...</p>
                      <p className="text-[8px] text-zinc-550">Resolving 256bit HSM cryptographic handshake</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-center p-3">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto" />
                      <p className="text-zinc-300 font-bold">Secure Allocated Lockbox</p>
                      <p className="text-zinc-500 text-[8px] truncate leading-tight">Location: {activeCamera}</p>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-500 text-[8px]">
                    <span>UTC: {new Date().toISOString().replace('T', ' ').substring(0, 19)}</span>
                    <span>Secure Node: 200 OK</span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 space-y-2 select-none">
                  <Lock className="w-8 h-8 text-zinc-700 mx-auto stroke-[1.5]" />
                  <p className="text-xs font-semibold text-zinc-400">Stream Closed</p>
                  <p className="text-[10px] text-zinc-650 max-w-[200px] leading-normal mx-auto">
                    Click "Live CCTV Feed" below any bar card above to establish encrypted visual connection.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850 text-[10px] font-mono text-zinc-400 leading-relaxed">
              <strong>LBMA Registry Verified:</strong> Each of your gold bullion holds active assay certificate credentials signed by metal refiner inspectors, and is legally held on private custody bailment accounts.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
