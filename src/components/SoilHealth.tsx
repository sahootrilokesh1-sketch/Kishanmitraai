import React, { useState } from 'react';
import {
  FlaskConical,
  Calculator,
  Droplets,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  Info,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';

export const SoilHealth: React.FC = () => {
  const { soilCard, updateSoilCard, triggerConfetti } = useFarm();

  const [cropSelected, setCropSelected] = useState('Wheat');
  const [targetYield, setTargetYield] = useState('22'); // quintals / acre

  // Calculate scientific fertilizer requirements based on crop and current soil NPK
  // Wheat: 120:60:40 NPK kg/ha ~ 50:25:16 kg/acre
  const calculateBags = () => {
    if (cropSelected === 'Wheat') {
      return { urea: 2.2, dap: 1.0, mop: 0.6, zinc: 5.0 };
    } else if (cropSelected === 'Red Onion') {
      return { urea: 2.5, dap: 1.5, mop: 1.2, zinc: 6.0 };
    } else if (cropSelected === 'Cotton') {
      return { urea: 2.8, dap: 1.2, mop: 0.8, zinc: 8.0 };
    } else if (cropSelected === 'Paddy / Rice') {
      return { urea: 2.4, dap: 1.0, mop: 0.7, zinc: 10.0 };
    }
    return { urea: 2.0, dap: 1.0, mop: 0.5, zinc: 5.0 };
  };

  const reqBags = calculateBags();

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      {/* Header bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <FlaskConical className="w-4 h-4" />
            <span>Digital Soil Health Card & Nutrition Science</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Soil Health & Fertilizer Doctor
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Card Ref: #{soilCard.sampleId} • Validated by Department of Agriculture & Farmers Welfare
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-800">
          <Calendar className="w-3.5 h-3.5" />
          <span>Last Tested: {soilCard.testDate}</span>
        </div>
      </div>

      {/* Main Grid: Soil Card Viewer + Fertilizer Dosage Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Digital Soil Health Card Viewer */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-stone-900">Soil Nutrients & Chemical Balance</h2>
              <p className="text-xs text-stone-500">12 Essential parameters evaluated</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Grade B+ Fertile
            </span>
          </div>

          {/* Primary Macro Nutrients N-P-K */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Primary Macro-Nutrients (N-P-K)
            </span>

            {/* Nitrogen (N) */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">Available Nitrogen (N)</span>
                <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {soilCard.nitrogenKgHa} kg/ha ({soilCard.nitrogenStatus})
                </span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div className="bg-rose-500 h-2 rounded-full w-[45%]" />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Low (&lt;280)</span>
                <span>Ideal (280-560)</span>
                <span>High (&gt;560)</span>
              </div>
            </div>

            {/* Phosphorus (P) */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">Available Phosphorus (P2O5)</span>
                <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {soilCard.phosphorusKgHa} kg/ha ({soilCard.phosphorusStatus})
                </span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full w-[65%]" />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Low (&lt;23)</span>
                <span>Medium (23-56)</span>
                <span>High (&gt;56)</span>
              </div>
            </div>

            {/* Potassium (K) */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">Available Potassium (K2O)</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {soilCard.potassiumKgHa} kg/ha ({soilCard.potassiumStatus})
                </span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full w-[85%]" />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Low (&lt;145)</span>
                <span>Medium (145-337)</span>
                <span>High (&gt;337)</span>
              </div>
            </div>
          </div>

          {/* Secondary & Soil Reaction (pH, EC, Organic Carbon) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400">Soil pH</span>
              <div className="text-2xl font-extrabold text-stone-900 mt-1">{soilCard.ph}</div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                Normal (6.5 - 7.5)
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400">Elec. Conductivity</span>
              <div className="text-2xl font-extrabold text-stone-900 mt-1">{soilCard.electricalConductivity}</div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                Non-Saline (&lt;1.0 dS/m)
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400">Organic Carbon</span>
              <div className="text-2xl font-extrabold text-stone-900 mt-1">{soilCard.organicCarbonPercent}%</div>
              <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full inline-block mt-1">
                Low (&lt;0.75%)
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Scientific Fertilizer Bag Calculator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Tailored Fertilizer Dosage Calculator</span>
            </div>
            <p className="text-xs text-stone-500">
              Prescribed bags per acre formulated to fix soil deficiencies without wasting money on excess chemicals.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Selected Crop
                </label>
                <select
                  value={cropSelected}
                  onChange={e => setCropSelected(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Red Onion">Red Onion (प्याज)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                  <option value="Paddy / Rice">Paddy / Rice (धान)</option>
                </select>
              </div>

              {/* Fertilizer Bags Output Cards */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {/* Urea */}
                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-emerald-800">Neem-Coated Urea</span>
                  <div className="text-xl font-black text-emerald-950 mt-1">
                    {reqBags.urea} <span className="text-xs font-semibold">Bags</span>
                  </div>
                  <span className="text-[10px] text-emerald-800">45 kg bag / acre</span>
                </div>

                {/* DAP */}
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-amber-800">DAP (18:46:0)</span>
                  <div className="text-xl font-black text-amber-950 mt-1">
                    {reqBags.dap} <span className="text-xs font-semibold">Bags</span>
                  </div>
                  <span className="text-[10px] text-amber-800">50 kg bag / acre</span>
                </div>

                {/* MOP */}
                <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-purple-800">MOP Potash (0:0:60)</span>
                  <div className="text-xl font-black text-purple-950 mt-1">
                    {reqBags.mop} <span className="text-xs font-semibold">Bags</span>
                  </div>
                  <span className="text-[10px] text-purple-800">50 kg bag / acre</span>
                </div>

                {/* Zinc */}
                <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-sky-800">Zinc Sulphate (21%)</span>
                  <div className="text-xl font-black text-sky-950 mt-1">
                    {reqBags.zinc} <span className="text-xs font-semibold">Kg</span>
                  </div>
                  <span className="text-[10px] text-sky-800">Micronutrient basal</span>
                </div>
              </div>

              {/* Split Application Schedule */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                <span className="font-bold text-stone-900 block">Dosage Application Schedule:</span>
                <div className="space-y-1 text-stone-600 text-[11px]">
                  <div>• <strong>Basal (At Sowing):</strong> Full DAP + Full MOP + 1/2 Bag Urea + Zinc</div>
                  <div>• <strong>1st Top Dressing (25 DAS):</strong> 1 Bag Urea with 1st irrigation</div>
                  <div>• <strong>2nd Top Dressing (50 DAS):</strong> Remaining Urea before boot/flowering</div>
                </div>
              </div>
            </div>
          </div>

          {/* Organic Carbon Enrichment Prescription */}
          <div className="bg-emerald-800 text-white rounded-3xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              <Sprout className="w-4 h-4 text-emerald-300" />
              <span>Soil Biological Health Tip</span>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Your organic carbon is <strong>0.58%</strong> (Low). Apply 4 tonnes of well-decomposed Farm Yard Manure (FYM) or 1 tonne of vermicompost with 2 kg <em>Trichoderma</em> to boost soil microbial life and moisture retention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
