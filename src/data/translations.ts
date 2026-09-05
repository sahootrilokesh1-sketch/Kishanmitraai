import { LanguageCode } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  nav: {
    dashboard: string;
    myFields: string;
    cropDoctor: string;
    weather: string;
    cropHealth: string;
    mandiPrices: string;
    soilHealth: string;
    calendar: string;
    schemes: string;
    expertHelp: string;
    orderForm?: string;
  };
  dashboard: {
    welcome: string;
    farmOverview: string;
    todayWeather: string;
    quickStats: string;
    totalLand: string;
    activePlots: string;
    cropHealthScore: string;
    estHarvestValue: string;
    urgentAlerts: string;
    quickActions: string;
    scanDisease: string;
    checkMandi: string;
    testSoil: string;
    askSahayak: string;
    mandiTicker: string;
    scheduledTasks: string;
  };
  voice: {
    title: string;
    placeholder: string;
    listening: string;
    speak: string;
    askQuestion: string;
    suggestions: string[];
  };
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: "KisanMitra AI",
    tagline: "Your Intelligent Farming Companion",
    nav: {
      dashboard: "Dashboard",
      myFields: "My Farm",
      cropDoctor: "AI Crop Doctor",
      weather: "Weather Advisory",
      cropHealth: "Crop Health",
      mandiPrices: "Mandi Prices",
      soilHealth: "Soil Health",
      calendar: "Crop Calendar",
      schemes: "Govt Schemes",
      expertHelp: "KVK & Experts",
      orderForm: "Agri-Store & Orders",
    },
    dashboard: {
      welcome: "Namaste, Farmer Friend",
      farmOverview: "Farm Overview & Live Advisory",
      todayWeather: "Today's Farm Weather",
      quickStats: "Field Overview",
      totalLand: "Total Land",
      activePlots: "Active Crops",
      cropHealthScore: "Crop Health Index",
      estHarvestValue: "Est. Harvest Value",
      urgentAlerts: "Critical Farming Alerts",
      quickActions: "Instant Action Shortcuts",
      scanDisease: "Diagnose Crop Disease",
      checkMandi: "Check Mandi Bhav",
      testSoil: "Soil Health Check",
      askSahayak: "Ask Kisan Sahayak",
      mandiTicker: "Live Mandi APMC Rates",
      scheduledTasks: "Today's Pending Farm Tasks",
    },
    voice: {
      title: "Kisan Sahayak Voice AI",
      placeholder: "Ask about pest control, weather, urea dosage, MSP prices...",
      listening: "Listening to your voice... Speak now in your language",
      speak: "Speak",
      askQuestion: "Send Question",
      suggestions: [
        "Why are my wheat leaves turning yellow?",
        "When should I spray for pink bollworm in cotton?",
        "What is the current Wheat MSP rate?",
        "How much DAP fertilizer is needed per acre of paddy?"
      ],
    },
  },
  hi: {
    appName: "किसान मित्र AI",
    tagline: "आपका डिजिटल कृषि साथी",
    nav: {
      dashboard: "डैशबोर्ड",
      myFields: "मेरा खेत",
      cropDoctor: "फसल डॉक्टर",
      weather: "मौसम व सलाह",
      cropHealth: "फसल स्वास्थ्य",
      mandiPrices: "मंडी भाव",
      soilHealth: "मृदा स्वास्थ्य",
      calendar: "कृषि कैलेंडर",
      schemes: "सरकारी योजनाएं",
      expertHelp: "कृषि वैज्ञानिक",
    },
    dashboard: {
      welcome: "नमस्ते, किसान भाई",
      farmOverview: "खेत स्थिति व दैनिक सलाह",
      todayWeather: "आज का स्थानीय मौसम",
      quickStats: "खेत का संक्षिप्त विवरण",
      totalLand: "कुल रकबा",
      activePlots: "सक्रिय फसलें",
      cropHealthScore: "फसल स्वास्थ्य सूचकांक",
      estHarvestValue: "अनुमानित फसल मूल्य",
      urgentAlerts: "अति आवश्यक कृषि चेतावनी",
      quickActions: "तुरंत उपयोगी सेवाएं",
      scanDisease: "रोग पहचानें (फोटो लें)",
      checkMandi: "आज का मंडी भाव",
      testSoil: "मिट्टी की जांच",
      askSahayak: "किसान सहायक से पूछें",
      mandiTicker: "ताजा एपीएमसी मंडी दरें",
      scheduledTasks: "आज के जरूरी कृषि कार्य",
    },
    voice: {
      title: "किसान मित्र सहायक (आवाज द्वारा प्रश्न पूछें)",
      placeholder: "कीट नियंत्रण, खाद की मात्रा, मौसम या मंडी भाव पूछें...",
      listening: "आपकी आवाज सुन रहा हूँ... कृपया बोलें",
      speak: "बोलें",
      askQuestion: "पूछें",
      suggestions: [
        "गेहूं की पत्तियां पीली क्यों पड़ रही हैं?",
        "कपास में गुलाबी सुंडी का उपचार क्या है?",
        "धान की फसल में यूरिया कब और कितना डालें?",
        "आज गेहूं और सोयाबीन का न्यूनतम समर्थन मूल्य (MSP) क्या है?"
      ],
    },
  },
  mr: {
    appName: "किसान मित्र AI",
    tagline: "तुमचा हुशार शेती सोबती",
    nav: {
      dashboard: "डॅशबोर्ड",
      myFields: "माझे शेत",
      cropDoctor: "पिक डॉक्टर",
      weather: "हवामान अंदाज",
      cropHealth: "पिक आरोग्य",
      mandiPrices: "बाजार भाव",
      soilHealth: "माती परीक्षण",
      calendar: "कृषी दिनदर्शिका",
      schemes: "शासकीय योजना",
      expertHelp: "तज्ज्ञ सल्ला",
    },
    dashboard: {
      welcome: "नमस्कार, शेतकरी बांधव",
      farmOverview: "शेताचा आढावा व ताज्या सूचना",
      todayWeather: "आजचे स्थानिक हवामान",
      quickStats: "शेती माहिती",
      totalLand: "एकूण जमीन",
      activePlots: "चालू पिके",
      cropHealthScore: "पिक स्वास्थ्य निर्देशांक",
      estHarvestValue: "अपेक्षित उत्पन्न",
      urgentAlerts: "महत्त्वाच्या शेती सूचना",
      quickActions: "जलद सेवा",
      scanDisease: "पिक रोग तपासणी",
      checkMandi: "बाजार भाव पहा",
      testSoil: "माती आरोग्य कार्ड",
      askSahayak: "सहायकाशी बोला",
      mandiTicker: "थेट बाजार समिती भाव",
      scheduledTasks: "आजची नियोजित कामे",
    },
    voice: {
      title: "किसान सहायक (व्हॉइस AI)",
      placeholder: "कीड व्यवस्थापन, खतांचे प्रमाण, बाजार भाव विचारा...",
      listening: "तुमचा आवाज ऐकत आहे... बोला",
      speak: "बोला",
      askQuestion: "विचारा",
      suggestions: [
        "सोयाबीनच्या पानांवर पिवळे डाग पडले आहेत, काय करावे?",
        "कांद्याला करपा रोगापासून कसे वाचवावे?",
        "कपाशीवरील बोंडअळीचे नियंत्रण कसे करावे?",
        "सोयाबीन आणि कापूस चालू बाजारभाव काय आहे?"
      ],
    },
  },
  pa: {
    appName: "ਕਿਸਾਨ ਮਿੱਤਰ AI",
    tagline: "ਤੁਹਾਡਾ ਸਮਾਰਟ ਖੇਤੀ ਸਾਥੀ",
    nav: {
      dashboard: "ਡੈਸ਼ਬੋਰਡ",
      myFields: "ਮੇਰਾ ਖੇਤ",
      cropDoctor: "ਫਸਲ ਡਾਕਟਰ",
      weather: "ਮੌਸਮ ਜਾਣਕਾਰੀ",
      cropHealth: "ਫਸਲ ਸਿਹਤ",
      mandiPrices: "ਮੰਡੀ ਦੇ ਭਾਅ",
      soilHealth: "ਮਿੱਟੀ ਪਰਖ",
      calendar: "ਖੇਤੀ ਕੈਲੰਡਰ",
      schemes: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
      expertHelp: "ਮਾਹਿਰ ਸਲਾਹ",
    },
    dashboard: {
      welcome: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਕਿਸਾਨ ਵੀਰੋ",
      farmOverview: "ਖੇਤ ਸੰਖੇਪ ਤੇ ਤਾਜ਼ਾ ਸਲਾਹ",
      todayWeather: "ਅੱਜ ਦਾ ਮੌਸਮ",
      quickStats: "ਖੇਤੀ ਵੇਰਵਾ",
      totalLand: "ਕੁੱਲ ਰਕਬਾ",
      activePlots: "ਮੌਜੂਦਾ ਫ਼ਸਲਾਂ",
      cropHealthScore: "ਫਸਲ ਸਿਹਤ ਸਕੋਰ",
      estHarvestValue: "ਅੰਦਾਜ਼ਨ ਫਸਲ ਮੁੱਲ",
      urgentAlerts: "ਜ਼ਰੂਰੀ ਖੇਤੀ ਚੇਤਾਵਨੀਆਂ",
      quickActions: "ਤੇਜ਼ ਸੇਵਾਵਾਂ",
      scanDisease: "ਫਸਲ ਬਿਮਾਰੀ ਜਾਂਚ",
      checkMandi: "ਮੰਡੀ ਰੇਟ ਵੇਖੋ",
      testSoil: "ਮਿੱਟੀ ਕਾਰਡ ਵੇਖੋ",
      askSahayak: "ਸਹਾਇਕ ਨੂੰ ਪੁੱਛੋ",
      mandiTicker: "ਤਾਜ਼ਾ ਏ.ਪੀ.ਐਮ.ਸੀ. ਮੰਡੀ ਰੇਟ",
      scheduledTasks: "ਅੱਜ ਦੇ ਜ਼ਰੂਰੀ ਖੇਤੀ ਕੰਮ",
    },
    voice: {
      title: "ਕਿਸਾਨ ਸਹਾਇਕ ਏ.ਆਈ.",
      placeholder: "ਬਿਮਾਰੀ, ਯੂਰੀਆ, ਮੌਸਮ ਜਾਂ ਮੰਡੀ ਭਾਅ ਬਾਰੇ ਪੁੱਛੋ...",
      listening: "ਤੁਹਾਡੀ ਆਵਾਜ਼ ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲੋ ਜੀ",
      speak: "ਬੋਲੋ",
      askQuestion: "ਪੁੱਛੋ",
      suggestions: [
        "ਕਣਕ ਵਿੱਚ ਪੀਲੀ ਕੁੰਗੀ ਦਾ ਕੀ ਇਲਾਜ ਹੈ?",
        "ਝੋਨੇ ਵਿੱਚ ਖਾਦ ਪਾਉਣ ਦਾ ਸਹੀ ਸਮਾਂ ਕੀ ਹੈ?",
        "ਅੱਜ ਕਣਕ ਦਾ ਐਮ.ਐਸ.ਪੀ. ਭਾਅ ਕਿੰਨਾ ਹੈ?"
      ],
    },
  },
  te: {
    appName: "కిసాన్ మిత్ర AI",
    tagline: "మీ స్మార్ట్ వ్యవసాయ నేస్తం",
    nav: {
      dashboard: "డాష్‌బోర్డ్",
      myFields: "నా పొలం",
      cropDoctor: "పంట డాక్టర్",
      weather: "వాతావరణం",
      cropHealth: "పంట ఆరోగ్యం",
      mandiPrices: "మార్కెట్ ధరలు",
      soilHealth: "నేల పరీక్ష",
      calendar: "వ్యవసాయ క్యాలెండర్",
      schemes: "ప్రభుత్వ పథకాలు",
      expertHelp: "శాస్త్రవేత్త సలహా",
    },
    dashboard: {
      welcome: "నమస్కారం రైతు సోదరా",
      farmOverview: "పొలం వివరాలు మరియు తాజా సూచనలు",
      todayWeather: "నేటి వాతావరణం",
      quickStats: "వ్యవసాయ సారాంశం",
      totalLand: "మొత్తం భూమి",
      activePlots: "సాగులో ఉన్న పంటలు",
      cropHealthScore: "పంట ఆరోగ్య సూచిక",
      estHarvestValue: "అంచనా దిగుబడి విలువ",
      urgentAlerts: "అత్యవసర వ్యవసాయ హెచ్చరికలు",
      quickActions: "శీఘ్ర సేవలు",
      scanDisease: "తెగులు గుర్తింపు",
      checkMandi: "మార్కెట్ ధరలు చూడండి",
      testSoil: "నేల ఆరోగ్య కార్డ్",
      askSahayak: "సహాయకుడిని అడగండి",
      mandiTicker: "లైవ్ మార్కెట్ రేట్లు",
      scheduledTasks: "నేటి వ్యవసాయ పనులు",
    },
    voice: {
      title: "కిసాన్ సహాయక్ AI",
      placeholder: "తెగుళ్ల నివారణ, ఎరువులు, మార్కెట్ ధరలు అడగండి...",
      listening: "వినబడుతోంది... మాట్లాడండి",
      speak: "మాట్లాడండి",
      askQuestion: "ప్రశ్నించండి",
      suggestions: [
        "వరిలో ఆకు ఎండు తెగులు నివారణ ఎలా?",
        "మిరపలో తామర పురుగుల నివారణ మందులేవి?"
      ],
    },
  },
  ta: {
    appName: "கிசான் மித்ரா AI",
    tagline: "உங்கள் அறிவார்ந்த விவசாய தோழன்",
    nav: {
      dashboard: "முகப்பு",
      myFields: "என் வயல்",
      cropDoctor: "பயிர் மருத்துவர்",
      weather: "வானிலை",
      cropHealth: "பயிர் நலம்",
      mandiPrices: "சந்தை விலை",
      soilHealth: "மண் வளம்",
      calendar: "பயிர் நாட்காட்டி",
      schemes: "அரசு திட்டங்கள்",
      expertHelp: "விவசாய நிபுணர்",
    },
    dashboard: {
      welcome: "வணக்கம், விவசாய தோழரே",
      farmOverview: "பண்ணை கண்ணோட்டம்",
      todayWeather: "இன்றைய வானிலை",
      quickStats: "வயல் சுருக்கம்",
      totalLand: "மொத்த நிலம்",
      activePlots: "பயிர்கள்",
      cropHealthScore: "பயிர் நலக் குறியீடு",
      estHarvestValue: "மதிப்பிடப்பட்ட அறுவடை",
      urgentAlerts: "முக்கிய எச்சரிக்கைகள்",
      quickActions: "விரைவு சேவைகள்",
      scanDisease: "நோய் கண்டறிதல்",
      checkMandi: "சந்தை நிலவரம்",
      testSoil: "மண் பரிசோதனை",
      askSahayak: "உதவியாளரிடம் கேளுங்கள்",
      mandiTicker: "நேரலை ஒழுங்குமுறை சந்தை விலை",
      scheduledTasks: "இன்றைய விவசாய பணிகள்",
    },
    voice: {
      title: "கிசான் மித்ரா குரல் AI",
      placeholder: "பூச்சி மேலாண்மை, உரம், சந்தை விலை பற்றி கேளுங்கள்...",
      listening: "கேட்கிறது... பேசுங்கள்",
      speak: "பேசுங்கள்",
      askQuestion: "கேளுங்கள்",
      suggestions: [
        "நெற்பயிரில் இலை சுருட்டுப் புழுவை கட்டுப்படுத்துவது எப்படி?",
        "பருத்திக்கு உகந்த உர அளவு என்ன?"
      ],
    },
  },
  bn: {
    appName: "কিষাণমিত্র AI",
    tagline: "আপনার বিশ্বস্ত ডিজিটাল কৃষি সাথী",
    nav: {
      dashboard: "ড্যাশবোর্ড",
      myFields: "আমার খামার",
      cropDoctor: "ফসল ডাক্তার",
      weather: "আবহাওয়া",
      cropHealth: "ফসলের স্বাস্থ্য",
      mandiPrices: "মান্ডির দাম",
      soilHealth: "মাটি পরীক্ষা",
      calendar: "কৃষি ক্যালেন্ডার",
      schemes: "সরকারি প্রকল্প",
      expertHelp: "কৃষি বিশেষজ্ঞ",
    },
    dashboard: {
      welcome: "নমস্কার, কৃষক ভাই",
      farmOverview: "খামারের বর্তমান অবস্থা",
      todayWeather: "আজকের আবহাওয়া",
      quickStats: "সংক্ষিপ্ত বিবরণ",
      totalLand: "মোট জমি",
      activePlots: "বর্তমান ফসল",
      cropHealthScore: "ফসল স্বাস্থ্য স্কোর",
      estHarvestValue: "আনুমানিক আয়",
      urgentAlerts: "জরুরি কৃষি সতর্কবার্তা",
      quickActions: "দ্রুত সেবা",
      scanDisease: "রোগ নির্ণয় (ছবি তুলুন)",
      checkMandi: "বাজার দর দেখুন",
      testSoil: "মাটি স্বাস্থ্য কার্ড",
      askSahayak: "কৃষি সহায়ককে জিজ্ঞাসা করুন",
      mandiTicker: "লাইভ মান্ডি দর",
      scheduledTasks: "আজকের জরুরি কাজ",
    },
    voice: {
      title: "কিষাণ সহায়ক AI",
      placeholder: "কীটনাশক, সারের পরিমাণ, আবহাওয়া বা মান্ডি দর জানতে চান...",
      listening: "শুনছি... বলুন",
      speak: "বলুন",
      askQuestion: "জিজ্ঞাসা করুন",
      suggestions: [
        "ধানের পাতায় বাদামী দাগ হলে কী করব?",
        "আলু চাষে নাবি ধসা রোগের ওষুধ কী?"
      ],
    },
  },
  gu: {
    appName: "કિસાન મિત્ર AI",
    tagline: "તમારો સ્માર્ટ ખેતી સાથી",
    nav: {
      dashboard: "ડેશબોર્ડ",
      myFields: "મારું ખેતર",
      cropDoctor: "પાક ડોક્ટર",
      weather: "હવામાન",
      cropHealth: "પાક તંદુરસ્તી",
      mandiPrices: "માર્કેટ યાર્ડ ભાવ",
      soilHealth: "જમીન ચકાસણી",
      calendar: "ખેતી કેલેન્ડર",
      schemes: "સરકારી યોજનાઓ",
      expertHelp: "કૃષિ નિષ્ણાત",
    },
    dashboard: {
      welcome: "નમસ્તે, ખેડૂત મિત્ર",
      farmOverview: "ખેતર પરિસ્થિતિ અને સલાહ",
      todayWeather: "આજનું સ્થાનિક હવામાન",
      quickStats: "ખેતી વિગત",
      totalLand: "કુલ જમીન",
      activePlots: "ચાલુ પાક",
      cropHealthScore: "પાક આરોગ્ય સ્કોર",
      estHarvestValue: "અંદાજિત આવક",
      urgentAlerts: "મહત્વપૂર્ણ ચેતવણીઓ",
      quickActions: "ઝડપી સેવાઓ",
      scanDisease: "પાક રોગ ઓળખ",
      checkMandi: "યાર્ડના ભાવ જુઓ",
      testSoil: "સોઈલ હેલ્થ કાર્ડ",
      askSahayak: "કિસાન સહાયકને પૂછો",
      mandiTicker: "લાઈવ APMC બજાર ભાવ",
      scheduledTasks: "આજના ખેતી કાર્યો",
    },
    voice: {
      title: "કિસાન મિત્ર સહાયક AI",
      placeholder: "રોગ નિયંત્રણ, ખાતરનું પ્રમાણ, હવામાન અથવા ભાવ પૂછો...",
      listening: "સાંભળી રહ્યો છું... બોલો",
      speak: "બોલો",
      askQuestion: "પૂછો",
      suggestions: [
        "કપાસમાં ગુલાબી ઈયળ માટે શું કરવું?",
        "મગફળીમાં સફેદ ઘેણનું નિયંત્રણ કેવી રીતે કરવું?"
      ],
    },
  },
};
