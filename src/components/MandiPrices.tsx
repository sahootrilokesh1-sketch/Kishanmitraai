import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  IndianRupee,
  MapPin,
  Truck,
  Sparkles,
  Info,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { MandiPrice } from '../types';

export const MandiPrices: React.FC = () => {
  const { mandiPrices } = useFarm();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedMandi, setSelectedMandi] = useState<MandiPrice | null>(mandiPrices[0] || null);

  // Calculator state
  const [calcQuantity, setCalcQuantity] = useState<number>(40); // quintals
  const [calcCrop, setCalcCrop] = useState<string>('Red Onion (Garva/Late Kharif)');

  // Filter mandis
  const filteredMandis = mandiPrices.filter(item => {
    const matchesSearch =
      item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.marketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState = selectedState === 'All' || item.state === selectedState;

    return matchesSearch && matchesState;
  });

  const states = ['All', 'Maharashtra', 'Madhya Pradesh', 'Punjab', 'Rajasthan'];

  // Smart calculation: compare local mandi vs regional hub
  const activeCalcMandi = mandiPrices.find(m => m.commodity.includes(calcCrop)) || mandiPrices[1];
  const localMandiPrice = activeCalcMandi ? activeCalcMandi.modalPrice - 220 : 2000;
  const hubMandiPrice = activeCalcMandi ? activeCalcMandi.modalPrice : 2280;
  const grossDiff = (hubMandiPrice - localMandiPrice) * calcQuantity;
  const estimatedTransport = Math.round(activeCalcMandi ? activeCalcMandi.distanceKm * 45 + 500 : 2000);
  const netExtraProfit = grossDiff - estimatedTransport;

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      {/* Header bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Agmarknet & APMC Live Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Mandi Prices & MSP Tracker
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Real-time modal rates, arrival volumes, and transport-optimized profit recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-800">
          <IndianRupee className="w-3.5 h-3.5" />
          <span>Govt MSP 2026-27 Benchmarked</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search crop, mandi, district..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800"
          />
        </div>

        {/* State filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {states.map(st => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedState === st
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Section: Mandi Cards Grid & Interactive Profit Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Mandi Cards */}
        <div className="lg:col-span-7 space-y-3.5">
          {filteredMandis.map(mandi => {
            const isAboveMsp = mandi.modalPrice >= mandi.mspPrice;
            const diffMsp = mandi.modalPrice - mandi.mspPrice;
            const isSelected = selectedMandi?.id === mandi.id;

            return (
              <div
                key={mandi.id}
                onClick={() => setSelectedMandi(mandi)}
                className={`p-5 rounded-3xl border transition cursor-pointer bg-white ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-600/10 shadow-sm'
                    : 'border-stone-200 hover:border-emerald-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-stone-900">
                        {mandi.commodity}
                      </h3>
                      <span className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                        {mandi.variety}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {mandi.marketName}, {mandi.district} ({mandi.state}) • {mandi.distanceKm} km away
                      </span>
                    </div>
                  </div>

                  {/* Modal price & trend */}
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black text-stone-900">
                      ₹{mandi.modalPrice}
                      <span className="text-xs font-normal text-stone-400">/Qtl</span>
                    </div>
                    <div
                      className={`text-xs font-bold flex items-center justify-end gap-0.5 ${
                        mandi.trend === 'up'
                          ? 'text-emerald-600'
                          : mandi.trend === 'down'
                          ? 'text-rose-600'
                          : 'text-stone-500'
                      }`}
                    >
                      {mandi.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : mandi.trend === 'down' ? <ArrowDownRight className="w-3.5 h-3.5" /> : null}
                      <span>{mandi.priceChangePercent > 0 ? `+${mandi.priceChangePercent}%` : `${mandi.priceChangePercent}%`}</span>
                    </div>
                  </div>
                </div>

                {/* Price band bar */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-100 text-center text-xs">
                  <div className="bg-stone-50 p-2 rounded-xl">
                    <span className="text-[10px] text-stone-400 block font-medium">Min Rate</span>
                    <strong className="text-stone-800">₹{mandi.minPrice}</strong>
                  </div>
                  <div className="bg-stone-50 p-2 rounded-xl">
                    <span className="text-[10px] text-stone-400 block font-medium">Max Rate</span>
                    <strong className="text-stone-800">₹{mandi.maxPrice}</strong>
                  </div>
                  <div className="bg-stone-50 p-2 rounded-xl">
                    <span className="text-[10px] text-stone-400 block font-medium">Arrivals</span>
                    <strong className="text-stone-800">{mandi.arrivalTons} Tons</strong>
                  </div>
                </div>

                {/* MSP benchmark badge */}
                <div className="mt-3 flex items-center justify-between text-xs pt-1">
                  <span className="text-stone-500">
                    Govt MSP: <strong className="text-stone-800">₹{mandi.mspPrice}/Qtl</strong>
                  </span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                      isAboveMsp
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isAboveMsp ? `+₹${diffMsp} Above MSP` : `-₹${Math.abs(diffMsp)} Below MSP`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (5 Cols): Selected Mandi 7-Day Chart & Smart Transport Calculator */}
        <div className="lg:col-span-5 space-y-5">
          {/* Price trajectory chart */}
          {selectedMandi && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase">7-Day Trajectory</span>
                  <h3 className="text-sm font-extrabold text-stone-900 mt-0.5">
                    {selectedMandi.commodity.split('(')[0]} ({selectedMandi.marketName.split(' ')[0]})
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-700">
                    Latest: ₹{selectedMandi.modalPrice}
                  </span>
                </div>
              </div>

              {/* Responsive SVG price line chart */}
              <div className="w-full bg-stone-50 p-4 rounded-2xl border border-stone-200/70">
                <svg viewBox="0 0 400 130" className="w-full h-28 overflow-visible">
                  {/* Grid lines */}
                  <line x1="10" y1="20" x2="390" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="10" y1="65" x2="390" y2="65" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="10" y1="110" x2="390" y2="110" stroke="#e2e8f0" strokeDasharray="3 3" />

                  {/* Sparkline curve */}
                  <path
                    d="M 20 85 L 80 75 L 140 68 L 200 50 L 260 40 L 320 30 L 380 20"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3"
                  />

                  {/* Data points */}
                  {selectedMandi.historicalPrices.map((hp, i) => {
                    const cx = 20 + i * 60;
                    const cy = 85 - i * 10.5;
                    return (
                      <g key={i}>
                        <circle cx={cx} cy={cy} r="4" fill="#047857" stroke="#ffffff" strokeWidth="2" />
                        <text x={cx} y={cy - 8} fontSize="9" fontWeight="bold" textAnchor="middle" fill="#047857">
                          ₹{hp.price}
                        </text>
                        <text x={cx} y="125" fontSize="9" textAnchor="middle" fill="#94a3b8">
                          {hp.date.replace('Day ', 'D')}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          )}

          {/* Smart Mandi Profit Transport Calculator */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Smart Mandi Arbitrage Calculator</span>
            </div>
            <p className="text-xs text-stone-500">
              Calculate if driving to a higher-paying APMC mandi earns more net profit after diesel and toll.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Expected Produce Volume (Quintals)
                </label>
                <input
                  type="number"
                  min="5"
                  max="1000"
                  value={calcQuantity}
                  onChange={e => setCalcQuantity(parseInt(e.target.value) || 10)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Profit comparison calculation block */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-stone-700">
                  <span>Gross Extra Revenue ({calcQuantity} Qtl):</span>
                  <strong className="text-stone-900">+₹{grossDiff.toLocaleString()}</strong>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span>Estimated Transport & Toll ({activeCalcMandi?.distanceKm || 25} km):</span>
                  <strong className="text-rose-700">-₹{estimatedTransport.toLocaleString()}</strong>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex items-center justify-between font-bold text-sm">
                  <span className="text-emerald-950">Net Additional Profit:</span>
                  <span className="text-emerald-700 text-base font-extrabold">
                    +₹{netExtraProfit.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-stone-600 p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Recommendation:</strong> Driving to {activeCalcMandi?.marketName || 'Hub APMC'} is financially viable and yields approx{' '}
                  <strong className="text-emerald-700">₹{Math.round(netExtraProfit / calcQuantity)}/Qtl</strong> extra net profit in your pocket.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
