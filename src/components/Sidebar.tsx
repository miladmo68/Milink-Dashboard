/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowUpDown, 
  ShieldCheck, 
  Coins, 
  ShieldAlert, 
  Briefcase, 
  Award, 
  FileText, 
  User, 
  ChevronLeft, 
  Menu
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}: SidebarProps) {
  
  const navItems = [
    { id: ActiveTab.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ActiveTab.WALLET, label: 'Wallet', icon: Wallet },
    { id: ActiveTab.TRADING, label: 'Trading', icon: ArrowUpDown },
    { id: ActiveTab.VAULT, label: 'Vault', icon: ShieldCheck },
    { id: ActiveTab.COLLATERAL, label: 'Collateral', icon: Coins },
    { id: ActiveTab.PROTECTION, label: 'Protection', icon: ShieldAlert },
    { id: ActiveTab.ASSET_MANAGER, label: 'Asset manager', icon: Briefcase },
    { id: ActiveTab.PASSPORT, label: 'Passport', icon: Award },
    { id: ActiveTab.STATEMENT, label: 'Statement', icon: FileText },
    { id: ActiveTab.PROFILE, label: 'Profile', icon: User },
  ];

  const content = (
    <div className="flex flex-col h-full text-zinc-300 select-none">
      {/* Brand Logo header */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.3)]">
            <span className="font-bold text-zinc-950 text-base">M</span>
            {/* Minimal glowing dot */}
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-yellow-400" />
          </div>
          
          {/* Logo Name - Updated to MiLink */}
          {(!collapsed || mobileOpen) && (
            <span className="text-xl font-medium tracking-tight text-white flex items-center">
              Mi<span className="text-amber-500 font-semibold drop-shadow-[0_0_8px_rgba(212,175,55,0.45)]">L</span>ink
            </span>
          )}
        </div>

        {/* Collapse button on desktop */}
        {!mobileOpen && (
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
            id="sidebar-toggle-btn"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Nav navigation items */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileOpen(false); // Close mobile drawer on selection
              }}
              id={`nav-${item.id}`}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-250 text-left relative group cursor-pointer ${
                isActive 
                  ? 'text-white border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-transparent shadow-[inset_0_1px_12px_rgba(234,179,8,0.06)]' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent'
              }`}
            >
              {/* Left Glowing Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-full bg-yellow-400 shadow-[0_0_8px_rgb(234,179,8)]" />
              )}

              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 duration-200 ${isActive ? 'text-yellow-400' : 'text-zinc-400 group-hover:text-zinc-300'}`} />
              
              {(!collapsed || mobileOpen) && (
                <span className={`text-[14px] font-medium tracking-wide ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                  {item.label}
                </span>
              )}
              
              {/* Tooltip on collapsed state */}
              {collapsed && !mobileOpen && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md bg-zinc-950 text-xs font-semibold text-white border border-zinc-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer information block */}
      <div className="p-5 border-t border-zinc-800/60 bg-zinc-950/40 text-xs text-zinc-500">
        {(!collapsed || mobileOpen) ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] uppercase tracking-wider font-mono text-zinc-400">Secure Node Online</span>
            </div>
            <p className="text-[10px] leading-relaxed font-mono">LBMA Vault Partner • 256bit SSL</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar container */}
      <aside 
        id="sidebar-container"
        className={`hidden md:block bg-zinc-950/70 backdrop-blur-md border-r border-zinc-950 transition-all duration-300 ease-in-out flex-shrink-0 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {content}
      </aside>

      {/* Mobile Sidebar overlay shelf */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}

      {/* Mobile Drawer */}
      <aside 
        className={`md:hidden fixed top-0 bottom-0 left-0 w-64 bg-zinc-950 z-50 transition-transform duration-300 ease-out transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </aside>
    </>
  );
}
