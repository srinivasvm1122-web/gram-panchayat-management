import React, { useState } from "react";
import { 
  History, 
  ShieldCheck, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  UserCheck, 
  AlertCircle 
} from "lucide-react";

export const AuditLogs = ({ auditLogs, t, lang }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = auditLogs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-gov-800 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Section 8: Statutory Security Audit Trail</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {t.auditTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {t.auditSubtitle}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user, action, details..."
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-gov-500"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <span>Every village addition, modification, deletion, voucher approval and authentication event is cryptographically indexed and immutable.</span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">{t.timestamp}</th>
                <th className="px-4 py-3">{t.adminUser}</th>
                <th className="px-4 py-3">{t.role}</th>
                <th className="px-4 py-3">{t.actionTaken}</th>
                <th className="px-4 py-3">{t.details}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-slate-500 font-medium">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    {log.user}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {log.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-gov-900 font-mono text-xs">
                    {log.action}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600 max-w-md leading-relaxed">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
