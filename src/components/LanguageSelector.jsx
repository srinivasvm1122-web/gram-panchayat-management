import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../data/translations";

export const LanguageSelector = ({ 
  currentLang = "en", 
  onSelectLanguage, 
  variant = "dropdown", // "dropdown" | "grid" | "modal" | "inline"
  showLabel = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const activeLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const handleSelect = (code) => {
    onSelectLanguage(code);
    setIsOpen(false);
  };

  // Grid variant: Ideal for Dashboard and Settings
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {SUPPORTED_LANGUAGES.map((item) => {
          const isSelected = item.code === currentLang;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => handleSelect(item.code)}
              className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between relative group ${
                isSelected
                  ? "bg-amber-500 text-gov-950 border-amber-400 shadow-md font-bold ring-2 ring-amber-400/50"
                  : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 hover:border-slate-300 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold">{item.flag}</span>
                {isSelected && (
                  <span className="bg-gov-950 text-amber-400 p-0.5 rounded-full">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="mt-1.5">
                <div className={`text-base font-extrabold leading-tight ${item.fontClass}`}>
                  {item.nativeName}
                </div>
                <div className={`text-[11px] ${isSelected ? "text-gov-900 font-semibold" : "text-slate-500"}`}>
                  {item.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Inline / Pills variant: Compact row of languages
  if (variant === "inline") {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {SUPPORTED_LANGUAGES.map((item) => {
          const isSelected = item.code === currentLang;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => handleSelect(item.code)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${item.fontClass} ${
                isSelected
                  ? "bg-amber-500 text-gov-950 shadow-sm ring-1 ring-amber-400"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <span>{item.nativeName}</span>
              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: Dropdown variant (Header bar)
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 rounded-xl bg-gov-950/80 hover:bg-gov-950 text-white text-xs font-semibold border border-amber-500/40 hover:border-amber-400 flex items-center space-x-2 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change Language / ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ"
      >
        <Globe className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-spin-slow" />
        <span className={`text-xs font-bold text-amber-300 ${activeLangObj.fontClass}`}>
          {activeLangObj.nativeName}
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl bg-white border border-slate-200 ring-1 ring-black/5 divide-y divide-slate-100 z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3.5 py-2.5 bg-slate-50 rounded-t-2xl border-b border-slate-100">
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 flex items-center justify-between">
              <span>Select Language</span>
              <span className="font-kannada">ಭಾಷೆ ಆಯ್ಕೆ</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Choose interface language
            </p>
          </div>

          <div className="py-1 max-h-80 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((item) => {
              const isSelected = item.code === currentLang;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition hover:bg-slate-100 ${
                    isSelected ? "bg-amber-50 text-gov-950 font-bold" : "text-slate-700"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">{item.flag}</span>
                    <div>
                      <div className={`text-sm font-bold text-slate-900 ${item.fontClass}`}>
                        {item.nativeName}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {item.name} • {item.subtext}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-gov-950 flex items-center justify-center font-bold shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
