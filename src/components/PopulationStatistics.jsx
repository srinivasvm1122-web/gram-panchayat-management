import React from "react";
import { 
  Users, 
  HeartHandshake, 
  Baby, 
  GraduationCap, 
  Briefcase, 
  Activity, 
  Download, 
  FileSpreadsheet, 
  Home, 
  Building2, 
  TrendingUp,
  Percent
} from "lucide-react";

export const PopulationStatistics = ({ 
  villages, 
  members = [],
  stats, 
  t, 
  lang,
  onExportPdf,
  onExportExcel 
}) => {
  // Compute gender ratio: (totalFemale / totalMale) * 1000
  const genderRatio = stats.totalMaleMembers > 0 
    ? Math.round((stats.totalFemaleMembers / stats.totalMaleMembers) * 1000) 
    : 968;

  const livingPercent = stats.totalPopulation > 0 
    ? ((stats.totalLivingMembers / stats.totalPopulation) * 100).toFixed(1) 
    : 98.2;

  const avgFamilySize = stats.totalFamilies > 0 
    ? (stats.totalPopulation / stats.totalFamilies).toFixed(1) 
    : 4.8;

  // Approximate age demographics based on Karnataka rural census models
  const total = stats.totalPopulation || 24700;
  const childrenCount = Math.round(total * 0.11); // 11%
  const youthCount = Math.round(total * 0.22); // 22%
  const adultCount = Math.round(total * 0.55); // 55%
  const seniorCount = Math.round(total * 0.12); // 12%

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-gov-800 uppercase tracking-wide">
              <Users className="w-4 h-4 text-gov-800" />
              <span>Census & Demographic Analytics • Shivapura GP</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {t.populationTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {t.populationSubtitle}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onExportPdf("census")}
              className="px-3.5 py-2 rounded-xl bg-gov-900 hover:bg-gov-800 text-white text-xs sm:text-sm font-bold shadow-sm transition flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Population PDF</span>
            </button>
            <button
              onClick={onExportExcel}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-300 transition flex items-center space-x-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Excel Register</span>
            </button>
          </div>
        </div>

        {/* 4 Primary Demographic KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase block">
              {t.totalPopulation}
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {(stats.totalPopulation || 0).toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {stats.totalMaleMembers} Male • {stats.totalFemaleMembers} Female
            </span>
          </div>

          <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200">
            <span className="text-xs font-bold text-teal-800 uppercase block">
              {t.livingRatio}
            </span>
            <div className="text-2xl font-black text-teal-950 mt-1">
              {livingPercent}%
            </div>
            <span className="text-[11px] text-teal-700 mt-0.5 block font-semibold">
              {(stats.totalLivingMembers || 0).toLocaleString()} Verified Living Citizens
            </span>
          </div>

          <div className="bg-pink-50/70 p-4 rounded-xl border border-pink-200">
            <span className="text-xs font-bold text-pink-800 uppercase block">
              {t.genderRatio}
            </span>
            <div className="text-2xl font-black text-pink-950 mt-1">
              {genderRatio}
            </div>
            <span className="text-[11px] text-pink-700 mt-0.5 block font-semibold">
              Karnataka Rural Avg: 965
            </span>
          </div>

          <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-200">
            <span className="text-xs font-bold text-sky-800 uppercase block">
              {t.avgFamilySize}
            </span>
            <div className="text-2xl font-black text-sky-950 mt-1">
              {avgFamilySize} Members
            </div>
            <span className="text-[11px] text-sky-700 mt-0.5 block font-semibold">
              Across {stats.totalFamilies} Households
            </span>
          </div>

        </div>

      </div>

      {/* CITIZEN DEMOGRAPHIC AGE SEGMENTS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">
            {t.ageDemographics}
          </h3>
          <p className="text-xs text-slate-500">
            Estimated demographic distribution across health, education and social welfare schemes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200">
            <div className="flex items-center space-x-2 text-amber-800 font-bold mb-1">
              <Baby className="w-4 h-4 text-amber-600" />
              <span>{t.childrenAge}</span>
            </div>
            <div className="text-xl font-black text-amber-950 mt-1">
              {childrenCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-700 mt-1">
              Enrolled in 14 GP Anganwadi Centers
            </div>
          </div>

          <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-2 text-blue-800 font-bold mb-1">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>{t.youthAge}</span>
            </div>
            <div className="text-xl font-black text-blue-950 mt-1">
              {youthCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-blue-700 mt-1">
              Attending Primary & High Schools
            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold mb-1">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>{t.adultAge}</span>
            </div>
            <div className="text-xl font-black text-emerald-950 mt-1">
              {adultCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-700 mt-1">
              Agriculture, Dairy & Allied Workforce
            </div>
          </div>

          <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200">
            <div className="flex items-center space-x-2 text-purple-800 font-bold mb-1">
              <Activity className="w-4 h-4 text-purple-600" />
              <span>{t.seniorAge}</span>
            </div>
            <div className="text-xl font-black text-purple-950 mt-1">
              {seniorCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-purple-700 mt-1">
              Sandhya Suraksha & Pensioners
            </div>
          </div>

        </div>
      </div>

      {/* VILLAGE-BY-VILLAGE DEMOGRAPHIC BREAKDOWN TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-extrabold text-slate-900 text-base">
            10-Village Ward Level Demographic Register
          </h3>
          <p className="text-xs text-slate-500">
            Official population, living citizens, male/female distribution and sex ratios.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">{t.wardNo}</th>
                <th className="px-4 py-3">{t.villageName}</th>
                <th className="px-4 py-3">{t.totalPopulation}</th>
                <th className="px-3 py-3 text-purple-900 bg-purple-50 border-x border-purple-100 whitespace-nowrap">SC</th>
                <th className="px-3 py-3 text-emerald-900 bg-emerald-50 border-r border-emerald-100 whitespace-nowrap">ST</th>
                <th className="px-3 py-3 text-blue-900 bg-blue-50 border-r border-blue-100 whitespace-nowrap">OBC</th>
                <th className="px-3 py-3 text-slate-800 bg-slate-100 border-r border-slate-200 whitespace-nowrap">General</th>
                <th className="px-4 py-3">{t.livingMembers}</th>
                <th className="px-4 py-3">{t.maleMembers}</th>
                <th className="px-4 py-3">{t.femaleMembers}</th>
                <th className="px-4 py-3">Ward Sex Ratio</th>
                <th className="px-4 py-3">{t.totalFamilies}</th>
                <th className="px-4 py-3">Avg Family</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {villages.map((v) => {
                const wardRatio = v.maleMembers > 0 
                  ? Math.round((v.femaleMembers / v.maleMembers) * 1000) 
                  : 960;
                const famSize = v.totalFamilies > 0 
                  ? (v.totalPopulation / v.totalFamilies).toFixed(1) 
                  : 4.8;
                const vilMems = members.filter(m => m.villageId === v.id);
                const getC = (m) => m.caste || m.casteCategory || "General";
                const scCount = vilMems.filter(m => getC(m) === "SC").length;
                const stCount = vilMems.filter(m => getC(m) === "ST").length;
                const obcCount = vilMems.filter(m => getC(m) === "OBC").length;
                const genCount = vilMems.filter(m => getC(m) === "General").length;

                return (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-gov-900">
                      Ward {v.wardNo}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      <div>{v.nameEn}</div>
                      <div className="text-xs text-slate-500 font-kannada font-normal">{v.nameKn}</div>
                    </td>
                    <td className="px-4 py-3.5 font-black text-slate-900">
                      {v.totalPopulation.toLocaleString()}
                    </td>
                    
                    {/* Caste Columns: SC, ST, OBC, General */}
                    <td className="px-3 py-3.5 bg-purple-50/30 border-x border-purple-100/40 font-bold text-purple-950 font-mono">
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 text-xs font-black">
                        {scCount}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 bg-emerald-50/30 border-r border-emerald-100/40 font-bold text-emerald-950 font-mono">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-xs font-black">
                        {stCount}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 bg-blue-50/30 border-r border-blue-100/40 font-bold text-blue-950 font-mono">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-xs font-black">
                        {obcCount}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 bg-slate-50/50 border-r border-slate-200/60 font-bold text-slate-900 font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-black">
                        {genCount}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-teal-800">
                      {v.livingMembers.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-blue-900 font-semibold">
                      {v.maleMembers}
                    </td>
                    <td className="px-4 py-3.5 text-pink-900 font-semibold">
                      {v.femaleMembers}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-pink-50 text-pink-800 border border-pink-200">
                        {wardRatio} F / 1000 M
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium">
                      {v.totalFamilies}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-700">
                      {famSize}
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
