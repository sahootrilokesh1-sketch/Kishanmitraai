import React, { useState } from 'react';
import {
  Users,
  PhoneCall,
  Video,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  Star,
  MessageSquare,
  HelpCircle,
  FileQuestion,
  Phone,
} from 'lucide-react';
import { kvkExperts } from '../data/mockData';
import { useFarm } from '../context/FarmContext';

export const ExpertHelp: React.FC = () => {
  const { farmer, triggerConfetti } = useFarm();

  const [querySubject, setQuerySubject] = useState('');
  const [queryCrop, setQueryCrop] = useState('Wheat');
  const [queryText, setQueryText] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [activeExpert, setActiveExpert] = useState<typeof kvkExperts[0] | null>(null);

  const handleSubmitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;

    setSubmittedSuccess(true);
    triggerConfetti();
    setQuerySubject('');
    setQueryText('');
  };

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      {/* Header bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>KVK Scientists & Agronomy Extension</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            KVK Expert Help & Tele-Advisory
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Connect directly with verified ICAR agricultural scientists, plant pathologists, and soil experts.
          </p>
        </div>

        {/* Kisan Call Center banner button */}
        <a
          href="tel:18001801551"
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition"
        >
          <Phone className="w-4 h-4" />
          <span>Kisan Call Center: 1800-180-1551</span>
        </a>
      </div>

      {/* Main Grid: Experts Cards + Direct Query Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: KVK Scientists Directory */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">
              Assigned District Extension Scientists ({farmer.district})
            </h2>
            <span className="text-xs text-stone-500">Free Government Service</span>
          </div>

          <div className="space-y-3.5">
            {kvkExperts.map(expert => (
              <div
                key={expert.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 hover:border-emerald-300 shadow-xs transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={expert.photoUrl}
                      alt={expert.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-stone-900">{expert.name}</h3>
                        <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{expert.rating}</span>
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-800">{expert.specialization}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">{expert.institution}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      expert.status === 'Available Now'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {expert.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                  <span>Languages: <strong>{expert.languages.join(', ')}</strong></span>
                  <span>{expert.experienceYears} Years Experience</span>
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setActiveExpert(expert)}
                    className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat / Query</span>
                  </button>

                  <a
                    href="tel:18001801551"
                    className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-2xs transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Extension</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Ask a Question Query Form */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 sticky top-24">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <FileQuestion className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  {activeExpert ? `Consult ${activeExpert.name}` : 'Submit Agricultural Query'}
                </h3>
                <p className="text-[11px] text-stone-500">
                  Expected advisory reply within 2 to 4 hours via SMS & App.
                </p>
              </div>
            </div>

            {submittedSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-950">Query Successfully Lodged!</h4>
                <p className="text-xs text-emerald-800">
                  Ticket Ref #KVK-88219 has been assigned to the Plant Pathology division. You will receive an SMS on {farmer.phone}.
                </p>
                <button
                  onClick={() => setSubmittedSuccess(false)}
                  className="mt-2 text-xs font-bold text-emerald-700 underline cursor-pointer"
                >
                  Submit Another Question
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuery} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Related Crop
                  </label>
                  <select
                    value={queryCrop}
                    onChange={e => setQueryCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800"
                  >
                    <option value="Wheat">Wheat (गेहूं)</option>
                    <option value="Red Onion">Red Onion (प्याज)</option>
                    <option value="Cotton">Cotton (कपास)</option>
                    <option value="Soybean">Soybean (सोयाबीन)</option>
                    <option value="Paddy / Rice">Paddy / Rice (धान)</option>
                    <option value="Tomato">Tomato (टमाटर)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Problem Summary / Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Wilting observed in patches after rainfall"
                    value={querySubject}
                    onChange={e => setQuerySubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Detailed Symptoms & Inputs Applied *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Mention soil type, previous spray, fertilizer dose, and days since problem started..."
                    value={queryText}
                    onChange={e => setQueryText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to KVK Scientist</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
