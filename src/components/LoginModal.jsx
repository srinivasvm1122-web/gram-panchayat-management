import React, { useState } from "react";
import { 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  X, 
  Building2, 
  CheckCircle2, 
  LogOut,
  Sparkles
} from "lucide-react";
import { initialAdmins } from "../data/initialData";

export const LoginModal = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  onLoginSuccess, 
  onLogout,
  t, 
  lang 
}) => {
  if (!isOpen) return null;

  const [selectedRole, setSelectedRole] = useState(currentUser?.role || "PDO");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRoleLogin = (admin) => {
    onLoginSuccess(admin);
    onClose();
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    const admin = initialAdmins.find(a => a.role === selectedRole);
    if (admin) {
      onLoginSuccess(admin);
      onClose();
    } else {
      setError("Invalid administrative credentials.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-gov-950 via-gov-900 to-gov-800 text-white border-b border-amber-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-gov-900 rounded-xl border border-amber-400/40">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  {t.loginTitle}
                </h3>
                <p className="text-xs text-sky-200">
                  {t.subTitle}
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {currentUser && (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-800 uppercase font-bold block">
                  {t.loggedInAs}:
                </span>
                <span className="text-xs font-black text-slate-900">
                  {currentUser.name} ({currentUser.role})
                </span>
              </div>
              <button
                onClick={() => { onLogout(); onClose(); }}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.logoutBtn}</span>
              </button>
            </div>
          )}

          {/* Role selector buttons for quick administrative authentication */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              {t.selectRole}:
            </label>

            <div className="space-y-2">
              {initialAdmins.map((admin) => {
                const isCurrent = currentUser?.id === admin.id;
                return (
                  <button
                    key={admin.id}
                    onClick={() => handleRoleLogin(admin)}
                    className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                      isCurrent
                        ? "bg-gov-50 border-gov-500 shadow-sm"
                        : "border-slate-200 hover:border-gov-300 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-gov-800" />
                        <span>{admin.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {admin.designation}
                      </span>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {admin.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-800 block mb-0.5">
              {t.quickDemoAccess}
            </span>
            <span>{t.demoAccessMsg}</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300 transition"
          >
            {t.cancel}
          </button>
        </div>

      </div>
    </div>
  );
};
