/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ActiveTab, Currency, NotificationItem, UserProfile, MetalHolding, CollateralLoan, InsurancePolicy, ManagedProduct, Transaction } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import TradingView from './components/TradingView';
import WalletView from './components/WalletView';
import VaultView from './components/VaultView';
import CollateralView from './components/CollateralView';
import ProtectionView from './components/ProtectionView';
import AssetManagerView from './components/AssetManagerView';
import PassportView from './components/PassportView';
import StatementView from './components/StatementView';
import ProfileView from './components/ProfileView';

// Initial mocks import
import { 
  INITIAL_USER_PROFILE, 
  INITIAL_NOTIFICATIONS, 
  MOCK_HOLDINGS, 
  MOCK_LOANS, 
  MOCK_POLICIES, 
  MOCK_MANAGED_PRODUCTS, 
  MOCK_TRANSACTIONS 
} from './mockData';

export default function App() {
  // Navigation layout state
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.TRADING); // Defaults on Trading view to match the screenshot!
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Global Financial & User states
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(Currency.SGD);
  const [portfolioBalance, setPortfolioBalance] = useState<number>(7593.04); // Stored in SGD base value, exactly matching screenshot!
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [holdings, setHoldings] = useState<MetalHolding[]>(MOCK_HOLDINGS);
  const [loans, setLoans] = useState<CollateralLoan[]>(MOCK_LOANS);
  const [policies, setPolicies] = useState<InsurancePolicy[]>(MOCK_POLICIES);
  const [products, setProducts] = useState<ManagedProduct[]>(MOCK_MANAGED_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  // Theme state: dark mode as default nice
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Action callback to append dynamic transactions safely
  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);

    // Format new real-time transaction notification entry
    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      title: `${newTx.type} Order executed`,
      message: `${newTx.type} transaction for ${newTx.amount} ${newTx.metal || 'cash assets'} was authorized successfully.`,
      time: 'Just now',
      category: 'Order',
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Switch render pages
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case ActiveTab.DASHBOARD:
        return (
          <DashboardView 
            selectedCurrency={selectedCurrency}
            portfolioBalance={portfolioBalance}
            holdings={holdings}
            transactions={transactions}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        );
      case ActiveTab.WALLET:
        return (
          <WalletView 
            selectedCurrency={selectedCurrency}
            portfolioBalance={portfolioBalance}
            setPortfolioBalance={setPortfolioBalance}
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
          />
        );
      case ActiveTab.TRADING:
        return (
          <TradingView 
            selectedCurrency={selectedCurrency}
            portfolioBalance={portfolioBalance}
            setPortfolioBalance={setPortfolioBalance}
            onAddTransaction={handleAddTransaction}
          />
        );
      case ActiveTab.VAULT:
        return (
          <VaultView 
            holdings={holdings}
            selectedCurrency={selectedCurrency}
            portfolioBalance={portfolioBalance}
          />
        );
      case ActiveTab.COLLATERAL:
        return (
          <CollateralView 
            holdings={holdings}
            selectedCurrency={selectedCurrency}
            loans={loans}
            setLoans={setLoans}
            portfolioBalance={portfolioBalance}
            setPortfolioBalance={setPortfolioBalance}
          />
        );
      case ActiveTab.PROTECTION:
        return (
          <ProtectionView 
            selectedCurrency={selectedCurrency}
            policies={policies}
          />
        );
      case ActiveTab.ASSET_MANAGER:
        return (
          <AssetManagerView 
            selectedCurrency={selectedCurrency}
            products={products}
            setProducts={setProducts}
            portfolioBalance={portfolioBalance}
            setPortfolioBalance={setPortfolioBalance}
          />
        );
      case ActiveTab.PASSPORT:
        return (
          <PassportView 
            holdings={holdings}
            userProfile={userProfile}
          />
        );
      case ActiveTab.STATEMENT:
        return (
          <StatementView 
            transactions={transactions}
            selectedCurrency={selectedCurrency}
          />
        );
      case ActiveTab.PROFILE:
        return (
          <ProfileView 
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        );
      default:
        return (
          <div className="text-center p-20 text-zinc-500">
            Tab Under Construction
          </div>
        );
    }
  };

  return (
    <div 
      id="app-root-layout"
      data-theme={theme}
      className="min-h-screen bg-zinc-950 text-white flex select-none overflow-x-hidden antialiased font-sans flex-row"
    >
      {/* Background glow meshes for ultimate luxury gold palette accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/[0.02] rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/[0.01] rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Nav Sidebar Column */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main viewport Container */}
      <div className="flex-1 min-w-0 flex flex-col z-10 relative">
        {/* Core Header (Accounts, Currencies, notification ledger bell, balance avatar widgets) */}
        <Header 
          userProfile={userProfile}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          portfolioBalance={portfolioBalance}
          notifications={notifications}
          setNotifications={setNotifications}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onNavigateToTab={(tab) => setActiveTab(tab)}
          theme={theme}
          setTheme={setTheme}
        />

        {/* Content body with responsive sizing boundaries */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full"
            >
              {renderActiveTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
