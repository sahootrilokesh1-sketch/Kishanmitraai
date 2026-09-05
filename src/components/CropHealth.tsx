import React, { useState } from 'react';
import {
  Activity,
  Layers,
  Sparkles,
  Droplets,
  AlertCircle,
  TrendingUp,
  Info,
  CheckCircle2,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';

export const CropHealth: React.FC = () => {
  const { fields, selectedField, setSelectedFieldId } = useFarm();
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'moisture' | 'pestRisk'>('ndvi');

  const field = selectedField || fields[0];

  const stages = [
    { name: 'Germination', day: '0-15', done: true },
    { name: 'Vegetative', day: '16-35', done: true },
    { name: 'Tillering', day: '36-60', done: true },
    { name: 'Flowering', day: '61-80', done: field.growthStage === 'Flowering' || field.growthStage === 'Grain Filling' || field.growthStage === 'Maturity', current: field.growthStage === 'Flowering' },
    { name: 'Grain Filling', day: '81-105', done: field.growthStage === 'Grain Filling' || field.growthStage === 'Maturity', current: field.growthStage === 'Grain Filling' },
    { name: 'Maturity', day: '106-125', done: field.growthStage === 'Maturity', current: field.growthStage === 'Maturity' },
  ];

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      {/* Header bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Remote Sensing & Satellite Bio-Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Crop Health & NDVI Index
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Sentinel-2 Multispectral satellite telemetry calibrated for precision Indian agriculture.
          </p>
        </div>

        {/* Field Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-stone-500 hidden sm:inline">Active Field:</label>
          <select
            value={field?.id}
            onChange={e => setSelectedFieldId(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {fields.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.currentCrop})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Satellite Map Simulation + Bio Physical Indices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: NDVI Satellite Visualization Canvas */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Satellite Parcel Heatmap: {field?.name}
              </h2>
              <p className="text-xs text-stone-500">
                10m spatial resolution • Resolution pass: 3 days ago
              </p>
            </div>

            {/* Layer Toggles */}
            <div className="bg-stone-100 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => setActiveLayer('ndvi')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  activeLayer === 'ndvi' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                NDVI Vigor
              </button>
              <button
                onClick={() => setActiveLayer('moisture')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  activeLayer === 'moisture' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                Water Stress
              </button>
              <button
                onClick={() => setActiveLayer('pestRisk')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  activeLayer === 'pestRisk' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                Pest Risk
              </button>
            </div>
          </div>

          {/* Interactive Simulated Multispectral Satellite Parcel Render */}
          <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-stone-200 bg-stone-950 flex items-center justify-center">
            {/* Background grid */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Simulated Satellite Field Parcel Heatmap */}
            <svg viewBox="0 0 600 400" className="w-full h-full p-6">
              <defs>
                <radialGradient id="ndviGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#15803d" />
                  <stop offset="60%" stopColor="#22c55e" />
                  <stop offset="85%" stopColor="#a3e635" />
                  <stop offset="100%" stopColor={field?.healthScore < 80 ? '#f59e0b' : '#22c55e'} />
                </radialGradient>
                <radialGradient id="waterStressGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="70%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </radialGradient>
                <radialGradient id="pestGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="70%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ef4444" />
                </radialGradient>
              </defs>

              {/* Main Field Parcel Boundary */}
              <polygon
                points="60,60 520,40 480,340 80,310"
                fill={
                  activeLayer === 'ndvi'
                    ? 'url(#ndviGradient)'
                    : activeLayer === 'moisture'
                    ? 'url(#waterStressGrad)'
                    : 'url(#pestGrad)'
                }
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="6,4"
                opacity="0.85"
              />

              {/* Parcel Contour Grid Lines */}
              <line x1="160" y1="55" x2="160" y2="320" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.4" />
              <line x1="280" y1="50" x2="270" y2="328" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.4" />
              <line x1="400" y1="45" x2="380" y2="335" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.4" />
              <line x1="70" y1="150" x2="500" y2="140" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.4" />
              <line x1="75" y1="230" x2="490" y2="230" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.4" />

              {/* Center Vigor Badge Label */}
              <rect x="230" y="170" width="140" height="50" rx="10" fill="#0f172a" fillOpacity="0.8" />
              <text x="300" y="193" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                {activeLayer === 'ndvi' ? `NDVI: 0.${field?.healthScore}` : activeLayer === 'moisture' ? `Moisture: ${field?.soilMoisturePercent}%` : 'Pest Risk: Low'}
              </text>
              <text x="300" y="210" fill="#34d399" fontSize="11" textAnchor="middle">
                {field?.ndviStatus} Condition
              </text>
            </svg>

            {/* Color Scale Legend */}
            <div className="absolute bottom-3 left-3 right-3 bg-stone-900/80 backdrop-blur p-2.5 rounded-xl border border-stone-700 flex items-center justify-between text-[11px] text-stone-300">
              <span>0.2 (Bare Soil / Stressed)</span>
              <div className="w-48 h-2 rounded-full bg-gradient-to-r from-amber-500 via-lime-400 to-emerald-600 mx-2" />
              <span>0.9 (Dense Healthy Canopy)</span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Key Biophysical Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Biophysical Indices
            </h3>

            <div className="space-y-3">
              {/* Vigor Index */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-emerald-950">Vegetation Canopy Vigor</span>
                  <strong className="text-emerald-700 font-bold">{field?.healthScore}%</strong>
                </div>
                <div className="w-full bg-emerald-200/50 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${field?.healthScore}%` }} />
                </div>
                <p className="text-[11px] text-emerald-800 mt-1.5">
                  High chlorophyll reflectance detected across 92% of the plot area.
                </p>
              </div>

              {/* Water Deficit */}
              <div className="p-3.5 rounded-2xl bg-cyan-50/50 border border-cyan-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-cyan-950">Root Zone Moisture</span>
                  <strong className="text-cyan-700 font-bold">{field?.soilMoisturePercent}%</strong>
                </div>
                <div className="w-full bg-cyan-200/50 rounded-full h-2 overflow-hidden">
                  <div className="bg-cyan-600 h-2 rounded-full" style={{ width: `${field?.soilMoisturePercent}%` }} />
                </div>
                <p className="text-[11px] text-cyan-800 mt-1.5">
                  Adequate moisture buffer for the next 48 hours.
                </p>
              </div>

              {/* Nitrogen Uptake */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-800">Estimated Nitrogen Index</span>
                  <strong className="text-stone-800 font-bold">Optimal</strong>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-600 h-2 rounded-full w-4/5" />
                </div>
                <p className="text-[11px] text-stone-500 mt-1.5">
                  Top dressing fertilizer applied last week shows strong canopy absorption.
                </p>
              </div>
            </div>
          </div>

          {/* Agronomic Pro-Tip for this field */}
          <div className="bg-emerald-800 text-white rounded-3xl p-5 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Smart Growth Stage Recommendation</span>
            </div>
            <h4 className="text-sm font-bold">
              {field?.growthStage} Stage Advisory for {field?.currentCrop}
            </h4>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Maintain uniform root moisture during this phase. Water stress during grain filling or flowering can reduce single-grain weight by 15-20%.
            </p>
          </div>
        </div>
      </div>

      {/* Growth Stage Progression Timeline */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
          Crop Growth Journey & Milestones ({field?.currentCrop} - {field?.variety})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-center transition ${
                stage.current
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                  : stage.done
                  ? 'bg-stone-50 border-stone-200 text-stone-700'
                  : 'bg-stone-50/50 border-stone-200/50 text-stone-400'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                {stage.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-stone-300" />
                )}
              </div>
              <div className="text-xs font-bold text-stone-900 mt-1">{stage.name}</div>
              <div className="text-[10px] text-stone-500">Day {stage.day}</div>
              {stage.current && (
                <span className="inline-block text-[9px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full mt-1.5">
                  Current Stage
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
