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
  BadgeCheck,
  Map
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
    { id: "dashboard", label: "1. Dashboard", icon: LayoutDashboard, badge: "Overview" },
    { id: "villages", label: "2. Manage Villages", icon: MapPin, badge: villageCount },
    { id: "villageMap", label: "3. 10 Villages Map", icon: Map, badge: "GPS" },
    { id: "members", label: "4. Village People & Records", icon: Users, badge: "300" },
    { id: "population", label: "5. Population Management", icon: Users, badge: "Demographics" },
    { id: "families", label: "6. Family Management", icon: Home, badge: "Housing" },
    { id: "rations", label: "7. APL/BPL Management", icon: CreditCard, badge: "PDS" },
    { id: "elections", label: "8. Election Management", icon: Vote, badge: "Results" },
    { id: "funds", label: "9. Funds Management", icon: Wallet, badge: "Grants" },
    { id: "transactions", label: "10. Transactions", icon: FileSpreadsheet, badge: "Vouchers" },
    { id: "reports", label: "11. Reports", icon: FileText, badge: "PDF/XLS" },
    { id: "documents", label: "12. Document Management", icon: FolderArchive, badge: "Orders" },
    { id: "audit", label: "13. Audit History", icon: History, badge: "Security" },
    { id: "logout", label: "Logout", icon: LogOut, isAction: true }
  ];

  const getSidebarLabel = (item) => {
    switch (item.id) {
      case "dashboard": return `1. ${t.navHome || "Dashboard"}`;
      case "villages": return `2. ${t.navVillages || "Manage Villages"}`;
      case "villageMap": return `3. ${t.pageVillageMap || t.navVillageMap || "10 Villages Map"}`;
      case "members": return `4. ${t.pageMembers || t.navMembers || "Village People"}`;
      case "population": return `5. ${t.pagePopulation || t.navPopulation || "Population"}`;
      case "families": return `6. ${t.totalFamilies || "Families"}`;
      case "rations": return `7. ${t.pageRations || t.navRations || "APL/BPL"}`;
      case "elections": return `8. ${t.pageElections || t.navElections || "Elections"}`;
      case "funds": return `9. ${t.pageFunds || t.navFunds || "Funds"}`;
      case "transactions": return `10. ${t.allTransactions || "Transactions"}`;
      case "reports": return `11. ${t.pageReports || t.navReports || "Reports"}`;
      case "documents": return `12. ${t.documentsTitle || "Documents"}`;
      case "audit": return `13. ${t.navAudit || "Audit History"}`;
      case "logout": return t.logoutBtn || "Logout";
      default: return item.label;
    }
  };

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
                    <span>{getSidebarLabel(item)}</span>
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
                  <span className="truncate">{getSidebarLabel(item)}</span>
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
