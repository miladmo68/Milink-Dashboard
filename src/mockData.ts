/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MetalHolding,
  CollateralLoan,
  InsurancePolicy,
  ManagedProduct,
  NotificationItem,
  UserProfile,
  PriceHistoryPoint,
  MetalType,
  Currency,
  Transaction
} from './types';

// Let's create realistic mock prices in SGD
export const SPOT_PRICES_SGD = {
  [MetalType.GOLD]: 5834.19, // per oz. (translates to SGD 187.57 per gram, SGD 187,570 per kg)
  [MetalType.SILVER]: 48.24,  // per oz. (translates to SGD 1.55 per gram)
};

// Converters (1 kg = 32.1507 oz)
export const KG_TO_OZ = 32.1507;

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Johnathan MiLink',
  email: 'miladmo68@gmail.com', // matching user email from metadata or generic name
  phone: '+65 9123 4567',
  kycLevel: 'Level 2 (Verified Premium)',
  accountNumber: '81-1234567',
  riskProfile: 'Balanced Growth (Risk Level 3/5)',
  twoFactorEnabled: true,
  apiKeyCreated: false,
  language: 'En',
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Limit Order Executed',
    message: 'Your Limit Buy order for 0.5 kg Gold was executed at SGD 92,150.00.',
    time: '10 minutes ago',
    category: 'Order',
    isRead: false,
  },
  {
    id: 'n-2',
    title: 'Gold Price Alert',
    message: 'Gold has broken past SGD 5,830 / oz, hitting a new 30-day high.',
    time: '1 hour ago',
    category: 'Price',
    isRead: false,
  },
  {
    id: 'n-3',
    title: 'Collateral Interest Paid',
    message: 'Interest cycle payment of SGD 124.50 has been successfully debited.',
    time: 'Yesterday',
    category: 'Wallet',
    isRead: true,
  },
  {
    id: 'n-4',
    title: 'Security Login Alert',
    message: 'Successful Web Login from IP 110.54.21.109 (Singapore).',
    time: '2 days ago',
    category: 'Security',
    isRead: true,
  },
  {
    id: 'n-5',
    title: 'Insurance Coverage Activated',
    message: 'Full Lloyd\'s of London tier-1 coverage certified for Vault Box SG-125.',
    time: '5 days ago',
    category: 'Security',
    isRead: true,
  }
];

export const MOCK_HOLDINGS: MetalHolding[] = [
  {
    id: 'h-1',
    metal: MetalType.GOLD,
    weight: 1.0, // in KG
    value: 187570, // SGD (1kg gold)
    location: 'Singapore (SG-1, Freeport)',
    serialNumber: 'AU-9999-SB814',
    status: 'Available',
    purity: '99.99% LBMA Certified',
  },
  {
    id: 'h-2',
    metal: MetalType.GOLD,
    weight: 0.5,
    value: 93785,
    location: 'Zurich (CH-3, Swiss Gold Vault)',
    serialNumber: 'AU-9999-ZH323',
    status: 'Collateralized',
    purity: '99.99% Valcambi Assay',
  },
  {
    id: 'h-3',
    metal: MetalType.SILVER,
    weight: 15.0, // in KG (15kg silver approx $1500 * 15 = $22500)
    value: 23260,
    location: 'London (UK-2, Brink\'s Global)',
    serialNumber: 'AG-999-LN0023',
    status: 'Available',
    purity: '99.9% Royal Mint Bar',
  },
  {
    id: 'h-4',
    metal: MetalType.GOLD,
    weight: 0.3,
    value: 56271,
    location: 'Singapore (SG-1, Freeport)',
    serialNumber: 'AU-9999-SB991',
    status: 'Available',
    purity: '99.99% Premium Minted',
  }
];

export const MOCK_LOANS: CollateralLoan[] = [
  {
    id: 'l-1',
    amountBorrowed: 45000,
    currency: Currency.SGD,
    interestRate: 3.5,
    ltv: 48.0, // Loan to Value %
    collateralWeight: 0.5, // 0.5 KG of gold used as collateral
    collateralValue: 93785,
    dueDate: '2026-12-15',
    status: 'Active',
  }
];

export const MOCK_POLICIES: InsurancePolicy[] = [
  {
    policyNumber: 'LL-SG-814-99P',
    provider: 'Lloyd\'s of London (Underwritten by Marsh)',
    coverageAmount: 500000,
    coverageCurrency: Currency.SGD,
    annualPremium: 450,
    renewalDate: '2027-02-18',
    status: 'Active',
    assetsCovered: ['Singapore Vault AU-9999-SB814', 'London Vault AG-999-LN0023'],
  }
];

