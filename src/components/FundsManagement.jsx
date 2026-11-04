import React, { useState } from "react";
import { 
  Wallet, 
  IndianRupee, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Download, 
  FileSpreadsheet, 
  Eye, 
  X, 
  ShieldCheck, 
  Upload,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";

export const FundsManagement = ({ 
  funds, 
  transactions, 
  stats, 
  villages, 
  t, 
  lang,
  isOfficer = false,
  onAddTransaction,
  onExportPdf,
  onExportExcel
}) => {
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Form state for new transaction / expense voucher
  const [newTxn, setNewTxn] = useState({
    date: new Date().toISOString().substring(0, 10),
    type: "Debit",
    category: "Road Development",
    amount: "",
    purpose: "",
    villageId: "ALL",
    villageName: "All Villages",
    voucherNumber: `VCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    approvedBy: "Panchayat Development Officer (PDO)",
    approverName: "Chandrasekhar H.M., K.A.S. (PDO)",
    status: "Approved",
    receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60"
  });

  const [formError, setFormError] = useState("");

  const formatINR = (val = 0) => "₹ " + Number(val).toLocaleString("en-IN");

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.villageName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = filterCategory === "all" || t.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateTransaction = (e) => {
    e.preventDefault();
    if (!isOfficer) {
      setFormError("Unauthorized: Only authorized Gram Panchayat Officers can record vouchers.");
      return;
    }
    if (!newTxn.amount || Number(newTxn.amount) <= 0) {
      setFormError("Please enter a valid amount.");
      return;
    }
    if (!newTxn.purpose) {
      setFormError("Please enter the expenditure or grant purpose.");
      return;
    }

    const payload = {
      ...newTxn,
      id: `TXN-${Date.now().toString().slice(-6)}`,
      amount: Number(newTxn.amount),
      approvalDate: newTxn.date
    };

    onAddTransaction(payload);
    setIsAddModalOpen(false);
    setNewTxn({
      date: new Date().toISOString().substring(0, 10),
      type: "Debit",
      category: "Road Development",
      amount: "",
      purpose: "",
      villageId: "ALL",
      villageName: "All Villages",
      voucherNumber: `VCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      approvedBy: "Panchayat Development Officer (PDO)",
      approverName: "Chandrasekhar H.M., K.A.S. (PDO)",
      status: "Approved",
      receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60"
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTxn(prev => ({ ...prev, receiptUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wide">
              <Wallet className="w-4 h-4 text-emerald-700" />
              <span>{t.financialYear}: 2024-2025 • Public Finance Accounting</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {t.fundsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {t.fundsSubtitle}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onExportPdf}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-300 transition flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4 text-gov-800" />
              <span>Balance Sheet PDF</span>
            </button>
            {isOfficer && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4 text-emerald-200" />
                <span>{t.addTransaction}</span>
              </button>
            )}
          </div>
        </div>

        {!isOfficer && (
          <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{t.publicFundsNote}</span>
          </div>
        )}

        {/* 4 Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
            <span className="text-xs font-bold text-emerald-800 uppercase block">
              {t.totalFundsReceived}
            </span>
            <div className="text-xl font-black text-emerald-950 mt-1">
              {formatINR(stats.totalFundsReceived)}
            </div>
            <span className="text-[11px] text-emerald-700 mt-0.5 block">
              Central & State Grants
            </span>
          </div>

          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200">
            <span className="text-xs font-bold text-blue-800 uppercase block">
              {t.govtGrants} + {t.developmentFunds}
            </span>
            <div className="text-xl font-black text-blue-950 mt-1">
              {formatINR(funds.developmentFunds || 4850000)}
            </div>
            <span className="text-[11px] text-blue-700 mt-0.5 block">
              15th Finance Comm. + MGNREGA
            </span>
          </div>

          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200">
            <span className="text-xs font-bold text-rose-800 uppercase block">
              {t.totalExpenses}
            </span>
            <div className="text-xl font-black text-rose-950 mt-1">
              - {formatINR(stats.totalExpenses)}
            </div>
            <span className="text-[11px] text-rose-700 mt-0.5 block">
              Audited Vouchers & Works
            </span>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200">
            <span className="text-xs font-bold text-amber-900 uppercase block">
              {t.remainingBalance}
            </span>
            <div className="text-xl font-black text-amber-950 mt-1">
              {formatINR(stats.remainingBalance)}
            </div>
            <span className="text-[11px] text-amber-800 mt-0.5 block">
              Current Treasury Balance
            </span>
          </div>

        </div>

      </div>

      {/* CATEGORIZED EXPENDITURE BREAKDOWN */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
          <Layers className="w-5 h-5 text-gov-800" />
          <span>{lang === "kn" ? "ವೆಚ್ಚದ ವರ್ಗವಾರು ವಿವರಣೆ" : "Audited Expense Categories Breakdown"}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-semibold block text-[11px]">
              {t.roadExpenses}
            </span>
            <div className="text-sm font-black text-slate-900 mt-1">
              {formatINR(stats.breakdownExpenses?.roadExpenses || funds.roadDevelopmentExpenses)}
            </div>
            <span className="text-[10px] text-gov-700 font-bold block mt-0.5">
              CC Road & Drainage
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-semibold block text-[11px]">
              {t.waterExpenses}
            </span>
            <div className="text-sm font-black text-slate-900 mt-1">
              {formatINR(stats.breakdownExpenses?.waterExpenses || funds.waterSupplyExpenses)}
            </div>
            <span className="text-[10px] text-teal-700 font-bold block mt-0.5">
              Jal Jeevan / RO Plants
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-semibold block text-[11px]">
              {t.sanitationExpenses}
            </span>
            <div className="text-sm font-black text-slate-900 mt-1">
              {formatINR(stats.breakdownExpenses?.sanitationExpenses || funds.sanitationExpenses)}
            </div>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
              Swachh Bharat Grameen
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-semibold block text-[11px]">
              {t.lightingExpenses}
            </span>
            <div className="text-sm font-black text-slate-900 mt-1">
              {formatINR(stats.breakdownExpenses?.lightingExpenses || funds.streetLightingExpenses)}
            </div>
            <span className="text-[10px] text-amber-700 font-bold block mt-0.5">
              Solar LED Lighting
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
            <span className="text-slate-500 font-semibold block text-[11px]">
              {t.otherExpenses}
            </span>
            <div className="text-sm font-black text-slate-900 mt-1">
              {formatINR(stats.breakdownExpenses?.otherExpenses || funds.otherExpenses)}
            </div>
            <span className="text-[10px] text-purple-700 font-bold block mt-0.5">
              Anganwadi & Office
            </span>
          </div>

        </div>
      </div>

      {/* AUDITED VOUCHERS REGISTER TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gov-800" />
              <span>{t.allTransactions}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {lang === "kn" 
                ? "ಪಂಚಾಯತ್ ಅಭಿವೃದ್ಧಿ ಅಧಿಕಾರಿ (PDO) ಮತ್ತು ಅಧ್ಯಕ್ಷರು ಅನುಮೋದಿಸಿದ ಅಧಿಕೃತ ವೋಚರ್‌ಗಳು."
                : "Audited financial vouchers with verified approval authorities and receipt attachments."}
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search voucher, village..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="all">All Categories</option>
              <option value="Government Grant">Government Grants</option>
              <option value="Road Development">Road Development</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Sanitation & Waste Mgmt.">Sanitation</option>
              <option value="Street Lighting & Electricity">Street Lighting</option>
              <option value="Other Expenses">Other Expenses</option>
            </select>
          </div>
        </div>

        {/* Vouchers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">{t.voucherNumber}</th>
                <th className="px-4 py-3">{t.transactionDate}</th>
                <th className="px-4 py-3">{t.category}</th>
                <th className="px-4 py-3">Beneficiary</th>
                <th className="px-4 py-3">{t.purpose}</th>
                <th className="px-4 py-3">{t.amount}</th>
                <th className="px-4 py-3">{t.approvalDetails}</th>
                <th className="px-4 py-3 text-right">{t.receiptUpload}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransactions.map((txn) => {
                const isCredit = txn.type === "Credit";
                return (
                  <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold font-mono text-gov-900">
                      {txn.voucherNumber}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">
                      {txn.date}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                        isCredit 
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-slate-100 text-slate-800 border border-slate-200"
                      }`}>
                        {txn.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      {txn.villageName}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {txn.purpose}
                    </td>
                    <td className="px-4 py-3.5 font-black whitespace-nowrap">
                      <span className={isCredit ? "text-emerald-700" : "text-rose-600"}>
                        {isCredit ? "+" : "-"} {formatINR(txn.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-1 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{txn.status}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {txn.approvedBy}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {txn.receiptUrl ? (
                        <button
                          onClick={() => setSelectedReceipt(txn)}
                          className="px-2.5 py-1 rounded-lg bg-gov-50 text-gov-900 hover:bg-gov-100 font-semibold text-xs border border-gov-200 flex items-center space-x-1 ml-auto"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{t.viewReceipt}</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs italic">No file</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD NEW VOUCHER / TRANSACTION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gov-950 text-white rounded-t-2xl">
              <div>
                <h3 className="font-extrabold text-base flex items-center space-x-2">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  <span>{t.addTransaction}</span>
                </h3>
                <p className="text-xs text-sky-200">
                  {lang === "kn" 
                    ? "ಅಧಿಕೃತ ಪಂಚಾಯತಿ ಖರ್ಚು ಅಥವಾ ಅನುದಾನದ ವೋಚರ್ ದಾಖಲಿಸಿ."
                    : "Create audited expenditure voucher with approval authority."}
                </p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="p-6 space-y-4">
              
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  {formError}
                </div>
              )}

              {/* Type: Credit vs Debit */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewTxn({ ...newTxn, type: "Debit" })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    newTxn.type === "Debit"
                      ? "bg-rose-50 border-rose-400 text-rose-800 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <ArrowDownRight className="w-4 h-4 text-rose-600" />
                  <span>{t.debit}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNewTxn({ ...newTxn, type: "Credit", category: "Government Grant" })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    newTxn.type === "Credit"
                      ? "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  <span>{t.credit}</span>
                </button>
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t.amount} *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={newTxn.amount}
                      onChange={(e) => setNewTxn({ ...newTxn, amount: e.target.value })}
                      placeholder="e.g. 150000"
                      required
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-gov-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t.transactionDate} *
                  </label>
                  <input
                    type="date"
                    value={newTxn.date}
                    onChange={(e) => setNewTxn({ ...newTxn, date: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-gov-500"
                  />
                </div>
              </div>

              {/* Category & Beneficiary Village */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t.category} *
                  </label>
                  <select
                    value={newTxn.category}
                    onChange={(e) => setNewTxn({ ...newTxn, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-gov-500"
                  >
                    <option value="Road Development">Road Development</option>
                    <option value="Water Supply">Water Supply (Jal Jeevan)</option>
                    <option value="Sanitation & Waste Mgmt.">Sanitation & Swachh Bharat</option>
                    <option value="Street Lighting & Electricity">Street Lighting</option>
                    <option value="Government Grant">Government Grant Inflow</option>
                    <option value="Other Expenses">Other Panchayat Expenses</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Target Village *
                  </label>
                  <select
                    value={newTxn.villageId}
                    onChange={(e) => {
                      const v = villages.find(x => x.id === e.target.value);
                      setNewTxn({ 
                        ...newTxn, 
                        villageId: e.target.value,
                        villageName: v ? v.nameEn : "All Villages"
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-gov-500"
                  >
                    <option value="ALL">All Villages (General Panchayat)</option>
                    {villages.map(v => (
                      <option key={v.id} value={v.id}>{v.nameEn} (Ward {v.wardNo})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.purpose} *
                </label>
                <textarea
                  rows="2"
                  value={newTxn.purpose}
                  onChange={(e) => setNewTxn({ ...newTxn, purpose: e.target.value })}
                  placeholder="e.g. Concrete road construction from main bus stand to primary school."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-gov-500"
                ></textarea>
              </div>

              {/* Approval Authority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t.approvedBy}
                  </label>
                  <select
                    value={newTxn.approvedBy}
                    onChange={(e) => setNewTxn({ ...newTxn, approvedBy: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-gov-500"
                  >
                    <option value="Panchayat Development Officer (PDO)">PDO</option>
                    <option value="Gram Panchayat President">Gram Panchayat President</option>
                    <option value="PDO & President Joint Approval">PDO & President Joint Approval</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Voucher Bill Number
                  </label>
                  <input
                    type="text"
                    value={newTxn.voucherNumber}
                    onChange={(e) => setNewTxn({ ...newTxn, voucherNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Receipt File Upload */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.receiptUpload} (Image / PDF scan)
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gov-50 file:text-gov-900 hover:file:bg-gov-100"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md transition"
                >
                  Save Audited Voucher
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* RECEIPT / VOUCHER VIEWER MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gov-800" />
                <span className="font-extrabold text-slate-900 text-base">
                  Official Voucher: {selectedReceipt.voucherNumber}
                </span>
              </div>
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-black text-rose-600 text-sm">{formatINR(selectedReceipt.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficiary:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.villageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Approved By:</span>
                  <span className="font-bold text-emerald-800">{selectedReceipt.approvedBy}</span>
                </div>
              </div>

              {/* Receipt Preview Attachment */}
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center max-h-56">
                <img 
                  src={selectedReceipt.receiptUrl} 
                  alt="Voucher Receipt Attachment" 
                  className="w-full h-auto object-cover max-h-56"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Statutory Audit Stamp: Reconciled with Karnataka Treasury Khajane-II voucher registry.</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-gov-900 text-white font-bold text-xs hover:bg-gov-800 transition"
            >
              Close Voucher Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
