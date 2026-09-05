import React from 'react';
import {
  Sprout,
  Stethoscope,
  TrendingUp,
  CloudSun,
  FlaskConical,
  Mic,
  CalendarCheck2,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Droplets,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Activity,
  Award,
  ShoppingBag,
  Database,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { weatherForecast } from '../data/mockData';

export const FarmerDashboard: React.FC = () => {
  const {
    farmer,
    fields,
    tasks,
    toggleTaskCompletion,
    mandiPrices,
    notifications,
    setActiveTab,
    setSelectedFieldId,
    setIsVoiceAssistantOpen,
    setIsCheckoutModalOpen,
    cartCount,
    cartTotal,
    t,
  } = useFarm();

  const todayWeather = weatherForecast[0];

  // Calculate stats
  const totalLand = fields.reduce((acc, f) => acc + f.sizeAcres, 0);
  const avgHealth = Math.round(
    fields.reduce((acc, f) => acc + f.healthScore, 0) / (fields.length || 1)
  );
  const pendingTasks = tasks.filter(t => !t.completed);
  const urgentAlert = notifications.find(n => !n.read && (n.type === 'weather' || n.type === 'pest'));

  // Calculate estimated harvest value based on crops and modal prices
  // e.g. Wheat ~20 Qtl/acre @ ₹2650, Onion ~100 Qtl/acre @ ₹2280, Cotton ~12 Qtl/acre @ ₹7210
  const estimatedValue = 485000;

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      {/* Top Welcome & Hyperlocal Weather Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
        <div className="absolute right-24 top-2 w-48 h-48 rounded-full bg-teal-400/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-900/60 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-emerald-200 border border-emerald-600/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{farmer.village}, {farmer.district} • Kharif/Rabi Transition</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {t.dashboard.welcome}, {farmer.name.split(' ')[0]}!
            </h1>
            <p className="text-sm text-emerald-100/90 max-w-xl">
              Farming <span className="font-semibold text-white">{farmer.totalLandAcres} Acres</span> across {fields.length} active plots. Today is an <span className="text-amber-200 font-semibold">{todayWeather.spraySuitability}</span> day for spraying.
            </p>
          </div>

          {/* Micro Weather Bar inside banner */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center justify-between sm:justify-start gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300">
                <CloudSun className="w-7 h-7" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight">{todayWeather.tempMax}°C</div>
                <div className="text-xs text-emerald-100">{todayWeather.condition}</div>
              </div>
            </div>

            <div className="h-10 w-px bg-white/20" />

            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-100">
                <Droplets className="w-3.5 h-3.5 text-cyan-300" />
                <span>Humidity: <b className="text-white">{todayWeather.humidity}%</b></span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-100">
                <WindIcon className="w-3.5 h-3.5 text-teal-300" />
                <span>Wind: <b className="text-white">{todayWeather.windSpeedKm} km/h</b></span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('weather')}
              className="hidden sm:flex items-center gap-1 bg-white text-emerald-900 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-emerald-50 transition cursor-pointer"
            >
              <span>Forecast</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Alert Banner (if any) */}
      {urgentAlert && (
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-4 shadow-xs flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-amber-950">{urgentAlert.title}</h2>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-0.5">{urgentAlert.message}</p>
            </div>
          </div>
          <button
            onClick={() => urgentAlert.actionTab && setActiveTab(urgentAlert.actionTab as any)}
            className="text-xs font-semibold text-amber-900 underline hover:text-amber-950 shrink-0 cursor-pointer pt-1"
          >
            Details
          </button>
        </div>
      )}

      {/* 4 Farm Metric Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Land */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t.dashboard.totalLand}</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-stone-900">{totalLand}</span>
            <span className="text-xs font-semibold text-stone-500">Acres</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {fields.length} active plots in {farmer.district}
          </p>
        </div>

        {/* Active Crops */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t.dashboard.activePlots}</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-stone-900">{fields.length}</span>
            <span className="text-xs font-semibold text-stone-500">Varieties</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 truncate">
            {fields.map(f => f.currentCrop).join(', ')}
          </p>
        </div>

        {/* Crop Health Index */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t.dashboard.cropHealthScore}</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-700">{avgHealth}%</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {avgHealth >= 85 ? 'Vigorous' : avgHealth >= 70 ? 'Good' : 'Attention'}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            NDVI Remote sensing verified
          </p>
        </div>

        {/* Est. Harvest Value */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t.dashboard.estHarvestValue}</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-stone-500">₹</span>
            <span className="text-2xl sm:text-3xl font-bold text-stone-900">
              {(estimatedValue / 100000).toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-stone-500">Lakhs</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>Based on current APMC rates</span>
          </p>
        </div>
      </div>

      {/* Quick Action Shortcuts Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">{t.dashboard.quickActions}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Action 1: Crop Doctor */}
          <button
            id="dash-action-doctor"
            onClick={() => setActiveTab('cropDoctor')}
            className="flex flex-col items-start p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="font-bold text-stone-900 text-sm">{t.dashboard.scanDisease}</span>
            <span className="text-xs text-stone-500 mt-0.5">Instant AI leaf scan</span>
          </button>

          {/* Action 2: Check Mandi */}
          <button
            id="dash-action-mandi"
            onClick={() => setActiveTab('mandiPrices')}
            className="flex flex-col items-start p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200 hover:border-amber-400 hover:shadow-md transition text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="font-bold text-stone-900 text-sm">{t.dashboard.checkMandi}</span>
            <span className="text-xs text-stone-500 mt-0.5">APMC rates & MSP comparison</span>
          </button>

          {/* Action 3: Soil Health */}
          <button
            id="dash-action-soil"
            onClick={() => setActiveTab('soilHealth')}
            className="flex flex-col items-start p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-200 hover:border-sky-400 hover:shadow-md transition text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FlaskConical className="w-5 h-5" />
            </div>
            <span className="font-bold text-stone-900 text-sm">{t.dashboard.testSoil}</span>
            <span className="text-xs text-stone-500 mt-0.5">NPK & fertilizer dose card</span>
          </button>

          {/* Action 4: Ask Sahayak */}
          <button
            id="dash-action-sahayak"
            onClick={() => setIsVoiceAssistantOpen(true)}
            className="flex flex-col items-start p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-200 hover:border-purple-400 hover:shadow-md transition text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <span className="font-bold text-stone-900 text-sm">{t.dashboard.askSahayak}</span>
            <span className="text-xs text-stone-500 mt-0.5">Voice assistance in Hindi/Eng</span>
          </button>
        </div>
      </div>

      {/* Agri-Store & Supabase Order Form Showcase Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 rounded-3xl p-5 sm:p-6 text-white border border-emerald-700/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">
                Agri-Store & Certified Farm Supplies
              </h3>
              <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                <Database className="w-3 h-3" />
                Supabase Connected
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              Order certified seeds, bio-fertilizers & drip kits. All checkout data is securely saved in your Supabase database.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('orderForm')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>Open Order Form</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsCheckoutModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-black transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Fast Checkout</span>
          </button>
        </div>
      </div>

      {/* Live Mandi Rate Ticker Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-bold text-stone-900">{t.dashboard.mandiTicker}</h2>
            <span className="text-[11px] text-stone-500 hidden sm:inline">
              (Live quotes from nearby APMCs)
            </span>
          </div>
          <button
            onClick={() => setActiveTab('mandiPrices')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-0.5 cursor-pointer"
          >
            <span>All Mandis</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {mandiPrices.slice(0, 6).map(item => (
            <div
              key={item.id}
              onClick={() => setActiveTab('mandiPrices')}
              className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 hover:bg-stone-100/80 transition cursor-pointer"
            >
              <div className="text-[11px] text-stone-500 truncate">{item.commodity.split('(')[0]}</div>
              <div className="text-base font-bold text-stone-900 mt-0.5">
                ₹{item.modalPrice}
                <span className="text-[10px] font-normal text-stone-500">/Qtl</span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-stone-500 truncate max-w-[70px]">{item.marketName.split(' ')[0]}</span>
                <span
                  className={`flex items-center font-semibold ${
                    item.trend === 'up'
                      ? 'text-emerald-600'
                      : item.trend === 'down'
                      ? 'text-rose-600'
                      : 'text-stone-500'
                  }`}
                >
                  {item.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : item.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
                  {item.priceChangePercent > 0 ? `+${item.priceChangePercent}%` : `${item.priceChangePercent}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Section: Active Farm Plots & Today's Scheduled Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Active Farm Plots Snapshot */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Active Field Plots</h2>
                <p className="text-xs text-stone-500">Real-time health and growth stage</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('myFields')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Fields</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {fields.map(field => (
              <div
                key={field.id}
                onClick={() => {
                  setSelectedFieldId(field.id);
                  setActiveTab('myFields');
                }}
                className="p-4 rounded-2xl border border-stone-200/90 hover:border-emerald-400 hover:shadow-xs transition cursor-pointer bg-stone-50/50"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">{field.name}</h3>
                    <p className="text-xs text-stone-500">
                      {field.currentCrop} ({field.variety}) • {field.sizeAcres} Acres • {field.soilType}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        field.healthScore >= 90
                          ? 'bg-emerald-100 text-emerald-800'
                          : field.healthScore >= 75
                          ? 'bg-lime-100 text-lime-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {field.healthScore}% Health
                    </span>
                  </div>
                </div>

                {/* Progress bar for growth stage */}
                <div className="space-y-1 mt-3">
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <span>Stage: <strong className="text-stone-800">{field.growthStage}</strong></span>
                    <span>Moisture: <strong className="text-cyan-700">{field.soilMoisturePercent}%</strong></span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width:
                          field.growthStage === 'Germination'
                            ? '15%'
                            : field.growthStage === 'Vegetative'
                            ? '40%'
                            : field.growthStage === 'Tillering'
                            ? '55%'
                            : field.growthStage === 'Flowering'
                            ? '75%'
                            : field.growthStage === 'Grain Filling'
                            ? '85%'
                            : '95%',
                      }}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                    {field.irrigationType} Irrigation
                  </span>
                  <span>Est. Harvest: {field.estimatedHarvestDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Today's Pending Farm Tasks */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <CalendarCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">{t.dashboard.scheduledTasks}</h2>
                <p className="text-xs text-stone-500">
                  {pendingTasks.length} pending agricultural actions
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('calendar')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
            >
              Full Calendar
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition flex items-start gap-3 ${
                  task.completed
                    ? 'bg-stone-50/60 border-stone-200/60 opacity-60'
                    : 'bg-white border-stone-200 hover:border-emerald-300 shadow-2xs'
                }`}
              >
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition cursor-pointer shrink-0 ${
                    task.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-stone-300 hover:border-emerald-600 text-transparent'
                  }`}
                  aria-label="Toggle task completion"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-bold truncate ${
                        task.completed ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        task.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {task.dueDate}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-[10px] text-stone-500">
                    <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {task.crop}
                    </span>
                    <span>• {task.fieldName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function WindIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  );
}
