/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ActiveTab {
  DASHBOARD = 'dashboard',
  WALLET = 'wallet',
  TRADING = 'trading',
  VAULT = 'vault',
  COLLATERAL = 'collateral',
  PROTECTION = 'protection',
  ASSET_MANAGER = 'asset_manager',
  PASSPORT = 'passport',
  STATEMENT = 'statement',
  PROFILE = 'profile',
}

export enum MetalType {
  GOLD = 'Gold',
  SILVER = 'Silver',
}

export enum Currency {
  SGD = 'SGD',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

export enum OrderType {
  SPOT = 'Spot',
  LIMIT = 'Limit',
}

export enum BarWeight {
  KG_1 = '1 kg',
  G_100 = '100 g',
  OZ_1 = '1 oz',
}

// Data structures
export interface Transaction {
  id: string;
  type: 'Buy' | 'Sell' | 'Deposit' | 'Withdraw' | 'Interest' | 'Fee';
  metal?: MetalType;
  amount: number; // in metal weight (kg/oz) or cash amount
  unit?: string;
  currencyValue: number;
  currency: Currency;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}

export interface MetalHolding {
  id: string;
  metal: MetalType;
  weight: number; // in KG
  value: number; // in SGD/selected currency
  location: string; // "Singapore (SG-1)", "Zurich (CH-3)", "London (UK-2)"
  serialNumber: string;
  status: 'Locked' | 'In Transit' | 'Collateralized' | 'Available';
  purity: string; // e.g. "99.99% Pure Gold"
}

export interface CollateralLoan {
  id: string;
  amountBorrowed: number;
  currency: Currency;
  interestRate: number; // % p.a.
  ltv: number; // Loan to Value %
  collateralWeight: number; // in KG of Gold
  collateralValue: number;
  dueDate: string;
  status: 'Active' | 'Paid' | 'Margin Call';
}

export interface InsurancePolicy {
  policyNumber: string;
  provider: string; // "Lloyd's of London"
  coverageAmount: number;
  coverageCurrency: Currency;
  annualPremium: number;
  renewalDate: string;
  status: 'Active' | 'Pending Renewal';
  assetsCovered: string[];
}

export interface ManagedProduct {
  id: string;
  name: string;
  type: string; // "Yield Maxizer", "Precious Basket", "Safe Haven Growth"
  targetYield: string; // "4.5% p.a.", "6.2% expected"
  minInvestment: number;
  unrealizedPnL: number;
  amountInvested: number;
  riskProfile: 'Conservative' | 'Moderate' | 'Growth';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'Price' | 'Security' | 'Order' | 'Wallet';
  isRead: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  kycLevel: 'Level 1 (Basic)' | 'Level 2 (Verified Premium)' | 'Unverified';
  accountNumber: string;
  riskProfile: string;
  twoFactorEnabled: boolean;
  apiKeyCreated: boolean;
  language: string;
}

export interface PriceHistoryPoint {
  time: string;
  price: number;
}
