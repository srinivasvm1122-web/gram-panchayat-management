import React, { useState } from "react";
import { 
  ShieldCheck, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Trash2, 
  Key, 
  Mail, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Lock
} from "lucide-react";

export const OfficerManagement = ({ 
  admins, 
  currentUser, 
  onAddOfficer, 
  onToggleOfficerStatus, 
  onDeleteOfficer, 
  t, 
  lang 
}) => {
  const [isAddOfficerModalOpen, setIsAddOfficerModalOpen] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    name: "",
    role: "PDO",
    designation: "Panchayat Development Officer (PDO)",
    email: "",
    phone: "+91 94808 ",
    pin: "9876",
    status: "Active"
  });
  const [error, setError] = useState("");

  const isSuperAdminUser = currentUser?.role === "SuperAdmin";

  const handleCreateOfficer = (e) => {
    e.preventDefault();
    if (!newOfficer.name || !newOfficer.email) {
      setError("Please fill in the Officer's name and government email.");
      return;
    }

    const payload = {
      ...newOfficer,
      id: `ADM-${Date.now().toString().slice(-4)}`,
      badge: "Official Executive Officer",
      lastLogin: "Never"
    };

    onAddOfficer(payload);
    setIsAddOfficerModalOpen(false);
    setNewOfficer({
      name: "",
      role: "PDO",
      designation: "Panchayat Development Officer (PDO)",
      email: "",
      phone: "+91 94808 ",
      pin: "9876",
      status: "Active"
    });
    setError("");
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-gov-800 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-gov-800" />
              <span>Section 9: Role-Based Access Control</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {t.officerMgmtTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {t.officerMgmtSubtitle}
            </p>
          </div>

          {isSuperAdminUser ? (
            <button
              onClick={() => setIsAddOfficerModalOpen(true)}
              className="px-4 py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>{t.createOfficer}</span>
            </button>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
              Admin Viewing Mode (Super Admin Required to Add Accounts)
            </div>
          )}
        </div>

        {/* Security Alert: No Public Registration */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center space-x-2">
          <Lock className="w-4 h-4 text-gov-900 flex-shrink-0" />
          <span>Strict Security Protocol: Public self-registration for officer accounts is permanently disabled. Only Super Administrators can issue credentials.</span>
        </div>
      </div>

      {/* Officers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-extrabold text-slate-900 text-base">
            Authorized Gram Panchayat Officers Directory
          </h3>
          <p className="text-xs text-slate-500">
            Registered officers with write access to village census, elections, and treasury accounts.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Officer Name</th>
                <th className="px-4 py-3">Authority Role</th>
                <th className="px-4 py-3">Official Designation</th>
                <th className="px-4 py-3">Govt Email</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
                {isSuperAdminUser && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-gov-800" />
                    <span>{admin.name}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-md text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">
                    {admin.designation}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-600">
                    {admin.email}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs">
                    {admin.phone}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      admin.status === "Suspended"
                        ? "bg-red-100 text-red-800 border border-red-300"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    }`}>
                      {admin.status || "Active"}
                    </span>
                  </td>
                  {isSuperAdminUser && (
                    <td className="px-4 py-3.5 text-right">
                      {admin.role !== "SuperAdmin" && (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onToggleOfficerStatus(admin.id)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                            title="Toggle Status (Active / Suspended)"
                          >
                            {admin.status === "Suspended" ? <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> : <UserX className="w-3.5 h-3.5 text-amber-600" />}
                          </button>
                          <button
                            onClick={() => onDeleteOfficer(admin.id, admin.name)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                            title="Revoke & Delete Officer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE OFFICER MODAL (Super Admin only) */}
      {isAddOfficerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-gov-800" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  {t.createOfficer}
                </h3>
              </div>
              <button 
                onClick={() => setIsAddOfficerModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOfficer} className="mt-4 space-y-4">
              {error && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Officer Full Name *
                </label>
                <input
                  type="text"
                  value={newOfficer.name}
                  onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
                  placeholder="e.g. Anand Kumar K."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Role Category *
                  </label>
                  <select
                    value={newOfficer.role}
                    onChange={(e) => {
                      const r = e.target.value;
                      const desig = r === "PDO" 
                        ? "Panchayat Development Officer (PDO)" 
                        : r === "President" 
                        ? "Gram Panchayat President (ಅಧ್ಯಕ್ಷರು)" 
                        : "Executive Officer / Revenue Secretary";
                      setNewOfficer({ ...newOfficer, role: r, designation: desig });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="PDO">PDO (Panchayat Development Officer)</option>
                    <option value="President">Gram Panchayat President</option>
                    <option value="Officer">Executive Officer / Secretary</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Access PIN / Password *
                  </label>
                  <input
                    type="password"
                    value={newOfficer.pin}
                    onChange={(e) => setNewOfficer({ ...newOfficer, pin: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Government Email / Username *
                </label>
                <input
                  type="email"
                  value={newOfficer.email}
                  onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
                  placeholder="officer.name@karnataka.gov.in"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Official Contact Phone
                </label>
                <input
                  type="text"
                  value={newOfficer.phone}
                  onChange={(e) => setNewOfficer({ ...newOfficer, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddOfficerModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gov-900 text-white text-xs font-bold hover:bg-gov-800 shadow-md"
                >
                  Create Officer Account
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
