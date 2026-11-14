import React, { useState } from "react";
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  Users, 
  Home, 
  Vote, 
  CreditCard,
  ChevronRight,
  UserCheck,
  AlertTriangle,
  X,
  FileSpreadsheet,
  Download,
  Phone,
  LayoutGrid,
  List
} from "lucide-react";

export const VillageManagement = ({ 
  villages, 
  t, 
  lang,
  isOfficer = false,
  onAddVillage,
  onUpdateVillage,
  onDeleteVillage,
  onSelectVillageForDetails,
  onExportExcel
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"
  const [filterTurnout, setFilterTurnout] = useState("all");
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [villageToDelete, setVillageToDelete] = useState(null);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    id: "",
    nameEn: "",
    nameKn: "",
    wardNo: 1,
    totalPopulation: "",
    livingMembers: "",
    maleMembers: "",
    femaleMembers: "",
    totalFamilies: "",
    aplCardCount: "",
    bplCardCount: "",
    totalVoters: "",
    maleVoters: "",
    femaleVoters: "",
    votesCast: "",
    sarpanchName: "",
    sarpanchContact: "",
    notes: ""
  });

  const [formError, setFormError] = useState("");

  // Search and filter logic
  const filteredVillages = villages.filter(v => {
    const matchesSearch = 
      v.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.nameKn.includes(searchTerm) ||
      `w-${v.wardNo}`.includes(searchTerm.toLowerCase()) ||
      v.sarpanchName.toLowerCase().includes(searchTerm.toLowerCase());

    const turnout = v.totalVoters > 0 ? (v.votesCast / v.totalVoters) * 100 : 0;
    
    if (filterTurnout === "high") return matchesSearch && turnout >= 85;
    if (filterTurnout === "medium") return matchesSearch && turnout >= 75 && turnout < 85;
    if (filterTurnout === "low") return matchesSearch && turnout < 75;

    return matchesSearch;
  });

  const openAddModal = () => {
    setFormData({
      id: `VIL-${String(villages.length + 1).padStart(3, "0")}`,
      nameEn: "",
      nameKn: "",
      wardNo: villages.length + 1,
      totalPopulation: "",
      livingMembers: "",
      maleMembers: "",
      femaleMembers: "",
      totalFamilies: "",
      aplCardCount: "",
      bplCardCount: "",
      totalVoters: "",
      maleVoters: "",
      femaleVoters: "",
      votesCast: "",
      sarpanchName: "",
      sarpanchContact: "+91 98450 ",
      notes: ""
    });
    setFormError("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (v) => {
    setSelectedVillage(v);
    setFormData({ ...v });
    setFormError("");
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (v) => {
    setVillageToDelete(v);
    setIsDeleteModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-compute living members or population if male + female entered
      if (name === "maleMembers" || name === "femaleMembers") {
        const m = Number(name === "maleMembers" ? value : prev.maleMembers) || 0;
        const f = Number(name === "femaleMembers" ? value : prev.femaleMembers) || 0;
        if (m > 0 || f > 0) {
          updated.livingMembers = m + f;
          if (!prev.totalPopulation || Number(prev.totalPopulation) < m + f) {
            updated.totalPopulation = m + f;
          }
        }
      }

      // Auto-compute voters if male + female voters entered
      if (name === "maleVoters" || name === "femaleVoters") {
        const mv = Number(name === "maleVoters" ? value : prev.maleVoters) || 0;
        const fv = Number(name === "femaleVoters" ? value : prev.femaleVoters) || 0;
        if (mv > 0 || fv > 0) {
          updated.totalVoters = mv + fv;
        }
      }

      return updated;
    });
  };

  const handleSaveVillage = (e) => {
    e.preventDefault();
    if (!isOfficer) {
      setFormError("Unauthorized: Public users have read-only access. Only Officers can modify records.");
      return;
    }
    if (!formData.nameEn || !formData.nameKn) {
      setFormError("Please enter both English and Kannada village names.");
      return;
    }
    if (!formData.totalPopulation || !formData.totalFamilies || !formData.totalVoters) {
      setFormError("Population, families and voter totals are mandatory.");
      return;
    }

    const payload = {
      ...formData,
      wardNo: Number(formData.wardNo) || 1,
      totalPopulation: Number(formData.totalPopulation) || 0,
      livingMembers: Number(formData.livingMembers) || 0,
      maleMembers: Number(formData.maleMembers) || 0,
      femaleMembers: Number(formData.femaleMembers) || 0,
      totalFamilies: Number(formData.totalFamilies) || 0,
      aplCardCount: Number(formData.aplCardCount) || 0,
      bplCardCount: Number(formData.bplCardCount) || 0,
      totalVoters: Number(formData.totalVoters) || 0,
      maleVoters: Number(formData.maleVoters) || 0,
      femaleVoters: Number(formData.femaleVoters) || 0,
      votesCast: Number(formData.votesCast) || 0
    };

    if (isAddModalOpen) {
      onAddVillage(payload);
      setIsAddModalOpen(false);
    } else {
      onUpdateVillage(payload);
      setIsEditModalOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (!isOfficer) {
      alert("Unauthorized: Public users cannot delete records.");
      return;
    }
    if (villageToDelete) {
      onDeleteVillage(villageToDelete.id, villageToDelete.nameEn);
      setIsDeleteModalOpen(false);
      setVillageToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-gov-800 uppercase tracking-wide">
              <span>{t.villagesTitle}</span>
              <span className="bg-gov-100 text-gov-900 px-2 py-0.5 rounded-full font-bold">
                {villages.length} Registered
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {lang === "kn" ? "10 ಪ್ರತ್ಯೇಕ ಗ್ರಾಮಗಳ ವಿವರಗಳು" : "10 Village Profiles Registry"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {t.villagesSubtitle}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onExportExcel}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-300 transition flex items-center space-x-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Excel Export</span>
            </button>
            {isOfficer && (
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>{t.addVillage}</span>
              </button>
            )}
          </div>
        </div>

        {!isOfficer && (
          <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{t.publicReadOnlyNotice}</span>
          </div>
        )}

        {/* Search, Filter & View Controls */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchVillagePlaceholder}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-500 transition"
            />
          </div>

          {/* Turnout Filter and Layout Toggles */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filterTurnout}
                onChange={(e) => setFilterTurnout(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-gov-500"
              >
                <option value="all">{t.filterAll}</option>
                <option value="high">High Turnout (&gt;=85%)</option>
                <option value="medium">Moderate Turnout (75-85%)</option>
                <option value="low">Lower Turnout (&lt;75%)</option>
              </select>
            </div>

            <div className="bg-slate-100 p-1 rounded-lg flex items-center border border-slate-200">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-md ${viewMode === "cards" ? "bg-white shadow-sm text-gov-900" : "text-slate-500"}`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md ${viewMode === "table" ? "bg-white shadow-sm text-gov-900" : "text-slate-500"}`}
                title="Tabular View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Villages Display: Cards or Table */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVillages.map((v) => {
            const turnout = v.totalVoters > 0 ? ((v.votesCast / v.totalVoters) * 100).toFixed(1) : 0;
            return (
              <div 
                key={v.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Village Card Header */}
                <div className="p-5 pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-md bg-gov-100 text-gov-900 text-xs font-extrabold">
                          Ward {v.wardNo}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {v.id}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1 group-hover:text-gov-800 transition-colors">
                        {v.nameEn}
                      </h3>
                      <p className="text-xs text-slate-500 font-kannada font-medium">
                        {v.nameKn}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {turnout}% Turnout
                    </span>
                  </div>

                  {/* Village Key Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                    
                    <div className="bg-slate-50/80 p-2 rounded-xl">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        {t.totalPopulation}
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {v.totalPopulation.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {v.maleMembers} M • {v.femaleMembers} F
                      </span>
                    </div>

                    <div className="bg-slate-50/80 p-2 rounded-xl">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        {t.livingMembers}
                      </span>
                      <span className="font-extrabold text-teal-800 text-sm">
                        {v.livingMembers.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Verified Residents
                      </span>
                    </div>

                    <div className="bg-slate-50/80 p-2 rounded-xl">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        {t.totalFamilies}
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {v.totalFamilies}
                      </span>
                      <span className="text-[10px] text-cyan-700 font-semibold block">
                        {v.aplCardCount} APL • {v.bplCardCount} BPL
                      </span>
                    </div>

                    <div className="bg-slate-50/80 p-2 rounded-xl">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        {t.totalVoters}
                      </span>
                      <span className="font-extrabold text-purple-900 text-sm">
                        {v.totalVoters}
                      </span>
                      <span className="text-[10px] text-purple-700 font-semibold block">
                        {v.votesCast} Cast
                      </span>
                    </div>

                  </div>

                  {/* Ward Member / Sarpanch info */}
                  <div className="mt-3 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100/80 text-xs">
                    <span className="text-[10px] text-amber-800 font-bold uppercase block">
                      {t.sarpanch}
                    </span>
                    <div className="flex items-center justify-between font-semibold text-slate-800 mt-0.5">
                      <span>{v.sarpanchName}</span>
                      <span className="text-[11px] text-slate-600 flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-amber-600" />
                        <span>{v.sarpanchContact}</span>
                      </span>
                    </div>
                  </div>

                </div>

                {/* Card Action Buttons: View (All), Edit & Delete (Officers only) */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectVillageForDetails(v)}
                    className={`px-3 py-1.5 rounded-lg bg-gov-900 hover:bg-gov-800 text-white font-semibold transition flex items-center space-x-1 shadow-sm ${
                      !isOfficer ? "w-full justify-center" : ""
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t.viewDetails}</span>
                  </button>

                  {isOfficer && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openEditModal(v)}
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-gov-900 transition"
                        title={t.editVillage}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(v)}
                        className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition"
                        title={t.deleteVillage}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Tabular View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{t.wardNo}</th>
                  <th className="px-4 py-3">{t.villageName}</th>
                  <th className="px-4 py-3">{t.totalPopulation}</th>
                  <th className="px-4 py-3">{t.livingMembers}</th>
                  <th className="px-4 py-3">{t.maleMembers} / {t.femaleMembers}</th>
                  <th className="px-4 py-3">{t.totalFamilies}</th>
                  <th className="px-4 py-3">{t.aplCardCount}</th>
                  <th className="px-4 py-3">{t.bplCardCount}</th>
                  <th className="px-4 py-3">{t.totalVoters}</th>
                  <th className="px-4 py-3">{t.votesCast}</th>
                  <th className="px-4 py-3">{t.votingTurnout}</th>
                  <th className="px-4 py-3 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredVillages.map((v) => {
                  const turnout = v.totalVoters > 0 ? ((v.votesCast / v.totalVoters) * 100).toFixed(1) : 0;
                  return (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-bold text-gov-900">
                        W-{v.wardNo}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div>{v.nameEn}</div>
                        <div className="text-xs text-slate-500 font-kannada">{v.nameKn}</div>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {v.totalPopulation.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-teal-800 font-semibold">
                        {v.livingMembers.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {v.maleMembers} / {v.femaleMembers}
                      </td>
                      <td className="px-4 py-3">
                        {v.totalFamilies}
                      </td>
                      <td className="px-4 py-3 font-semibold text-cyan-700">
                        {v.aplCardCount}
                      </td>
                      <td className="px-4 py-3 font-semibold text-amber-700">
                        {v.bplCardCount}
                      </td>
                      <td className="px-4 py-3">
                        {v.totalVoters}
                      </td>
                      <td className="px-4 py-3">
                        {v.votesCast}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {turnout}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onSelectVillageForDetails(v)}
                            className="p-1.5 rounded-lg bg-gov-50 text-gov-900 hover:bg-gov-100 transition"
                            title={t.viewDetails}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {isOfficer && (
                            <>
                              <button
                                onClick={() => openEditModal(v)}
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                                title={t.editVillage}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(v)}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                title={t.deleteVillage}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT VILLAGE MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gov-950 text-white rounded-t-2xl">
              <div>
                <h3 className="font-extrabold text-lg flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <span>{isAddModalOpen ? t.addVillage : t.editVillage}</span>
                </h3>
                <p className="text-xs text-sky-200">
                  {t.villagesSubtitle || "Official demographic and voter profile entry form."}
                </p>
              </div>
              <button 
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-gov-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVillage} className="p-6 space-y-4">
              
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Village Names & Ward */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t.villageName} (English) *
                  </label>
                  <input
                    type="text"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleFormChange}
                    placeholder="e.g. Shivapura"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-gov-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t.villageNameKn} (ಕನ್ನಡ) *
                  </label>
                  <input
                    type="text"
                    name="nameKn"
                    value={formData.nameKn}
                    onChange={handleFormChange}
                    placeholder="ಉದಾ. ಶಿವಪುರ"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-kannada focus:ring-2 focus:ring-gov-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t.wardNo} (1 - 10) *
                  </label>
                  <input
                    type="number"
                    name="wardNo"
                    value={formData.wardNo}
                    onChange={handleFormChange}
                    min="1"
                    max="50"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-gov-500"
                  />
                </div>
              </div>

              {/* Demographics: Total, Living, Male, Female */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-extrabold text-gov-900 uppercase tracking-wide block">
                  1. {t.populationTitle || "Population Demographics"}
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t.totalPopulation} *
                    </label>
                    <input
                      type="number"
                      name="totalPopulation"
                      value={formData.totalPopulation}
                      onChange={handleFormChange}
                      required
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-1 focus:ring-gov-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t.livingMembers} *
                    </label>
                    <input
                      type="number"
                      name="livingMembers"
                      value={formData.livingMembers}
                      onChange={handleFormChange}
                      required
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-1 focus:ring-gov-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t.maleMembers}
                    </label>
                    <input
                      type="number"
                      name="maleMembers"
                      value={formData.maleMembers}
                      onChange={handleFormChange}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-gov-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t.femaleMembers}
                    </label>
                    <input
                      type="number"
                      name="femaleMembers"
                      value={formData.femaleMembers}
                      onChange={handleFormChange}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-gov-500"
                    />
                  </div>
                </div>
              </div>

              {/* Families & Ration Cards (APL & BPL) */}
              <div className="p-4 bg-cyan-50/50 rounded-xl border border-cyan-100 space-y-3">
                <span className="text-xs font-extrabold text-cyan-900 uppercase tracking-wide block">
                  2. {t.rationTitle || "Households & Ration Cards"}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t.totalFamilies} *
                    </label>
                    <input
                      type="number"
                      name="totalFamilies"
                      value={formData.totalFamilies}
                      onChange={handleFormChange}
                      required
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-cyan-800 block mb-1">
                      {t.aplCardCount}
                    </label>
                    <input
                      type="number"
                      name="aplCardCount"
                      value={formData.aplCardCount}
                      onChange={handleFormChange}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-cyan-300 text-xs font-semibold text-cyan-900 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-amber-800 block mb-1">
                      {t.bplCardCount}
                    </label>
                    <input
                      type="number"
                      name="bplCardCount"
                      value={formData.bplCardCount}
                      onChange={handleFormChange}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs font-semibold text-amber-900 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Voters: Total, Male, Female, Votes Cast */}
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-3">
                <span className="text-xs font-extrabold text-purple-900 uppercase tracking-wide block">
                  3. {t.electionTitle || "Voter Registry & Turnout"}
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-purple-900 block mb-1">
                      {t.totalVoters} *
                    </label>
                    <input
                      type="number"
                      name="totalVoters"
                      value={formData.totalVoters}
                      onChange={handleFormChange}
                      required
                      className="w-full px-2.5 py-1.5 rounded-lg border border-purple-300 text-xs font-semibold focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t.maleVoters}
                    </label>
                    <input
                      type="number"
                      name="maleVoters"
                      value={formData.maleVoters}
                      onChange={handleFormChange}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t.femaleVoters}
                    </label>
                    <input
                      type="number"
                      name="femaleVoters"
                      value={formData.femaleVoters}
                      onChange={handleFormChange}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-emerald-800 block mb-1">
                      {t.votesCast} *
                    </label>
                    <input
                      type="number"
                      name="votesCast"
                      value={formData.votesCast}
                      onChange={handleFormChange}
                      required
                      className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-300 text-xs font-semibold text-emerald-900 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sarpanch / Ward Member details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t.sarpanch}
                  </label>
                  <input
                    type="text"
                    name="sarpanchName"
                    value={formData.sarpanchName}
                    onChange={handleFormChange}
                    placeholder="e.g. Ramesh Gowda"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-gov-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Official Contact No.
                  </label>
                  <input
                    type="text"
                    name="sarpanchContact"
                    value={formData.sarpanchContact}
                    onChange={handleFormChange}
                    placeholder="+91 98450 12345"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-gov-500"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gov-900 hover:bg-gov-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition"
                >
                  {isAddModalOpen ? t.createVillage : t.saveChanges}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && villageToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-100 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-center font-extrabold text-slate-900 text-lg">
              {t.confirmDeleteTitle}
            </h3>

            <p className="text-center text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {t.confirmDeleteMsg}
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-center font-bold text-slate-800">
              {villageToDelete.nameEn} ({villageToDelete.nameKn}) • Ward {villageToDelete.wardNo}
            </div>

            <div className="mt-6 flex items-center space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition"
              >
                {t.deleteVillage}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
