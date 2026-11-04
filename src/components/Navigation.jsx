import React from "react";
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  CreditCard, 
  Vote, 
  Wallet, 
  FileText, 
  ShieldCheck, 
  Lock, 
  UserCheck 
} from "lucide-react";

export const Navigation = ({ activeTab, setActiveTab, t, isOfficer, isSuperAdmin, villageCount = 10 }) => {
  const navItems = [
    { id: "home", label: t.navHome, icon: LayoutDashboard, badge: null },
    { id: "villages", label: t.navVillages, icon: MapPin, badge: villageCount },
    { id: "members", label: t.navMembers || "Village People", icon: Users, badge: "300" },
    { id: "population", label: t.navPopulation, icon: Users, badge: "Census" },
    { id: "rations", label: t.navRations, icon: CreditCard, badge: "APL/BPL" },
    { id: "elections", label: t.navElections, icon: Vote, badge: "Results" },
    { id: "funds", label: t.navFunds, icon: Wallet, badge: "Audited" },
    { id: "reports", label: t.navReports, icon: FileText, badge: "PDF/XLS" }
  ];

  // Add Officer Portal or Public switch
  if (isOfficer) {
    navItems.push({ 
      id: "admin", 
      label: t.navAdmin, 
      icon: ShieldCheck, 
      badge: isSuperAdmin ? "Super Admin" : "Officer" 
    });
    navItems.push({ 
      id: "publicLogin", 
      label: "Public View", 
      icon: UserCheck, 
      badge: "Switch" 
    });
  } else {
    navItems.push({ 
      id: "officerLogin", 
      label: t.pageOfficerLogin, 
      icon: Lock, 
      badge: "Login" 
    });
  }

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-20 z-30 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 py-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
                  isActive
                    ? "bg-gov-900 text-white shadow-md shadow-gov-900/20"
                    : "text-slate-600 hover:text-gov-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                      isActive
                        ? "bg-amber-400 text-gov-950"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
