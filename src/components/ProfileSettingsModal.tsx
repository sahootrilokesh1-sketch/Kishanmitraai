import React, { useState } from 'react';
import {
  User,
  X,
  ShieldCheck,
  MapPin,
  Phone,
  CreditCard,
  Bell,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSettingsModal: React.FC = () => {
  const { isProfileModalOpen, setIsProfileModalOpen, farmer, updateFarmer, triggerConfetti } = useFarm();

  const [name, setName] = useState(farmer.name);
  const [mobile, setMobile] = useState(farmer.phone);
  const [village, setVillage] = useState(farmer.village);
  const [district, setDistrict] = useState(farmer.district);
  const [state, setState] = useState(farmer.state);
  const [totalLandAcres, setTotalLandAcres] = useState(farmer.totalLandAcres.toString());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Notification preferences
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [mandiAlerts, setMandiAlerts] = useState(true);
  const [sprayAlerts, setSprayAlerts] = useState(true);

  if (!isProfileModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFarmer({
      name,
      phone: mobile,
      mobile,
      village,
      district,
      state,
      totalLandAcres: parseFloat(totalLandAcres) || 6.5,
    });
    setSavedSuccess(true);
    triggerConfetti();
    setTimeout(() => {
      setSavedSuccess(false);
      setIsProfileModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900">Farmer Profile & Farm Settings</h2>
              <p className="text-xs text-stone-500">Aadhaar e-KYC Verified Farmer</p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {savedSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Farmer profile updated successfully!</span>
            </div>
          )}

          {/* Verification Badge Bar */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="font-bold text-stone-900 text-xs">PM-KISAN Registered</div>
                <div className="text-[10px] text-stone-500">ID: MH-NSK-2024-8841</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Active
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Farmer Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Mobile Number *</label>
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Total Land (Acres) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={totalLandAcres}
                  onChange={e => setTotalLandAcres(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Village</label>
                <input
                  type="text"
                  value={village}
                  onChange={e => setVillage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Notification toggles */}
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <span className="font-bold text-stone-900 block">SMS & WhatsApp Alerts</span>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 cursor-pointer">
              <span className="text-stone-700 font-medium">Hyperlocal Severe Weather Warnings</span>
              <input
                type="checkbox"
                checked={weatherAlerts}
                onChange={e => setWeatherAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 cursor-pointer">
              <span className="text-stone-700 font-medium">Mandi Price Spike & Drop Updates</span>
              <input
                type="checkbox"
                checked={mandiAlerts}
                onChange={e => setMandiAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 cursor-pointer">
              <span className="text-stone-700 font-medium">Fertilizer & Spray Window Reminders</span>
              <input
                type="checkbox"
                checked={sprayAlerts}
                onChange={e => setSprayAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
