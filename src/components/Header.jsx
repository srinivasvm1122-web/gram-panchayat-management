import React from "react";
import { 
  Building2, 
  ShieldCheck, 
  Cloud, 
  CloudOff, 
  LogOut, 
  UserCheck, 
  Menu, 
  X, 
  Download,
  Users,
  Lock,
  ArrowRight,
  Globe
} from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";

export const Header = ({ 
  lang, 
  setLang, 
  t, 
  currentUser, 
  isOfficer,
  onNavigateToLogin,
  onLogout,
  setIsFirebaseModalOpen,
  isFirebaseConnected,
  mobileMenuOpen,
  setMobileMenuOpen,
  onQuickExportMaster
}) => {
  return (
    <header className="bg-gradient-to-r from-gov-950 via-gov-900 to-gov-800 text-white shadow-lg sticky top-0 z-40 border-b border-amber-500/30">
      {/* Tricolor Subtle Accent Bar */}
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official Emblem & Portal Title */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-gov-900 flex items-center justify-center border border-amber-300/40">
                  <Building2 className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full w-3.5 h-3.5 border-2 border-gov-900" title="System Online"></div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {lang === "kn" 
                    ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರ" 
                    : lang === "hi" 
                    ? "कर्नाटक सरकार" 
                    : lang === "mr" 
                    ? "कर्नाटक शासन" 
                    : lang === "ta" 
                    ? "கர்நாடக அரசு" 
                    : lang === "te" 
                    ? "కర్ణాటక ప్రభుత్వం" 
                    : "Govt. of Karnataka"}
                </span>
                <span className="text-[11px] text-slate-300 hidden md:inline">
                  RDPR Department
                </span>
              </div>
              <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white leading-tight mt-0.5">
                {t.appTitle}
              </h1>
              <p className="text-[11px] sm:text-xs text-sky-200/90 font-medium">
                {t.panchayatName}
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* Multilingual 6-Language Selector Dropdown */}
            <LanguageSelector 
              currentLang={lang} 
              onSelectLanguage={setLang} 
              variant="dropdown" 
            />

            {/* Quick Master PDF Export */}
            <button
              onClick={onQuickExportMaster}
              className="px-3 py-1.5 rounded-xl bg-sky-900/60 hover:bg-sky-800 text-sky-100 text-xs font-medium border border-sky-600/50 flex items-center space-x-1.5 transition"
              title="Download Master PDF Report"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === "kn" ? "PDF ವರದಿ" : "PDF Report"}</span>
            </button>

            {/* Firestore Status Pill */}
            <button
              onClick={() => setIsFirebaseModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-gov-950/70 hover:bg-gov-950 text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition"
              title="Configure Cloud Firestore Database"
            >
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Firestore Active</span>
            </button>

            {/* Role & Access Badge */}
            {isOfficer ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-700">
                <div className="text-right">
                  <div className="text-xs font-black text-white flex items-center justify-end space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentUser.name}</span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-bold bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-300 hover:text-red-300 transition"
                  title="Log Out to Public View"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-700">
                <div className="text-right">
                  <div className="text-[11px] font-bold text-slate-300 flex items-center space-x-1">
                    <Users className="w-3 h-3 text-sky-300" />
                    <span>Public Citizen</span>
                  </div>
                  <span className="text-[9px] text-sky-300 font-semibold bg-sky-400/10 px-1.5 py-0.2 rounded">
                    {t.readOnlyBadge}
                  </span>
                </div>
                <button
                  onClick={() => onNavigateToLogin("officer")}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gov-950 font-extrabold text-xs shadow-md transition flex items-center space-x-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t.officerLoginBtn}</span>
                </button>
              </div>
            )}

          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center space-x-2 lg:hidden">
            <LanguageSelector 
              currentLang={lang} 
              onSelectLanguage={setLang} 
              variant="dropdown" 
            />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gov-800 text-slate-200 hover:text-white border border-slate-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
