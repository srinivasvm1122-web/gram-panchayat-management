import React from "react";
import { 
  CreditCard, 
  Download, 
  FileSpreadsheet, 
  ShoppingBag, 
  Users, 
  CheckCircle2, 
  Building2,
  ChevronRight,
  TrendingUp
} from "lucide-react";

export const RationCardSummary = ({ 
  villages, 
  stats, 
  t, 
  lang,
  onExportExcel,
  onExportPdf
}) => {
  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-800 uppercase tracking-wide">
              <ShoppingBag className="w-4 h-4 text-cyan-700" />
              <span>Food, Civil Supplies & Consumer Affairs Dept.</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {t.rationTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {t.rationSubtitle}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onExportExcel}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-300 transition flex items-center space-x-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Download Excel</span>
            </button>
            <button
              onClick={onExportPdf}
              className="px-3.5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4 text-cyan-200" />
              <span>PDF Summary</span>
            </button>
          </div>
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase block">
              {t.totalFamilies}
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {(stats.totalFamilies || 0).toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Registered in 10 Panchayat Villages
            </span>
          </div>

          <div className="bg-cyan-50/70 p-4 rounded-xl border border-cyan-200">
            <span className="text-xs font-bold text-cyan-800 uppercase block">
              {t.aplFamilies}
            </span>
            <div className="text-2xl font-black text-cyan-950 mt-1">
              {(stats.aplCardFamilies || 0).toLocaleString()}
            </div>
            <span className="text-[11px] text-cyan-700 mt-0.5 block font-semibold">
              {stats.totalFamilies > 0 ? ((stats.aplCardFamilies / stats.totalFamilies) * 100).toFixed(1) : 0}% Above Poverty Line
            </span>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200">
            <span className="text-xs font-bold text-amber-900 uppercase block">
              {t.bplFamilies} (NFSA / Anna Bhagya)
            </span>
            <div className="text-2xl font-black text-amber-950 mt-1">
              {(stats.bplCardFamilies || 0).toLocaleString()}
            </div>
            <span className="text-[11px] text-amber-800 mt-0.5 block font-semibold">
              {stats.totalFamilies > 0 ? ((stats.bplCardFamilies / stats.totalFamilies) * 100).toFixed(1) : 0}% Priority Beneficiaries
            </span>
          </div>

        </div>

      </div>

      {/* VILLAGE-WISE RATION REGISTER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-extrabold text-slate-900 text-base">
            {lang === "kn" ? "ಗ್ರಾಮವಾರು ಪಡಿತರ ಚೀಟಿ ಫಲಾನುಭವಿಗಳ ರಿಜಿಸ್ಟರ್" : "Village-wise Ration Card Beneficiaries Register"}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === "kn" 
              ? "ಪ್ರತಿಯೊಂದು ಗ್ರಾಮದ ಎ.ಪಿ.ಎಲ್ ಮತ್ತು ಬಿ.ಪಿ.ಎಲ್ ಕಾರ್ಡ್‌ಗಳು ಹಾಗೂ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ವಿತರಕರ ವಿವರ."
              : "Detailed breakdown of APL and BPL quota entitlements and local Fair Price Shops."}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">{t.wardNo}</th>
                <th className="px-4 py-3">{t.villageName}</th>
                <th className="px-4 py-3">{t.totalFamilies}</th>
                <th className="px-4 py-3">{t.aplCardCount}</th>
                <th className="px-4 py-3">{t.bplCardCount}</th>
                <th className="px-4 py-3">BPL Ratio</th>
                <th className="px-4 py-3">{t.fairPriceShop}</th>
                <th className="px-4 py-3">{t.quotaDetails}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {villages.map((v) => {
                const bplRatio = v.totalFamilies > 0 
                  ? ((v.bplCardCount / v.totalFamilies) * 100).toFixed(1) 
                  : 0;

                return (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-gov-900">
                      Ward {v.wardNo}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      <div>{v.nameEn}</div>
                      <div className="text-xs text-slate-500 font-kannada font-normal">{v.nameKn}</div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold">
                      {v.totalFamilies}
                    </td>
                    <td className="px-4 py-3.5 font-black text-cyan-800">
                      {v.aplCardCount}
                    </td>
                    <td className="px-4 py-3.5 font-black text-amber-700">
                      {v.bplCardCount}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="w-24">
                        <div className="flex justify-between text-[11px] font-bold text-amber-800 mb-0.5">
                          <span>{bplRatio}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${bplRatio}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      FPS Dealer - Ward {v.wardNo} ({v.nameEn})
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1 w-max">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Active NFSA Allocation</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
