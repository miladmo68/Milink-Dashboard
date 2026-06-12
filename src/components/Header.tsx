/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Menu, 
  ChevronDown, 
  Globe, 
  CreditCard,
  Check, 
  Trash2, 
  Mail,
  UserCheck,
  ShieldCheck,
  Building,
  Sun,
  Moon
} from 'lucide-react';
import { ActiveTab, Currency, NotificationItem, UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile;
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  portfolioBalance: number;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  setMobileOpen: (open: boolean) => void;
  mobileOpen: boolean;
  onNavigateToTab: (tab: any) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export default function Header({
  userProfile,
  selectedCurrency,
  setSelectedCurrency,
  portfolioBalance,
  notifications,
  setNotifications,
  setMobileOpen,
  mobileOpen,
  onNavigateToTab,
  theme,
  setTheme
}: HeaderProps) {
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('En');

  const notificationRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setShowCurrencyDropdown(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const toggleReadStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: !n.isRead } : n
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Order': return <Building className="w-4 h-4 text-amber-400" />;
      case 'Price': return <Globe className="w-4 h-4 text-yellow-400" />;
      case 'Security': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'Wallet': return <CreditCard className="w-4 h-4 text-blue-400" />;
      default: return <Bell className="w-4 h-4 text-zinc-400" />;
    }
  };

  // Convert SGD base balance to selected currency for visual presentation
  const getCurrencySign = (curr: Currency) => {
    switch (curr) {
      case Currency.SGD: return 'S$';
      case Currency.USD: return '$';
      case Currency.EUR: return '€';
      case Currency.GBP: return '£';
    }
  };

  const getCurrencyRate = (curr: Currency) => {
    switch (curr) {
      case Currency.SGD: return 1.0;
      case Currency.USD: return 0.74;
      case Currency.EUR: return 0.68;
      case Currency.GBP: return 0.58;
    }
  };

  const currencySign = getCurrencySign(selectedCurrency);
  const convertedBalance = portfolioBalance * getCurrencyRate(selectedCurrency);

  return (
    <header 
      id="app-header"
      className="h-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 flex items-center justify-between sticky top-0 z-30"
    >
      {/* Mobile Drawer menu Icon */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          id="mobile-drawer-toggle"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Selected Account display matching screenshot */}
        <div ref={accountRef} className="relative">
          <button
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-[13px] font-medium text-zinc-200 hover:text-white transition-all cursor-pointer"
            id="account-selector-btn"
          >
            <span className="text-zinc-500 font-normal">Account:</span>
            <span>{userProfile.accountNumber}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {showAccountDropdown && (
            <div className="absolute left-0 mt-2 w-56 rounded-xl bg-zinc-950 border border-zinc-850/80 shadow-[0_12px_24px_rgba(0,0,0,0.6)] py-1.5 z-50 text-xs">
              <div className="px-3.5 py-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500 border-b border-zinc-900/60 pb-1">
                Select Active Account
              </div>
              <button 
                onClick={() => setShowAccountDropdown(false)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-900 text-left text-white mt-1"
              >
                <span>Johnathan MiLink (81-1234567)</span>
                <Check className="w-3.5 h-3.5 text-amber-500" />
              </button>
              <button 
                onClick={() => setShowAccountDropdown(false)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-900 text-left text-zinc-400 group"
              >
                <span className="group-hover:text-zinc-200">Joint Institutional Vault (81-9988111)</span>
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
              </button>
            </div>
          )}
        </div>

        {/* Currency Display dropdown matching screenshot */}
        <div ref={currencyRef} className="relative hidden sm:block">
          <button
            onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-[13px] font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
            id="currency-selector-btn"
          >
            <span>{selectedCurrency}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {showCurrencyDropdown && (
            <div className="absolute left-0 mt-2 w-32 rounded-xl bg-zinc-950 border border-zinc-850/80 shadow-[0_12px_24px_rgba(0,0,0,0.6)] py-1.5 z-50 text-xs">
              {Object.values(Currency).map((curr) => (
                <button
                  key={curr}
                  onClick={() => {
                    setSelectedCurrency(curr);
                    setShowCurrencyDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-900 text-left ${selectedCurrency === curr ? 'text-yellow-400 font-semibold' : 'text-zinc-400'}`}
                >
                  <span>{curr}</span>
                  {selectedCurrency === curr && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls Bar */}
      <div className="flex items-center gap-3 md:gap-5">
        
        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 py-1.5 md:p-2.5 rounded-xl bg-zinc-900 border border-zinc-805/80 text-zinc-305 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          id="theme-toggle"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline text-[11px] font-semibold text-zinc-400">Light Mo.</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-amber-600" />
              <span className="hidden lg:inline text-[11px] font-semibold text-zinc-500">Dark Mo.</span>
            </>
          )}
        </button>

        {/* Language selector in layout */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-[13px] text-zinc-300 hover:text-white cursor-pointer transition-all"
            id="lang-selector-btn"
          >
            <span className="text-[12px] font-semibold uppercase tracking-wider">{selectedLanguage}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>

          {showLanguageDropdown && (
            <div className="absolute right-0 mt-2 w-28 rounded-xl bg-zinc-950 border border-zinc-850/80 shadow-2xl py-1.5 z-50 text-xs">
              {['En', 'Fr', 'De', 'Ja'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setShowLanguageDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-zinc-900 ${selectedLanguage === lang ? 'text-yellow-400 font-medium' : 'text-zinc-400'}`}
                >
                  {lang === 'En' && 'English'}
                  {lang === 'Fr' && 'Français'}
                  {lang === 'De' && 'Deutsch'}
                  {lang === 'Ja' && '日本語'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Tray popover */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-805/80 text-zinc-400 hover:text-white relative hover:scale-105 active:scale-95 transition-all cursor-pointer"
            id="notification-bell-btn"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-yellow-500 text-[9px] font-extrabold text-zinc-950 flex items-center justify-center border border-zinc-950 animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 md:w-96 rounded-2xl bg-zinc-950 border border-zinc-850/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden transform origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Popover Header */}
              <div className="p-4 bg-zinc-900/60 border-b border-zinc-800/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-semibold text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-yellow-500/10 text-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={markAllAsRead}
                    className="text-[11px] font-medium text-yellow-500 hover:text-yellow-400 hover:underline transition-all cursor-pointer"
                  >
                    Mark all read
                  </button>
                  <button 
                    onClick={clearAllNotifications}
                    className="text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
                    title="Clear All"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Popover Body List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-zinc-900">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500">
                    <Mail className="w-8 h-8 mx-auto mb-2.5 text-zinc-700 stroke-[1.5]" />
                    <p className="text-xs font-medium">Your inbox is empty</p>
                    <p className="text-[10px] text-zinc-600 mt-1">We'll alert you with real-time updates</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => {
                        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                        onNavigateToTab(ActiveTab.DASHBOARD);
                        setShowNotifications(false);
                      }}
                      className={`p-4 flex gap-3 text-left hover:bg-zinc-900/80 transition-colors cursor-pointer relative ${!notif.isRead ? 'bg-yellow-500/5' : ''}`}
                    >
                      {!notif.isRead && (
                        <div className="absolute right-3 top-4 w-1.5 h-1.5 rounded-full bg-yellow-400" />
                      )}
                      
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center flex-shrink-0 border border-zinc-800">
                        {getCategoryIcon(notif.category)}
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-semibold ${!notif.isRead ? 'text-white' : 'text-zinc-350'}`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] font-mono text-zinc-550">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[9px] uppercase tracking-wider font-mono text-zinc-500">
                            {notif.category}
                          </span>
                          <button 
                            onClick={(e) => toggleReadStatus(notif.id, e)}
                            className="text-[9px] text-zinc-650 hover:text-zinc-400 underline"
                          >
                            {notif.isRead ? 'Unread' : 'Read'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Balance widget exactly matching screenshot */}
        <div className="flex items-center gap-2.5 bg-zinc-900/90 border border-zinc-805/80 pl-3 md:pl-4.5 pr-2 py-1.5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-1.5 md:gap-2 text-[13px] md:text-sm font-semibold text-white">
            <CreditCard className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            <span className="font-mono tracking-wide">{currencySign}{convertedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          
          {/* User profile avatar with luxury gold border */}
          <button 
            onClick={() => onNavigateToTab(ActiveTab.PROFILE)}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 flex items-center justify-center cursor-pointer hover:rotate-6 transition-transform"
            title="View Profile Settings"
          >
            <div className="w-full h-full rounded-full bg-zinc-950 overflow-hidden flex items-center justify-center">
              {/* Initial character or golden icon */}
              <span className="text-[11px] font-bold text-yellow-400 font-mono">JG</span>
            </div>
          </button>
        </div>
        
      </div>
    </header>
  );
}
