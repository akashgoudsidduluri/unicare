import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Check, AlertCircle } from 'lucide-react';
import { runTriage } from '../../services/triage';
import { TriageResult } from '../../types/triage';

interface VoiceIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVoiceTranscript: (transcript: string, identifiedDomains: string[]) => void;
}

// Preset realistic spoken prompts for instant testing during demo
const VOICE_DEMO_PRESETS = [
  {
    title: 'Primary Demo Scenario (Academic + Financial)',
    text: "I've been missing classes and assignments lately, and I'm also worried about money. I don't know who I should talk to.",
  },
  {
    title: 'Coursework Difficulties (Academic)',
    text: "I'm struggling to understand my coursework and I've missed two assignments.",
  },
  {
    title: 'Hostel Accommodation Issue (Housing)',
    text: "I'm having trouble with my hostel accommodation heating and maintenance.",
  },
  {
    title: 'Overwhelmed & Exhausted (Wellbeing + Academic)',
    text: "I've been feeling overwhelmed and I'm struggling to keep up with everything.",
  },
];

export const VoiceIntakeModal: React.FC<VoiceIntakeModalProps> = ({
  isOpen,
  onClose,
  onApplyVoiceTranscript,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [aiResponseText, setAiResponseText] = useState<string | null>(null);
  const [analyzedTriage, setAnalyzedTriage] = useState<TriageResult | null>(null);
  const [isSpeakingResponse, setIsSpeakingResponse] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API availability
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setTranscript(currentTranscript);
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition status:', err.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        setVoiceSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!voiceSupported || !recognitionRef.current) {
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
      if (transcript.trim()) {
        processVoiceTranscript(transcript);
      }
    } else {
      setTranscript('');
      setAiResponseText(null);
      setAnalyzedTriage(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start recognition:', err);
        setIsListening(false);
      }
    }
  };

  const processVoiceTranscript = (text: string) => {
    const triage = runTriage({
      selectedConcerns: [],
      clarifications: {},
      freeText: text,
    });

    setAnalyzedTriage(triage);

    const detectedLabels = triage.needs.map((n) => n.label.replace(' Support', '').toLowerCase());
    let spokenReply = '';
    if (detectedLabels.length > 1) {
      spokenReply = `I understand. It sounds like you're dealing with both ${detectedLabels.join(' and ')} concerns. Is that right?`;
    } else if (detectedLabels.length === 1) {
      spokenReply = `I hear you. It sounds like you need support with ${detectedLabels[0]}. Is that right?`;
    } else {
      spokenReply = 'Thank you for sharing. We will connect you to central student support.';
    }

    setAiResponseText(spokenReply);

    // Speak aloud using Web Speech Synthesis if available
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(spokenReply);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeakingResponse(true);
      utterance.onend = () => setIsSpeakingResponse(false);
      utterance.onerror = () => setIsSpeakingResponse(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectPreset = (text: string) => {
    setTranscript(text);
    processVoiceTranscript(text);
  };

  const handleApplyToCanvas = () => {
    if (!transcript.trim()) return;
    const domainIds = analyzedTriage ? analyzedTriage.needs.map((n) => n.domain) : [];
    onApplyVoiceTranscript(transcript, domainIds);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center">
              <Mic size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy-950">Talk to UniCare</h3>
              <p className="text-xs text-slate-500">Optional voice guided intake</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!voiceSupported && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>
                Microphone speech recognition is not supported in this browser environment. You can
                use the quick voice demo scenarios below or type in the intake canvas.
              </span>
            </div>
          )}

          {/* Active listening microphone button */}
          <div className="flex flex-col items-center justify-center py-4">
            <button
              onClick={toggleListening}
              disabled={!voiceSupported}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                isListening
                  ? 'bg-rose-600 text-white ring-8 ring-rose-100 animate-pulse'
                  : 'bg-navy-900 text-white hover:bg-navy-800 hover:scale-105'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </button>

            <span className="text-xs font-semibold text-slate-700 mt-3">
              {isListening ? 'Listening... click again when done speaking' : 'Click microphone to speak'}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">
              Natural speech is converted to structured support categories
            </span>
          </div>

          {/* Spoken Transcript Area */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">
              Live Transcript:
            </label>
            <div className="min-h-16 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed font-normal">
              {transcript ? transcript : <span className="text-slate-400 italic">No speech recorded yet. Speak above or pick a demo scenario below.</span>}
            </div>
          </div>

          {/* AI Structured Confirmation & Audio Reply */}
          {aiResponseText && analyzedTriage && (
            <div className="p-4 bg-brand-50/70 border border-brand-200 rounded-xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                  <Volume2 size={15} className={isSpeakingResponse ? 'text-brand-600 animate-bounce' : 'text-slate-500'} />
                  UniCare Response:
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Triage Engine</span>
              </div>

              <p className="text-xs text-slate-800 font-medium italic">
                "{aiResponseText}"
              </p>

              {/* Identified categories from voice */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Detected needs:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analyzedTriage.needs.map((need) => (
                    <span
                      key={need.domain}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-white border border-brand-300 text-brand-900"
                    >
                      <Check size={12} className="text-emerald-600" />
                      {need.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Demo Scenario Presets */}
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-2">
              Or test with realistic spoken demo presets:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {VOICE_DEMO_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset.text)}
                  className="text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors text-xs cursor-pointer"
                >
                  <p className="font-semibold text-slate-800 line-clamp-1">{preset.title}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">"{preset.text}"</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-md hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleApplyToCanvas}
            disabled={!transcript.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-900 text-white rounded-lg text-xs font-semibold hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Apply to Smart Canvas</span>
            <Check size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
