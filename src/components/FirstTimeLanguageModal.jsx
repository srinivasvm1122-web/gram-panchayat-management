import React, { useState } from "react";
import { Building2, Globe, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../data/translations";

export const FirstTimeLanguageModal = ({ 
  isOpen, 
  currentLang, 
  onConfirmLanguage,
  t 
}) => {
  if (!isOpen) return null;

  const [selectedLang, setSelectedLang] = useState(currentLang || "en");

  const handleContinue = () => {
    onConfirmLanguage(selectedLang);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-amber-500/30 overflow-hidden transform transition-all">
        
        {/* Top Decorative Banner */}
        <div className="h-2 w-full flex">
          <div className="w-1/3 bg-[#FF9933]"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-[#138808]"></div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Emblem & Portal Icon */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-md flex items-center justify-center flex-shrink-0">
              <div className="w-full h-full bg-gov-900 rounded-[14px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
                Karnataka E-Governance • ಡಿಜಿಟಲ್ ಗ್ರಾಮ
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1 leading-tight">
                Gram Panchayat Digital System
              </h2>
            </div>
          </div>

          <div className="space-y-1 mb-6">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gov-800 flex-shrink-0" />
              <span>Choose Your Preferred Language</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-kannada">
              ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ (Select your language)
            </p>
          </div>

          {/* 6 Language Cards in Native Scripts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {SUPPORTED_LANGUAGES.map((item) => {
              const isSelected = selectedLang === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setSelectedLang(item.code)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all duration-150 relative flex flex-col justify-between ${
                    isSelected
                      ? "bg-amber-500 text-gov-950 border-amber-500 shadow-lg scale-[1.02]"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-lg">{item.flag}</span>
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-gov-950 text-amber-400 flex items-center justify-center font-bold">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300"></span>
                    )}
                  </div>

                  <div>
                    <div className={`text-base font-black leading-tight ${item.fontClass} ${isSelected ? "text-gov-950" : "text-slate-900"}`}>
                      {item.nativeName}
                    </div>
                    <div className={`text-[11px] font-semibold mt-0.5 ${isSelected ? "text-gov-900" : "text-slate-500"}`}>
                      {item.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Notice info */}
          <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-3 mb-6 text-xs text-sky-900 flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5" />
            <p>
              You can change this language anytime from the top bar or settings. Official names and database records remain unchanged.
            </p>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-3.5 px-6 bg-gov-900 hover:bg-gov-800 active:bg-gov-950 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 group hover:shadow-gov-900/30"
          >
            <span>
              {selectedLang === "kn" 
                ? "ಮುಂದುವರಿಯಿರಿ (Continue)" 
                : selectedLang === "hi"
                ? "जारी रखें (Continue)"
                : selectedLang === "mr"
                ? "पुढे चालू ठेवा (Continue)"
                : selectedLang === "ta"
                ? "தொடரவும் (Continue)"
                : selectedLang === "te"
                ? "కొనసాగించండి (Continue)"
                : "Continue to Portal"}
            </span>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>
      </div>
    </div>
  );
};

export default FirstTimeLanguageModal;
