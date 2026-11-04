import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Building2, 
  Vote, 
  Wallet, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  Calendar,
  Layers
} from "lucide-react";

export const Reports = ({ 
  villages, 
  funds, 
  transactions, 
  electionData, 
  stats, 
  t, 
  lang,
  onExportPdf,
  onExportExcel
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState("");

  const handleDownloadPdf = (type) => {
    onExportPdf(type);
    setDownloadSuccess(`Official PDF document generated and downloaded.`);
    setTimeout(() => setDownloadSuccess(""), 4000);
  };

  const handleDownloadExcel = () => {
    onExportExcel();
    setDownloadSuccess(`Official Excel master register (.xlsx) downloaded successfully.`);
    setTimeout(() => setDownloadSuccess(""), 4000);
  };

  const reportsList = [
    {
      id: "master",
      title: t.comprehensiveReport,
      titleKn: "ಸಮಗ್ರ ಗ್ರಾಮ ಪಂಚಾಯತಿ ಮಾಸ್ಟರ್ ವರದಿ",
      desc: "Complete official consolidated report containing all 10 village demographics, living populations, voter turnout percentages, APL/BPL cards, and financial balances.",
      icon: Building2,
      color: "bg-gov-900 text-white",
      pdfType: "master",
      badge: "Official Gazette Format"
    },
    {
      id: "census",
      title: t.villageCensusReport,
      titleKn: "10 ಗ್ರಾಮಗಳ ಜನಗಣತಿ & ವಿವರಣೆ ರಿಜಿಸ್ಟರ್",
      desc: "Detailed census breakdown for all 10 wards: male/female population, living members, family counts, and ward member / sarpanch contact register.",
      icon: Layers,
      color: "bg-teal-700 text-white",
      pdfType: "census",
      badge: "RDPR Dept Standard"
    },
    {
      id: "funds",
      title: t.fundsStatementReport,
      titleKn: "ಪಂಚಾಯತಿ ಹಣಕಾಸು ಲೆಕ್ಕಪತ್ರ & ವೋಚರ್ ವಿವರ",
      desc: "Detailed financial ledger of Central Government 15th FC grants, MGNREGA allocations, road & water supply expenditures, remaining balance, and audited vouchers.",
      icon: Wallet,
      color: "bg-emerald-700 text-white",
      pdfType: "funds",
      badge: "Treasury Reconciled"
    },
    {
      id: "election",
      title: t.electionReport,
      titleKn: "ಚುನಾವಣಾ ಮತದಾನ ಮತ್ತು ಫಲಿತಾಂಶಗಳ ಗೆಜೆಟ್",
      desc: "Karnataka State Election Commission official turnout and declared ward results gazette. Section 128 privacy compliant.",
      icon: Vote,
      color: "bg-purple-700 text-white",
      pdfType: "election",
      badge: "SEC Certified"
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-gov-800 uppercase tracking-wide">
              <FileText className="w-4 h-4 text-gov-800" />
              <span>Official Reports Center • Government of Karnataka</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {t.reportsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {t.reportsSubtitle}
            </p>
          </div>

          {/* Master 1-Click Excel Download */}
          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center space-x-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>{t.downloadExcel}</span>
          </button>
        </div>

        {downloadSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccess}</span>
          </div>
        )}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportsList.map((rep) => {
          const Icon = rep.icon;
          return (
            <div
              key={rep.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${rep.color} shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {rep.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-3.5">
                  {lang === "kn" ? rep.titleKn : rep.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {rep.desc}
                </p>

                {/* Audit Seal */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Includes PDO signature block and official government seal.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleDownloadPdf(rep.pdfType)}
                  className="w-1/2 py-2 px-3 rounded-xl bg-gov-900 hover:bg-gov-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t.downloadPdf}</span>
                </button>

                <button
                  onClick={handleDownloadExcel}
                  className="w-1/2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 border border-slate-300 transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Excel Format</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
