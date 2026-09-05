import React, { useState } from 'react';
import { FarmProvider, useFarm } from './context/FarmContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { FarmerDashboard } from './components/FarmerDashboard';
import { MyFields } from './components/MyFields';
import { CropDoctor } from './components/CropDoctor';
import { WeatherAdvisory } from './components/WeatherAdvisory';
import { CropHealth } from './components/CropHealth';
import { MandiPrices } from './components/MandiPrices';
import { SoilHealth } from './components/SoilHealth';
import { FarmingCalendar } from './components/FarmingCalendar';
import { GovernmentSchemes } from './components/GovernmentSchemes';
import { ExpertHelp } from './components/ExpertHelp';
import { AgriStoreOrderForm } from './components/AgriStoreOrderForm';
import { CheckoutOrderModal } from './components/CheckoutOrderModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab } = useFarm();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900 selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header Bar */}
      <Header />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex-1 flex flex-col">
        {/* Navigation Tabs (Desktop Bar & Mobile Bottom) */}
        <Navigation />

        {/* View Switcher based on active tab */}
        <main className="flex-1 mt-4">
          {activeTab === 'dashboard' && <FarmerDashboard />}
          {activeTab === 'myFields' && <MyFields />}
          {activeTab === 'cropDoctor' && <CropDoctor />}
          {activeTab === 'weather' && <WeatherAdvisory />}
          {activeTab === 'cropHealth' && <CropHealth />}
          {activeTab === 'mandiPrices' && <MandiPrices />}
          {activeTab === 'soilHealth' && <SoilHealth />}
          {activeTab === 'calendar' && <FarmingCalendar />}
          {activeTab === 'schemes' && <GovernmentSchemes />}
          {activeTab === 'expertHelp' && <ExpertHelp />}
          {activeTab === 'orderForm' && <AgriStoreOrderForm />}
        </main>
      </div>

      {/* Checkout Order Drawer/Modal with Supabase persistence */}
      <CheckoutOrderModal />

      {/* Floating Action Button: KisanMitra AI Assistant */}
      <div className="fixed bottom-20 md:bottom-6 right-5 z-40">
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="group flex items-center gap-2.5 bg-emerald-800 hover:bg-emerald-900 text-white pl-3.5 pr-4 py-3 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-103 transition-all duration-200 border border-emerald-600/40 cursor-pointer"
          aria-label="Open AI Farming Assistant"
        >
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 group-hover:rotate-12 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-black tracking-tight flex items-center gap-1">
              <span>Ask KisanMitra AI</span>
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
            </div>
            <div className="text-[10px] text-emerald-200 font-medium">
              Voice / Text 24x7
            </div>
          </div>
        </button>
      </div>

      {/* KisanMitra AI Chat Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Farmer Profile & App Settings Modal */}
      <ProfileSettingsModal />
    </div>
  );
};

export default function App() {
  return (
    <FarmProvider>
      <MainContent />
    </FarmProvider>
  );
}
