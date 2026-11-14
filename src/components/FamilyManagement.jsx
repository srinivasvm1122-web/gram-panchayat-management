import React, { useState } from "react";
import { 
  Home, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Save, 
  Download, 
  FileSpreadsheet,
  Users,
  Building2,
  Zap,
  Droplet
} from "lucide-react";

export const FamilyManagement = ({ 
  families, 
  villages, 
  isOfficer, 
  onAddFamily, 
  onUpdateFamily, 
  onDeleteFamily, 
  onExportExcel, 
  t, 
  lang 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState(null);
  const [deletingFamily, setDeletingFamily] = useState(null);

  const [formData, setFormData] = useState({
    wardNo: 1,
    villageName: "Shivapura",
    totalHouseholds: 590,
    headOfFamilySample: "",
    rationType: "BPL",
    housingScheme: "PMAY (Gramin)",
    schemeStatus: "Sanctioned & Completed",
    membersCount: 5,
    electricityConnection: "Yes (Bescom)",
    tapWater: "Yes (Jal Jeevan)"
  });

  const [error, setError] = useState("");

  const filtered = families.filter(f => 
    f.villageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.headOfFamilySample.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.housingScheme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setFormData({
      wardNo: 1,
      villageName: "Shivapura",
      totalHouseholds: 590,
      headOfFamilySample: "",
      rationType: "BPL",
      housingScheme: "PMAY (Gramin)",
      schemeStatus: "Sanctioned",
      membersCount: 4,
      electricityConnection: "Yes (Bescom)",
      tapWater: "Yes (Jal Jeevan)"
    });
    setError("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (fam) => {
    setEditingFamily(fam);
    setFormData({ ...fam });
    setError("");
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!isOfficer) return;
    if (!formData.headOfFamilySample) {
      setError("Please enter the sample head of household name.");
      return;
    }

    const payload = {
      ...formData,
      wardNo: Number(formData.wardNo) || 1,
      totalHouseholds: Number(formData.totalHouseholds) || 100,
      membersCount: Number(formData.membersCount) || 4
    };

    if (editingFamily) {
      onUpdateFamily({ ...payload, id: editingFamily.id });
      setEditingFamily(null);
    } else {
      onAddFamily({ ...payload, id: `FAM-${Date.now().toString().slice(-4)}` });
      setIsAddModalOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingFamily && isOfficer) {
      onDeleteFamily(deletingFamily.id, deletingFamily.villageName);
      setDeletingFamily(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-gov-800 uppercase tracking-wide">
              <Home className="w-4 h-4 text-gov-800" />
              <span>Section 4: Household & Housing Schemes Registry</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {({
                kn: "ಕುಟುಂಬ ಮತ್ತು ವಸತಿ ಯೋಜನೆಗಳ ನಿರ್ವಹಣೆ",
                hi: "परिवार एवं आवास योजना प्रबंधन",
                mr: "कुटुंब व गृहनिर्माण योजना व्यवस्थापन",
                ta: "குடும்பம் மற்றும் வீட்டு வசதித் திட்டங்கள் மேலாண்மை",
                te: "కుటుంబం మరియు గృహనిర్మాణ పథకాల నిర్వహణ",
                en: "Family & Housing Schemes Management"
              })[lang] || "Family & Housing Schemes Management"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Ward-wise household registry, PMAY / Basava Vasathi housing schemes, and basic utility connections.
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
                <span>Add Family Record</span>
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by village, head of family, housing scheme..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
            Showing {filtered.length} Ward Records
          </span>
        </div>
      </div>

      {/* Families Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Ward</th>
                <th className="px-4 py-3">Village Name</th>
                <th className="px-4 py-3">Total Households</th>
                <th className="px-4 py-3">Sample Head of Family</th>
                <th className="px-4 py-3">Ration Type</th>
                <th className="px-4 py-3">Housing Scheme Allocation</th>
                <th className="px-4 py-3">Scheme Status</th>
                <th className="px-4 py-3">Utilities</th>
                {isOfficer && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((fam) => (
                <tr key={fam.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-gov-900">
                    Ward {fam.wardNo}
                  </td>
                  <td className="px-4 py-3.5 font-black text-slate-900">
                    {fam.villageName}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-800">
                    {fam.totalHouseholds}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">
                    {fam.headOfFamilySample} ({fam.membersCount} members)
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-black ${
                      fam.rationType === "BPL" 
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-cyan-100 text-cyan-900 border border-cyan-300"
                    }`}>
                      {fam.rationType}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-700">
                    {fam.housingScheme}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {fam.schemeStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">
                    <div className="flex items-center space-x-1 text-[11px]">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>{fam.electricityConnection}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[11px] mt-0.5">
                      <Droplet className="w-3 h-3 text-blue-500" />
                      <span>{fam.tapWater}</span>
                    </div>
                  </td>
                  {isOfficer && (
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => openEditModal(fam)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                          title="Edit Family Record"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingFamily(fam)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT FAMILY MODAL */}
      {(isAddModalOpen || editingFamily) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Home className="w-5 h-5 text-gov-800" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  {editingFamily ? "Edit Family & Housing Record" : "Add New Family Record"}
                </h3>
              </div>
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditingFamily(null); }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              {error && (
                <div className="p-2.5 bg-red-50 text-red-700 rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ward Number *</label>
                  <input
                    type="number"
                    value={formData.wardNo}
                    onChange={(e) => setFormData({ ...formData, wardNo: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Village Name *</label>
                  <input
                    type="text"
                    value={formData.villageName}
                    onChange={(e) => setFormData({ ...formData, villageName: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Head of Family Name (Sample) *</label>
                <input
                  type="text"
                  value={formData.headOfFamilySample}
                  onChange={(e) => setFormData({ ...formData, headOfFamilySample: e.target.value })}
                  placeholder="e.g. Rameshappa G."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ration Card Category</label>
                  <select
                    value={formData.rationType}
                    onChange={(e) => setFormData({ ...formData, rationType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    <option value="BPL">BPL (Below Poverty Line)</option>
                    <option value="APL">APL (Above Poverty Line)</option>
                    <option value="Antyodaya">Antyodaya Anna Yojana (AAY)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Family Members</label>
                  <input
                    type="number"
                    value={formData.membersCount}
                    onChange={(e) => setFormData({ ...formData, membersCount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Housing Scheme</label>
                  <select
                    value={formData.housingScheme}
                    onChange={(e) => setFormData({ ...formData, housingScheme: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    <option value="PMAY (Gramin)">PMAY (Gramin)</option>
                    <option value="Dr. B.R. Ambedkar Nivas">Dr. B.R. Ambedkar Nivas</option>
                    <option value="Basava Vasathi Yojana">Basava Vasathi Yojana</option>
                    <option value="Own Pucca House">Own Pucca House</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Scheme Status</label>
                  <input
                    type="text"
                    value={formData.schemeStatus}
                    onChange={(e) => setFormData({ ...formData, schemeStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Action Buttons: Save, Update, Cancel */}
              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingFamily(null); }}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gov-900 text-white font-bold hover:bg-gov-800 shadow-md flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>{editingFamily ? "Update Record" : "Save Record"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingFamily && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-center font-extrabold text-slate-900 text-base">
              Confirm Record Deletion
            </h3>
            <p className="text-center text-xs text-slate-600 mt-2">
              Are you sure you want to delete the family record for Ward {deletingFamily.wardNo} ({deletingFamily.villageName})?
            </p>
            <div className="mt-5 flex space-x-2">
              <button
                onClick={() => setDeletingFamily(null)}
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

    </div>
  );
};
