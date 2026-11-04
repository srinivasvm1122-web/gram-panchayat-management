import React, { useState } from "react";
import { 
  X, 
  Save, 
  AlertTriangle, 
  Building2, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Database
} from "lucide-react";

export const EditDashboardModal = ({ 
  isOpen, 
  onClose, 
  stats, 
  villages, 
  funds, 
  onSaveDashboardStats, 
  t, 
  lang 
}) => {
  if (!isOpen) return null;

  // Local form state initialized with current stats
  const [form, setForm] = useState({
    totalPopulation: stats.totalPopulation || 24700,
    totalLivingMembers: stats.totalLivingMembers || 24200,
    totalFamilies: stats.totalFamilies || 5160,
    aplCardFamilies: stats.aplCardFamilies || 1835,
    bplCardFamilies: stats.bplCardFamilies || 3325,
    totalRegisteredVoters: stats.totalRegisteredVoters || 17980,
    totalVotesCast: stats.totalVotesCast || 15300,
    totalFundsReceived: stats.totalFundsReceived || 4850000,
    totalExpenses: stats.totalExpenses || 3650000
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveDashboardStats(form);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const calculatedBalance = (form.totalFundsReceived || 0) - (form.totalExpenses || 0);
  const calculatedTurnout = form.totalRegisteredVoters > 0 
    ? ((form.totalVotesCast / form.totalRegisteredVoters) * 100).toFixed(2) 
    : 0;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-gov-950 via-gov-900 to-gov-800 text-white rounded-t-3xl border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gov-900 rounded-xl border border-amber-400/40">
              <Database className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                Officer Dashboard Management
              </h3>
              <p className="text-xs text-sky-200">
                Update Consolidated Dashboard Indicators & Instant Sync to Firebase
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Dashboard statistics saved and synchronized to Cloud Firestore successfully!</span>
            </div>
          )}

          {/* SECTION 1: POPULATION & FAMILIES */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-black text-gov-900 uppercase tracking-wide block">
              1. Population & Citizen Demographics
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Total Population (ಒಟ್ಟು ಜನಸಂಖ್ಯೆ) *
                </label>
                <input
                  type="number"
                  name="totalPopulation"
                  value={form.totalPopulation}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Total Living Members (ಜೀವಂತ ಸದಸ್ಯರು) *
                </label>
                <input
                  type="number"
                  name="totalLivingMembers"
                  value={form.totalLivingMembers}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-teal-800 bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: FAMILIES & RATION CARDS */}
          <div className="p-4 bg-cyan-50/50 rounded-2xl border border-cyan-200/80 space-y-3">
            <span className="text-xs font-black text-cyan-950 uppercase tracking-wide block">
              2. Household & Ration Distribution (APL / BPL)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Total Families (ಒಟ್ಟು ಕುಟುಂಬಗಳು) *
                </label>
                <input
                  type="number"
                  name="totalFamilies"
                  value={form.totalFamilies}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-cyan-900 block mb-1">
                  APL Families (APL ಕಾರ್ಡ್‌ಗಳು) *
                </label>
                <input
                  type="number"
                  name="aplCardFamilies"
                  value={form.aplCardFamilies}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-cyan-300 font-bold text-cyan-900 bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-amber-900 block mb-1">
                  BPL Families (BPL ಕಾರ್ಡ್‌ಗಳು) *
                </label>
                <input
                  type="number"
                  name="bplCardFamilies"
                  value={form.bplCardFamilies}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 font-bold text-amber-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ELECTORAL REGISTRATION & VOTES */}
          <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-950 uppercase tracking-wide block">
                3. Registered Voters & Ballots Polled
              </span>
              <span className="text-xs font-bold text-purple-800">
                Turnout: {calculatedTurnout}%
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-purple-900 block mb-1">
                  Total Registered Voters (ನೋಂದಾಯಿತ ಮತದಾರರು) *
                </label>
                <input
                  type="number"
                  name="totalRegisteredVoters"
                  value={form.totalRegisteredVoters}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-purple-300 font-bold text-purple-900 bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-emerald-900 block mb-1">
                  Total Votes Cast (ಚಲಾವಣೆಯಾದ ಮತಗಳು) *
                </label>
                <input
                  type="number"
                  name="totalVotesCast"
                  value={form.totalVotesCast}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 font-bold text-emerald-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: FUNDS & EXPENSES */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-950 uppercase tracking-wide block">
                4. Panchayat Treasury Funds & Audited Expenses
              </span>
              <span className="text-xs font-bold text-amber-800">
                Balance: ₹ {calculatedBalance.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-emerald-900 block mb-1">
                  Total Funds Received (ಸ್ವೀಕರಿಸಿದ ಒಟ್ಟು ನಿಧಿ - ₹) *
                </label>
                <input
                  type="number"
                  name="totalFundsReceived"
                  value={form.totalFundsReceived}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 font-bold text-emerald-900 bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-rose-900 block mb-1">
                  Total Expenses (ಒಟ್ಟು ಪರಿಶೋಧಿತ ವೆಚ್ಚಗಳು - ₹) *
                </label>
                <input
                  type="number"
                  name="totalExpenses"
                  value={form.totalExpenses}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-rose-300 font-bold text-rose-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Actions: Save Button, Cancel Button, Update Button */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gov-900 hover:bg-gov-800 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Save & Update Dashboard</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
