import React, { useState } from 'react';
import {
  Sprout,
  Mic,
  Bell,
  User,
  MapPin,
  CloudSun,
  CheckCheck,
  ChevronDown,
  Globe,
  Sparkles,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { LanguageCode } from '../types';

export const Header: React.FC = () => {
  const {
    farmer,
    language,
    setLanguage,
    t,
    notifications,
    markAllNotificationsRead,
    markNotificationAsRead,
    setActiveTab,
    setIsVoiceAssistantOpen,
    setIsOnboardingOpen,
    cartCount,
    cartTotal,
    setIsCheckoutModalOpen,
  } = useFarm();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const languages: { code: LanguageCode; name: string; native: string }[] = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  ];

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo & Tagline */}
          <div
            id="brand-logo-container"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg sm:text-2xl text-stone-900 tracking-tight">
                  {t.appName}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  AI Smart Farm
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block font-normal">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Center: Location & Micro Weather Chip */}
          <div className="hidden md:flex items-center gap-3 bg-stone-100/80 px-3.5 py-1.5 rounded-full border border-stone-200 text-xs text-stone-700">
            <div className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {farmer.village}, {farmer.district}
              </span>
            </div>
            <span className="text-stone-300">|</span>
            <div className="flex items-center gap-1.5 text-stone-600">
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              <span>31°C • Partly Cloudy</span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ask Sahayak Voice AI CTA */}
            <button
              id="header-voice-assistant-btn"
              onClick={() => setIsVoiceAssistantOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-3 sm:px-4 py-2 rounded-full font-medium text-xs sm:text-sm shadow-sm transition-all hover:shadow-md cursor-pointer group"
            >
              <Mic className="w-4 h-4 text-emerald-200 group-hover:animate-pulse" />
              <span className="hidden sm:inline">Ask Sahayak</span>
              <Sparkles className="w-3 h-3 text-amber-300 hidden sm:inline" />
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                id="header-lang-selector-btn"
                onClick={() => {
                  setShowLanguageMenu(!showLanguageMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium transition cursor-pointer"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold">{currentLangObj.native}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                    Select Language / भाषा
                  </div>
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-50 transition cursor-pointer ${
                        language === lang.code
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-stone-700'
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-[11px] text-stone-400">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shopping Cart & Supabase Checkout Button */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCheckoutModalOpen(true)}
              className="relative flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition cursor-pointer"
              title="View Cart & Supabase Checkout"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-500 text-stone-950 font-black text-[10px] px-1.5 py-0.5 rounded-full ring-1 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="header-notifications-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowLanguageMenu(false);
                }}
                className="relative p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 transition cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4 text-stone-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-stone-800">Alerts & Advisory</span>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.actionTab) {
                            setActiveTab(notif.actionTab as any);
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                          notif.read
                            ? 'bg-stone-50/60 border-stone-100 text-stone-600'
                            : 'bg-amber-50/40 border-amber-200/70 text-stone-900 font-medium shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-semibold">{notif.title}</span>
                          <span className="text-[10px] text-stone-400">{notif.timestamp}</span>
                        </div>
                        <p className="text-stone-600 line-clamp-2">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Trigger */}
            <button
              id="header-profile-btn"
              onClick={() => setIsOnboardingOpen(true)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition cursor-pointer"
              title="Farmer Profile & Settings"
            >
              <div className="w-7 h-7 rounded-lg bg-stone-800 text-amber-300 flex items-center justify-center font-bold text-xs">
                {farmer.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <div className="font-semibold text-stone-800 leading-tight truncate max-w-[110px]">
                  {farmer.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-stone-500">
                  {farmer.totalLandAcres} Ac • {farmer.district}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
