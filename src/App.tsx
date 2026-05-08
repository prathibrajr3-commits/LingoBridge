/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Languages, 
  ArrowRightLeft, 
  Copy, 
  Volume2, 
  Check, 
  Loader2, 
  History, 
  Trash2,
  Sparkles,
  Globe,
  Mic,
  MicOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translateText, TranslationResult } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LANGUAGES = [
  { code: 'auto', name: 'Detect Language' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'kn', name: 'Kannada' },
];

interface HistoryItem {
  id: string;
  source: string;
  target: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
}

export default function App() {
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('translation_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
        
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
          handleTranslate(transcript);
        }, 1000);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        // Set language if not auto
        if (sourceLang !== 'auto') {
          recognitionRef.current.lang = sourceLang;
        }
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  };

  const handleTranslate = async (text: string = inputText) => {
    if (!text.trim()) {
      setResult(null);
      return;
    }

    setIsLoading(true);
    try {
      const translation = await translateText(text, targetLang, sourceLang);
      setResult(translation);
      
      // Add to history
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        source: text,
        target: translation.translatedText,
        sourceLang: translation.detectedLanguage || sourceLang,
        targetLang,
        timestamp: Date.now(),
      };
      
      const updatedHistory = [newItem, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      localStorage.setItem('translation_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputText(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    if (value.trim()) {
      debounceTimer.current = setTimeout(() => {
        handleTranslate(value);
      }, 1000);
    } else {
      setResult(null);
    }
  };

  const swapLanguages = () => {
    if (sourceLang === 'auto') return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (result) {
      setInputText(result.translatedText);
      handleTranslate(result.translatedText);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('translation_history');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Languages size={24} />
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-zinc-900">LingoBridge</h1>
        </div>
        
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 hover:bg-zinc-200 rounded-full transition-colors text-zinc-600"
          title="History"
        >
          <History size={20} />
        </button>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Translation Area */}
        <div className={cn("lg:col-span-8 space-y-6", showHistory ? "lg:col-span-8" : "lg:col-span-12")}>
          <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
            {/* Language Selectors */}
            <div className="flex items-center justify-between px-6 py-4 border-bottom border-zinc-100 bg-zinc-50/50">
              <div className="flex items-center gap-2 flex-1">
                <select 
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="bg-transparent font-medium text-sm text-zinc-600 focus:outline-none cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={swapLanguages}
                disabled={sourceLang === 'auto'}
                className="p-2 hover:bg-zinc-200 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed mx-4"
              >
                <ArrowRightLeft size={18} className="text-zinc-400" />
              </button>

              <div className="flex items-center gap-2 flex-1 justify-end">
                <select 
                  value={targetLang}
                  onChange={(e) => {
                    setTargetLang(e.target.value);
                    if (inputText) handleTranslate();
                  }}
                  className="bg-transparent font-medium text-sm text-zinc-600 focus:outline-none cursor-pointer hover:text-indigo-600 transition-colors text-right"
                >
                  {LANGUAGES.filter(l => l.code !== 'auto').map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input/Output Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
              {/* Input */}
              <div className="p-6 min-h-[240px] flex flex-col">
                <textarea
                  value={inputText}
                  onChange={onInputChange}
                  placeholder="Enter text to translate..."
                  className="w-full flex-1 resize-none bg-transparent text-xl font-medium placeholder:text-zinc-300 focus:outline-none"
                />
                <div className="flex justify-between items-center mt-4 text-zinc-400">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono">{inputText.length} / 5000</span>
                    <button 
                      onClick={toggleListening}
                      className={cn(
                        "p-2 rounded-full transition-all flex items-center justify-center",
                        isListening 
                          ? "bg-red-100 text-red-600 animate-pulse" 
                          : "hover:bg-zinc-100 text-zinc-400 hover:text-indigo-600"
                      )}
                      title={isListening ? "Stop Listening" : "Start Voice Input"}
                    >
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                  </div>
                  {inputText && (
                    <button 
                      onClick={() => { setInputText(''); setResult(null); }}
                      className="text-xs hover:text-zinc-600 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Output */}
              <div className="p-6 min-h-[240px] bg-zinc-50/30 flex flex-col relative">
                {isLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                  </div>
                ) : result ? (
                  <div className="flex-1 flex flex-col">
                    <div className="text-xl font-medium text-zinc-900 leading-relaxed">
                      {result.translatedText}
                    </div>
                    
                    {result.pronunciation && (
                      <div className="mt-2 text-sm text-zinc-500 italic flex items-center gap-2">
                        <Volume2 size={14} />
                        {result.pronunciation}
                      </div>
                    )}

                    {result.notes && (
                      <div className="mt-4 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 text-xs text-indigo-700 flex gap-2">
                        <Sparkles size={14} className="shrink-0 mt-0.5" />
                        <p>{result.notes}</p>
                      </div>
                    )}

                    <div className="mt-auto pt-4 flex justify-end gap-2">
                      <button 
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-zinc-200 rounded-lg transition-all text-zinc-500 flex items-center gap-2 text-xs font-medium"
                      >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-zinc-300">
                    <Globe size={48} strokeWidth={1} className="mb-4 opacity-20" />
                    <p className="text-sm font-medium">Translation will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features / Tips */}
          {!result && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                { icon: <Sparkles className="text-amber-500" />, title: "Context Aware", desc: "Understands nuances and idioms." },
                { icon: <Globe className="text-blue-500" />, title: "Any Language", desc: "Supports 100+ languages globally." },
                { icon: <History className="text-indigo-500" />, title: "History", desc: "Your recent translations are saved." }
              ].map((f, i) => (
                <div key={i} className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
                  <div className="mb-2">{f.icon}</div>
                  <h3 className="font-bold text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-zinc-500">{f.desc}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <motion.aside 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-4 bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col h-fit max-h-[80vh]"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                <h2 className="font-display font-bold text-lg">History</h2>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Clear
                  </button>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {history.length === 0 ? (
                  <div className="py-12 text-center text-zinc-400">
                    <History size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No history yet</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => {
                        setInputText(item.source);
                        setSourceLang(item.sourceLang);
                        setTargetLang(item.targetLang);
                        handleTranslate(item.source);
                      }}
                      className="w-full text-left p-4 rounded-2xl hover:bg-zinc-50 border border-transparent hover:border-zinc-100 transition-all group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          {item.sourceLang} → {item.targetLang}
                        </span>
                        <span className="text-[10px] text-zinc-300">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-zinc-900 line-clamp-1 mb-1">{item.source}</p>
                      <p className="text-xs text-zinc-500 line-clamp-1">{item.target}</p>
                    </button>
                  ))
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto pt-12 pb-6 text-zinc-400 text-xs font-medium">
        Powered by Gemini AI • Built with Precision
      </footer>
    </div>
  );
}
