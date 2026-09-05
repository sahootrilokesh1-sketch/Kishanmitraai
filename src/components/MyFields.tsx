import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  MapPin,
  Droplets,
  Calendar,
  Layers,
  ChevronRight,
  Activity,
  Trash2,
  Edit2,
  AlertCircle,
  Sparkles,
  X,
  Compass,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { FieldPlot } from '../types';

export const MyFields: React.FC = () => {
  const {
    fields,
    selectedField,
    setSelectedFieldId,
    addField,
    deleteField,
    setActiveTab,
  } = useFarm();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');

  // New field form state
  const [newFieldName, setNewFieldName] = useState('');
  const [newSize, setNewSize] = useState('2.0');
  const [newCrop, setNewCrop] = useState('Wheat');
  const [newVariety, setNewVariety] = useState('GW-322');
  const [newSoilType, setNewSoilType] = useState('Medium Black Loam');
  const [newIrrigation, setNewIrrigation] = useState<'Drip' | 'Sprinkler' | 'Flood' | 'Rainfed'>('Drip');
  const [newSowingDate, setNewSowingDate] = useState('2026-11-20');
  const [newNotes, setNewNotes] = useState('');

  const handleCreateField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;

    addField({
      name: newFieldName.trim(),
      sizeAcres: parseFloat(newSize) || 2.0,
      currentCrop: newCrop,
      variety: newVariety,
      sowingDate: newSowingDate,
      estimatedHarvestDate: '2027-03-30',
      soilType: newSoilType,
      irrigationType: newIrrigation,
      healthScore: 88,
      ndviStatus: 'Optimal',
      soilMoisturePercent: 65,
      growthStage: 'Vegetative',
      notes: newNotes || 'Newly registered farm plot.',
      coordinates: { lat: 20.076, lng: 74.113 },
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewFieldName('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Farm Plots & Land Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            My Farm Fields
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Total {fields.reduce((acc, f) => acc + f.sizeAcres, 0)} Acres across {fields.length} parcels with real-time moisture & health metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="bg-stone-100 p-1 rounded-xl flex items-center text-xs font-semibold text-stone-600">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Plot Cards
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'map' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Interactive Map
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Plot</span>
          </button>
        </div>
      </div>

      {/* Map View Mode */}
      {viewMode === 'map' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                Satellite Parcel Spatial Layout (Niphad, Nashik)
              </h2>
              <p className="text-xs text-stone-500">
                Click any plot polygon to inspect soil moisture, NDVI vigor, and agronomy alerts.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                Optimal (&gt;85%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-lime-500 inline-block" />
                Normal (75-85%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                Stressed (&lt;75%)
              </span>
            </div>
          </div>

          {/* Interactive SVG Farm Field Map */}
          <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-stone-900 overflow-hidden border border-stone-800 flex items-center justify-center">
            {/* Grid texture */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <svg viewBox="0 0 800 450" className="w-full h-full p-4">
              {/* Field 1 Polygon */}
              <polygon
                points="100,80 380,60 360,260 90,240"
                className={`transition-all cursor-pointer ${
                  selectedField?.id === fields[0]?.id
                    ? 'fill-emerald-600/80 stroke-white stroke-2'
                    : 'fill-emerald-700/60 hover:fill-emerald-600/75 stroke-emerald-400 stroke-1'
                }`}
                onClick={() => fields[0] && setSelectedFieldId(fields[0].id)}
              />
              <text x="210" y="160" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">
                {fields[0]?.name || 'Plot A (Wheat)'}
              </text>
              <text x="210" y="180" fill="#d1fae5" fontSize="11" textAnchor="middle">
                2.5 Ac • {fields[0]?.currentCrop} • 92% Health
              </text>

              {/* Field 2 Polygon */}
              <polygon
                points="410,70 690,100 660,290 390,270"
                className={`transition-all cursor-pointer ${
                  selectedField?.id === fields[1]?.id
                    ? 'fill-amber-600/80 stroke-white stroke-2'
                    : 'fill-amber-600/60 hover:fill-amber-600/75 stroke-amber-400 stroke-1'
                }`}
                onClick={() => fields[1] && setSelectedFieldId(fields[1].id)}
              />
              <text x="530" y="180" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">
                {fields[1]?.name || 'Plot B (Onion)'}
              </text>
              <text x="530" y="200" fill="#fef3c7" fontSize="11" textAnchor="middle">
                2.0 Ac • {fields[1]?.currentCrop} • 78% Health
              </text>

              {/* Field 3 Polygon */}
              <polygon
                points="160,280 620,310 590,410 140,390"
                className={`transition-all cursor-pointer ${
                  selectedField?.id === fields[2]?.id
                    ? 'fill-teal-600/80 stroke-white stroke-2'
                    : 'fill-teal-700/60 hover:fill-teal-600/75 stroke-teal-400 stroke-1'
                }`}
                onClick={() => fields[2] && setSelectedFieldId(fields[2].id)}
              />
              <text x="370" y="350" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">
                {fields[2]?.name || 'Plot C (Cotton)'}
              </text>
              <text x="370" y="370" fill="#ccfbf1" fontSize="11" textAnchor="middle">
                2.0 Ac • {fields[2]?.currentCrop} • 88% Health
              </text>
            </svg>

            <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-stone-700 text-[11px] text-stone-300">
              Selected: <strong className="text-white">{selectedField?.name}</strong> ({selectedField?.currentCrop})
            </div>
          </div>
        </div>
      )}

      {/* Cards View Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {fields.map(field => (
          <div
            key={field.id}
            className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between ${
              selectedField?.id === field.id
                ? 'border-emerald-600 ring-2 ring-emerald-600/10 shadow-md'
                : 'border-stone-200 hover:border-emerald-300 hover:shadow-xs'
            }`}
          >
            <div>
              {/* Top title & health badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-base text-stone-900">{field.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {field.currentCrop}
                    </span>
                    <span>({field.variety})</span>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    field.healthScore >= 90
                      ? 'bg-emerald-100 text-emerald-800'
                      : field.healthScore >= 75
                      ? 'bg-lime-100 text-lime-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {field.healthScore}% Vigor
                </span>
              </div>

              {/* Stats pill row */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-100 text-center">
                <div className="bg-stone-50 p-2 rounded-xl">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Area</div>
                  <div className="text-xs font-bold text-stone-800 mt-0.5">{field.sizeAcres} Ac</div>
                </div>
                <div className="bg-stone-50 p-2 rounded-xl">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Moisture</div>
                  <div className="text-xs font-bold text-cyan-700 mt-0.5">{field.soilMoisturePercent}%</div>
                </div>
                <div className="bg-stone-50 p-2 rounded-xl">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">NDVI</div>
                  <div className="text-xs font-bold text-emerald-700 mt-0.5">{field.ndviStatus}</div>
                </div>
              </div>

              {/* Details list */}
              <div className="space-y-2 mt-4 text-xs text-stone-600">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Growth Stage:</span>
                  <span className="font-semibold text-stone-800">{field.growthStage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Irrigation:</span>
                  <span className="font-medium text-stone-800">{field.irrigationType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Soil Type:</span>
                  <span className="font-medium text-stone-800">{field.soilType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Sown On:</span>
                  <span className="font-medium text-stone-800">{field.sowingDate}</span>
                </div>
              </div>

              {/* Notes callout */}
              {field.notes && (
                <div className="mt-4 p-3 rounded-xl bg-stone-50 text-[11px] text-stone-600 border border-stone-200/60">
                  <span className="font-semibold text-stone-800">Field Log: </span>
                  {field.notes}
                </div>
              )}
            </div>

            {/* Actions footer */}
            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setSelectedFieldId(field.id);
                  setActiveTab('cropHealth');
                }}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Health Index</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setSelectedFieldId(field.id);
                    setActiveTab('cropDoctor');
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition cursor-pointer"
                >
                  Doctor Scan
                </button>
                {fields.length > 1 && (
                  <button
                    onClick={() => deleteField(field.id)}
                    className="p-1 text-stone-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                    title="Remove plot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Field Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <Sprout className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-stone-900">Register New Farm Plot</h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateField} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Plot Name / Gat Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Canal Side Plot (Gat No. 51)"
                  value={newFieldName}
                  onChange={e => setNewFieldName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Area (Acres) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.25"
                    max="100"
                    required
                    value={newSize}
                    onChange={e => setNewSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Current Crop *
                  </label>
                  <select
                    value={newCrop}
                    onChange={e => setNewCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Wheat">Wheat (गेहूं)</option>
                    <option value="Red Onion">Red Onion (कांदा)</option>
                    <option value="Cotton">Cotton (कपास)</option>
                    <option value="Soybean">Soybean (सोयाबीन)</option>
                    <option value="Paddy / Rice">Paddy / Rice (धान)</option>
                    <option value="Sugarcane">Sugarcane (गन्ना)</option>
                    <option value="Maize">Maize (मक्का)</option>
                    <option value="Tomato">Tomato (टमाटर)</option>
                    <option value="Mustard">Mustard (सरसों)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Seed Variety
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., GW-322, Bhima Super"
                    value={newVariety}
                    onChange={e => setNewVariety(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Sowing Date
                  </label>
                  <input
                    type="date"
                    value={newSowingDate}
                    onChange={e => setNewSowingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Soil Type
                  </label>
                  <select
                    value={newSoilType}
                    onChange={e => setNewSoilType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Medium Black Loam">Medium Black Loam</option>
                    <option value="Deep Black Cotton">Deep Black Cotton Soil</option>
                    <option value="Alluvial River Loam">Alluvial River Loam</option>
                    <option value="Red Sandy Loam">Red Sandy Loam</option>
                    <option value="Clay Loam">Clay Loam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Irrigation Method
                  </label>
                  <select
                    value={newIrrigation}
                    onChange={e => setNewIrrigation(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Drip">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler System</option>
                    <option value="Flood">Flood Irrigation</option>
                    <option value="Rainfed">Rainfed (Barani)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Initial Field Observations / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Basal DAP fertilizer applied during land preparation."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  Save Field Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
