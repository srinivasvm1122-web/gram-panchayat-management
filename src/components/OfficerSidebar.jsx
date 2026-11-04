import React from "react";
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Home, 
  CreditCard, 
  Vote, 
  Wallet, 
  FileSpreadsheet, 
  FileText, 
  FolderArchive, 
  History, 
  LogOut,
  ShieldCheck,
  ChevronRight,
  BadgeCheck
} from "lucide-react";

export const OfficerSidebar = ({ 
  activeSection, 
  setActiveSection, 
  currentUser, 
  onLogout, 
  t, 
  lang,
  villageCount = 10 
}) => {
  const sidebarItems = [
    { id: "dashboard", label: "1. Dashboard", labelKn: "1. ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", icon: LayoutDashboard, badge: "Overview" },
    { id: "villages", label: "2. Manage Villages", labelKn: "2. ಗ್ರಾಮಗಳ ನಿರ್ವಹಣೆ", icon: MapPin, badge: villageCount },
    { id: "members", label: "3. Village People & Records", labelKn: "3. ಗ್ರಾಮದ ನಾಗರಿಕರು & ದಾಖಲೆಗಳು", icon: Users, badge: "300" },
    { id: "population", label: "4. Population Management", labelKn: "4. ಜನಸಂಖ್ಯೆ ನಿರ್ವಹಣೆ", icon: Users, badge: "Demographics" },
    { id: "families", label: "5. Family Management", labelKn: "5. ಕುಟುಂಬ ನಿರ್ವಹಣೆ", icon: Home, badge: "Housing" },
    { id: "rations", label: "6. APL/BPL Management", labelKn: "6. APL/BPL ನಿರ್ವಹಣೆ", icon: CreditCard, badge: "PDS" },
    { id: "elections", label: "7. Election Management", labelKn: "7. ಚುನಾವಣೆ ನಿರ್ವಹಣೆ", icon: Vote, badge: "Results" },
    { id: "funds", label: "8. Funds Management", labelKn: "8. ನಿಧಿ ನಿರ್ವಹಣೆ", icon: Wallet, badge: "Grants" },
    { id: "transactions", label: "9. Transactions", labelKn: "9. ವಹಿವಾಟುಗಳು", icon: FileSpreadsheet, badge: "Vouchers" },
    { id: "reports", label: "10. Reports", labelKn: "10. ವರದಿಗಳು", icon: FileText, badge: "PDF/XLS" },
    { id: "documents", label: "11. Document Management", labelKn: "11. ಕಡತಗಳ ನಿರ್ವಹಣೆ", icon: FolderArchive, badge: "Orders" },
    { id: "audit", label: "12. Audit History", labelKn: "12. ಆಡಿಟ್ ಇತಿಹಾಸ", icon: History, badge: "Security" },
    { id: "logout", label: "Logout", labelKn: "ನಿರ್ಗಮಿಸಿ (Logout)", icon: LogOut, isAction: true }
  ];

  return (
    <aside className="w-full lg:w-72 bg-white rounded-3xl border border-slate-200 shadow-md p-4 flex flex-col justify-between flex-shrink-0">
      <div>
        
        {/* Officer Active Badge */}
        <div className="p-3.5 bg-gradient-to-r from-gov-950 via-gov-900 to-gov-800 rounded-2xl text-white mb-4 border border-amber-500/30 shadow-sm">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gov-900 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-black truncate">{currentUser?.name || "Officer"}</div>
              <div className="text-[10px] text-amber-300 font-bold bg-amber-400/20 px-1.5 py-0.2 rounded w-max mt-0.5">
                {currentUser?.role || "PDO"} • Full CRUD Access
              </div>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-700/80 text-[10px] text-sky-200 flex items-center justify-between">
            <span>Official Officer Console</span>
            <span className="flex items-center space-x-1 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Edit Mode</span>
            </span>
          </div>
        </div>

        {/* 12 Sidebar Navigation Items */}
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            if (item.isAction) {
              return (
                <button
                  key={item.id}
                  onClick={onLogout}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition mt-2 border border-red-100"
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{lang === "kn" ? item.labelKn : item.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? "bg-gov-900 text-white shadow-md shadow-gov-900/20"
                    : "text-slate-700 hover:bg-slate-100 hover:text-gov-900"
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                  <span className="truncate">{lang === "kn" ? item.labelKn : item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold flex-shrink-0 ml-1 ${
                      isActive
                        ? "bg-amber-400 text-gov-950"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer info */}
      <div className="pt-4 mt-4 border-t border-slate-100 text-[10px] text-slate-500 text-center">
        <span>Shivapura Gram Panchayat • FY 2024-25</span>
      </div>
    </aside>
  );
};
