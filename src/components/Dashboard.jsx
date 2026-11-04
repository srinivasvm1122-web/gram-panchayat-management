import React from "react";
import { 
  Building2, 
  Users, 
  HeartHandshake, 
  Home, 
  CreditCard, 
  Vote, 
  CheckCircle2, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  TrendingUp,
  FileSpreadsheet,
  Download,
  PlusCircle,
  Clock,
  Sparkles,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Edit3
} from "lucide-react";

export const Dashboard = ({ 
  stats, 
  villages, 
  funds, 
  transactions, 
  auditLogs,
  electionData,
  t, 
  lang,
  isOfficer = false,
  onNavigateToLogin,
  setActiveTab,
  setIsAddVillageModalOpen,
  setIsAddTransactionModalOpen,
  onExportPdf,
  onExportExcel,
  onOpenEditDashboard
}) => {
  // Format currency in Indian numbering format
  const formatINR = (val = 0) => {
    return "₹ " + Number(val).toLocaleString("en-IN");
  };

  const cards = [
    {
      id: "villages",
      label: t.totalVillages,
      value: stats.totalVillages || villages.length,
      sub: lang === "kn" ? "10 ಗ್ರಾಮಗಳ ಪೂರ್ಣ ವಿವರ" : "10 Wards Registered",
      icon: Building2,
      color: "from-blue-600 to-gov-900",
      iconBg: "bg-blue-100 text-gov-900",
      accent: "border-blue-500",
      onClick: () => setActiveTab("villages")
    },
    {
      id: "population",
      label: t.totalPopulation,
      value: (stats.totalPopulation || 0).toLocaleString("en-IN"),
      sub: `${stats.totalMaleMembers || 0} M • ${stats.totalFemaleMembers || 0} F`,
      icon: Users,
      color: "from-indigo-600 to-indigo-900",
      iconBg: "bg-indigo-100 text-indigo-900",
      accent: "border-indigo-500",
      onClick: () => setActiveTab("villages")
    },
    {
      id: "living",
      label: t.totalLivingMembers,
      value: (stats.totalLivingMembers || 0).toLocaleString("en-IN"),
      sub: lang === "kn" ? "ಸಕ್ರಿಯ ನಾಗರಿಕರು" : "Verified Living Residents",
      icon: HeartHandshake,
      color: "from-teal-600 to-teal-900",
      iconBg: "bg-teal-100 text-teal-900",
      accent: "border-teal-500",
      onClick: () => setActiveTab("villages")
    },
    {
      id: "families",
      label: t.totalFamilies,
      value: (stats.totalFamilies || 0).toLocaleString("en-IN"),
      sub: lang === "kn" ? "ದಾಖಲಾದ ಕುಟುಂಬಗಳು" : "Registered Households",
      icon: Home,
      color: "from-sky-600 to-sky-900",
      iconBg: "bg-sky-100 text-sky-900",
      accent: "border-sky-500",
      onClick: () => setActiveTab("villages")
    },
    {
      id: "apl",
      label: t.aplFamilies,
      value: (stats.aplCardFamilies || 0).toLocaleString("en-IN"),
      sub: `${stats.totalFamilies > 0 ? ((stats.aplCardFamilies / stats.totalFamilies) * 100).toFixed(1) : 0}% ${lang === "kn" ? "ಕುಟುಂಬಗಳು" : "of total"}`,
      icon: CreditCard,
      color: "from-cyan-600 to-cyan-900",
      iconBg: "bg-cyan-100 text-cyan-900",
      accent: "border-cyan-500",
      onClick: () => setActiveTab("rations")
    },
    {
      id: "bpl",
      label: t.bplFamilies,
      value: (stats.bplCardFamilies || 0).toLocaleString("en-IN"),
      sub: `${stats.totalFamilies > 0 ? ((stats.bplCardFamilies / stats.totalFamilies) * 100).toFixed(1) : 0}% ${lang === "kn" ? "ಫಲಾನುಭವಿಗಳು" : "NFSA Beneficiaries"}`,
      icon: CreditCard,
      color: "from-amber-600 to-amber-900",
      iconBg: "bg-amber-100 text-amber-900",
      accent: "border-amber-500",
      onClick: () => setActiveTab("rations")
    },
    {
      id: "voters",
      label: t.totalRegisteredVoters,
      value: (stats.totalRegisteredVoters || 0).toLocaleString("en-IN"),
      sub: `${stats.totalMaleVoters || 0} M • ${stats.totalFemaleVoters || 0} F`,
      icon: Vote,
      color: "from-purple-600 to-purple-900",
      iconBg: "bg-purple-100 text-purple-900",
      accent: "border-purple-500",
      onClick: () => setActiveTab("elections")
    },
    {
      id: "votesCast",
      label: t.totalVotesCast,
      value: (stats.totalVotesCast || 0).toLocaleString("en-IN"),
      sub: `${stats.votingPercentage || 0}% ${t.votingTurnout}`,
      icon: CheckCircle2,
      color: "from-emerald-600 to-emerald-900",
      iconBg: "bg-emerald-100 text-emerald-900",
      accent: "border-emerald-500",
      onClick: () => setActiveTab("elections")
    },
    {
      id: "funds",
      label: t.totalFundsReceived,
      value: formatINR(stats.totalFundsReceived),
      sub: lang === "kn" ? "ಕೇಂದ್ರ/ರಾಜ್ಯ ಅನುದಾನಗಳು" : "Govt. Grants + SFC",
      icon: ArrowUpRight,
      color: "from-emerald-700 to-teal-900",
      iconBg: "bg-emerald-100 text-emerald-800",
      accent: "border-emerald-600",
      onClick: () => setActiveTab("funds")
    },
    {
      id: "expenses",
      label: t.totalExpenses,
      value: formatINR(stats.totalExpenses),
      sub: lang === "kn" ? "ಪರಿಶೋಧಿತ ವೆಚ್ಚಗಳು" : "Audited Vouchers",
      icon: ArrowDownRight,
      color: "from-rose-600 to-red-900",
      iconBg: "bg-rose-100 text-rose-800",
      accent: "border-rose-500",
      onClick: () => setActiveTab("funds")
    },
    {
      id: "balance",
      label: t.remainingBalance,
      value: formatINR(stats.remainingBalance),
      sub: lang === "kn" ? "ಪಂಚಾಯತಿ ಖಾತೆಯಲ್ಲಿರುವ ಬಾಕಿ" : "Available in Treasury",
      icon: Wallet,
      color: "from-amber-600 to-amber-800",
      iconBg: "bg-amber-100 text-amber-900",
      accent: "border-amber-500",
      onClick: () => setActiveTab("funds")
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-gov-800 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t.officialPortal} • FY 2024-25</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            {t.navDashboard}
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            {lang === "kn" 
              ? "ಶಿವಪುರ ಗ್ರಾಮ ಪಂಚಾಯಿತಿಯ 10 ಗ್ರಾಮಗಳ ಅಧಿಕೃತ ಅಂಕಿಅಂಶಗಳು, ಮತದಾನ ವಿವರ ಮತ್ತು ಹಣಕಾಸು ವೆಚ್ಚಗಳ ಅವಲೋಕನ."
              : "Consolidated demographic, voter turnout, ration entitlement and public treasury overview for all 10 villages."}
          </p>

          {!isOfficer && (
            <div className="mt-3 p-2.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-700 flex-shrink-0" />
                <span>{t.publicViewNotice}</span>
              </div>
              <button
                onClick={onNavigateToLogin}
                className="font-bold underline text-gov-800 hover:text-gov-950 text-[11px]"
              >
                {t.officerLoginPrompt} {t.officerLoginBtn} &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isOfficer ? (
            <>
              <button
                onClick={onOpenEditDashboard}
                className="px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center space-x-1.5"
                title="Edit Dashboard Statistics"
              >
                <Edit3 className="w-4 h-4 text-amber-300" />
                <span>{lang === "kn" ? "ಅಂಕಿಅಂಶ ತಿದ್ದುಪಡಿ" : "Edit Dashboard Stats"}</span>
              </button>

              <button
                onClick={() => setIsAddVillageModalOpen(true)}
                className="px-3.5 py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>{t.addVillage}</span>
              </button>

              <button
                onClick={() => setIsAddTransactionModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center space-x-1.5"
              >
                <Wallet className="w-4 h-4 text-emerald-200" />
                <span>{t.addTransaction}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setActiveTab("villages")}
              className="px-3.5 py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center space-x-1.5"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>View All 10 Villages</span>
            </button>
          )}

          <button
            onClick={onExportPdf}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 transition flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-gov-800" />
            <span>PDF</span>
          </button>

          <button
            onClick={onExportExcel}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 transition flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Officer Live Dashboard Management Banner */}
      {isOfficer && (
        <div className="bg-gradient-to-r from-gov-950 via-gov-900 to-indigo-950 text-white p-4 rounded-2xl border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-gov-950 flex items-center justify-center font-bold flex-shrink-0 shadow">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold flex items-center space-x-2">
                <span>{lang === "kn" ? "ಅಧಿಕಾರಿ ಲೈವ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ನಿರ್ವಹಣೆ" : "Officer Live Dashboard Management Mode"}</span>
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase font-black tracking-wider">Authorized</span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">
                {lang === "kn" 
                  ? "ಜನಸಂಖ್ಯೆ, ಕುಟುಂಬಗಳು, ಎಪಿಎಲ್/ಬಿಪಿಎಲ್, ಮತದಾರರು ಮತ್ತು ಅನುದಾನ ಅಂಕಿಅಂಶಗಳನ್ನು ತಕ್ಷಣವೇ ತಿದ್ದುಪಡಿ ಮಾಡಿ ಉಳಿಸಿ."
                  : "Directly update consolidated population, living members, families, APL/BPL counts, voters and funds."}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenEditDashboard}
            className="w-full sm:w-auto px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-gov-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4 text-gov-950" />
            <span>{lang === "kn" ? "ಅಂಕಿಅಂಶ ತಿದ್ದುಪಡಿ ಮಾಡಿ" : "Edit Dashboard Statistics"}</span>
          </button>
        </div>
      )}

      {/* Primary KPI Grid (Requirement 2 - 11 Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={card.onClick}
              className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 border-l-4 ${card.accent}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`p-2 rounded-xl ${card.iconBg} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-2.5">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {card.value}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1 flex items-center justify-between">
                  <span>{card.sub}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytical Widgets: Demographic Ratio, Election Turnout, and Funds Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget 1: Gender & Demographic Ratio */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Users className="w-4 h-4 text-gov-800" />
                <span>{lang === "kn" ? "ಜನಸಂಖ್ಯಾ ಹಂಚಿಕೆ" : "Demographic Ratio"}</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {stats.totalPopulation} {lang === "kn" ? "ಒಟ್ಟು" : "Total"}
              </span>
            </div>

            {/* Visual Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                <span>{t.maleMembers}: {stats.totalMaleMembers}</span>
                <span>{t.femaleMembers}: {stats.totalFemaleMembers}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  className="bg-gov-700 h-full transition-all"
                  style={{ width: `${stats.totalPopulation > 0 ? (stats.totalMaleMembers / stats.totalPopulation) * 100 : 50}%` }}
                  title="Male Population"
                ></div>
                <div 
                  className="bg-pink-500 h-full transition-all"
                  style={{ width: `${stats.totalPopulation > 0 ? (stats.totalFemaleMembers / stats.totalPopulation) * 100 : 50}%` }}
                  title="Female Population"
                ></div>
              </div>
            </div>

            {/* Ration Distribution Breakdown */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                <span>{t.aplFamilies}: {stats.aplCardFamilies}</span>
                <span>{t.bplFamilies}: {stats.bplCardFamilies}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  className="bg-cyan-600 h-full"
                  style={{ width: `${stats.totalFamilies > 0 ? (stats.aplCardFamilies / stats.totalFamilies) * 100 : 30}%` }}
                  title="APL Families"
                ></div>
                <div 
                  className="bg-amber-500 h-full"
                  style={{ width: `${stats.totalFamilies > 0 ? (stats.bplCardFamilies / stats.totalFamilies) * 100 : 70}%` }}
                  title="BPL Families"
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 inline-block"></span>
                  <span>APL ({stats.totalFamilies > 0 ? ((stats.aplCardFamilies / stats.totalFamilies) * 100).toFixed(1) : 0}%)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  <span>BPL ({stats.totalFamilies > 0 ? ((stats.bplCardFamilies / stats.totalFamilies) * 100).toFixed(1) : 0}%)</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("villages")}
            className="mt-4 text-xs font-bold text-gov-800 hover:text-gov-900 flex items-center justify-between pt-2 border-t border-slate-100"
          >
            <span>{t.viewDetails}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Widget 2: Election Turnout Overview */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Vote className="w-4 h-4 text-purple-700" />
                <span>{lang === "kn" ? "ಮತದಾನದ ಅಂಕಿಅಂಶ" : "Election Statistics"}</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                {stats.votingPercentage}% Turnout
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>{t.totalVotesCast}</span>
                  <span className="font-bold text-slate-900">{stats.totalVotesCast} / {stats.totalRegisteredVoters}</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all"
                    style={{ width: `${stats.votingPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100 text-xs text-purple-900 space-y-1">
                <div className="font-bold flex items-center space-x-1.5 text-purple-950">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>10 Wards Declared Results</span>
                </div>
                <p className="text-[11px] text-purple-800/90 leading-relaxed">
                  {lang === "kn"
                    ? "ಚುನಾವಣಾ ಆಯೋಗದ ನಿಯಮಾವಳಿಯಂತೆ ಎಲ್ಲಾ 10 ವಾರ್ಡ್‌ಗಳ ಗೆಜೆಟ್ ಪ್ರಕಟವಾಗಿದೆ."
                    : "Official returning officer gazette published. Zero secret ballot data retained."}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("elections")}
            className="mt-4 text-xs font-bold text-purple-800 hover:text-purple-950 flex items-center justify-between pt-2 border-t border-slate-100"
          >
            <span>{t.viewFullElectionReport}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Widget 3: Village Funds & Treasury Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <IndianRupee className="w-4 h-4 text-emerald-700" />
                <span>{lang === "kn" ? "ನಿಧಿ ಮತ್ತು ವೆಚ್ಚಗಳ ಲೆಕ್ಕಪತ್ರ" : "Treasury Balance"}</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                Audited
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">{t.totalFundsReceived}:</span>
                <span className="font-bold text-emerald-700">{formatINR(stats.totalFundsReceived)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">{t.totalExpenses}:</span>
                <span className="font-bold text-rose-600">- {formatINR(stats.totalExpenses)}</span>
              </div>
              <div className="h-px bg-slate-200 my-1"></div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-800">{t.remainingBalance}:</span>
                <span className="font-black text-amber-600">{formatINR(stats.remainingBalance)}</span>
              </div>

              {/* Progress bar of funds utilized */}
              <div className="mt-2">
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-rose-500 h-full"
                    style={{ width: `${stats.totalFundsReceived > 0 ? (stats.totalExpenses / stats.totalFundsReceived) * 100 : 0}%` }}
                    title="Utilized"
                  ></div>
                  <div 
                    className="bg-emerald-500 h-full"
                    style={{ width: `${stats.totalFundsReceived > 0 ? (stats.remainingBalance / stats.totalFundsReceived) * 100 : 0}%` }}
                    title="Remaining Balance"
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>{stats.totalFundsReceived > 0 ? ((stats.totalExpenses / stats.totalFundsReceived) * 100).toFixed(1) : 0}% Utilized</span>
                  <span>{stats.totalFundsReceived > 0 ? ((stats.remainingBalance / stats.totalFundsReceived) * 100).toFixed(1) : 0}% In Balance</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("funds")}
            className="mt-4 text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center justify-between pt-2 border-t border-slate-100"
          >
            <span>{t.navFunds}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 10 Villages Quick Glance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              {t.villagesTitle} (10)
            </h3>
            <p className="text-xs text-slate-500">
              {lang === "kn" 
                ? "ಗ್ರಾಮ ಪಂಚಾಯತಿಯ ಎಲ್ಲಾ 10 ವಾರ್ಡ್‌ಗಳ ಜನಸಂಖ್ಯಾ ಮತ್ತು ಮತದಾರರ ವಿವರಣೆ."
                : "Active directory of all 10 registered village profiles in this gram panchayat."}
            </p>
          </div>
          <button
            onClick={() => setActiveTab("villages")}
            className="text-xs font-bold text-gov-800 hover:text-gov-950 hover:underline flex items-center space-x-1"
          >
            <span>{lang === "kn" ? "ಎಲ್ಲಾ 10 ನೋಡಿ" : "View All 10"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">{t.wardNo}</th>
                <th className="px-4 py-3">{t.villageName}</th>
                <th className="px-4 py-3">{t.totalPopulation}</th>
                <th className="px-4 py-3">{t.totalFamilies}</th>
                <th className="px-4 py-3">{t.aplCardCount} / {t.bplCardCount}</th>
                <th className="px-4 py-3">{t.totalVoters}</th>
                <th className="px-4 py-3">{t.votesCast}</th>
                <th className="px-4 py-3">{t.votingTurnout}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {villages.slice(0, 10).map((v) => {
                const turnout = v.totalVoters > 0 ? ((v.votesCast / v.totalVoters) * 100).toFixed(1) : 0;
                return (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-bold text-gov-900">
                      W-{v.wardNo}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <div>{v.nameEn}</div>
                      <div className="text-xs text-slate-500 font-kannada">{v.nameKn}</div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {v.totalPopulation.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {v.totalFamilies}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-cyan-700 font-bold">{v.aplCardCount}</span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="text-amber-700 font-bold">{v.bplCardCount}</span>
                    </td>
                    <td className="px-4 py-3">
                      {v.totalVoters}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {v.votesCast}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {turnout}%
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
