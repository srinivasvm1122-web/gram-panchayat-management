import React from "react";
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Wallet, 
  Lock,
  ShieldCheck
} from "lucide-react";

export const MobileNav = ({ activeTab, setActiveTab, t, isOfficer }) => {
  const primaryTabs = [
    { id: "home", label: t.navHome, icon: LayoutDashboard },
    { id: "villages", label: t.navVillages, icon: MapPin },
    { id: "population", label: t.navPopulation, icon: Users },
    { id: "funds", label: t.navFunds, icon: Wallet },
    isOfficer 
      ? { id: "admin", label: "Admin", icon: ShieldCheck }
      : { id: "officerLogin", label: "Officer", icon: Lock }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 px-2 py-1 shadow-2xl safe-area-bottom">
      <div className="flex justify-around items-center">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (tab.id === "home" && activeTab === "dashboard");
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-1.5 rounded-lg transition-all ${
                isActive ? "text-gov-900 font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? "bg-amber-400 text-gov-950" : ""}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-0.5 max-w-[62px] truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
