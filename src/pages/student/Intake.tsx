import React, { useState } from 'react';
import { useApp } from '../../app/AppContext';
import { INITIAL_INTENT_OPTIONS, CONTEXT_FOLLOW_UPS } from '../../data/intentConfig';
import { SupportDomain } from '../../types/support';
import { runTriage } from '../../services/triage';
import { DotsConnectedCard } from '../../components/student/DotsConnectedCard';
import { CareContextCard } from '../../components/student/CareContextCard';
import { VoiceIntakeModal } from '../../components/student/VoiceIntakeModal';
import {
  Mic,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const Intake: React.FC = () => {
  const { state, dispatch, activeStudent } = useApp();

  // Intake State
  const [selectedInitialIds, setSelectedInitialIds] = useState<string[]>([]);
  const [clarifications, setClarifications] = useState<Record<string, string[]>>({});
  const [freeText, setFreeText] = useState('');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // Workflow steps: 'canvas' | 'dots' | 'care_context'
  const [currentStep, setCurrentStep] = useState<'canvas' | 'dots' | 'care_context'>('canvas');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick preset loader for Primary Demo Scenario:
  // "I've been missing classes and assignments lately, and I'm also worried about money. I don't know who I should talk to."
  const loadPrimaryDemoScenario = () => {
    setSelectedInitialIds(['studies', 'money']);
    setClarifications({
      academic: ['acad-falling-behind', 'acad-assignments'],
      financial: ['fin-tuition'],
    });
    setFreeText(
      "I've been missing classes and assignments lately, and I'm also worried about money. I don't know who I should talk to."
    );
  };

  // Toggle initial selection
  const handleToggleInitial = (id: string) => {
    setSelectedInitialIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle clarification sub-option
  const handleToggleClarification = (domain: SupportDomain, optionId: string) => {
    setClarifications((prev) => {
      const currentList = prev[domain] || [];
      const updated = currentList.includes(optionId)
        ? currentList.filter((item) => item !== optionId)
        : [...currentList, optionId];
      return { ...prev, [domain]: updated };
    });
  };

  // Identify selected domains
  const selectedDomains: SupportDomain[] = selectedInitialIds
    .map((id) => INITIAL_INTENT_OPTIONS.find((opt) => opt.id === id)?.domain)
    .filter((d): d is SupportDomain => Boolean(d));

  // Triage preview
  const triagePreview = runTriage({
    selectedConcerns: selectedInitialIds.map(
      (id) => INITIAL_INTENT_OPTIONS.find((opt) => opt.id === id)?.label || id
    ),
    clarifications,
    freeText,
  });

  // Handle Voice Apply
  const handleApplyVoice = (transcriptText: string, identifiedDomainIds: string[]) => {
    setFreeText(transcriptText);

    // Map identified domains back to initial options
    const newInitialIds = new Set(selectedInitialIds);
    identifiedDomainIds.forEach((domain) => {
      const match = INITIAL_INTENT_OPTIONS.find((opt) => opt.domain === domain);
      if (match) {
        newInitialIds.add(match.id);
      }
    });

    if (newInitialIds.size === 0 && transcriptText.trim()) {
      newInitialIds.add('other');
    }

    setSelectedInitialIds(Array.from(newInitialIds));
  };

  // Handle Next step from Canvas
  const handleProceedFromCanvas = () => {
    if (selectedInitialIds.length === 0 && !freeText.trim()) return;

    if (triagePreview.isMultiNeed) {
      setCurrentStep('dots');
    } else {
      setCurrentStep('care_context');
    }
  };

  // Handle final submission
  const handleConfirmSubmission = () => {
    setIsSubmitting(true);

    const selectedConcernLabels = selectedInitialIds.map(
      (id) => INITIAL_INTENT_OPTIONS.find((opt) => opt.id === id)?.label || id
    );

    setTimeout(() => {
      dispatch({
        type: 'CREATE_CASE',
        payload: {
          studentId: activeStudent.id,
          studentName: activeStudent.name,
          selectedConcerns: selectedConcernLabels,
          clarifications,
          freeText: freeText.trim() ? freeText : undefined,
        },
      });
      setIsSubmitting(false);
    }, 400);
  };

  const handleReset = () => {
    setSelectedInitialIds([]);
    setClarifications({});
    setFreeText('');
    setCurrentStep('canvas');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
      {/* Voice Modal */}
      <VoiceIntakeModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onApplyVoiceTranscript={handleApplyVoice}
      />

      {/* STEP 1: Smart Intent Canvas */}
      {currentStep === 'canvas' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Hero Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 mb-2">
                <Sparkles size={13} />
                <span>Guided Support Intake</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight">
                What's going on?
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                UniCare replaces the university support maze with a guided intake that turns a student's situation into an actionable care context for staff.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Voice button */}
              <button
                type="button"
                onClick={() => setIsVoiceOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-slate-400 shadow-xs transition-colors cursor-pointer"
              >
                <Mic size={15} className="text-brand-600" />
                <span>Talk to UniCare</span>
              </button>

              {/* Demo auto-fill scenario button */}
              <button
                type="button"
                onClick={loadPrimaryDemoScenario}
                title="Fill primary hackathon demo scenario (Academic + Financial + Overwhelmed)"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-navy-50 text-navy-900 border border-navy-200 text-xs font-semibold hover:bg-navy-100 transition-colors cursor-pointer"
              >
                <span>Demo Scenario</span>
              </button>
            </div>
          </div>

          {/* Primary Intent Canvas: Multi-select Cards */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select all that apply:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INITIAL_INTENT_OPTIONS.map((option) => {
                const isSelected = selectedInitialIds.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleToggleInitial(option.id)}
                    className={`flex items-center justify-between p-4 rounded-xl text-left border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/60 shadow-xs ring-1 ring-brand-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? 'text-brand-950 font-semibold' : 'text-slate-800'
                      }`}
                    >
                      {option.label}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ml-3 transition-colors ${
                        isSelected
                          ? 'bg-brand-600 text-white'
                          : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progressive Disclosure: Context-Aware Follow-ups */}
          {selectedDomains.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Follow-up details (Optional)
                </span>
                <span className="text-[11px] text-slate-500">
                  — Helps staff prepare before contacting you
                </span>
              </div>

              {selectedDomains.map((domain) => {
                const followUp = CONTEXT_FOLLOW_UPS[domain];
                if (!followUp) return null;
                const activeClarifications = clarifications[domain] || [];

                return (
                  <div
                    key={domain}
                    className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-navy-950">{followUp.question}</h3>
                      {followUp.subtitle && (
                        <p className="text-xs text-slate-500 mt-0.5">{followUp.subtitle}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {followUp.options.map((opt) => {
                        const isChecked = activeClarifications.includes(opt.id);
                        return (
                          <label
                            key={opt.id}
                            className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer select-none transition-colors ${
                              isChecked
                                ? 'bg-white border-brand-500 font-semibold text-brand-900 shadow-xs'
                                : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleClarification(domain, opt.id)}
                              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                            />
                            <span>{opt.label}</span>
                            {opt.urgencyIndicator && (
                              <span className="ml-auto text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                                Urgent
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Free Text Area (Optional) */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <label
              htmlFor="free-text-intake"
              className="text-xs font-bold uppercase tracking-wider text-slate-500 block"
            >
              Anything else you'd like us to know? (Optional)
            </label>
            <textarea
              id="free-text-intake"
              rows={3}
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="Feel free to write in your own words. You do not need to diagnose yourself or use administrative terms."
              className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 bg-white placeholder-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all leading-relaxed"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            {(selectedInitialIds.length > 0 || freeText.trim()) && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                <RotateCcw size={14} />
                <span>Clear Selections</span>
              </button>
            )}

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={handleProceedFromCanvas}
                disabled={selectedInitialIds.length === 0 && !freeText.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 active:bg-navy-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
              >
                <span>Continue to Support Pathway</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: "We've connected the dots" Recommendation */}
      {currentStep === 'dots' && (
        <DotsConnectedCard
          triageResult={triagePreview}
          onBack={() => setCurrentStep('canvas')}
          onProceed={() => setCurrentStep('care_context')}
        />
      )}

      {/* STEP 3: Actionable Care Context Review & Submission */}
      {currentStep === 'care_context' && (
        <CareContextCard
          student={activeStudent}
          selectedConcerns={selectedInitialIds.map(
            (id) => INITIAL_INTENT_OPTIONS.find((opt) => opt.id === id)?.label || id
          )}
          clarifications={clarifications}
          freeText={freeText}
          triageResult={triagePreview}
          isSubmitting={isSubmitting}
          onEdit={() => setCurrentStep('canvas')}
          onConfirm={handleConfirmSubmission}
        />
      )}
    </div>
  );
};
