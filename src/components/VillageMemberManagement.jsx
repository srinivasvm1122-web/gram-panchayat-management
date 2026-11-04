import React, { useState, useMemo } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Activity, 
  HeartHandshake, 
  Phone, 
  Home, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Save, 
  Edit3, 
  Trash2, 
  Lock, 
  ShieldCheck, 
  Building2, 
  ChevronRight, 
  Download, 
  FileSpreadsheet,
  Calendar,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles,
  LayoutGrid,
  Table
} from "lucide-react";
import { VILLAGES_CONFIG } from "../data/memberData";

export const VillageMemberManagement = ({ 
  members = [], 
  villages = [], 
  isOfficer = false, 
  onAddMember, 
  onUpdateMember, 
  onDeleteMember, 
  onNavigateToLogin,
  t, 
  lang 
}) => {
  // Selected village tab: "ALL" or specific village ID
  const [selectedVillageId, setSelectedVillageId] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState("November 2024");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRation, setFilterRation] = useState("all");
  const [filterCheckup, setFilterCheckup] = useState("all");
  const [filterCaste, setFilterCaste] = useState("all");
  const [showCategorySummary, setShowCategorySummary] = useState(true);
  const [directoryViewMode, setDirectoryViewMode] = useState("cards"); // "cards" (Directory Layout) | "table" (Tabular View)

  // Style helper for statutory caste categories
  const getCasteStyle = (cat) => {
    switch (cat) {
      case "SC":
        return {
          header: "bg-purple-800 text-white border-purple-900",
          badge: "bg-purple-100 text-purple-900 border-purple-300",
          accent: "text-purple-700"
        };
      case "ST":
        return {
          header: "bg-emerald-800 text-white border-emerald-900",
          badge: "bg-emerald-100 text-emerald-900 border-emerald-300",
          accent: "text-emerald-700"
        };
      case "OBC":
        return {
          header: "bg-blue-800 text-white border-blue-900",
          badge: "bg-blue-100 text-blue-900 border-blue-300",
          accent: "text-blue-700"
        };
      case "General":
        return {
          header: "bg-slate-900 text-white border-black",
          badge: "bg-slate-100 text-slate-800 border-slate-300",
          accent: "text-slate-700"
        };
      case "Other":
        return {
          header: "bg-amber-800 text-white border-amber-900",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          accent: "text-amber-700"
        };
      case "Not Disclosed":
      default:
        return {
          header: "bg-gray-700 text-white border-gray-800",
          badge: "bg-gray-100 text-gray-700 border-gray-300",
          accent: "text-gray-700"
        };
    }
  };

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [showFullPhone, setShowFullPhone] = useState(false);

  // Form state for add/edit member
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    guardianName: "",
    villageId: "VIL-001",
    villageName: "Shivapura",
    wardNo: 1,
    houseNumber: "",
    familyId: "",
    gender: "Male",
    age: "",
    rationType: "BPL",
    caste: "General",
    casteCategory: "General",
    phone: "",
    medicalCheckupStatus: "Completed",
    lastCheckupMonth: "November 2024",
    remarks: ""
  });

  const [formError, setFormError] = useState("");

  // Village list mapping
  const villageList = villages.length > 0 ? villages : VILLAGES_CONFIG;

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const casteVal = m.caste || m.casteCategory || "General";
      const matchVillage = selectedVillageId === "ALL" || m.villageId === selectedVillageId;
      const matchSearch = 
        m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.houseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.familyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.phone && m.phone.includes(searchTerm)) ||
        (isOfficer && casteVal.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchRation = filterRation === "all" || m.rationType === filterRation;
      const matchCheckup = filterCheckup === "all" || m.medicalCheckupStatus === filterCheckup;
      const matchCaste = filterCaste === "all" || casteVal === filterCaste;
      return matchVillage && matchSearch && matchRation && matchCheckup && matchCaste;
    });
  }, [members, selectedVillageId, searchTerm, filterRation, filterCheckup, filterCaste, isOfficer]);

  // Statistics for the selected village (or all)
  const currentVillageMembers = useMemo(() => {
    return selectedVillageId === "ALL" 
      ? members 
      : members.filter(m => m.villageId === selectedVillageId);
  }, [members, selectedVillageId]);

  const totalRegisteredInView = currentVillageMembers.length;
  const checkupsCompletedCount = currentVillageMembers.filter(m => m.medicalCheckupStatus === "Completed").length;
  const checkupsPendingCount = currentVillageMembers.filter(m => m.medicalCheckupStatus === "Not Completed").length;
  const checkupsNaCount = currentVillageMembers.filter(m => m.medicalCheckupStatus === "Not Applicable").length;

  const completionRate = totalRegisteredInView > 0 
    ? ((checkupsCompletedCount / totalRegisteredInView) * 100).toFixed(1) 
    : 0;

  // Category-wise statistical counts for authorized Officers (Statutory Rollup)
  const categoryStats = useMemo(() => {
    const total = currentVillageMembers.length;
    const getCat = (m) => m.caste || m.casteCategory || "General";
    const general = currentVillageMembers.filter(m => getCat(m) === "General").length;
    const obc = currentVillageMembers.filter(m => getCat(m) === "OBC").length;
    const sc = currentVillageMembers.filter(m => getCat(m) === "SC").length;
    const st = currentVillageMembers.filter(m => getCat(m) === "ST").length;
    const other = currentVillageMembers.filter(m => getCat(m) === "Other").length;
    const notDisclosed = currentVillageMembers.filter(m => !getCat(m) || getCat(m) === "Not Disclosed").length;

    return {
      total,
      general,
      obc,
      sc,
      st,
      other,
      notDisclosed,
      generalPct: total > 0 ? ((general / total) * 100).toFixed(1) : 0,
      obcPct: total > 0 ? ((obc / total) * 100).toFixed(1) : 0,
      scPct: total > 0 ? ((sc / total) * 100).toFixed(1) : 0,
      stPct: total > 0 ? ((st / total) * 100).toFixed(1) : 0,
      otherPct: total > 0 ? ((other / total) * 100).toFixed(1) : 0,
      notDisclosedPct: total > 0 ? ((notDisclosed / total) * 100).toFixed(1) : 0
    };
  }, [currentVillageMembers]);

  // Open Add modal with auto-generated ID
  const openAddModal = () => {
    const targetVil = villageList.find(v => v.id === (selectedVillageId === "ALL" ? "VIL-001" : selectedVillageId)) || villageList[0];
    const code = targetVil.code || targetVil.nameEn?.substring(0, 4).toUpperCase() || "VIL";
    const nextNum = members.filter(m => m.villageId === targetVil.id).length + 1;
    const autoId = `MEM-${code}-${String(nextNum).padStart(3, "0")}`;

    setFormData({
      id: autoId,
      fullName: "",
      guardianName: "",
      villageId: targetVil.id,
      villageName: targetVil.nameEn || targetVil.name || "Shivapura",
      wardNo: targetVil.wardNo || targetVil.ward || 1,
      houseNumber: `H-${targetVil.wardNo || 1}/${nextNum}A`,
      familyId: `FAM-${String(targetVil.wardNo || 1).padStart(2, "0")}-${String(Math.floor((nextNum - 1) / 3) + 1).padStart(3, "0")}`,
      gender: "Male",
      age: "32",
      rationType: "BPL",
      caste: "General",
      casteCategory: "General",
      phone: "+91 98450 ",
      medicalCheckupStatus: "Completed",
      lastCheckupMonth: selectedMonth,
      remarks: "Routine blood pressure and general health screening completed."
    });
    setFormError("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (mem) => {
    setEditingMember(mem);
    const casteVal = mem.caste || mem.casteCategory || "General";
    setFormData({ 
      ...mem,
      caste: casteVal,
      casteCategory: casteVal
    });
    setFormError("");
  };

  const handleSaveMember = (e) => {
    e.preventDefault();
    if (!isOfficer) {
      setFormError("Unauthorized: Only authorized Officers can add or update member records.");
      return;
    }
    if (!formData.fullName.trim()) {
      setFormError("Please enter the member's full name.");
      return;
    }
    if (!formData.houseNumber.trim()) {
      setFormError("Please enter the house number.");
      return;
    }

    const casteVal = formData.caste || formData.casteCategory || "General";
    const payload = {
      ...formData,
      caste: casteVal,
      casteCategory: casteVal,
      age: Number(formData.age) || 30
    };

    if (editingMember) {
      onUpdateMember(payload);
      setEditingMember(null);
    } else {
      onAddMember(payload);
      setIsAddModalOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingMember && isOfficer) {
      onDeleteMember(deletingMember.id, deletingMember.fullName, deletingMember.villageName);
      setDeletingMember(null);
    }
  };

  // Quick 1-click toggle checkup status by Officer
  const handleQuickToggleCheckup = (mem) => {
    if (!isOfficer) return;
    const nextStatus = mem.medicalCheckupStatus === "Completed" ? "Not Completed" : "Completed";
    onUpdateMember({
      ...mem,
      medicalCheckupStatus: nextStatus,
      lastCheckupMonth: nextStatus === "Completed" ? selectedMonth : mem.lastCheckupMonth
    });
  };

  // Export Village-Wise Category Summary Report (Confidential - Officer Only)
  const handleExportCategorySummary = () => {
    const vName = selectedVillageId === "ALL" ? "All-10-Villages" : (villageList.find(v => v.id === selectedVillageId)?.nameEn || selectedVillageId);
    let csv = `Gram Panchayat Digital Management System - Category Summary Report\n`;
    csv += `Village: ${vName}\n`;
    csv += `Date: ${new Date().toLocaleDateString()}\n`;
    csv += `Classification: CONFIDENTIAL - Specifically Authorized Officers Only\n\n`;
    csv += `Caste Category,Total Count,Percentage (%)\n`;
    csv += `1. General,${categoryStats.general},${categoryStats.generalPct}%\n`;
    csv += `2. OBC (Other Backward Classes),${categoryStats.obc},${categoryStats.obcPct}%\n`;
    csv += `3. SC (Scheduled Caste),${categoryStats.sc},${categoryStats.scPct}%\n`;
    csv += `4. ST (Scheduled Tribe),${categoryStats.st},${categoryStats.stPct}%\n`;
    csv += `5. Other,${categoryStats.other},${categoryStats.otherPct}%\n`;
    csv += `6. Not Disclosed (Optional),${categoryStats.notDisclosed},${categoryStats.notDisclosedPct}%\n`;
    csv += `Total Registered Members,${categoryStats.total},100%\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Category_Summary_${vName}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP BANNER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-gov-800 uppercase tracking-wide">
              <Users className="w-4 h-4 text-gov-800" />
              <span>Village People & Family Records Management • 10 Villages</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {lang === "kn" ? t.membersTitle : "Village People & Family Records Management"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {lang === "kn" ? t.membersSubtitle : "Individual citizen records, household mapping, ration eligibility and monthly medical checkup tracking."}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {isOfficer && (
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center space-x-1.5"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>{t.addNewPerson}</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. MONTHLY MEDICAL CHECKUP TRACKING WIDGET (Requirement 5) */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span className="font-extrabold text-sm text-slate-900">
                Monthly Medical Checkup Tracking (ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ತಪಾಸಣೆ)
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 font-semibold">{t.selectMonth}:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold bg-slate-50 text-slate-800 focus:outline-none"
              >
                <option value="November 2024">November 2024</option>
                <option value="October 2024">October 2024</option>
                <option value="September 2024">September 2024</option>
              </select>
            </div>
          </div>

          {/* 4 Stat Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Total Registered Members
              </span>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                {totalRegisteredInView}
              </div>
              <span className="text-[10px] text-slate-500">
                {selectedVillageId === "ALL" ? "All 10 Villages" : "Current Ward"}
              </span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                {t.checkupsCompletedStat}
              </span>
              <div className="text-xl font-black text-emerald-950 mt-0.5">
                {checkupsCompletedCount}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">
                Screened at PHC
              </span>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">
                {t.checkupsPendingStat}
              </span>
              <div className="text-xl font-black text-amber-950 mt-0.5">
                {checkupsPendingCount}
              </div>
              <span className="text-[10px] text-amber-700 font-semibold">
                Scheduled Follow-up
              </span>
            </div>

            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
              <span className="text-[10px] font-bold text-sky-800 uppercase block">
                {t.checkupCompletionRate}
              </span>
              <div className="text-xl font-black text-sky-950 mt-0.5">
                {completionRate}%
              </div>
              <span className="text-[10px] text-sky-700 font-semibold">
                Target: &gt;80%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-500 h-full transition-all"
                style={{ width: `${completionRate}%` }}
                title="Completed"
              ></div>
              <div 
                className="bg-amber-400 h-full transition-all"
                style={{ width: `${totalRegisteredInView > 0 ? (checkupsPendingCount / totalRegisteredInView) * 100 : 0}%` }}
                title="Pending"
              ></div>
            </div>
          </div>
        </div>

        {/* STATUTORY CATEGORY SUMMARY REPORT WIDGET (Officer Only - Requirement) */}
        {isOfficer && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-indigo-700" />
                <span className="font-extrabold text-sm text-slate-900">
                  {lang === "kn" ? t.categorySummaryTitle : "Village-Wise Category Demographics Summary (Statutory Rollup)"}
                </span>
                <span className="text-[10px] bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Officer Confidential
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportCategorySummary}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold border border-slate-300 flex items-center space-x-1.5 transition shadow-sm"
                  title="Export Category Summary CSV"
                >
                  <Download className="w-3.5 h-3.5 text-gov-800" />
                  <span>Export Report (CSV)</span>
                </button>
                <button
                  onClick={() => setShowCategorySummary(!showCategorySummary)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1"
                >
                  {showCategorySummary ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {showCategorySummary && (
              <>
                <p className="text-xs text-slate-500 mb-3">
                  {lang === "kn" ? t.categorySummarySubtitle : "Consolidated rollups across General, OBC, SC, ST, Other and Not Disclosed for welfare schemes and statutory reporting."}
                </p>

                {/* 6 Category Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
                  {/* 1. General */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-600 uppercase block">1. General</span>
                    <div className="text-lg font-black text-slate-900 mt-0.5">{categoryStats.general}</div>
                    <span className="text-[10px] text-slate-500">{categoryStats.generalPct}% of ward</span>
                  </div>

                  {/* 2. OBC */}
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="text-[10px] font-bold text-blue-800 uppercase block">2. OBC</span>
                    <div className="text-lg font-black text-blue-950 mt-0.5">{categoryStats.obc}</div>
                    <span className="text-[10px] text-blue-700 font-semibold">{categoryStats.obcPct}% of ward</span>
                  </div>

                  {/* 3. SC */}
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                    <span className="text-[10px] font-bold text-purple-800 uppercase block">3. SC</span>
                    <div className="text-lg font-black text-purple-950 mt-0.5">{categoryStats.sc}</div>
                    <span className="text-[10px] text-purple-700 font-semibold">{categoryStats.scPct}% of ward</span>
                  </div>

                  {/* 4. ST */}
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">4. ST</span>
                    <div className="text-lg font-black text-emerald-950 mt-0.5">{categoryStats.st}</div>
                    <span className="text-[10px] text-emerald-700 font-semibold">{categoryStats.stPct}% of ward</span>
                  </div>

                  {/* 5. Other */}
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">5. Other</span>
                    <div className="text-lg font-black text-amber-950 mt-0.5">{categoryStats.other}</div>
                    <span className="text-[10px] text-amber-700 font-semibold">{categoryStats.otherPct}% of ward</span>
                  </div>

                  {/* 6. Not Disclosed */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">6. Not Disclosed</span>
                    <div className="text-lg font-black text-gray-700 mt-0.5">{categoryStats.notDisclosed}</div>
                    <span className="text-[10px] text-gray-500 font-medium">{categoryStats.notDisclosedPct}% (Optional)</span>
                  </div>
                </div>

                {/* Proportional Multi-Segment Progress Bar */}
                <div className="mt-3">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex" title="Category distribution">
                    <div className="bg-slate-400 h-full" style={{ width: `${categoryStats.generalPct}%` }} title={`General: ${categoryStats.general}`}></div>
                    <div className="bg-blue-500 h-full" style={{ width: `${categoryStats.obcPct}%` }} title={`OBC: ${categoryStats.obc}`}></div>
                    <div className="bg-purple-500 h-full" style={{ width: `${categoryStats.scPct}%` }} title={`SC: ${categoryStats.sc}`}></div>
                    <div className="bg-emerald-500 h-full" style={{ width: `${categoryStats.stPct}%` }} title={`ST: ${categoryStats.st}`}></div>
                    <div className="bg-amber-400 h-full" style={{ width: `${categoryStats.otherPct}%` }} title={`Other: ${categoryStats.other}`}></div>
                    <div className="bg-gray-300 h-full" style={{ width: `${categoryStats.notDisclosedPct}%` }} title={`Not Disclosed: ${categoryStats.notDisclosed}`}></div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 3. VILLAGE SELECTOR TABS (10 SEPARATE VILLAGES) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm overflow-x-auto scrollbar-none">
        <div className="flex space-x-1.5 min-w-max">
          <button
            onClick={() => setSelectedVillageId("ALL")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              selectedVillageId === "ALL"
                ? "bg-gov-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>All Villages</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedVillageId === "ALL" ? "bg-amber-400 text-gov-950 font-black" : "bg-slate-200"}`}>
              {members.length}
            </span>
          </button>

          {villageList.map((v) => {
            const count = members.filter(m => m.villageId === v.id).length;
            const isSelected = selectedVillageId === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVillageId(v.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  isSelected
                    ? "bg-gov-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{v.nameEn || v.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-amber-400 text-gov-950 font-black" : "bg-slate-200"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. SEARCH & FILTER CONTROLS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPersonPlaceholder}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterRation}
            onChange={(e) => setFilterRation(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 font-semibold bg-white text-xs"
          >
            <option value="all">All Ration Cards</option>
            <option value="BPL">BPL Priority</option>
            <option value="APL">APL Non-Priority</option>
          </select>

          <select
            value={filterCheckup}
            onChange={(e) => setFilterCheckup(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 font-semibold bg-white text-xs"
          >
            <option value="all">All Checkup Status</option>
            <option value="Completed">Completed</option>
            <option value="Not Completed">Not Completed</option>
            <option value="Not Applicable">Not Applicable</option>
          </select>

          {/* Caste Category Filter (Officer Only) */}
          {isOfficer && (
            <select
              value={filterCaste}
              onChange={(e) => setFilterCaste(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-indigo-300 font-bold bg-indigo-50/80 text-indigo-950 text-xs focus:ring-2 focus:ring-indigo-400"
              title="Filter by Statutory Caste Category"
            >
              <option value="all">All Categories (ಪ್ರವರ್ಗ)</option>
              <option value="General">1. General (ಸಾಮಾನ್ಯ)</option>
              <option value="OBC">2. OBC (ಹಿಂದುಳಿದ ವರ್ಗ)</option>
              <option value="SC">3. SC (ಪರಿಶಿಷ್ಟ ಜಾತಿ)</option>
              <option value="ST">4. ST (ಪರಿಶಿಷ್ಟ ಪಂಗಡ)</option>
              <option value="Other">5. Other (ಇತರೆ)</option>
              <option value="Not Disclosed">6. Not Disclosed (ತಿಳಿಸಿಲ್ಲ)</option>
            </select>
          )}

          {isOfficer && (
            <button
              onClick={() => setShowFullPhone(!showFullPhone)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold bg-slate-50 hover:bg-slate-100 flex items-center space-x-1"
              title="Toggle Phone Number Visibility"
            >
              {showFullPhone ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showFullPhone ? "Mask Phones" : "Show Full Phones"}</span>
            </button>
          )}
        </div>

      </div>

      {/* 5. PRIVACY LOCK NOTICE (If Public User) */}
      {!isOfficer && (
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-5 shadow-sm text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-sm block text-amber-900">
                {t.memberPrivacyLockTitle} (Section 6, Data Protection Protocol)
              </span>
              <p className="mt-0.5 text-amber-800 leading-relaxed font-medium">
                {t.memberPrivacyLockMsg}
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToLogin}
            className="px-4 py-2 rounded-xl bg-gov-900 text-white font-bold text-xs hover:bg-gov-800 shadow-sm flex-shrink-0"
          >
            Officer Sign In &rarr;
          </button>
        </div>
      )}

      {/* 6. REGISTERED MEMBERS DIRECTORY */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Directory Header with View Switcher */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <span>Registered Village Members Directory</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gov-900 text-white font-bold">
                {filteredMembers.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Displaying member records with statutory Caste Category as the FIRST field before all other details.
            </p>
          </div>

          {/* View Switcher: Directory Cards (Default) vs Tabular View */}
          <div className="flex items-center space-x-1.5 bg-slate-200/80 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setDirectoryViewMode("cards")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                directoryViewMode === "cards"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Directory Layout (Caste Category as First Heading)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Directory Cards</span>
            </button>
            <button
              onClick={() => setDirectoryViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                directoryViewMode === "table"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Tabular View (Caste Category as First Column)"
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tabular View</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredMembers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-semibold">No member records match the selected village or filter criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the search bar or category filters.</p>
          </div>
        ) : directoryViewMode === "cards" ? (
          
          /* DIRECTORY CARDS LAYOUT: Caste Category as FIRST heading before all other details */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 sm:p-5 bg-slate-50/40">
            {filteredMembers.map((mem) => {
              const casteStyle = getCasteStyle(mem.casteCategory);
              const isCheckupDone = mem.medicalCheckupStatus === "Completed";
              const isCheckupPending = mem.medicalCheckupStatus === "Not Completed";

              return (
                <div 
                  key={mem.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* FIRST FIELD / HEADING: Caste Category (Authorized Officers Only) */}
                  {isOfficer ? (
                    <div className={`px-4 py-3 border-b flex items-center justify-between ${casteStyle.header}`}>
                      {/* Show ONLY the caste category as the first heading */}
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-white/90 flex-shrink-0" />
                        <h4 className="font-black text-sm uppercase tracking-wider">
                          {mem.casteCategory || "Not Disclosed"}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-white/20 text-white px-2 py-0.5 rounded">
                        {mem.id}
                      </span>
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-slate-100 text-slate-800 border-b border-slate-200 flex items-center justify-between font-bold text-xs uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span>Citizen Record</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{mem.id}</span>
                    </div>
                  )}

                  {/* MEMBER DETAILS LIST (Name without caste inside or next to it) */}
                  <div className="p-4 space-y-2.5 text-xs text-slate-700 flex-grow bg-white">
                    {/* - Name: Ravi Kumar - [OBC] */}
                    <div className="flex items-start justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-semibold w-20 flex-shrink-0 flex items-center space-x-1.5">
                        <span className="text-slate-400 font-black">•</span>
                        <span>Name:</span>
                      </span>
                      <div className="text-right flex-grow flex items-center justify-end flex-wrap gap-1.5">
                        <span 
                          onClick={() => setViewingMember(mem)}
                          className="font-extrabold text-slate-900 text-sm hover:text-gov-800 hover:underline cursor-pointer"
                          title="Click to view full individual member profile"
                        >
                          {mem.fullName}
                        </span>
                        {isOfficer && (
                          <span className={`inline-flex items-center text-[11px] font-black px-2 py-0.5 rounded-md border shadow-2xs ${casteStyle.badge}`}>
                            - [{mem.caste || mem.casteCategory || "General"}]
                          </span>
                        )}
                      </div>
                    </div>

                    {/* - Caste: SC / ST / OBC / General */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-semibold w-20 flex-shrink-0 flex items-center space-x-1.5">
                        <span className="text-slate-400 font-black">•</span>
                        <span>Caste:</span>
                      </span>
                      <div className="text-right">
                        {isOfficer ? (
                          <span className={`inline-flex items-center text-xs font-black px-2.5 py-0.5 rounded-lg border shadow-xs ${casteStyle.badge}`}>
                            <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
                            {mem.caste || mem.casteCategory || "General"}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px] font-normal">Restricted (Officer Only)</span>
                        )}
                      </div>
                    </div>

                    {/* - Village: Village 1 */}
                    <div className="flex items-start justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-semibold w-24 flex-shrink-0 flex items-center space-x-1.5">
                        <span className="text-slate-400 font-black">•</span>
                        <span>Village:</span>
                      </span>
                      <span className="font-bold text-slate-800 text-right">
                        {mem.villageName}
                        {mem.houseNumber && (
                          <span className="block text-[11px] font-mono text-slate-500 font-normal">
                            House: {mem.houseNumber}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* - Ration Card: BPL */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-semibold w-24 flex-shrink-0 flex items-center space-x-1.5">
                        <span className="text-slate-400 font-black">•</span>
                        <span>Ration Card:</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-black ${
                        mem.rationType === "BPL"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-cyan-100 text-cyan-900 border border-cyan-300"
                      }`}>
                        {mem.rationType}
                      </span>
                    </div>

                    {/* - Phone: Member Phone */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-semibold w-24 flex-shrink-0 flex items-center space-x-1.5">
                        <span className="text-slate-400 font-black">•</span>
                        <span>Phone:</span>
                      </span>
                      <span className="font-mono font-bold text-slate-800 text-right">
                        {isOfficer ? (
                          showFullPhone ? mem.phone : `${mem.phone.substring(0, 8)}••••`
                        ) : (
                          <span className="text-slate-400 italic text-[11px] font-normal">Restricted (Officer Only)</span>
                        )}
                      </span>
                    </div>

                    {/* - Medical Checkup */}
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-slate-500 font-semibold w-24 flex-shrink-0 flex items-center space-x-1.5">
                        <span className="text-slate-400 font-black">•</span>
                        <span>Medical:</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border flex items-center space-x-1 ${
                        isCheckupDone
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : isCheckupPending
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {isCheckupDone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {isCheckupPending && <Clock className="w-3 h-3 text-amber-600" />}
                        <span>{mem.medicalCheckupStatus}</span>
                      </span>
                    </div>
                  </div>

                  {/* Officer Actions Bar */}
                  {isOfficer && (
                    <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setViewingMember(mem)}
                        className="text-gov-800 font-bold hover:underline flex items-center space-x-1 text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => openEditModal(mem)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold hover:bg-blue-100 text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingMember(mem)}
                          className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 font-bold hover:bg-red-100 text-[11px]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          
          /* TABULAR LAYOUT: Caste Category as FIRST column before all other details */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{t.memberId}</th>
                  <th className="px-4 py-3">{t.fullName}</th>
                  {isOfficer && (
                    <th className="px-4 py-3 text-indigo-950 whitespace-nowrap bg-indigo-50/80 border-x border-indigo-100 font-extrabold">
                      <span className="flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-700 inline" />
                        <span>Caste (SC, ST, OBC, General)</span>
                      </span>
                    </th>
                  )}
                  <th className="px-4 py-3">Village & House</th>
                  <th className="px-4 py-3">{t.familyId}</th>
                  <th className="px-4 py-3">Ration Card</th>
                  <th className="px-4 py-3">{t.phone}</th>
                  <th className="px-4 py-3">{t.medicalCheckupStatus}</th>
                  <th className="px-4 py-3">Last Checkup</th>
                  {isOfficer && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMembers.map((mem) => {
                  const isCheckupDone = mem.medicalCheckupStatus === "Completed";
                  const isCheckupPending = mem.medicalCheckupStatus === "Not Completed";
                  const casteStyle = getCasteStyle(mem.caste || mem.casteCategory);

                  return (
                    <tr key={mem.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Member ID */}
                      <td className="px-4 py-3.5 font-mono font-bold text-gov-900 text-xs">
                        {mem.id}
                      </td>

                      {/* Full Name & Guardian: Name - [General] */}
                      <td className="px-4 py-3.5">
                        <div className="font-extrabold text-slate-900 flex items-center flex-wrap gap-1.5">
                          <span 
                            onClick={() => setViewingMember(mem)}
                            className="cursor-pointer hover:text-gov-800 hover:underline text-sm"
                            title="Click to view full individual member profile"
                          >
                            {mem.fullName}
                          </span>
                          {isOfficer && (
                            <span className={`text-[11px] font-black px-2 py-0.5 rounded-md border shadow-2xs ${casteStyle.badge}`}>
                              - [{mem.caste || mem.casteCategory || "General"}]
                            </span>
                          )}
                        </div>
                        {mem.guardianName && (
                          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                            c/o {mem.guardianName} ({mem.gender || "Citizen"}, {mem.age || "35"}y)
                          </div>
                        )}
                      </td>

                      {/* DEDICATED CASTE COLUMN (SC, ST, OBC, General) */}
                      {isOfficer && (
                        <td className="px-4 py-3.5 bg-indigo-50/20 border-x border-indigo-100/50">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-black border uppercase tracking-wider inline-flex items-center space-x-1 shadow-xs ${casteStyle.badge}`}>
                            <ShieldCheck className="w-3 h-3 text-current inline" />
                            <span>{mem.caste || mem.casteCategory || "General"}</span>
                          </span>
                        </td>
                      )}

                      {/* Village & House No */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-800">{mem.villageName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">House: {mem.houseNumber}</div>
                      </td>

                      {/* Family ID */}
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-600 font-semibold">
                        {mem.familyId}
                      </td>

                      {/* Ration Card */}
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-black ${
                          mem.rationType === "BPL"
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-cyan-100 text-cyan-900 border border-cyan-300"
                        }`}>
                          {mem.rationType}
                        </span>
                      </td>

                      {/* Phone Number (Masked for privacy unless Officer toggles) */}
                      <td className="px-4 py-3.5 font-mono text-xs">
                        {isOfficer ? (
                          showFullPhone ? (
                            <span className="font-bold text-slate-800">{mem.phone}</span>
                          ) : (
                            <span className="text-slate-600 font-medium">{mem.phone.substring(0, 8)}••••</span>
                          )
                        ) : (
                          <span className="text-slate-400 italic font-medium">Restricted (Officer Only)</span>
                        )}
                      </td>

                      {/* Medical Checkup Status */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center space-x-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border flex items-center space-x-1 ${
                            isCheckupDone
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : isCheckupPending
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}>
                            {isCheckupDone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {isCheckupPending && <Clock className="w-3 h-3 text-amber-600" />}
                            <span>{mem.medicalCheckupStatus}</span>
                          </span>

                          {isOfficer && (
                            <button
                              onClick={() => handleQuickToggleCheckup(mem)}
                              className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700"
                              title="Quick Toggle Checkup Status"
                            >
                              <Activity className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Last Checkup Month */}
                      <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">
                        {mem.lastCheckupMonth}
                      </td>

                      {/* Actions (Officer Only) */}
                      {isOfficer && (
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setViewingMember(mem)}
                              className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                              title="View Individual Profile"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditModal(mem)}
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                              title={t.editPerson}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingMember(mem)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                              title={t.deletePerson}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 7. ADD / EDIT PERSON MODAL */}
      {(isAddModalOpen || editingMember) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            
            <div className="p-5 bg-gradient-to-r from-gov-950 to-gov-800 text-white rounded-t-3xl border-b border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Users className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base text-white">
                  {editingMember ? t.editPerson : t.addNewPerson}
                </h3>
              </div>
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditingMember(null); }}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-6 space-y-4 text-xs">
              
              {formError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Member ID & Full Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.memberId} *</label>
                  <input
                    type="text"
                    value={formData.id}
                    readOnly
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-100 font-mono font-bold text-slate-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">{t.fullName} *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Ramesh Gowda"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              {/* Guardian Name, Gender, Age */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.guardianName}</label>
                  <input
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="Father / Guardian"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.gender}</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.age}</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Village, House Number, Family ID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Village *</label>
                  <select
                    value={formData.villageId}
                    onChange={(e) => {
                      const v = villageList.find(x => x.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        villageId: e.target.value,
                        villageName: v?.nameEn || v?.name || "Shivapura",
                        wardNo: v?.wardNo || v?.ward || 1
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  >
                    {villageList.map(v => (
                      <option key={v.id} value={v.id}>{v.nameEn || v.name} (Ward {v.wardNo || v.ward})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.houseNumber} *</label>
                  <input
                    type="text"
                    value={formData.houseNumber}
                    onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                    placeholder="e.g. H-1/12A"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.familyId} *</label>
                  <input
                    type="text"
                    value={formData.familyId}
                    onChange={(e) => setFormData({ ...formData, familyId: e.target.value })}
                    placeholder="e.g. FAM-01-015"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              {/* Ration Card & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ration Card Type *</label>
                  <select
                    value={formData.rationType}
                    onChange={(e) => setFormData({ ...formData, rationType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  >
                    <option value="BPL">BPL (Below Poverty Line / NFSA)</option>
                    <option value="APL">APL (Above Poverty Line)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.phone} *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98450 12345"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              {/* Caste Selection Field: General, OBC, SC, ST */}
              <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-indigo-950 text-xs flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-700" />
                    <span>Caste (ಜಾತಿ) *</span>
                  </span>
                  <span className="text-[10px] bg-indigo-200 text-indigo-950 px-2 py-0.5 rounded-full font-bold">
                    Official Statutory Selection
                  </span>
                </div>
                <p className="text-[11px] text-indigo-800 leading-snug">
                  {lang === "kn"
                    ? "ಶಾಸನಬದ್ಧ ಸರಕಾರಿ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳಿಗಾಗಿ ಜಾತಿ ಪ್ರವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ."
                    : "Select the member's statutory caste category for official welfare administration."}
                </p>
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">
                    Select Caste (General, OBC, SC, ST) *
                  </label>
                  <select
                    value={formData.caste || formData.casteCategory || "General"}
                    onChange={(e) => setFormData({ ...formData, caste: e.target.value, casteCategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-indigo-300 font-bold bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  >
                    <option value="General">General (ಸಾಮಾನ್ಯ)</option>
                    <option value="OBC">OBC (Other Backward Classes / ಹಿಂದುಳಿದ ವರ್ಗ)</option>
                    <option value="SC">SC (Scheduled Caste / ಪರಿಶಿಷ್ಟ ಜಾತಿ)</option>
                    <option value="ST">ST (Scheduled Tribe / ಪರಿಶಿಷ್ಟ ಪಂಗಡ)</option>
                    <option value="Other">Other (ಇತರೆ)</option>
                    <option value="Not Disclosed">Not Disclosed (ತಿಳಿಸಿಲ್ಲ)</option>
                  </select>
                </div>
              </div>

              {/* Medical Checkup Tracking */}
              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                <span className="font-black text-emerald-950 uppercase tracking-wide block">
                  Monthly Medical Checkup Status (ಆರೋಗ್ಯ ತಪಾಸಣೆ ವಿವರ)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-emerald-900 block mb-1">Checkup Status</label>
                    <select
                      value={formData.medicalCheckupStatus}
                      onChange={(e) => setFormData({ ...formData, medicalCheckupStatus: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 font-bold bg-white text-emerald-950"
                    >
                      <option value="Completed">Completed (ಪೂರ್ಣಗೊಂಡಿದೆ)</option>
                      <option value="Not Completed">Not Completed (ಬಾಕಿ ಇದೆ)</option>
                      <option value="Not Applicable">Not Applicable (ಅನ್ವಯಿಸುವುದಿಲ್ಲ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-emerald-900 block mb-1">Last Checkup Month</label>
                    <select
                      value={formData.lastCheckupMonth}
                      onChange={(e) => setFormData({ ...formData, lastCheckupMonth: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 font-semibold bg-white"
                    >
                      <option value="November 2024">November 2024</option>
                      <option value="October 2024">October 2024</option>
                      <option value="September 2024">September 2024</option>
                      <option value="August 2024">August 2024</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-emerald-900 block mb-1">Remarks (Optional)</label>
                  <input
                    type="text"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="e.g. Routine blood pressure screened at primary health center."
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white"
                  />
                </div>
              </div>

              {/* Action Buttons: Save, Update, Cancel */}
              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingMember(null); }}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gov-900 text-white font-bold hover:bg-gov-800 shadow-md flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>{editingMember ? "Update Person Details" : "Save Person Record"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 8. DELETE CONFIRMATION MODAL */}
      {deletingMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-center font-extrabold text-slate-900 text-base">
              Confirm Record Deletion
            </h3>
            <p className="text-center text-xs text-slate-600 mt-2 leading-relaxed">
              Are you sure you want to delete the member record for <strong>{deletingMember.fullName}</strong> ({deletingMember.id}) from {deletingMember.villageName}?
            </p>
            <div className="mt-5 flex space-x-2">
              <button
                onClick={() => setDeletingMember(null)}
                className="w-1/2 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-1/2 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. INDIVIDUAL MEMBER PROFILE VIEW MODAL */}
      {viewingMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-gov-950 via-gov-900 to-indigo-950 text-white rounded-t-3xl border-b border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                  Official Citizen Record • {viewingMember.id}
                </span>

                {/* Caste Category as the FIRST heading before all other member details */}
                {isOfficer && (
                  <div className="mt-1.5">
                    <span className={`inline-flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-md font-black uppercase tracking-wider border shadow-xs ${
                      viewingMember.casteCategory === "SC" 
                        ? "bg-purple-600 text-white border-purple-400" 
                        : viewingMember.casteCategory === "ST" 
                        ? "bg-emerald-600 text-white border-emerald-400" 
                        : viewingMember.casteCategory === "OBC" 
                        ? "bg-blue-600 text-white border-blue-400" 
                        : viewingMember.casteCategory === "General" 
                        ? "bg-slate-700 text-white border-slate-500" 
                        : viewingMember.casteCategory === "Other" 
                        ? "bg-amber-600 text-white border-amber-400" 
                        : "bg-gray-600 text-white border-gray-400"
                    }`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{viewingMember.casteCategory || "Not Disclosed"}</span>
                    </span>
                  </div>
                )}

                {/* Full Name: Name - [General] */}
                <h3 className="text-lg font-black text-white mt-1 flex items-center flex-wrap gap-2">
                  <span>{viewingMember.fullName}</span>
                  {isOfficer && (
                    <span className="text-xs px-2.5 py-0.5 rounded-md font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                      - [{viewingMember.caste || viewingMember.casteCategory || "General"}]
                    </span>
                  )}
                </h3>
              </div>

              <button 
                onClick={() => setViewingMember(null)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-4 text-xs">
              
              {/* FIRST FIELD: Statutory Caste Category (Authorized Officers Only) */}
              {isOfficer && (
                <div className="p-3.5 bg-indigo-50/90 rounded-2xl border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-indigo-900 uppercase font-black flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-700 inline" />
                      <span>1. Caste Category (First Field)</span>
                    </span>
                    <span className="text-[9px] bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded">
                      Authorized Officer Access
                    </span>
                  </div>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="font-black text-base text-indigo-950">
                      {viewingMember.casteCategory || "Not Disclosed"}
                    </span>
                    <span className="text-[11px] text-indigo-700 font-medium">
                      (Saved database category for statutory welfare governance)
                    </span>
                  </div>
                </div>
              )}

              {/* Village & Ward Header Banner */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {viewingMember.villageName}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Ward No: {viewingMember.wardNo} • Family ID: <span className="font-mono font-bold text-slate-700">{viewingMember.familyId}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">House Number</span>
                  <span className="font-mono font-extrabold text-gov-900 text-xs">{viewingMember.houseNumber}</span>
                </div>
              </div>

              {/* Personal & Demographic Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Father / Guardian</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{viewingMember.guardianName || "N/A"}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Gender & Age</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{viewingMember.gender || "Citizen"}, {viewingMember.age || 35} yrs</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Ration Card Type</span>
                  <span className={`inline-block px-2 py-0.5 mt-1 rounded text-xs font-black ${
                    viewingMember.rationType === "BPL" ? "bg-amber-100 text-amber-900" : "bg-cyan-100 text-cyan-900"
                  }`}>
                    {viewingMember.rationType} (Priority PDS)
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 col-span-2 sm:col-span-3">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Phone Number</span>
                  <span className="font-mono font-bold text-slate-800 mt-0.5 block">
                    {isOfficer 
                      ? (showFullPhone ? viewingMember.phone : `${viewingMember.phone.substring(0, 8)}••••`)
                      : "Restricted (Officer Access Only)"
                    }
                  </span>
                </div>
              </div>

              {/* Medical Checkup Card */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center space-x-1.5">
                    <Activity className="w-4 h-4 text-emerald-700" />
                    <span>Primary Health Screening Status</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                    viewingMember.medicalCheckupStatus === "Completed"
                      ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                      : "bg-amber-100 text-amber-900 border-amber-300"
                  }`}>
                    {viewingMember.medicalCheckupStatus}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-900">
                  Last verified screening month: <strong className="font-semibold">{viewingMember.lastCheckupMonth}</strong>
                </div>
                {viewingMember.remarks && (
                  <p className="text-[11px] text-emerald-800 italic pt-1 border-t border-emerald-200/60">
                    "{viewingMember.remarks}"
                  </p>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex items-center justify-between">
              {isOfficer ? (
                <button
                  onClick={() => {
                    const target = viewingMember;
                    setViewingMember(null);
                    openEditModal(target);
                  }}
                  className="px-4 py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Edit Member Details</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-500 font-medium">
                  Public View: Sensitive data protected
                </span>
              )}

              <button
                onClick={() => setViewingMember(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
