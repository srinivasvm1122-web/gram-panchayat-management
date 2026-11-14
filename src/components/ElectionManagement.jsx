import React, { useState } from "react";
import { 
  Vote, 
  Calendar, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  FileText, 
  Download, 
  TrendingUp, 
  AlertCircle,
  FileSpreadsheet,
  Building2,
  ChevronRight,
  Plus
} from "lucide-react";

export const ElectionManagement = ({ 
  electionData, 
  villages, 
  stats, 
  t, 
  lang,
  onExportPdf,
  onExportExcel
}) => {
  const [selectedWard, setSelectedWard] = useState("all");

  const results = electionData.declaredResults || [];
  const filteredResults = selectedWard === "all" 
    ? results 
    : results.filter(r => r.wardNo === Number(selectedWard));

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-purple-800 uppercase tracking-wide">
              <Vote className="w-4 h-4 text-purple-700" />
              <span>{electionData.officialGazetteNumber || "Official Election Gazette"}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {t.electionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {t.electionSubtitle}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onExportPdf}
              className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs sm:text-sm font-bold border border-purple-200 transition flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4 text-purple-700" />
              <span>Gazette PDF</span>
            </button>
            <button
              onClick={onExportExcel}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-300 transition flex items-center space-x-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* STATUTORY PRIVACY MANDATE BANNER */}
        <div className="mt-5 p-4 rounded-xl bg-purple-50/70 border border-purple-200 flex items-start space-x-3 text-purple-900">
          <ShieldCheck className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-extrabold uppercase tracking-wide block text-purple-950">
              Statutory Privacy & Secret Ballot Compliance (Section 128, R.P. Act, 1951)
            </span>
            <p className="mt-0.5 text-purple-800/90 leading-relaxed font-medium">
              {t.electionPrivacyNotice}
            </p>
          </div>
        </div>

        {/* 4 Key Election Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-semibold mb-1">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>{t.electionDate}</span>
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900">
              {electionData.electionDate}
            </div>
            <div className="text-[11px] text-slate-500">
              Dec 2024 General Poll
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-semibold mb-1">
              <Users className="w-3.5 h-3.5 text-gov-800" />
              <span>{t.totalRegisteredVoters}</span>
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900">
              {(stats.totalRegisteredVoters || 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500">
              Across 10 Wards
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-semibold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.totalVotesCast}</span>
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900">
              {(stats.totalVotesCast || 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">
              Valid Ballots Polled
            </div>
          </div>

          <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
            <div className="flex items-center space-x-1.5 text-emerald-800 text-xs font-semibold mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.votingPercentage}</span>
            </div>
            <div className="text-base sm:text-lg font-black text-emerald-950">
              {stats.votingPercentage}%
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">
              Consolidated Turnout
            </div>
          </div>
        </div>

      </div>

      {/* OFFICIALLY DECLARED RESULTS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>{t.declaredResults}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {t.electionSubtitle || "Certified ward winners declared by Karnataka State Election Commission Returning Officer."}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Filter Ward:</span>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="all">All 10 Wards</option>
              {results.map(r => (
                <option key={r.wardNo} value={r.wardNo}>Ward {r.wardNo} ({r.villageName})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Cards / Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/90 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">{t.wardNumber}</th>
                <th className="px-4 py-3">{t.villageName}</th>
                <th className="px-4 py-3">{t.winningCandidate}</th>
                <th className="px-4 py-3">{t.partyAffiliation}</th>
                <th className="px-4 py-3">Allotted Symbol</th>
                <th className="px-4 py-3">{t.votesSecured}</th>
                <th className="px-4 py-3">{t.victoryMargin}</th>
                <th className="px-4 py-3">{t.declarationStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredResults.map((r) => (
                <tr key={r.wardNo} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-black text-gov-900">
                    Ward {r.wardNo}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    {r.villageName}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-extrabold text-slate-900 flex items-center space-x-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>{r.candidateName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      vs {r.runnerUp} ({r.runnerUpVotes} votes)
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 font-semibold text-xs border border-purple-200">
                      {r.partyAffiliation}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-600">
                    {r.symbol}
                  </td>
                  <td className="px-4 py-3.5 font-black text-slate-900">
                    {r.votesSecured.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-emerald-700">
                      +{r.margin} votes
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1 w-max">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{r.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VILLAGE-WISE ELECTION TURNOUT REPORT */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-extrabold text-slate-900 text-base mb-1 flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-gov-800" />
          <span>{t.villageWiseReport}</span>
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          {t.villageWiseReport || "Aggregated ward level voter registration, gender distribution and voting turnout percentage."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {villages.map((v) => {
            const turnout = v.totalVoters > 0 ? ((v.votesCast / v.totalVoters) * 100).toFixed(1) : 0;
            return (
              <div key={v.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-gov-900 text-white font-bold text-xs">
                      Ward {v.wardNo}
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {v.nameEn} ({v.nameKn})
                    </span>
                  </div>
                  <span className="font-black text-sm text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                    {turnout}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-gov-700 to-purple-600 rounded-full transition-all"
                    style={{ width: `${turnout}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <span>Registered: <strong>{v.totalVoters}</strong> ({v.maleVoters} M / {v.femaleVoters} F)</span>
                  <span>Polled: <strong>{v.votesCast}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
