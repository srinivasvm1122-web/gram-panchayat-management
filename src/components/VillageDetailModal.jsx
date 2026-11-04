import React from "react";
import { 
  Building2, 
  X, 
  Users, 
  HeartHandshake, 
  Home, 
  CreditCard, 
  Vote, 
  Phone, 
  Printer, 
  FileSpreadsheet,
  CheckCircle2,
  MapPin,
  Calendar
} from "lucide-react";

export const VillageDetailModal = ({ village, onClose, t, lang, onPrintVillage }) => {
  if (!village) return null;

  const turnout = village.totalVoters > 0 
    ? ((village.votesCast / village.totalVoters) * 100).toFixed(1) 
    : 0;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Modal Top Header */}
        <div className="p-6 bg-gradient-to-r from-gov-950 via-gov-900 to-gov-800 text-white rounded-t-2xl border-b border-amber-500/30">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <span>Ward No. {village.wardNo}</span>
                <span>•</span>
                <span>{village.id}</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                {village.nameEn}
              </h2>
              <p className="text-sm text-sky-200 font-kannada">
                {village.nameKn} ಗ್ರಾಮ ಪಂಚಾಯತಿ ವಾರ್ಡ್ ದಾಖಲೆ
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gov-800/80 hover:bg-gov-700 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* Key Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">
                {t.totalPopulation}
              </span>
              <span className="text-xl font-black text-slate-900">
                {village.totalPopulation.toLocaleString()}
              </span>
            </div>

            <div className="bg-teal-50 p-3.5 rounded-xl border border-teal-100">
              <span className="text-[11px] font-bold text-teal-800 uppercase block">
                {t.livingMembers}
              </span>
              <span className="text-xl font-black text-teal-900">
                {village.livingMembers.toLocaleString()}
              </span>
            </div>

            <div className="bg-cyan-50 p-3.5 rounded-xl border border-cyan-100">
              <span className="text-[11px] font-bold text-cyan-800 uppercase block">
                {t.totalFamilies}
              </span>
              <span className="text-xl font-black text-cyan-900">
                {village.totalFamilies}
              </span>
            </div>

            <div className="bg-purple-50 p-3.5 rounded-xl border border-purple-100">
              <span className="text-[11px] font-bold text-purple-800 uppercase block">
                {t.votingTurnout}
              </span>
              <span className="text-xl font-black text-purple-900">
                {turnout}%
              </span>
            </div>
          </div>

          {/* Demographic Breakdown: Male vs Female */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center space-x-2">
              <Users className="w-4 h-4 text-gov-800" />
              <span>{lang === "kn" ? "ಜನಸಂಖ್ಯಾ ಲಿಂಗ ಅನುಪಾತ" : "Gender & Living Population Breakdown"}</span>
            </h4>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-900 font-bold">{t.maleMembers}</div>
                <div className="text-lg font-extrabold text-blue-950 mt-0.5">{village.maleMembers}</div>
                <div className="text-[11px] text-blue-700">
                  {village.totalPopulation > 0 ? ((village.maleMembers / village.totalPopulation) * 100).toFixed(1) : 0}% of Population
                </div>
              </div>

              <div className="p-3 bg-pink-50 rounded-lg">
                <div className="text-pink-900 font-bold">{t.femaleMembers}</div>
                <div className="text-lg font-extrabold text-pink-950 mt-0.5">{village.femaleMembers}</div>
                <div className="text-[11px] text-pink-700">
                  {village.totalPopulation > 0 ? ((village.femaleMembers / village.totalPopulation) * 100).toFixed(1) : 0}% of Population
                </div>
              </div>
            </div>
          </div>

          {/* Ration Card Registry: APL vs BPL */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-amber-700" />
              <span>{lang === "kn" ? "ಪಡಿತರ ಚೀಟಿ ಫಲಾನುಭವಿಗಳ ವಿವರಣೆ" : "Ration Cards (APL & BPL Classification)"}</span>
            </h4>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-100">
                <div className="text-cyan-900 font-bold">{t.aplCardCount}</div>
                <div className="text-lg font-black text-cyan-950 mt-0.5">{village.aplCardCount}</div>
                <div className="text-[11px] text-cyan-700">
                  Above Poverty Line Households
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className="text-amber-900 font-bold">{t.bplCardCount}</div>
                <div className="text-lg font-black text-amber-950 mt-0.5">{village.bplCardCount}</div>
                <div className="text-[11px] text-amber-700">
                  Below Poverty Line / NFSA Beneficiaries
                </div>
              </div>
            </div>
          </div>

          {/* Voter & Election Turnout */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center space-x-2">
              <Vote className="w-4 h-4 text-purple-700" />
              <span>{lang === "kn" ? "ಮತದಾರರ ನೋಂದಣಿ ಮತ್ತು ಮತದಾನ" : "Electoral Registration & Voting Turnout"}</span>
            </h4>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <div className="text-slate-500 font-bold">{t.totalVoters}</div>
                <div className="text-base font-extrabold text-slate-900">{village.totalVoters}</div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg">
                <div className="text-slate-500 font-bold">{t.maleVoters} / {t.femaleVoters}</div>
                <div className="text-base font-extrabold text-slate-900">{village.maleVoters} / {village.femaleVoters}</div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-lg">
                <div className="text-emerald-800 font-bold">{t.votesCast}</div>
                <div className="text-base font-extrabold text-emerald-950">{village.votesCast} ({turnout}%)</div>
              </div>
            </div>
          </div>

          {/* Sarpanch / Elected Member Info & Notes */}
          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-900 uppercase">{t.sarpanch}:</span>
              <span className="font-extrabold text-slate-900 text-sm">{village.sarpanchName}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span>Official Phone:</span>
              <span className="font-mono font-semibold">{village.sarpanchContact}</span>
            </div>
            {village.notes && (
              <p className="text-xs text-slate-600 pt-2 border-t border-amber-200/60 leading-relaxed italic">
                "{village.notes}"
              </p>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gov-900 text-white font-bold text-xs sm:text-sm hover:bg-gov-800 transition"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};
