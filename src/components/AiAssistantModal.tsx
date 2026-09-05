import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  User,
  CornerDownLeft,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useFarm } from '../context/FarmContext';
import { ChatMessage } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const { farmer, selectedField, language } = useFarm();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `नमस्ते ${farmer.name.split(' ')[0]} जी! 🙏 मैं **किसानमित्र AI (KisanMitra)** हूँ। आप मुझसे मौसम, खाद की मात्रा, फसल के रोग, मंडी भाव या सरकारी योजनाओं के बारे में अपनी भाषा में पूछ या बोल सकते हैं। आज मैं आपकी क्या सहायता कर सकता हूँ?`,
      timestamp: 'Just now',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedQuestions = [
    'गेहूं में पहली सिंचाई और यूरिया की मात्रा?',
    'प्याज में जलेबी रोग और थ्रिप्स का तुरंत इलाज?',
    'कल खेत में कीटनाशक स्प्रे करना चाहिए?',
    'लासलगांव मंडी में प्याज का आज का भाव क्या है?',
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle Speech-to-Text
  const handleToggleMic = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Handle Text-to-Speech playback of AI message
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown formatting for cleaner audio
    const plainText = text.replace(/[*_#`[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Send message to Gemini server endpoint
  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputMessage).trim();
    if (!content || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: content,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const farmContextStr = `Farmer: ${farmer.name}, Village: ${farmer.village}, District: ${farmer.district}, State: ${farmer.state}, Total Land: ${farmer.totalLandAcres} Acres. Current Active Crop: ${selectedField?.currentCrop || 'Wheat'} at ${selectedField?.growthStage || 'Tillering'} stage. Preferred Language: ${language}.`;

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          farmContext: farmContextStr,
        }),
      });

      const data = await response.json();
      const aiReply =
        data.reply ||
        'धन्यवाद! आपके सवाल का विश्लेषण किया गया है। वर्तमान मौसम और खेत की स्थिति अनुसार संतुलित सिंचाई एवं अनुशंसित उर्वरक का प्रयोग करें।';

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: 'Just now',
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'माफ़ कीजिए, सर्वर से संपर्क नहीं हो पाया। कृपया पुनः प्रयास करें। सामान्य सलाह: 25-30 दिन पर गेहूं में पहली सिंचाई (CRI Stage) एवं 1 बोरी यूरिया प्रति एकड़ का प्रयोग करें।',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[90vh] max-h-[720px] shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 bg-emerald-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-base tracking-tight">KisanMitra AI Assistant</h2>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-emerald-200">
                24/7 Smart Agronomist • Voice & Text Multi-lingual
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-50/50">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white border border-stone-200/90 text-stone-800 rounded-tl-xs shadow-xs'
                }`}
              >
                <div className="prose prose-sm max-w-none prose-emerald">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2 text-[10px] opacity-70">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Speak / सुनाएं</span>
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-stone-500 bg-white p-3 rounded-2xl border border-stone-200 w-fit">
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>KisanMitra is analyzing agronomy database & weather...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Question Prompts */}
        <div className="px-4 py-2 border-t border-stone-200/70 bg-white flex items-center gap-1.5 overflow-x-auto shrink-0">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap">
            Ask:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Bottom Input Field & Voice Controls */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200 shrink-0">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Mic button */}
            <button
              type="button"
              onClick={handleToggleMic}
              className={`p-2.5 rounded-2xl transition cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
              title="Speak in Hindi/English"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              placeholder={
                isListening
                  ? 'Listening... speak clearly into mic...'
                  : 'Ask about crops, fertilizers, mandi, or diseases...'
              }
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white transition cursor-pointer disabled:opacity-40 shrink-0 shadow-xs"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
