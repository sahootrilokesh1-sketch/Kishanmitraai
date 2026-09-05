import React, { useState } from 'react';
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Phone,
  FileText,
  Search,
  Award,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { govtSchemes } from '../data/mockData';
import { useFarm } from '../context/FarmContext';
import { GovtScheme } from '../types';

export const GovernmentSchemes: React.FC = () => {
  const { farmer, triggerConfetti } = useFarm();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeScheme, setActiveScheme] = useState<GovtScheme | null>(govtSchemes[0] || null);

  // Eligibility tool state
  const [eligibilityLand, setEligibilityLand] = useState(farmer.totalLandAcres.toString());
  const [eligibilityCategory, setEligibilityCategory] = useState('Small & Marginal (1-5 Ac)');
  const [hasCheckedEligibility, setHasCheckedEligibility] = useState(false);

  const categories = [
    'All',
    'Income Support',
    'Insurance',
    'Irrigation & Solar',
    'Credit',
    'Machinery',
    'Soil & Seeds',
  ];

  const filteredSchemes = govtSchemes.filter(scheme => {
    const matchesSearch =
      scheme.title.toLowerCase().includes(search.toLowerCase()) ||
      (scheme.hindiTitle && scheme.hindiTitle.includes(search)) ||
      scheme.benefitDescription.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCategory === 'All' || scheme.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleRunEligibilityCheck = () => {
    setHasCheckedEligibility(true);
    triggerConfetti();
  };

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      {/* Header bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <Landmark className="w-4 h-4" />
            <span>Direct Benefit Transfer & Subsidies</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Government Schemes & Subsidies
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Explore active central and state welfare benefits, verify eligibility, and download document checklists.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-800">
          <Award className="w-3.5 h-3.5" />
          <span>DBT Verified Portal</span>
        </div>
      </div>

      {/* Interactive Eligibility Checker Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Scheme Eligibility Finder</span>
            </span>
            <h2 className="text-xl font-bold mt-1">Check Your Subsidy Entitlements</h2>
          </div>
          <button
            onClick={handleRunEligibilityCheck}
            className="bg-white hover:bg-emerald-50 text-emerald-900 px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition cursor-pointer self-start sm:self-auto"
          >
            Run Eligibility Check
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-stone-800">
          <div className="bg-white/95 rounded-2xl p-3 text-xs">
            <span className="text-[10px] text-stone-500 block uppercase font-bold">Land Holding</span>
            <input
              type="text"
              value={`${eligibilityLand} Acres`}
              onChange={e => setEligibilityLand(e.target.value)}
              className="font-bold text-stone-900 bg-transparent w-full focus:outline-none"
            />
          </div>

          <div className="bg-white/95 rounded-2xl p-3 text-xs">
            <span className="text-[10px] text-stone-500 block uppercase font-bold">Farmer Category</span>
            <select
              value={eligibilityCategory}
              onChange={e => setEligibilityCategory(e.target.value)}
              className="font-bold text-stone-900 bg-transparent w-full focus:outline-none"
            >
              <option value="Small & Marginal (1-5 Ac)">Small & Marginal (&lt;5 Ac)</option>
              <option value="Medium (5-10 Ac)">Medium Farmer (5-10 Ac)</option>
              <option value="Large (>10 Ac)">Large Farmer (&gt;10 Ac)</option>
              <option value="Women Farmer">Women Farmer (Special 10% Extra Subsidy)</option>
            </select>
          </div>

          <div className="bg-white/95 rounded-2xl p-3 text-xs">
            <span className="text-[10px] text-stone-500 block uppercase font-bold">State & Region</span>
            <div className="font-bold text-stone-900">{farmer.state} ({farmer.district})</div>
          </div>
        </div>

        {hasCheckedEligibility && (
          <div className="p-3 bg-emerald-900/60 backdrop-blur rounded-2xl border border-emerald-500/30 text-xs text-emerald-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>
                <strong>Great News!</strong> Shri {farmer.name.split(' ')[0]} is eligible for <strong>5 out of 6</strong> central schemes with estimated total benefit of <strong>₹48,000+</strong>.
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search scheme name, subsidy..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Scheme List & Deep Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 Cols): Schemes Cards */}
        <div className="lg:col-span-6 space-y-3.5">
          {filteredSchemes.map(scheme => {
            const isSelected = activeScheme?.id === scheme.id;
            return (
              <div
                key={scheme.id}
                onClick={() => setActiveScheme(scheme)}
                className={`p-5 rounded-3xl border transition cursor-pointer bg-white ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-600/10 shadow-sm'
                    : 'border-stone-200 hover:border-emerald-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {scheme.category}
                    </span>
                    <h3 className="font-extrabold text-base text-stone-900 mt-1.5">
                      {scheme.title}
                    </h3>
                    {scheme.hindiTitle && (
                      <p className="text-xs text-stone-500 mt-0.5">{scheme.hindiTitle}</p>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      scheme.status === 'Expiring Soon'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {scheme.status}
                  </span>
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs font-semibold text-emerald-900">
                  {scheme.funding}
                </div>

                <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                  {scheme.benefitDescription}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column (6 Cols): Active Scheme Application Checklist & Documents */}
        <div className="lg:col-span-6">
          {activeScheme ? (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5 sticky top-24">
              <div className="pb-3 border-b border-stone-100">
                <span className="text-xs font-bold uppercase text-emerald-700 tracking-wider">
                  Scheme Specification & Document Checklist
                </span>
                <h2 className="text-xl font-extrabold text-stone-900 mt-1">
                  {activeScheme.title}
                </h2>
                <div className="mt-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  Funding: {activeScheme.funding}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                  Detailed Benefits
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60">
                  {activeScheme.benefitDescription}
                </p>
              </div>

              {/* Eligibility Criteria */}
              <div>
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                  Eligibility Criteria
                </h3>
                <div className="space-y-1.5 text-xs text-stone-700">
                  {activeScheme.eligibility.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents Required Checklist */}
              <div>
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                  Mandatory Documents to Apply
                </h3>
                <div className="space-y-1.5 text-xs text-stone-700">
                  {activeScheme.documentsRequired.map((doc, i) => (
                    <div key={i} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
                      <FileText className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-stone-600">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Toll-Free Helpline: <strong>{activeScheme.helpline}</strong></span>
                </div>

                <a
                  href={activeScheme.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
