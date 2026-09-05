import React, { useState } from 'react';
import {
  CloudSun,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { weatherForecast } from '../data/mockData';

export const WeatherAdvisory: React.FC = () => {
  const { farmer } = useFarm();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const selectedDay = weatherForecast[selectedDayIndex] || weatherForecast[0];

  // Hourly curve data for today
  const hourlyData = [
    { time: '6 AM', temp: 22, rain: 5 },
    { time: '9 AM', temp: 26, rain: 10 },
    { time: '12 PM', temp: 31, rain: 15 },
    { time: '3 PM', temp: 30, rain: 25 },
    { time: '6 PM', temp: 27, rain: 20 },
    { time: '9 PM', temp: 24, rain: 10 },
  ];

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      {/* Header bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <CloudSun className="w-4 h-4" />
            <span>Hyperlocal Micro-Climate & Agro-Met Advisory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Weather & Spray Advisory
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Station: IMD Agro-AWS ({farmer.village}, {farmer.district}) • Updated every hour
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 bg-stone-100 px-3.5 py-2 rounded-xl">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>7-Day Synoptic Outlook</span>
        </div>
      </div>

      {/* 7-Day Horizontal Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {weatherForecast.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedDayIndex(idx)}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[120px] ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-md scale-102'
                  : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-300'
              }`}
            >
              <div>
                <span className={`text-xs font-bold block ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`}>
                  {day.day}
                </span>
                <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-stone-400'}`}>
                  {day.date}
                </span>
              </div>

              <div className="my-1">
                {day.rainProbability > 50 ? (
                  <CloudRain className={`w-7 h-7 ${isSelected ? 'text-cyan-200' : 'text-cyan-600'}`} />
                ) : day.rainProbability > 20 ? (
                  <CloudSun className={`w-7 h-7 ${isSelected ? 'text-amber-300' : 'text-amber-500'}`} />
                ) : (
                  <Sun className={`w-7 h-7 ${isSelected ? 'text-amber-300' : 'text-amber-500'}`} />
                )}
              </div>

              <div>
                <div className="text-sm font-bold tracking-tight">
                  {day.tempMax}° / <span className={isSelected ? 'text-emerald-200' : 'text-stone-400'}>{day.tempMin}°</span>
                </div>
                <div
                  className={`text-[10px] font-semibold mt-0.5 px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-emerald-900/60 text-emerald-200'
                      : day.spraySuitability === 'Ideal'
                      ? 'bg-emerald-100 text-emerald-800'
                      : day.spraySuitability === 'Moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {day.spraySuitability === 'Ideal' ? 'Spray OK' : day.spraySuitability === 'Moderate' ? 'Caution' : 'No Spray'}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Deep Dive: 2 Main Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 Cols): Detailed Atmosphere Parameters */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                {selectedDay.day} ({selectedDay.date})
              </span>
              <h2 className="text-xl font-extrabold text-stone-900 mt-0.5">
                {selectedDay.condition}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-stone-900">{selectedDay.tempMax}°C</span>
              <span className="text-xs text-stone-400 block">Min: {selectedDay.tempMin}°C</span>
            </div>
          </div>

          {/* 4 Key Met Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
              <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
                <CloudRain className="w-3.5 h-3.5 text-cyan-600" />
                <span>Rain Chance</span>
              </div>
              <div className="text-lg font-bold text-stone-900">{selectedDay.rainProbability}%</div>
              <span className="text-[10px] text-stone-500">{selectedDay.rainfallMm} mm expected</span>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
              <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
                <Droplets className="w-3.5 h-3.5 text-blue-600" />
                <span>Humidity</span>
              </div>
              <div className="text-lg font-bold text-stone-900">{selectedDay.humidity}%</div>
              <span className="text-[10px] text-stone-500">Canopy wetness</span>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
              <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
                <Wind className="w-3.5 h-3.5 text-teal-600" />
                <span>Wind Speed</span>
              </div>
              <div className="text-lg font-bold text-stone-900">{selectedDay.windSpeedKm} km/h</div>
              <span className="text-[10px] text-stone-500">Drift hazard &lt;15</span>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
              <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>UV Index</span>
              </div>
              <div className="text-lg font-bold text-stone-900">{selectedDay.uvIndex} / 10</div>
              <span className="text-[10px] text-stone-500">Solar radiation</span>
            </div>
          </div>

          {/* Diurnal Temperature & Rain Probability SVG Curve */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
              <span>Daytime Hourly Trend</span>
              <span className="text-[11px] text-stone-400">Temp (°C) & Precipitation (%)</span>
            </div>

            <div className="w-full bg-stone-50 rounded-2xl p-4 border border-stone-200/70">
              <svg viewBox="0 0 500 120" className="w-full h-28 overflow-visible">
                {/* Temp curve line */}
                <path
                  d="M 20 80 Q 100 50 180 20 T 340 25 T 480 70"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                />

                {/* Rain bars behind */}
                {hourlyData.map((d, i) => {
                  const x = 30 + i * 85;
                  const barHeight = d.rain * 2;
                  return (
                    <g key={i}>
                      <rect
                        x={x - 10}
                        y={100 - barHeight}
                        width="20"
                        height={barHeight}
                        rx="3"
                        fill="#38bdf8"
                        opacity="0.3"
                      />
                      <circle cx={x} cy={d.temp > 28 ? 25 : d.temp > 24 ? 45 : 75} r="4" fill="#047857" />
                      <text x={x} y={d.temp > 28 ? 16 : d.temp > 24 ? 36 : 66} fontSize="10" fontWeight="bold" textAnchor="middle" fill="#047857">
                        {d.temp}°
                      </text>
                      <text x={x} y="115" fontSize="10" textAnchor="middle" fill="#78716c">
                        {d.time}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column (6 Cols): Smart Agricultural Action Advisories */}
        <div className="lg:col-span-6 space-y-4">
          {/* Spray Window Advisory Card */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border ${
              selectedDay.spraySuitability === 'Ideal'
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                : selectedDay.spraySuitability === 'Moderate'
                ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                : 'bg-rose-50/60 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Foliar Spray Advisory</span>
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                  selectedDay.spraySuitability === 'Ideal'
                    ? 'bg-emerald-600 text-white'
                    : selectedDay.spraySuitability === 'Moderate'
                    ? 'bg-amber-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {selectedDay.spraySuitability} Window
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium leading-relaxed mt-2">
              {selectedDay.sprayReason}
            </p>

            <div className="mt-4 pt-3 border-t border-black/5 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-stone-500 block">Best Spray Time:</span>
                <strong className="text-stone-900">
                  {selectedDay.spraySuitability === 'Do Not Spray' ? 'Postpone Application' : '6:30 AM - 9:30 AM'}
                </strong>
              </div>
              <div>
                <span className="text-stone-500 block">Chemical Wash Risk:</span>
                <strong className={selectedDay.rainProbability > 40 ? 'text-rose-700' : 'text-emerald-700'}>
                  {selectedDay.rainProbability > 40 ? 'High Washout Risk' : 'Minimal Washout Risk'}
                </strong>
              </div>
            </div>
          </div>

          {/* Smart Irrigation Advisory Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Smart Irrigation Schedule
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  selectedDay.irrigationNeed === 'Skip Irrigation'
                    ? 'bg-cyan-100 text-cyan-800'
                    : selectedDay.irrigationNeed === 'Heavy Irrigation'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {selectedDay.irrigationNeed}
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {selectedDay.irrigationNeed === 'Skip Irrigation'
                ? 'Rainfall expected to replenish soil moisture deficit naturally. Conserve pump electricity and avoid root oxygen suffocation.'
                : 'Maintain routine 2-hour drip schedule. Evapotranspiration is normal with minimal heat stress.'}
            </p>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/70 flex items-center justify-between text-xs">
              <span className="text-stone-600">Electricity Tariff Saving:</span>
              <strong className="text-emerald-700">₹140 / acre (Estimated)</strong>
            </div>
          </div>

          {/* Extreme Weather & Disaster Alert Guard */}
          <div className="bg-amber-500/10 border border-amber-300 rounded-3xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>IMD Agromet Warning: Weekend Rain System</span>
            </div>
            <p className="text-[11px] text-amber-950 leading-relaxed">
              Trough line passing through central Maharashtra. Ensure harvested onion bulbs in curing sheds are covered with tarpaulins to avoid black mold rot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