export const MOCK_MANAGED_PRODUCTS: ManagedProduct[] = [
  {
    id: 'p-1',
    name: 'MiLink Yield Maximizer',
    type: 'Asset Yield Fund',
    targetYield: '4.5% p.a.',
    minInvestment: 10000,
    unrealizedPnL: 843.20,
    amountInvested: 25000,
    riskProfile: 'Conservative',
  },
  {
    id: 'p-2',
    name: 'Tactical Precious Basket',
    type: 'Metal Rotation ETF',
    targetYield: '8.4% expected',
    minInvestment: 25000,
    unrealizedPnL: -210.50,
    amountInvested: 0,
    riskProfile: 'Moderate',
  },
  {
    id: 'p-3',
    name: 'Safe Haven Growth',
    type: 'Gold Leverage Index',
    targetYield: '12.0% potential',
    minInvestment: 50000,
    unrealizedPnL: 4920.00,
    amountInvested: 75000,
    riskProfile: 'Growth',
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    type: 'Buy',
    metal: MetalType.GOLD,
    amount: 0.5,
    unit: 'kg',
    currencyValue: 92150,
    currency: Currency.SGD,
    status: 'Completed',
    date: '2026-06-12 11:34',
  },
  {
    id: 'tx-102',
    type: 'Deposit',
    amount: 15000,
    currencyValue: 15000,
    currency: Currency.SGD,
    status: 'Completed',
    date: '2026-06-10 09:12',
  },
  {
    id: 'tx-103',
    type: 'Sell',
    metal: MetalType.SILVER,
    amount: 5.0,
    unit: 'kg',
    currencyValue: 7750,
    currency: Currency.SGD,
    status: 'Completed',
    date: '2026-06-05 16:45',
  },
  {
    id: 'tx-104',
    type: 'Interest',
    amount: 131.25,
    currencyValue: 131.25,
    currency: Currency.SGD,
    status: 'Completed',
    date: '2026-06-01 00:00',
  },
  {
    id: 'tx-105',
    type: 'Withdraw',
    amount: 3200,
    currencyValue: 3200,
    currency: Currency.SGD,
    status: 'Completed',
    date: '2026-05-28 14:10',
  },
  {
    id: 'tx-106',
    type: 'Buy',
    metal: MetalType.GOLD,
    amount: 1.0,
    unit: 'oz',
    currencyValue: 5812,
    currency: Currency.SGD,
    status: 'Completed',
    date: '2026-05-20 10:22',
  }
];

// Re-scaling arrays for the price chart (Time Interval data values)
export const GOLD_PRICE_CHART_HOURS: PriceHistoryPoint[] = [
  { time: '09:35', price: 6480 },
  { time: '09:40', price: 6510 },
  { time: '09:45', price: 6490 },
  { time: '09:50', price: 6500 },
  { time: '09:55', price: 6505 },
  { time: '09:58', price: 6512 },
];

export const MOCK_PRICE_DATA = {
  '1h': [
    { time: '09:35', price: 6480 },
    { time: '09:40', price: 6510 },
    { time: '09:45', price: 6490 },
    { time: '09:50', price: 6496 },
    { time: '09:55', price: 6504 },
    { time: '09:58', price: 6512 },
  ],
  '1d': [
    { time: '00:00', price: 6390 },
    { time: '04:00', price: 6410 },
    { time: '08:00', price: 6450 },
    { time: '12:00', price: 6490 },
    { time: '16:00', price: 6512 },
    { time: '20:00', price: 6510 },
  ],
  '1w': [
    { time: 'Mon', price: 6320 },
    { time: 'Tue', price: 6390 },
    { time: 'Wed', price: 6450 },
    { time: 'Thu', price: 6410 },
    { time: 'Fri', price: 6480 },
    { time: 'Sat', price: 6512 },
  ],
  '1m': [
    { time: 'Week 1', price: 6200 },
    { time: 'Week 2', price: 6280 },
    { time: 'Week 3', price: 6410 },
    { time: 'Week 4', price: 6512 },
  ],
  '6m': [
    { time: 'Jan', price: 5800 },
    { time: 'Feb', price: 5950 },
    { time: 'Mar', price: 6100 },
    { time: 'Apr', price: 6250 },
    { time: 'May', price: 6380 },
    { time: 'Jun', price: 6512 },
  ],
  '1y': [
    { time: '2025-Q3', price: 5100 },
    { time: '2025-Q4', price: 5400 },
    { time: '2026-Q1', price: 5900 },
    { time: '2026-Q2', price: 6512 },
  ]
};

export const MOCK_SILVER_PRICE_DATA = {
  '1h': [
    { time: '09:35', price: 47.90 },
    { time: '09:40', price: 48.10 },
    { time: '09:45', price: 48.02 },
    { time: '09:50', price: 48.15 },
    { time: '09:55', price: 48.20 },
    { time: '09:58', price: 48.24 },
  ],
  '1d': [
    { time: '00:00', price: 47.20 },
    { time: '04:00', price: 47.50 },
    { time: '08:00', price: 47.80 },
    { time: '12:00', price: 48.10 },
    { time: '16:00', price: 48.24 },
    { time: '20:00', price: 48.18 },
  ],
  '1w': [
    { time: 'Mon', price: 46.80 },
    { time: 'Tue', price: 47.10 },
    { time: 'Wed', price: 47.50 },
    { time: 'Thu', price: 47.90 },
    { time: 'Fri', price: 48.24 },
    { time: 'Sat', price: 48.12 },
  ],
  '1m': [
    { time: 'Week 1', price: 45.10 },
    { time: 'Week 2', price: 46.30 },
    { time: 'Week 3', price: 47.40 },
    { time: 'Week 4', price: 48.24 },
  ],
  '6m': [
    { time: 'Jan', price: 41.50 },
    { time: 'Feb', price: 43.10 },
    { time: 'Mar', price: 44.80 },
    { time: 'Apr', price: 46.20 },
    { time: 'May', price: 47.50 },
    { time: 'Jun', price: 48.24 },
  ],
  '1y': [
    { time: '2025-Q3', price: 38.00 },
    { time: '2025-Q4', price: 40.50 },
    { time: '2026-Q1', price: 44.20 },
    { time: '2026-Q2', price: 48.24 },
  ]
};
