/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  Key, 
  ToggleLeft, 
  CheckCircle,
  Copy,
  Info
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export default function ProfileView({
  userProfile,
  setUserProfile
}: ProfileProps) {
  
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [tfa, setTfa] = useState(userProfile.twoFactorEnabled);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name,
      email,
      phone,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleToggleTFA = () => {
    const next = !tfa;
    setTfa(next);
    setUserProfile(prev => ({
      ...prev,
      twoFactorEnabled: next
    }));
  };

  const generateNewAPIKey = () => {
    const key = `milink_live_sk_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    setApiKey(key);
    setCopied(false);
    setUserProfile(prev => ({
      ...prev,
      apiKeyCreated: true
    }));
  };

  const copyToClipboard = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Profile & Security</h1>
        <p className="text-xs text-zinc-500 font-medium mt-1">Manage physical bullion legal account credentials and security layers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Core profile details setup form (Left Column) */}
        <div className="lg:col-span-8 bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6">
          <form onSubmit={handleSave} className="space-y-5">
            <span className="text-[11px] font-mono text-yellow-500 uppercase tracking-wider block">Legal Account Information</span>
            
            {saved && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Account profile changes saved securely.</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Account owner */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold">Legal Beneficiary Name</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-805 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500/50"
                  required
                />
              </div>

              {/* Registered Account ID */}
              <div className="space-y-1.5">
                <label className="text-zinc-505 font-semibold">Account register serial</label>
                <input 
                  type="text"
                  value={userProfile.accountNumber}
                  className="w-full bg-zinc-900/60 border border-zinc-900 rounded-xl px-4 py-3 text-zinc-500 font-mono disabled:pointer-events-none"
                  disabled
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold">Email Contact Address</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-805 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500/50"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold">Mobile Phone (2FA SMS)</label>
                <input 
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-805 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold text-xs rounded-xl shadow-[0_4px_12px_rgba(234,179,8,0.2)] transition-colors cursor-pointer select-none"
            >
              Update Beneficiary Credentials
            </button>
          </form>

          {/* Verification Progress details */}
          <div className="border-t border-zinc-900 mt-6 pt-6 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white">KYC Verification status level</span>
              <span className="font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded">
                {userProfile.kycLevel}
              </span>
            </div>

            {/* Visual timeline */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase font-mono">
              <div className="p-2 border border-emerald-500/40 bg-emerald-500/5 text-emerald-400 rounded-xl">
                Level 1: Basic Signup Verified
              </div>
              <div className="p-2 border border-emerald-500/40 bg-emerald-500/5 text-emerald-400 rounded-xl">
                Level 2: Identity & Docs Verified
              </div>
              <div className="p-2 border border-dashed border-zinc-800 text-zinc-600 rounded-xl">
                Level 3: Custom Custody Account Delivery
              </div>
            </div>
          </div>
        </div>

        {/* Security parameters, 2FA, API Key box (Right Column) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Two-Factor Authenticator */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 space-y-4">
            <span className="text-[11px] font-mono text-zinc-550 uppercase tracking-wider block">Security triggers</span>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-white">SMS/TOTP Two-Factor</h3>
                <p className="text-[10px] text-zinc-500">Require token approval during transactions</p>
              </div>
              
              <button 
                onClick={handleToggleTFA}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <div className={`w-12 h-6 rounded-full p-0.5 transition-colors ${tfa ? 'bg-emerald-500' : 'bg-zinc-800'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${tfa ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Rest API Dev keys */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 space-y-4">
            <span className="text-[11px] font-mono text-zinc-550 uppercase tracking-wider block">Automated algorithmic integration</span>
            
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-white">Algorithmic API Tokens</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Allow programmatic reading of your physical vaults and portfolio margins ledger.
              </p>
            </div>

            {apiKey ? (
              <div className="space-y-2">
                <div className="relative bg-zinc-900 p-3 rounded-xl border border-zinc-850 flex items-center justify-between text-xs font-mono">
                  <span className="text-yellow-400 font-semibold truncate pr-1">{apiKey}</span>
                  <button 
                    onClick={copyToClipboard}
                    className="text-zinc-400 hover:text-white flex-shrink-0"
                    title="Copy Key"
                  >
                    <Copy className="w-4 h-4 cursor-pointer" />
                  </button>
                </div>
                {copied && <span className="text-[10px] text-emerald-450 block text-right font-mono">Copied!</span>}
              </div>
            ) : (
              <button
                onClick={generateNewAPIKey}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
              >
                Generate REST API Token
              </button>
            )}

            <div className="bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-900 text-[10px] text-zinc-500 leading-normal flex gap-1.5">
              <Info className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 mt-0.5" />
              <span>API credentials are encrypted under 256-bit HSM chips. Never share your secret keys.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
