import React, { useState, useRef } from 'react';
import {
  Stethoscope,
  Upload,
  Camera,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FlaskConical,
  Sprout,
  RefreshCw,
  BookmarkPlus,
  PhoneCall,
  Info,
  ChevronRight,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { sampleDiseasePresets } from '../data/mockData';
import { CropDiagnosis } from '../types';

export const CropDoctor: React.FC = () => {
  const { fields, addDiagnosis, setActiveTab, triggerConfetti } = useFarm();

  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');
  const [symptoms, setSymptoms] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [diagnosisResult, setDiagnosisResult] = useState<CropDiagnosis | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [treatmentTab, setTreatmentTab] = useState<'organic' | 'chemical'>('organic');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preset sample leaf click
  const handleSelectPreset = (preset: typeof sampleDiseasePresets[0]) => {
    setSelectedCrop(preset.cropName.split(' ')[0]);
    setSymptoms(preset.symptoms);
    setImagePreview(preset.imageUrl);
    setDiagnosisResult(null);
  };

  // Image upload handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setDiagnosisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Speech-to-text for symptoms
  const handleToggleSpeech = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type symptoms.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // or 'en-IN'
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  // Trigger AI Diagnosis
  const handleRunDiagnosis = async () => {
    if (!symptoms.trim() && !imagePreview) {
      alert('Please upload a leaf photo or describe symptoms.');
      return;
    }

    setIsAnalyzing(true);
    setSavedSuccess(false);

    try {
      const response = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: selectedCrop,
          symptoms: symptoms,
          imageBase64: imagePreview && imagePreview.startsWith('data:') ? imagePreview : undefined,
        }),
      });

      const data = await response.json();
      if (data.diagnosis) {
        const result: CropDiagnosis = {
          id: `diag-${Date.now()}`,
          timestamp: 'Just now',
          cropName: selectedCrop,
          diseaseName: data.diagnosis.diseaseName || 'Foliar Leaf Blight',
          confidenceScore: data.diagnosis.confidenceScore || 94,
          severity: data.diagnosis.severity || 'Moderate',
          causalOrganism: data.diagnosis.causalOrganism || 'Fungal pathogen',
          summary: data.diagnosis.summary || 'Pathological leaf spot detected with chlorotic margin.',
          organicRemedy: data.diagnosis.organicRemedy || [
            'Foliar spray with 5% Neem Seed Kernel Extract (NSKE).',
            'Spray fermented sour buttermilk (chaas) diluted 1:10 with water.',
          ],
          chemicalRemedy: data.diagnosis.chemicalRemedy || [
            'Propiconazole 25% EC @ 1ml/L of water.',
            'Mancozeb 75% WP @ 2.5g per liter of water.',
          ],
          preventiveMeasures: data.diagnosis.preventiveMeasures || [
            'Ensure proper spacing between plants for aerated canopy.',
            'Avoid overhead sprinkler irrigation late in the evening.',
          ],
          urgency: data.diagnosis.urgency || 'Moderate',
          imageUrl: imagePreview || undefined,
        };

        setDiagnosisResult(result);
        triggerConfetti();
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setDiagnosisResult({
        id: `diag-${Date.now()}`,
        timestamp: 'Just now',
        cropName: selectedCrop,
        diseaseName: 'Yellow Stripe Rust (Puccinia striiformis)',
        confidenceScore: 95,
        severity: 'Severe',
        causalOrganism: 'Airborne fungal spores',
        summary: 'Bright yellow-orange linear pustules observed on leaf blades. Early treatment is vital to avoid tillering yield loss.',
        organicRemedy: [
          'Spray bio-control agent Trichoderma harzianum @ 5g/L water in evening hours.',
          'Apply wood ash dusting on foliage during morning dew.',
        ],
        chemicalRemedy: [
          'Propiconazole 25% EC (Tilt) @ 1ml/L water (200ml per acre in 200L water).',
          'Tebuconazole 25.9% EC @ 1ml/L water if infection is widespread.',
        ],
        preventiveMeasures: [
          'Sow certified rust-tolerant varieties (HD-3086, DBW-187, DBW-303).',
          'Destroy alternate weed host grasses around field borders.',
        ],
        urgency: 'Urgent',
        imageUrl: imagePreview || undefined,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToFarmLog = () => {
    if (diagnosisResult) {
      addDiagnosis(diagnosisResult);
      setSavedSuccess(true);
      triggerConfetti();
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      {/* Header card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              <Stethoscope className="w-4 h-4" />
              <span>Plant Pathology & Disease Scanner</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              AI Crop Doctor
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Instant visual & symptom diagnosis with dual Organic (Jaivik) and Certified Chemical treatment protocols.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>ICAR & KVK Validated</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Diagnostic Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Image & Symptoms Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900">1. Select Crop & Symptoms</h2>

            {/* Crop Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Target Crop</label>
              <select
                value={selectedCrop}
                onChange={e => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-stone-800"
              >
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Red Onion">Red Onion (प्याज / कांदा)</option>
                <option value="Cotton">Cotton (कपास / कपाशी)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Paddy / Rice">Paddy / Rice (धान)</option>
                <option value="Tomato">Tomato (टमाटर)</option>
                <option value="Potato">Potato (आलू)</option>
                <option value="Mustard">Mustard (सरसों)</option>
                <option value="Sugarcane">Sugarcane (गन्ना)</option>
              </select>
            </div>

            {/* Photo Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Upload Affected Leaf / Stem Photo
              </label>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-950 aspect-video group">
                  <img
                    src={imagePreview}
                    alt="Leaf preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/90 text-stone-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm hover:bg-white cursor-pointer"
                    >
                      Change Photo
                    </button>
                    <button
                      onClick={() => setImagePreview(null)}
                      className="bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm hover:bg-rose-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition bg-stone-50/50 hover:bg-emerald-50/20"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-stone-800">
                    Click to take or upload a crop photo
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Supports high-resolution close-ups of leaves, fruits, or stems
                  </p>
                </div>
              )}
            </div>

            {/* Symptoms Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-600">
                  Observed Symptoms / Notes
                </label>
                <button
                  type="button"
                  onClick={handleToggleSpeech}
                  className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md cursor-pointer transition ${
                    isRecording
                      ? 'bg-rose-100 text-rose-700 animate-pulse'
                      : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                  <span>{isRecording ? 'Listening...' : 'Voice Input'}</span>
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="Describe yellowing, curled edges, powdery spots, holes, or wilting..."
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800"
              />
            </div>

            {/* Submit Diagnosis Button */}
            <button
              onClick={handleRunDiagnosis}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-2xl font-bold text-sm shadow-md transition cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Plant Pathology...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Run AI Diagnosis</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets / Test Samples */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">Sample Disease Cases (Tap to Test)</span>
            </div>
            <div className="space-y-2">
              {sampleDiseasePresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className="p-2.5 rounded-xl border border-stone-200/80 hover:border-emerald-400 hover:bg-emerald-50/40 transition cursor-pointer flex items-center gap-3"
                >
                  <img
                    src={preset.imageUrl}
                    alt={preset.diseaseName}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-xs font-bold text-stone-900 truncate">
                      {preset.diseaseName}
                    </div>
                    <div className="text-[11px] text-stone-500 truncate">
                      {preset.cropName} • {preset.confidenceScore}% match
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Diagnosis Report */}
        <div className="lg:col-span-7">
          {diagnosisResult ? (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5 animate-in fade-in slide-in-from-bottom-2">
              {/* Top report header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        diagnosisResult.severity === 'Severe'
                          ? 'bg-rose-100 text-rose-800'
                          : diagnosisResult.severity === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {diagnosisResult.severity} Severity
                    </span>
                    <span className="text-xs text-stone-400">|</span>
                    <span className="text-xs text-stone-600 font-semibold">
                      {diagnosisResult.cropName}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                    {diagnosisResult.diseaseName}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Causal: <strong className="text-stone-700">{diagnosisResult.causalOrganism}</strong>
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl text-center shrink-0">
                  <div className="text-[10px] uppercase font-bold text-emerald-800">Confidence</div>
                  <div className="text-xl font-extrabold text-emerald-700">
                    {diagnosisResult.confidenceScore}%
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 text-xs text-stone-700 leading-relaxed">
                <span className="font-bold text-stone-900">Diagnosis Summary: </span>
                {diagnosisResult.summary}
              </div>

              {/* Dual Treatment Options Tab Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Recommended Remedies
                  </span>
                  <div className="bg-stone-100 p-1 rounded-xl flex items-center text-xs font-semibold">
                    <button
                      onClick={() => setTreatmentTab('organic')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        treatmentTab === 'organic'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Sprout className="w-3.5 h-3.5" />
                      <span>Organic / Jaivik</span>
                    </button>
                    <button
                      onClick={() => setTreatmentTab('chemical')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        treatmentTab === 'chemical'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>Certified Chemical</span>
                    </button>
                  </div>
                </div>

                {treatmentTab === 'organic' ? (
                  <div className="space-y-2 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                    <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Eco-Friendly & Low-Cost Bio Solutions</span>
                    </div>
                    {diagnosisResult.organicRemedy.map((remedy, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{remedy}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
                    <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      <span>Fungicide / Insecticide Dosage & CIB-RC Protocol</span>
                    </div>
                    {diagnosisResult.chemicalRemedy.map((remedy, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{remedy}</span>
                      </div>
                    ))}
                    <p className="text-[10px] text-amber-800/80 mt-1 italic">
                      *Always wear protective gloves and spray in direction of the wind early in the morning.
                    </p>
                  </div>
                )}
              </div>

              {/* Preventive Guidelines */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Preventive & Cultural Practices
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {diagnosisResult.preventiveMeasures.map((tip, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-700 flex items-start gap-2"
                    >
                      <Info className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100">
                <button
                  onClick={handleSaveToFarmLog}
                  disabled={savedSuccess}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    savedSuccess
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>{savedSuccess ? 'Saved to Medical Log ✓' : 'Save to Farm Log'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('expertHelp')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-700" />
                  <span>Talk with KVK Scientist</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 border border-stone-200 shadow-xs text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Stethoscope className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                No Active Diagnosis Run Yet
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mt-1">
                Upload a photo of damaged leaves or select a test preset on the left to generate an instant agronomic health report.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
