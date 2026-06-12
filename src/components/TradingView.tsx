/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ArrowUpDown, 
  Info, 
  RefreshCw, 
  CheckCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { MetalType, Currency, OrderType, BarWeight, Transaction } from '../types';
import { MOCK_PRICE_DATA, MOCK_SILVER_PRICE_DATA, SPOT_PRICES_SGD, KG_TO_OZ } from '../mockData';

interface TradingViewProps {
  selectedCurrency: Currency;
  portfolioBalance: number;
  setPortfolioBalance: React.Dispatch<React.SetStateAction<number>>;
  onAddTransaction: (tx: Transaction) => void;
}

export default function TradingView({
  selectedCurrency,
  portfolioBalance,
  setPortfolioBalance,
  onAddTransaction,
}: TradingViewProps) {
  
  // States
  const [metal, setMetal] = useState<MetalType>(MetalType.GOLD);
  const [currency, setCurrency] = useState<Currency>(selectedCurrency);
  const [tradeType, setTradeType] = useState<'Buy' | 'Sell'>('Buy');
  const [orderType, setOrderType] = useState<OrderType>(OrderType.SPOT);
  const [barWeight, setBarWeight] = useState<BarWeight>(BarWeight.KG_1);
  const [quantity, setQuantity] = useState<string>('1.8');
  const [timeframe, setTimeframe] = useState<'1h' | '1d' | '1w' | '1m' | '6m' | '1y'>('1h');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; x: number; y: number; price: number; time: string } | null>(null);

  // Sync parent currency
  useEffect(() => {
    setCurrency(selectedCurrency);
  }, [selectedCurrency]);

  const currencySign = {
    [Currency.SGD]: 'S$',
    [Currency.USD]: '$',
    [Currency.EUR]: '€',
    [Currency.GBP]: '£'
  }[currency];

  const currencyRate = {
    [Currency.SGD]: 1.0,
    [Currency.USD]: 0.74,
    [Currency.EUR]: 0.68,
    [Currency.GBP]: 0.58
  }[currency];

  // Prices based on selection
  const baseSpotPriceOzSGD = SPOT_PRICES_SGD[metal]; 
  const currentSpotPriceOz = baseSpotPriceOzSGD * currencyRate;
  const currentSpotPriceKg = currentSpotPriceOz * KG_TO_OZ;

  // Premium details
  const premiumOz = metal === MetalType.GOLD ? 6 * currencyRate : 0.8 * currencyRate;
  const premiumPct = metal === MetalType.GOLD ? 0.14 : 1.6;

  // Total conversions
  const parsedQty = parseFloat(quantity) || 0;
  
  // Calculate total weights (in KG and OZ)
  let totalWeightKg = 0;
  let totalWeightOz = 0;

  if (barWeight === BarWeight.KG_1) {
    totalWeightKg = parsedQty * 1.0;
    totalWeightOz = totalWeightKg * KG_TO_OZ;
  } else if (barWeight === BarWeight.G_100) {
    totalWeightKg = parsedQty * 0.1;
    totalWeightOz = totalWeightKg * KG_TO_OZ;
  } else { // 1 oz
    totalWeightOz = parsedQty * 1.0;
    totalWeightKg = totalWeightOz / KG_TO_OZ;
  }

  const calculatedBasePrice = totalWeightOz * currentSpotPriceOz;
  const calculatedPremium = totalWeightOz * premiumOz;
  const totalPrice = calculatedBasePrice + (tradeType === 'Buy' ? calculatedPremium : -calculatedPremium);

  // Reset function matching "Reset all" text button in design
  const resetAllFields = () => {
    setTradeType('Buy');
    setOrderType(OrderType.SPOT);
    setBarWeight(BarWeight.KG_1);
    setQuantity('1.8');
    setOrderSuccess(false);
  };

  // Invest submit
  const handleInvestNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalPrice <= 0) return;
    
    // Check if user has enough balance on Buy
    const userBalanceInSelectedCurr = portfolioBalance * currencyRate;
    if (tradeType === 'Buy' && totalPrice > userBalanceInSelectedCurr) {
      alert('Insufficient funds. Please deposit in your Wallet tab first.');
      return;
    }

    // Process trade
    const baseSgdValue = totalPrice / currencyRate;
    setPortfolioBalance(prev => prev + (tradeType === 'Buy' ? -baseSgdValue : baseSgdValue));

    // Register transaction
    const newTx: Transaction = {
      id: `tx-${Math.round(Math.random() * 900000 + 100000)}`,
      type: tradeType,
      metal: metal,
      amount: parsedQty,
      unit: barWeight === BarWeight.KG_1 ? '1 kg bar' : barWeight === BarWeight.G_100 ? '100 g bar' : '1 oz bar',
      currencyValue: totalPrice,
      currency: currency,
      status: 'Completed',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    onAddTransaction(newTx);

    // Show beautiful custom notification
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
    }, 5000);
  };

  // SVG Chart rendering logic
  const chartData = metal === MetalType.GOLD 
    ? MOCK_PRICE_DATA[timeframe] 
    : MOCK_SILVER_PRICE_DATA[timeframe];

  // SVG dimensions
  const width = 500;
  const height = 300;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const prices = chartData.map(d => d.price);
  const minPrice = Math.min(...prices) * 0.995;
  const maxPrice = Math.max(...prices) * 1.005;
  const priceRange = maxPrice - minPrice;

  // Convert data points to SVG coordinates
  const svgPoints = chartData.map((d, index) => {
    const x = paddingLeft + (index / (chartData.length - 1)) * (width - paddingLeft - paddingRight);
    const y = height - paddingBottom - ((d.price - minPrice) / priceRange) * (height - paddingTop - paddingBottom);
    return { x, y, price: d.price, time: d.time, index };
  });

  // SVG Path generation
  let pathD = '';
  if (svgPoints.length > 0) {
    pathD = `M ${svgPoints[0].x} ${svgPoints[0].y}`;
    for (let i = 1; i < svgPoints.length; i++) {
      // Smooth cubic bezier curves for premium visual style
      const p0 = svgPoints[i - 1];
      const p1 = svgPoints[i];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
  }

  // Polygon area gradient path
  const areaD = svgPoints.length > 0 
    ? `${pathD} L ${svgPoints[svgPoints.length - 1].x} ${height - paddingBottom} L ${svgPoints[0].x} ${height - paddingBottom} Z` 
    : '';

  return (
    <div className="space-y-6">
      {/* Title block exactly matching design */}
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Trading</h1>
        <p className="text-xs text-zinc-500 mt-1 font-medium">Buy or Sell Gold / Silver</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* ================= COLUMN 1: SELECT METALL / ASSETS (LEFT) ================= */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 flex-1 flex flex-col justify-between overflow-hidden relative min-h-[380px]">
            {/* Ambient gold glow in core card */}
            <div className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full bg-yellow-500/5 blur-3xl pointer-events-none" />

            <div className="space-y-4">
              {/* Select Metal */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Select metall</label>
                <div className="relative">
                  <select 
                    value={metal}
                    onChange={(e) => setMetal(e.target.value as MetalType)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium text-white hover:border-zinc-700 outline-none cursor-pointer appearance-none"
                  >
                    <option value={MetalType.GOLD}>Gold</option>
                    <option value={MetalType.SILVER}>Silver</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              {/* Select Currency */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Select currency</label>
                <div className="relative">
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium text-white hover:border-zinc-700 outline-none cursor-pointer appearance-none"
                  >
                    <option value={Currency.SGD}>SGD</option>
                    <option value={Currency.USD}>USD</option>
                    <option value={Currency.EUR}>EUR</option>
                    <option value={Currency.GBP}>GBP</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              {/* Balance display */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Balance:</span>
                <p className="text-2xl font-semibold text-white tracking-tight">
                  {currencySign}{(portfolioBalance * currencyRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Bottom floating glassmorphic spot banner exactly looking like screenshot */}
            <div className="relative mt-8 group">
              {/* Outer glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-yellow-300/20 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300" />
              
              {/* Core card - glassmorphic black */}
              <div className="relative bg-zinc-950/80 border border-yellow-500/25 rounded-2xl p-4 overflow-hidden shadow-2xl">
                {/* Embedded golden dust vector rendering */}
                <div className="absolute -right-2 -bottom-2 w-20 h-20 opacity-30 pointer-events-none">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-yellow-400">
                    <path d="M50 0L65 35L100 50L65 65L50 100L35 65L0 50L35 35Z" fill="currentColor" />
                  </svg>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-yellow-500/20 uppercase tracking-widest">
                  Market Open
                </div>
                
                <p className="text-[11px] text-zinc-400 mt-2.5 font-medium">{metal} spot price:</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-bold text-white tracking-tight">
                    {currencySign}{currentSpotPriceOz.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">/{metal === MetalType.GOLD ? 'oz' : 'oz'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= COLUMN 2: INVEST ORDER CONSOLE (CENTER) ================= */}
        <div className="lg:col-span-5">
          <form 
            onSubmit={handleInvestNow}
            className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 space-y-5 flex flex-col justify-between h-full relative"
          >
            {/* Top Row: Buy / Sell Tab + Reset Button */}
            <div className="flex items-center justify-between">
              {/* Buy / Sell buttons styled identically to screenshot */}
              <div className="bg-zinc-900 p-1.5 rounded-xl flex gap-1 border border-zinc-850/60 max-w-xs">
                <button
                  type="button"
                  onClick={() => { setTradeType('Buy'); setOrderSuccess(false); }}
                  className={`flex items-center gap-1 px-5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    tradeType === 'Buy' 
                      ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 shadow-[0_2px_8px_rgba(234,179,8,0.15)]' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  ↓ Buy
                </button>
                <button
                  type="button"
                  onClick={() => { setTradeType('Sell'); setOrderSuccess(false); }}
                  className={`flex items-center gap-1 px-5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    tradeType === 'Sell' 
                      ? 'bg-zinc-800 border border-zinc-700 text-white' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  ↑ Sell
                </button>
              </div>

              <button
                type="button"
                onClick={resetAllFields}
                className="text-xs font-medium text-zinc-400 hover:text-white underline cursor-pointer"
              >
                Reset all
              </button>
            </div>

            {/* Order type segment: Spot / Limit */}
            <div className="flex items-center justify-between py-1 border-b border-zinc-900/60 pb-3">
              <span className="text-xs font-semibold text-zinc-400">Order type:</span>
              <div className="flex gap-2">
                {Object.values(OrderType).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOrderType(type)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      orderType === type 
                        ? 'bg-zinc-900 border-yellow-500/50 text-yellow-400' 
                        : 'bg-transparent border-zinc-800 text-zinc-400 hover:text-zinc-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar Weight preference selection */}
            <div className="flex items-center justify-between py-1 border-b border-zinc-900/60 pb-3">
              <span className="text-xs font-semibold text-zinc-400">Bar weight preference:</span>
              <div className="flex gap-2">
                {Object.values(BarWeight).map((weight) => (
                  <button
                    key={weight}
                    type="button"
                    onClick={() => setBarWeight(weight)}
                    className={`px-3.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      barWeight === weight 
                        ? 'bg-zinc-900 border-yellow-500/50 text-yellow-400' 
                        : 'bg-transparent border-zinc-800 text-zinc-400 hover:text-zinc-300'
                    }`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>

            {/* Premium details */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-900/60 pb-3">
              <div className="flex items-center gap-1.5 text-zinc-400 font-semibold">
                <span>Premium:</span>
                <Info className="w-3.5 h-3.5 text-zinc-500 cursor-help" title="Premium charged above metal base spot value" />
              </div>
              <span className="font-mono text-zinc-200">
                {premiumOz.toFixed(2)} {currency}/oz ({premiumPct}%)
              </span>
            </div>

            {/* Quantity kg / Investment tabs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-yellow-400 font-mono tracking-wide">
                  Quantity ({barWeight === BarWeight.OZ_1 ? 'oz' : 'bars'})
                </span>
                <span className="text-xs font-semibold text-zinc-400">Investment Amount</span>
              </div>
              
              {/* Dual custom text field representation */}
              <div className="relative">
                <input 
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setOrderSuccess(false);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-base font-mono font-bold text-white pr-16 focus:border-yellow-500/50 outline-none"
                  placeholder="0.0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-zinc-400">
                  {barWeight === BarWeight.KG_1 ? 'bars (1kg)' : barWeight === BarWeight.G_100 ? 'bars (100g)' : 'oz'}
                </span>
              </div>

              {/* Slider for quick increments */}
              <div className="pt-2">
                <input 
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setOrderSuccess(false);
                  }}
                  className="w-full accent-yellow-400 cursor-pointer h-1 bg-zinc-850 rounded"
                />
              </div>

              <div className="text-[11px] font-medium text-zinc-500 font-mono">
                Estimated: <span className="text-zinc-350">{totalWeightKg.toFixed(2)} kg ({totalWeightOz.toFixed(1)} oz)</span>
              </div>
            </div>

            {/* Calculations Summary Card */}
            <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-850/40 space-y-3 mt-1.5">
              <div className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Summary</div>
              
              <div className="space-y-2 text-xs">
                {/* Total Weight */}
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Total Weight:</span>
                  <span className="font-mono text-zinc-200">
                    {totalWeightKg.toFixed(3)} kg ({totalWeightOz.toFixed(2)} oz)
                  </span>
                </div>

                {/* Spot Price */}
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Spot Price:</span>
                  <span className="font-mono text-zinc-200">
                    {currencySign}{currentSpotPriceOz.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/oz
                  </span>
                </div>

                {/* Premium adjustment cost */}
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Premium:</span>
                  <span className="font-mono text-zinc-200">
                    {tradeType === 'Buy' ? '+' : '-'}{currencySign}{calculatedPremium.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({premiumPct}%)
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-800/60 my-1 pt-2 flex justify-between items-center text-sm font-semibold">
                  <span className="text-white">Total price:</span>
                  <span className="font-mono text-yellow-400 text-base drop-shadow-[0_0_8px_rgba(234,179,8,0.2)]">
                    {currencySign}{totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Action invest now button exactly replicating golden mesh from screenshot */}
            <div className="space-y-3">
              {orderSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold animate-pulse">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Success! {tradeType} order of {parsedQty} {barWeight} was processed securely. Balance updated.</span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={totalPrice <= 0}
                  className="w-full py-4 rounded-xl font-semibold text-zinc-950 text-sm tracking-wide bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 hover:from-yellow-400 hover:to-yellow-200 transition-all duration-300 shadow-[0_4px_24px_rgba(234,179,8,0.3)] hover:shadow-[0_4px_30px_rgba(234,179,8,0.45)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none cursor-pointer text-center font-bold"
                >
                  {tradeType === 'Buy' ? 'Invest now' : 'Liquidate holdings'}
                </button>
              )}

              <p className="text-[10px] text-zinc-550 leading-relaxed text-center px-4">
                For this product, MiLink reserves the right to substitute a 1kg bar with a combination of weight denomination of gold bars equaling 1kg in total.
              </p>
            </div>
          </form>
        </div>

        {/* ================= COLUMN 3: LIVE CHART DATA (RIGHT) ================= */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-5 flex-1 flex flex-col justify-between min-h-[380px]">
            <div>
              {/* Chart metadata bar */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-xs font-semibold text-white tracking-tight">{metal} price ({currency} / oz)</span>
              </div>

              {/* Chart Interval buttons selection bar modeled exact on screen */}
              <div className="flex gap-1.5 mt-3 select-none">
                {(['1h', '1d', '1w', '1m', '6m', '1y'] as const).map((itv) => (
                  <button
                    key={itv}
                    type="button"
                    onClick={() => { setTimeframe(itv); setHoveredPoint(null); }}
                    className={`w-9 py-1 rounded-lg text-[10px] font-mono font-bold tracking-tight transition-all cursor-pointer text-center ${
                      timeframe === itv 
                        ? 'bg-zinc-100 text-zinc-950' 
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-850/60'
                    }`}
                  >
                    {itv}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive SVG Chart block */}
            <div className="relative flex-1 mt-6 flex items-center justify-center">
              <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-full max-h-[220px]"
                onMouseLeave={() => setHoveredPoint(null)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const xClick = ((e.clientX - rect.left) / rect.width) * width;
                  
                  // Find closest data point
                  let closestPt = svgPoints[0];
                  let minDistance = Math.abs(svgPoints[0].x - xClick);
                  for (let i = 1; i < svgPoints.length; i++) {
                    const distance = Math.abs(svgPoints[i].x - xClick);
                    if (distance < minDistance) {
                      minDistance = distance;
                      closestPt = svgPoints[i];
                    }
                  }
                  
                  setHoveredPoint({
                    index: closestPt.index,
                    x: closestPt.x,
                    y: closestPt.y,
                    price: closestPt.price,
                    time: closestPt.time,
                  });
                }}
              >
                <defs>
                  {/* Linear gradient for filling space below lines */}
                  <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#eab308" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#eab308" stopOpacity="0.0" />
                  </linearGradient>
                  
                  {/* Glowing neon shadow filter effect */}
                  <filter id="yellow-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Horizontal Guide grid lines */}
                {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
                  const yVal = paddingTop + frac * (height - paddingTop - paddingBottom);
                  return (
                    <line 
                      key={idx}
                      x1={paddingLeft}
                      y1={yVal}
                      x2={width - paddingRight}
                      y2={yVal}
                      stroke="#27272a"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* Fill Area beneath gold Curve */}
                <path d={areaD} fill="url(#chart-area-grad)" />

                {/* Sharp Yellow Trend Line */}
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke="#eab308" 
                  strokeWidth="2.5" 
                  filter="url(#yellow-neon-glow)"
                />

                {/* Y-Axis scale label indicators */}
                {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
                  const yVal = paddingTop + frac * (height - paddingTop - paddingBottom);
                  const priceLabelVal = maxPrice - frac * priceRange;
                  return (
                    <text 
                      key={idx}
                      x={paddingLeft - 8}
                      y={yVal + 3}
                      fill="#71717a"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {priceLabelVal.toLocaleString('en-US', { maximumFractionDigits: 1 })}
                    </text>
                  );
                })}

                {/* X-Axis time label values at base */}
                {chartData.map((d, index) => {
                  const xVal = paddingLeft + (index / (chartData.length - 1)) * (width - paddingLeft - paddingRight);
                  return (
                    <text 
                      key={index}
                      x={xVal}
                      y={height - paddingBottom + 14}
                      fill="#71717a"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {d.time}
                    </text>
                  );
                })}

                {/* Moving indicator vertical crosshair on hover */}
                {hoveredPoint && (
                  <>
                    <line 
                      x1={hoveredPoint.x}
                      y1={paddingTop}
                      x2={hoveredPoint.x}
                      y2={height - paddingBottom}
                      stroke="#eab308"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                    />
                    <circle 
                      cx={hoveredPoint.x}
                      cy={hoveredPoint.y}
                      r="6"
                      fill="#eab308"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </>
                )}

                {/* Standard glow active endpoint indicator if not hovering */}
                {!hoveredPoint && svgPoints.length > 0 && (
                  <circle 
                    cx={svgPoints[svgPoints.length - 1].x}
                    cy={svgPoints[svgPoints.length - 1].y}
                    r="4.5"
                    fill="#ffffff"
                    stroke="#eab308"
                    strokeWidth="3.5"
                    className="animate-pulse"
                  />
                )}
              </svg>

              {/* Floating Tooltip information overlay */}
              {hoveredPoint && (
                <div 
                  className="absolute p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-white shadow-2xl space-y-0.5 z-10"
                  style={{
                    left: `${(hoveredPoint.x / width) * 100}%`,
                    top: `${((hoveredPoint.y - 45) / height) * 100}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <p className="text-zinc-400 text-center font-bold">{hoveredPoint.time}</p>
                  <p className="text-yellow-400 font-bold font-mono">
                    {currencySign}{hoveredPoint.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )}
            </div>

            {/* Micro stats under chart */}
            <div className="flex justify-between items-center bg-zinc-900/40 p-3 rounded-xl border border-zinc-900 mt-2 text-[11px]">
              <div className="flex items-center gap-1.5">
                <ChevronDown className="w-3.5 h-3.5 text-emerald-500 rotate-180" />
                <span className="text-zinc-400">Total Change (24h)</span>
              </div>
              <span className="font-semibold text-emerald-400 font-mono">+1.64%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
