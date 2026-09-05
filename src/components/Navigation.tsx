import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Stethoscope,
  CloudSun,
  Activity,
  TrendingUp,
  FlaskConical,
  CalendarDays,
  Landmark,
  PhoneCall,
  Mic,
  ShoppingBag,
} from 'lucide-react';
import { useFarm, ActiveTab } from '../context/FarmContext';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, t, setIsVoiceAssistantOpen, cartCount } = useFarm();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'orderForm', label: t.nav.orderForm || 'Agri-Store & Orders', icon: <ShoppingBag className="w-4 h-4" />, badge: cartCount },
    { id: 'myFields', label: t.nav.myFields, icon: <MapPin className="w-4 h-4" /> },
    { id: 'cropDoctor', label: t.nav.cropDoctor, icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'weather', label: t.nav.weather, icon: <CloudSun className="w-4 h-4" /> },
    { id: 'cropHealth', label: t.nav.cropHealth, icon: <Activity className="w-4 h-4" /> },
    { id: 'mandiPrices', label: t.nav.mandiPrices, icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'soilHealth', label: t.nav.soilHealth, icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'calendar', label: t.nav.calendar, icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'schemes', label: t.nav.schemes, icon: <Landmark className="w-4 h-4" /> },
    { id: 'expertHelp', label: t.nav.expertHelp, icon: <PhoneCall className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Top Desktop & Tablet Horizontal Tab Navigation */}
      <nav className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-2.5 no-scrollbar">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-200' : 'text-stone-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-stone-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Fixed Quick-Bar (Essential 5 actions) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-stone-200 shadow-lg px-2 py-1.5">
        <div className="grid grid-cols-5 gap-1">
          <button
            id="mobile-nav-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition cursor-pointer ${
              activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-stone-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </button>

          <button
            id="mobile-nav-fields"
            onClick={() => setActiveTab('myFields')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition cursor-pointer ${
              activeTab === 'myFields' ? 'text-emerald-700 font-bold' : 'text-stone-500'
            }`}
          >
            <MapPin className="w-4 h-4 mb-0.5" />
            <span>Farm</span>
          </button>

          <button
            id="mobile-nav-crop-doctor"
            onClick={() => setActiveTab('cropDoctor')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition cursor-pointer ${
              activeTab === 'cropDoctor' ? 'text-emerald-700 font-bold' : 'text-stone-500'
            }`}
          >
            <div className="w-8 h-8 -mt-4 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span>Doctor</span>
          </button>

          <button
            id="mobile-nav-mandi"
            onClick={() => setActiveTab('mandiPrices')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition cursor-pointer ${
              activeTab === 'mandiPrices' ? 'text-emerald-700 font-bold' : 'text-stone-500'
            }`}
          >
            <TrendingUp className="w-4 h-4 mb-0.5" />
            <span>Mandi</span>
          </button>

          <button
            id="mobile-nav-sahayak"
            onClick={() => setIsVoiceAssistantOpen(true)}
            className="flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium text-amber-700 cursor-pointer"
          >
            <Mic className="w-4 h-4 mb-0.5" />
            <span>Sahayak</span>
          </button>
        </div>
      </div>
    </>
  );
};
