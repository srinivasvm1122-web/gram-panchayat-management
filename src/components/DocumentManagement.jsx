import React, { useState } from "react";
import { 
  FolderArchive, 
  Plus, 
  Search, 
  FileText, 
  Download, 
  Trash2, 
  Edit3, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Save, 
  Eye,
  Calendar,
  Building2
} from "lucide-react";

export const DocumentManagement = ({ 
  documents, 
  isOfficer, 
  onAddDocument, 
  onUpdateDocument, 
  onDeleteDocument, 
  t, 
  lang 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [deletingDoc, setDeletingDoc] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Government Sanction Order",
    fileNumber: "",
    issueDate: new Date().toISOString().substring(0, 10),
    issuingAuthority: "Panchayat Development Officer (PDO)",
    fileSize: "1.5 MB",
    fileType: "PDF",
    status: "Approved",
    uploadedBy: "Authorized Officer"
  });

  const [error, setError] = useState("");

  const filtered = documents.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.fileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setFormData({
      title: "",
      category: "Government Sanction Order",
      fileNumber: `RDPR/GP/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      issueDate: new Date().toISOString().substring(0, 10),
      issuingAuthority: "Panchayat Development Officer (PDO)",
      fileSize: "1.5 MB",
      fileType: "PDF",
      status: "Approved",
      uploadedBy: "Authorized Officer"
    });
    setError("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (doc) => {
    setEditingDoc(doc);
    setFormData({ ...doc });
    setError("");
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!isOfficer) return;
    if (!formData.title || !formData.fileNumber) {
      setError("Document title and official file number are mandatory.");
      return;
    }

    if (editingDoc) {
      onUpdateDocument({ ...formData, id: editingDoc.id });
      setEditingDoc(null);
    } else {
      onAddDocument({ ...formData, id: `DOC-${Date.now().toString().slice(-4)}` });
      setIsAddModalOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingDoc && isOfficer) {
      onDeleteDocument(deletingDoc.id, deletingDoc.title);
      setDeletingDoc(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-gov-800 uppercase tracking-wide">
              <FolderArchive className="w-4 h-4 text-gov-800" />
              <span>Section 10: Official Gazette & Sanction Orders Archive</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {lang === "kn" ? "ಅಧಿಕೃತ ಕಡತಗಳು ಮತ್ತು ಆದೇಶಗಳ ನಿರ್ವಹಣೆ" : "Document & Sanction Orders Management"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Repository of Government circulars, 15th FC approvals, work completion certificates and tender notices.
            </p>
          </div>

          {isOfficer && (
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Upload Document</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, file number, category..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
            {filtered.length} Official Documents
          </span>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-gov-100 text-gov-900 font-bold text-[10px] uppercase">
                  {doc.category}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {doc.fileNumber}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-sm mt-2.5 leading-snug">
                {doc.title}
              </h3>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Issue Date:</span>
                  <span className="font-bold">{doc.issueDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Authority:</span>
                  <span className="font-bold truncate block">{doc.issuingAuthority}</span>
                </div>
              </div>
            </div>

            {/* Document Action Buttons: View, Download, Edit, Delete */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setViewingDoc(doc)}
                  className="px-2.5 py-1.5 rounded-lg bg-gov-50 text-gov-900 hover:bg-gov-100 font-semibold flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => alert(`Downloading official document: ${doc.title} (.pdf)`)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Download</span>
                </button>
              </div>

              {isOfficer && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(doc)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                    title="Edit Document"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingDoc(doc)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                    title="Delete Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* ADD / EDIT DOCUMENT MODAL */}
      {(isAddModalOpen || editingDoc) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <FolderArchive className="w-5 h-5 text-gov-800" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  {editingDoc ? "Edit Government Document" : "Upload Official Document"}
                </h3>
              </div>
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditingDoc(null); }}
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

              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 15th FC Untied Grant Annual Action Plan"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    <option value="Government Sanction Order">Government Sanction Order</option>
                    <option value="Labor & Works Sanction">Labor & Works Sanction</option>
                    <option value="Work Completion Certificate">Work Completion Certificate</option>
                    <option value="Tender Notification">Tender Notification</option>
                    <option value="Audit Utilization Certificate">Audit Utilization Certificate</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">File Number *</label>
                  <input
                    type="text"
                    value={formData.fileNumber}
                    onChange={(e) => setFormData({ ...formData, fileNumber: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    value={formData.issuingAuthority}
                    onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Attach File (PDF, DOCX)</label>
                <input
                  type="file"
                  accept="application/pdf,application/msword"
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gov-50 file:text-gov-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingDoc(null); }}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gov-900 text-white font-bold hover:bg-gov-800 shadow-md flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>{editingDoc ? "Update Document" : "Save Document"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* VIEW DOCUMENT VIEWER MODAL */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-extrabold text-slate-900 text-base">
                Official Document Preview
              </span>
              <button onClick={() => setViewingDoc(null)} className="p-1 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div><strong>Title:</strong> {viewingDoc.title}</div>
              <div><strong>File No:</strong> {viewingDoc.fileNumber}</div>
              <div><strong>Category:</strong> {viewingDoc.category}</div>
              <div><strong>Authority:</strong> {viewingDoc.issuingAuthority}</div>
              <div><strong>Date:</strong> {viewingDoc.issueDate}</div>
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl font-bold flex items-center space-x-1.5 mt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Digitally Signed & Validated by RDPR Karnataka e-Panchayat</span>
              </div>
            </div>
            <button
              onClick={() => setViewingDoc(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-gov-900 text-white font-bold text-xs"
            >
              Close Viewer
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-center font-extrabold text-slate-900 text-base">
              Confirm Document Deletion
            </h3>
            <p className="text-center text-xs text-slate-600 mt-2">
              Are you sure you want to delete the document: <strong>{deletingDoc.title}</strong>?
            </p>
            <div className="mt-5 flex space-x-2">
              <button
                onClick={() => setDeletingDoc(null)}
                className="w-1/2 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-1/2 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Delete Document
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
