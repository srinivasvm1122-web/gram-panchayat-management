import React, { useState, useEffect, useMemo } from "react";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { MobileNav } from "./components/MobileNav";
import { Dashboard } from "./components/Dashboard";
import { VillageManagement } from "./components/VillageManagement";
import { VillageDetailModal } from "./components/VillageDetailModal";
import { PopulationStatistics } from "./components/PopulationStatistics";
import { ElectionManagement } from "./components/ElectionManagement";
import { FundsManagement } from "./components/FundsManagement";
import { RationCardSummary } from "./components/RationCardSummary";
import { Reports } from "./components/Reports";
import { LoginPage } from "./components/LoginPage";
import { OfficerManagement } from "./components/OfficerManagement";
import { AuditLogs } from "./components/AuditLogs";
import { FirebaseSettingsModal } from "./components/FirebaseSettingsModal";
import { VillageMemberManagement } from "./components/VillageMemberManagement";
import { OfficerSidebar } from "./components/OfficerSidebar";
import { EditDashboardModal } from "./components/EditDashboardModal";
import { FamilyManagement } from "./components/FamilyManagement";
import { DocumentManagement } from "./components/DocumentManagement";
import { VillageMap } from "./components/VillageMap";
import { FirstTimeLanguageModal } from "./components/FirstTimeLanguageModal";
import { updateVillageInDb } from "./services/apiService";

import { translations } from "./data/translations";
import { 
  loadInitialState, 
  calculatePanchayatStatistics, 
  createAuditEntry,
  canModifyData,
  isSuperAdmin,
  PUBLIC_USER,
  STORAGE_KEYS,
  setStored,
  getStored
} from "./services/storageService";
import { exportToPdf, exportToExcel } from "./services/exportService";
import { 
  initialVillages, 
  initialFunds, 
  initialTransactions, 
  initialElectionData, 
  initialAdmins,
  initialDocuments,
  initialFamilies
} from "./data/initialData";
import { initialMembers } from "./data/memberData";
import { ShieldCheck, Lock, UserCheck, Database, History, Download, RefreshCw } from "lucide-react";

export default function App() {
  // Load state from local storage or fallback
  const [initialData] = useState(() => loadInitialState());
  
  const [villages, setVillages] = useState(initialData.villages);
  const [funds, setFunds] = useState(initialData.funds);
  const [transactions, setTransactions] = useState(initialData.transactions);
  const [electionData, setElectionData] = useState(initialData.electionData);
  const [auditLogs, setAuditLogs] = useState(initialData.auditLogs);
  const [admins, setAdmins] = useState(initialData.admins || initialAdmins);
  const [documents, setDocuments] = useState(initialData.documents || initialDocuments);
  const [families, setFamilies] = useState(initialData.families || initialFamilies);
  const [members, setMembers] = useState(initialData.members || initialMembers);
  const [currentUser, setCurrentUser] = useState(initialData.currentUser || PUBLIC_USER);
  const [lang, setLang] = useState(initialData.language || "en");

  // Dashboard Stats Override & Modal State (Full Officer Edit Access)
  const [dashboardStatsOverride, setDashboardStatsOverride] = useState(() => getStored("gp_dashboard_stats_override", null));
  const [isEditDashboardModalOpen, setIsEditDashboardModalOpen] = useState(false);
  
  // Active Tab across the pages
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedVillageForDetails, setSelectedVillageForDetails] = useState(null);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isFirstTimeModalOpen, setIsFirstTimeModalOpen] = useState(() => !localStorage.getItem("gp_language_chosen"));
  const [notification, setNotification] = useState(null);

  const handleConfirmFirstTimeLanguage = (selectedLanguage) => {
    setLang(selectedLanguage);
    localStorage.setItem("gp_language_chosen", "true");
    setIsFirstTimeModalOpen(false);
    showNotification(translations[selectedLanguage]?.languageChangedNotification || "Language preference saved successfully", "success");
  };

  // Active translation dictionary
  const t = translations[lang] || translations.en;

  // Role Checks
  const isOfficer = canModifyData(currentUser);
  const isSuperAdminUser = isSuperAdmin(currentUser);

  // Persistence Effects
  useEffect(() => {
    setStored(STORAGE_KEYS.VILLAGES, villages);
  }, [villages]);

  useEffect(() => {
    setStored(STORAGE_KEYS.FUNDS, funds);
  }, [funds]);

  useEffect(() => {
    setStored(STORAGE_KEYS.TRANSACTIONS, transactions);
  }, [transactions]);

  useEffect(() => {
    setStored(STORAGE_KEYS.ELECTIONS, electionData);
  }, [electionData]);

  useEffect(() => {
    setStored(STORAGE_KEYS.AUDIT_LOGS, auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    setStored(STORAGE_KEYS.ADMINS, admins);
  }, [admins]);

  useEffect(() => {
    setStored(STORAGE_KEYS.DOCUMENTS, documents);
  }, [documents]);

  useEffect(() => {
    setStored(STORAGE_KEYS.FAMILIES, families);
  }, [families]);

  useEffect(() => {
    setStored(STORAGE_KEYS.MEMBERS, members);
  }, [members]);

  useEffect(() => {
    setStored("gp_dashboard_stats_override", dashboardStatsOverride);
  }, [dashboardStatsOverride]);

  useEffect(() => {
    setStored(STORAGE_KEYS.CURRENT_USER, currentUser);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }, [lang]);

  // Dynamic Aggregates & Overrides
  const computedStats = useMemo(() => {
    return calculatePanchayatStatistics(villages, funds, transactions);
  }, [villages, funds, transactions]);

  const stats = useMemo(() => {
    if (!dashboardStatsOverride) return computedStats;
    const regVoters = dashboardStatsOverride.totalRegisteredVoters ?? computedStats.totalRegisteredVoters;
    const castVotes = dashboardStatsOverride.totalVotesCast ?? computedStats.totalVotesCast;
    const turnout = regVoters > 0 ? Number(((castVotes / regVoters) * 100).toFixed(2)) : 0;
    const totalRecv = dashboardStatsOverride.totalFundsReceived ?? computedStats.totalFundsReceived;
    const totalExp = dashboardStatsOverride.totalExpenses ?? computedStats.totalExpenses;
    return {
      ...computedStats,
      ...dashboardStatsOverride,
      remainingBalance: totalRecv - totalExp,
      votingPercentage: turnout
    };
  }, [computedStats, dashboardStatsOverride]);

  // Notifications
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Audit Log Entry
  const addAuditLog = (action, details) => {
    const entry = createAuditEntry(action, details, currentUser);
    setAuditLogs(prev => [entry, ...prev]);
  };

  // Village CRUD handlers (Protected)
  const handleAddVillage = (newVillage) => {
    if (!isOfficer) {
      showNotification("Permission Denied: Public users cannot add records.", "error");
      return;
    }
    setVillages(prev => [...prev, newVillage]);
    addAuditLog("VILLAGE_ADDED", `Officer ${currentUser.name} created profile for ${newVillage.nameEn} (Ward ${newVillage.wardNo}).`);
    showNotification(t.villageAddedSuccess);
  };

  const handleUpdateVillage = (updatedVillage) => {
    if (!isOfficer) {
      showNotification("Permission Denied: Public users cannot update records.", "error");
      return;
    }
    setVillages(prev => prev.map(v => v.id === updatedVillage.id ? updatedVillage : v));
    updateVillageInDb(updatedVillage).catch(() => {});
    addAuditLog("VILLAGE_UPDATED", `Officer ${currentUser.name} updated records / GPS coordinates for ${updatedVillage.nameEn} (Ward ${updatedVillage.wardNo}).`);
    showNotification(t.villageUpdatedSuccess);
  };

  const handleDeleteVillage = (villageId, villageName) => {
    if (!isOfficer) {
      showNotification("Permission Denied: Public users cannot delete records.", "error");
      return;
    }
    setVillages(prev => prev.filter(v => v.id !== villageId));
    addAuditLog("VILLAGE_DELETED", `Officer ${currentUser.name} deleted village record: ${villageName} (${villageId}).`);
    showNotification(t.villageDeletedSuccess);
  };

  // Transaction Voucher handler (Protected)
  const handleAddTransaction = (newTxn) => {
    if (!isOfficer) {
      showNotification("Permission Denied: Public users cannot record vouchers.", "error");
      return;
    }
    setTransactions(prev => [newTxn, ...prev]);
    addAuditLog("VOUCHER_RECORDED", `Officer ${currentUser.name} recorded voucher ${newTxn.voucherNumber} for ${newTxn.category} (₹ ${newTxn.amount.toLocaleString()}).`);
    showNotification("Financial voucher recorded and audited successfully!");
  };

  // Super Admin: Officer Account Management
  const handleAddOfficer = (newOfficer) => {
    if (!isSuperAdminUser) {
      showNotification("Permission Denied: Only Super Admin can create Officer accounts.", "error");
      return;
    }
    setAdmins(prev => [...prev, newOfficer]);
    addAuditLog("OFFICER_CREATED", `Super Admin ${currentUser.name} issued credentials for ${newOfficer.name} (${newOfficer.role}).`);
    showNotification(t.officerCreatedSuccess);
  };

  const handleToggleOfficerStatus = (adminId) => {
    if (!isSuperAdminUser) return;
    setAdmins(prev => prev.map(a => {
      if (a.id === adminId) {
        const nextStatus = a.status === "Suspended" ? "Active" : "Suspended";
        addAuditLog("OFFICER_STATUS_CHANGED", `Changed status of ${a.name} to ${nextStatus}.`);
        return { ...a, status: nextStatus };
      }
      return a;
    }));
    showNotification("Officer account status updated.");
  };

  const handleDeleteOfficer = (adminId, adminName) => {
    if (!isSuperAdminUser) return;
    setAdmins(prev => prev.filter(a => a.id !== adminId));
    addAuditLog("OFFICER_REVOKED", `Super Admin revoked access for ${adminName} (${adminId}).`);
    showNotification(`Officer ${adminName} account revoked.`);
  };

  // Dashboard Statistics Override Handlers (Officer Full Edit)
  const handleSaveDashboardStats = (updatedStats) => {
    if (!isOfficer) {
      showNotification("Permission Denied: Only authorized Officers can edit dashboard stats.", "error");
      return;
    }
    setDashboardStatsOverride(updatedStats);
    addAuditLog("DASHBOARD_STATS_UPDATED", `Officer ${currentUser.name} modified consolidated dashboard statistics directly.`);
    showNotification(lang === "kn" ? "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅಂಕಿಅಂಶಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಿ ಉಳಿಸಲಾಗಿದೆ!" : "Consolidated dashboard statistics saved successfully!");
  };

  // Individual Village Member Management Handlers (Protected)
  const handleAddMember = (newMember) => {
    if (!isOfficer) {
      showNotification("Permission Denied: Public users cannot add citizen records.", "error");
      return;
    }
    setMembers(prev => [newMember, ...prev]);
    addAuditLog("MEMBER_REGISTERED", `Officer ${currentUser.name} registered citizen: ${newMember.fullName} (${newMember.id}, ${newMember.villageName}, Category: ${newMember.casteCategory || "Not Disclosed"}).`);
    showNotification(lang === "kn" ? "ಹೊಸ ನಾಗರಿಕರ ದಾಖಲೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ!" : "New member registered and saved to database!");
  };

  const handleUpdateMember = (updatedMember) => {
    if (!isOfficer) {
      showNotification("Permission Denied: Public users cannot update records.", "error");
      return;
    }
    const oldMember = members.find(m => m.id === updatedMember.id);
    const categoryChanged = oldMember && oldMember.casteCategory !== updatedMember.casteCategory;
    const changeDetail = categoryChanged 
      ? ` (Category updated from ${oldMember.casteCategory || "Not Disclosed"} to ${updatedMember.casteCategory || "Not Disclosed"})`
      : "";

    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    addAuditLog("MEMBER_UPDATED", `Officer ${currentUser.name} updated citizen details: ${updatedMember.fullName} (${updatedMember.id})${changeDetail}.`);
    showNotification(lang === "kn" ? "ನಾಗರಿಕರ ಮಾಹಿತಿಯನ್ನು ಪರಿಷ್ಕರಿಸಲಾಗಿದೆ!" : "Citizen record updated successfully!");
  };

  const handleDeleteMember = (memberId, memberName) => {
    if (!isOfficer) {
      showNotification("Permission Denied: Public users cannot delete records.", "error");
      return;
    }
    setMembers(prev => prev.filter(m => m.id !== memberId));
    addAuditLog("MEMBER_DELETED", `Officer ${currentUser.name} deleted citizen profile: ${memberName} (${memberId}).`);
    showNotification(lang === "kn" ? "ದಾಖಲೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ!" : `Member ${memberName} removed.`);
  };

  // Family Management Handlers (Protected)
  const handleAddFamily = (newFamily) => {
    if (!isOfficer) {
      showNotification("Permission Denied: Public users cannot register families.", "error");
      return;
    }
    setFamilies(prev => [newFamily, ...prev]);
    addAuditLog("FAMILY_REGISTERED", `Officer ${currentUser.name} registered household: ${newFamily.headOfFamilySample} (${newFamily.villageName}).`);
    showNotification("New household registered successfully!");
  };

  const handleUpdateFamily = (updatedFamily) => {
    if (!isOfficer) {
      showNotification("Permission Denied: Public users cannot update records.", "error");
      return;
    }
    setFamilies(prev => prev.map(f => f.id === updatedFamily.id ? updatedFamily : f));
    addAuditLog("FAMILY_UPDATED", `Officer ${currentUser.name} updated household: ${updatedFamily.villageName} (${updatedFamily.id}).`);
    showNotification("Household record updated successfully!");
  };

  const handleDeleteFamily = (familyId, villageName) => {
    if (!isOfficer) {
      showNotification("Permission Denied: Public users cannot delete records.", "error");
      return;
    }
    setFamilies(prev => prev.filter(f => f.id !== familyId));
    addAuditLog("FAMILY_DELETED", `Officer ${currentUser.name} deleted household (${familyId}, ${villageName}).`);
    showNotification("Household record removed.");
  };

  // Document Management Handlers (Protected)
  const handleAddDocument = (newDoc) => {
    if (!isOfficer) {
      showNotification("Permission Denied: Public users cannot upload official documents.", "error");
      return;
    }
    setDocuments(prev => [newDoc, ...prev]);
    addAuditLog("DOCUMENT_UPLOADED", `Officer ${currentUser.name} uploaded official order: ${newDoc.title} (${newDoc.fileNumber}).`);
    showNotification("Government order/tender uploaded successfully!");
  };

  const handleUpdateDocument = (updatedDoc) => {
    if (!isOfficer) {
      showNotification("Permission Denied: Public users cannot edit documents.", "error");
      return;
    }
    setDocuments(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
    addAuditLog("DOCUMENT_UPDATED", `Officer ${currentUser.name} updated document: ${updatedDoc.title}.`);
    showNotification("Document details updated successfully!");
  };

  const handleDeleteDocument = (docId, title) => {
    if (!isOfficer) {
      showNotification("Permission Denied: Public users cannot delete documents.", "error");
      return;
    }
    setDocuments(prev => prev.filter(d => d.id !== docId));
    addAuditLog("DOCUMENT_DELETED", `Officer ${currentUser.name} archived/deleted document: ${title} (${docId}).`);
    showNotification(`Document ${title} archived.`);
  };

  // Reset to defaults (Includes 10 villages, 300 members, families, documents)
  const handleResetToDefaults = () => {
    setVillages(initialVillages);
    setFunds(initialFunds);
    setTransactions(initialTransactions);
    setElectionData(initialElectionData);
    setAdmins(initialAdmins);
    setDocuments(initialDocuments);
    setFamilies(initialFamilies);
    setMembers(initialMembers);
    setDashboardStatsOverride(null);
    localStorage.removeItem("gp_dashboard_stats_override");
    addAuditLog("DATABASE_RESET", "Restored default 10 Karnataka Gram Panchayat village profiles, 300 member records, and scheme registers.");
    showNotification("Restored default 10 Karnataka village profiles and 300 citizen records.");
    setIsFirebaseModalOpen(false);
  };

  // PDF & Excel Exports (Available to both Public & Officers)
  const handleExportPdf = (type = "master") => {
    exportToPdf(type, villages, stats, electionData, transactions);
    addAuditLog("REPORT_EXPORT_PDF", `Generated official ${type.toUpperCase()} PDF report.`);
    showNotification("Official PDF report generated and downloaded!");
  };

  const handleExportExcel = () => {
    exportToExcel(villages, transactions, electionData, stats);
    addAuditLog("REPORT_EXPORT_EXCEL", "Exported multi-sheet Excel master register (.xlsx).");
    showNotification("Excel register exported successfully!");
  };

  // Authentication Handlers
  const handleLoginSuccess = (officer) => {
    setCurrentUser(officer);
    addAuditLog("OFFICER_LOGIN", `Officer ${officer.name} (${officer.email}) authenticated with role: ${officer.role}`);
    showNotification(lang === "kn" ? `ಸ್ವಾಗತ ${officer.name}! ಆಡಳಿತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಮರುನಿರ್ದೇಶಿಸಲಾಗುತ್ತಿದೆ.` : `Welcome, ${officer.name}! Redirecting to Admin Dashboard.`);
    setActiveTab("admin"); // Redirect directly to Admin Dashboard as required
  };

  const handleContinueAsPublic = () => {
    setCurrentUser(PUBLIC_USER);
    addAuditLog("PUBLIC_ACCESS", "Visitor entered portal as Public Citizen (Read-Only).");
    showNotification("Entered portal as Public Citizen (Read-Only Mode)");
    setActiveTab("home");
  };

  const handleLogout = () => {
    addAuditLog("OFFICER_LOGOUT", `Officer ${currentUser?.name} logged out.`);
    setCurrentUser(PUBLIC_USER);
    showNotification("Logged out to Public Citizen view.");
    setActiveTab("home");
  };

  // Map activeTab to activeSection for OfficerSidebar
  const activeSidebarSection = useMemo(() => {
    if (activeTab === "home") return "dashboard";
    if (activeTab === "admin") return "audit";
    return activeTab;
  }, [activeTab]);

  const handleSidebarSelect = (sectionId) => {
    if (sectionId === "dashboard") {
      setActiveTab("home");
    } else if (sectionId === "audit") {
      setActiveTab("admin");
    } else {
      setActiveTab(sectionId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-16 lg:pb-0">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-24 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200 ${
          notification.type === "error"
            ? "bg-red-950 text-white border-red-400"
            : "bg-gov-950 text-white border-amber-400/50"
        }`}>
          <span className={`w-2 h-2 rounded-full ${notification.type === "error" ? "bg-red-400" : "bg-emerald-400"}`}></span>
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Top Government Navigation Header */}
      <Header
        lang={lang}
        setLang={setLang}
        t={t}
        currentUser={currentUser}
        isOfficer={isOfficer}
        onNavigateToLogin={(type) => setActiveTab(type === "officer" ? "officerLogin" : "publicLogin")}
        onLogout={handleLogout}
        setIsFirebaseModalOpen={setIsFirebaseModalOpen}
        isFirebaseConnected={true}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onQuickExportMaster={() => handleExportPdf("master")}
      />

      {/* Primary Tab Navigation across 10 Pages */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        t={t}
        isOfficer={isOfficer}
        isSuperAdmin={isSuperAdminUser}
        villageCount={villages.length}
      />

      {/* Mobile Drawer (When toggled) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gov-900 text-white px-4 py-3 border-b border-gov-800 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button 
              onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }}
              className="p-2 rounded-lg bg-gov-800 text-left"
            >
              1. {t.pageHome}
            </button>
            <button 
              onClick={() => { setActiveTab("villages"); setMobileMenuOpen(false); }}
              className="p-2 rounded-lg bg-gov-800 text-left"
            >
              2. {t.pageVillages} ({villages.length})
            </button>
            <button 
              onClick={() => { setActiveTab("villageMap"); setMobileMenuOpen(false); }}
              className="p-2 rounded-lg bg-gov-800 text-left text-amber-300 font-bold"
            >
              📍 {lang === "kn" ? "ಗ್ರಾಮಗಳ ನಕ್ಷೆ (GIS Map)" : "10 Villages Map (GIS)"}
            </button>
            <button 
              onClick={() => { setActiveTab("members"); setMobileMenuOpen(false); }}
              className="p-2 rounded-lg bg-gov-800 text-left"
            >
              3. Village People (300)
            </button>
            <button 
              onClick={() => { setActiveTab("population"); setMobileMenuOpen(false); }}
              className="p-2 rounded-lg bg-gov-800 text-left"
            >
              4. {t.pagePopulation}
            </button>
            <button 
              onClick={() => { setActiveTab("families"); setMobileMenuOpen(false); }}
              className="p-2 rounded-lg bg-gov-800 text-left"
            >
              5. Families & Housing
            </button>
            <button 
              onClick={() => { setActiveTab("rations"); setMobileMenuOpen(false); }}
              className="p-2 rounded-lg bg-gov-800 text-left"
            >
              6. {t.pageRations}
            </button>
            <button 
              onClick={() => { setActiveTab("elections"); setMobileMenuOpen(false); }}
              className="p-2 rounded-lg bg-gov-800 text-left"
            >
              7. {t.pageElections}
            </button>
            <button 
              onClick={() => { setActiveTab("funds"); setMobileMenuOpen(false); }}
              className="p-2 rounded-lg bg-gov-800 text-left"
            >
              8. {t.pageFunds}
            </button>
            <button 
              onClick={() => { setActiveTab("reports"); setMobileMenuOpen(false); }}
              className="p-2 rounded-lg bg-gov-800 text-left"
            >
              9. {t.pageReports}
            </button>
            <button 
              onClick={() => { setActiveTab("documents"); setMobileMenuOpen(false); }}
              className="p-2 rounded-lg bg-gov-800 text-left"
            >
              10. Documents
            </button>
            {isOfficer ? (
              <button 
                onClick={() => { setActiveTab("admin"); setMobileMenuOpen(false); }}
                className="p-2 rounded-lg bg-amber-500 text-gov-950 text-left font-bold col-span-2"
              >
                11. {t.pageAdminDashboard} (Officer Console)
              </button>
            ) : (
              <button 
                onClick={() => { setActiveTab("officerLogin"); setMobileMenuOpen(false); }}
                className="p-2 rounded-lg bg-amber-500 text-gov-950 text-left font-bold col-span-2"
              >
                Officer Portal Login
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={isOfficer ? "flex flex-col lg:flex-row gap-6 items-start" : ""}>
          
          {/* Officer Dashboard Sidebar (12 Menu Options) - Displayed for logged-in Officers */}
          {isOfficer && (
            <OfficerSidebar
              activeSection={activeSidebarSection}
              setActiveSection={handleSidebarSelect}
              currentUser={currentUser}
              onLogout={handleLogout}
              t={t}
              lang={lang}
              villageCount={villages.length}
            />
          )}

          {/* Active Section Content */}
          <div className="flex-1 min-w-0 w-full">
            
            {/* PAGE 1: HOME DASHBOARD */}
            {(activeTab === "home" || activeTab === "dashboard") && (
              <Dashboard
                stats={stats}
                villages={villages}
                funds={funds}
                transactions={transactions}
                auditLogs={auditLogs}
                electionData={electionData}
                t={t}
                lang={lang}
                setLang={setLang}
                isOfficer={isOfficer}
                onNavigateToLogin={() => setActiveTab("officerLogin")}
                setActiveTab={setActiveTab}
                setIsAddVillageModalOpen={() => {
                  if (isOfficer) setActiveTab("villages");
                  else showNotification("Public Users have read-only access.", "error");
                }}
                setIsAddTransactionModalOpen={() => {
                  if (isOfficer) setActiveTab("funds");
                  else showNotification("Public Users have read-only access.", "error");
                }}
                onExportPdf={() => handleExportPdf("master")}
                onExportExcel={handleExportExcel}
                onOpenEditDashboard={() => setIsEditDashboardModalOpen(true)}
              />
            )}

            {/* PAGE 2: VILLAGE INFORMATION (10 Separate Profiles) */}
            {activeTab === "villages" && (
              <VillageManagement
                villages={villages}
                t={t}
                lang={lang}
                setLang={setLang}
                isOfficer={isOfficer}
                onAddVillage={handleAddVillage}
                onUpdateVillage={handleUpdateVillage}
                onDeleteVillage={handleDeleteVillage}
                onSelectVillageForDetails={(v) => setSelectedVillageForDetails(v)}
                onExportExcel={handleExportExcel}
              />
            )}

            {/* PAGE: 10 VILLAGES GIS MAP */}
            {(activeTab === "villageMap" || activeTab === "map") && (
              <VillageMap
                villages={villages}
                t={t}
                lang={lang}
                setLang={setLang}
                isOfficer={isOfficer}
                onUpdateVillage={handleUpdateVillage}
                onSelectVillageForDetails={(v) => setSelectedVillageForDetails(v)}
              />
            )}

            {/* PAGE 3: VILLAGE PEOPLE & FAMILY RECORDS (300 Individual Members) */}
            {activeTab === "members" && (
              <VillageMemberManagement
                members={members}
                villages={villages}
                isOfficer={isOfficer}
                onAddMember={handleAddMember}
                onUpdateMember={handleUpdateMember}
                onDeleteMember={handleDeleteMember}
                onNavigateToLogin={() => setActiveTab("officerLogin")}
                t={t}
                lang={lang}
              />
            )}

            {/* PAGE 4: POPULATION STATISTICS */}
            {activeTab === "population" && (
              <PopulationStatistics
                villages={villages}
                members={members}
                stats={stats}
                t={t}
                lang={lang}
                onExportPdf={handleExportPdf}
                onExportExcel={handleExportExcel}
              />
            )}

            {/* PAGE 5: FAMILY MANAGEMENT */}
            {activeTab === "families" && (
              <FamilyManagement
                families={families}
                villages={villages}
                isOfficer={isOfficer}
                onAddFamily={handleAddFamily}
                onUpdateFamily={handleUpdateFamily}
                onDeleteFamily={handleDeleteFamily}
                onExportExcel={handleExportExcel}
                t={t}
                lang={lang}
              />
            )}

            {/* PAGE 6: APL/BPL SUMMARY */}
            {activeTab === "rations" && (
              <RationCardSummary
                villages={villages}
                stats={stats}
                t={t}
                lang={lang}
                onExportExcel={handleExportExcel}
                onExportPdf={() => handleExportPdf("master")}
              />
            )}

            {/* PAGE 7: ELECTION INFORMATION */}
            {activeTab === "elections" && (
              <ElectionManagement
                electionData={electionData}
                villages={villages}
                stats={stats}
                t={t}
                lang={lang}
                onExportPdf={() => handleExportPdf("election")}
                onExportExcel={handleExportExcel}
              />
            )}

            {/* PAGE 8: GOVERNMENT FUNDS & TRANSACTIONS */}
            {(activeTab === "funds" || activeTab === "transactions") && (
              <FundsManagement
                funds={funds}
                transactions={transactions}
                stats={stats}
                villages={villages}
                t={t}
                lang={lang}
                setLang={setLang}
                isOfficer={isOfficer}
                onAddTransaction={handleAddTransaction}
                onExportPdf={() => handleExportPdf("funds")}
                onExportExcel={handleExportExcel}
              />
            )}

            {/* PAGE 9: DEVELOPMENT REPORTS */}
            {activeTab === "reports" && (
              <Reports
                villages={villages}
                funds={funds}
                transactions={transactions}
                electionData={electionData}
                stats={stats}
                t={t}
                lang={lang}
                onExportPdf={handleExportPdf}
                onExportExcel={handleExportExcel}
              />
            )}

            {/* PAGE 10: OFFICIAL DOCUMENTS MANAGEMENT */}
            {activeTab === "documents" && (
              <DocumentManagement
                documents={documents}
                isOfficer={isOfficer}
                onAddDocument={handleAddDocument}
                onUpdateDocument={handleUpdateDocument}
                onDeleteDocument={handleDeleteDocument}
                t={t}
                lang={lang}
              />
            )}

            {/* PAGE 11: OFFICER LOGIN */}
            {activeTab === "officerLogin" && (
              <LoginPage
                initialTab="officer"
                onLoginSuccess={handleLoginSuccess}
                onContinueAsPublic={handleContinueAsPublic}
                currentUser={currentUser}
                t={t}
                lang={lang}
                setLang={setLang}
              />
            )}

            {/* PAGE 12: PUBLIC USER LOGIN / ENTRANCE */}
            {activeTab === "publicLogin" && (
              <LoginPage
                initialTab="public"
                onLoginSuccess={handleLoginSuccess}
                onContinueAsPublic={handleContinueAsPublic}
                currentUser={currentUser}
                t={t}
                lang={lang}
                setLang={setLang}
              />
            )}

            {/* PAGE 13: ADMIN DASHBOARD & AUDIT HISTORY */}
            {(activeTab === "admin" || activeTab === "audit") && (
              <div className="space-y-6">
                {isOfficer ? (
                  <>
                    {/* Officer Accounts Management (Super Admin can create/manage) */}
                    <OfficerManagement
                      admins={admins}
                      currentUser={currentUser}
                      onAddOfficer={handleAddOfficer}
                      onToggleOfficerStatus={handleToggleOfficerStatus}
                      onDeleteOfficer={handleDeleteOfficer}
                      t={t}
                      lang={lang}
                    />

                    {/* Database Firestore Sync Controls */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                          <Database className="w-5 h-5 text-gov-800" />
                          <span>{t.dbTitle}</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {t.dbSubtitle}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsFirebaseModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-gov-900 text-white font-bold text-xs hover:bg-gov-800 shadow-md transition"
                      >
                        Configure Firestore & Rules
                      </button>
                    </div>

                    {/* Audit Logs Trail */}
                    <AuditLogs
                      auditLogs={auditLogs}
                      t={t}
                      lang={lang}
                    />
                  </>
                ) : (
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-lg mx-auto shadow-lg space-y-4">
                    <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                      <Lock className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      Officer Authentication Required
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      The Admin Console and Officer Management screen are strictly restricted to authorized Gram Panchayat Officers. Please log in with your administrative credentials.
                    </p>
                    <button
                      onClick={() => setActiveTab("officerLogin")}
                      className="px-6 py-2.5 rounded-xl bg-gov-900 text-white font-bold text-xs sm:text-sm hover:bg-gov-800 shadow-md transition"
                    >
                      Go to Officer Login
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Official Government Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-600 py-6 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-800">
              {t.appTitle} ({t.panchayatName})
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Government of Karnataka • Rural Development and Panchayati Raj Department (RDPR)
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <button 
              onClick={() => setActiveTab("officerLogin")}
              className="text-gov-800 hover:underline font-semibold"
            >
              Officer Portal
            </button>
            <span>•</span>
            <button 
              onClick={() => handleExportPdf("master")}
              className="text-gov-800 hover:underline font-semibold"
            >
              Official Gazette PDF
            </button>
            <span>•</span>
            <span className="font-semibold text-slate-700">Role-Based Access Edition</span>
          </div>
        </div>
      </footer>

      {/* Mobile Android Bottom Dock Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        t={t}
        isOfficer={isOfficer}
      />

      {/* Village Deep-Dive Profile Modal */}
      {selectedVillageForDetails && (
        <VillageDetailModal
          village={selectedVillageForDetails}
          onClose={() => setSelectedVillageForDetails(null)}
          t={t}
          lang={lang}
          onPrintVillage={() => window.print()}
        />
      )}

      {/* Cloud Firestore & Security Settings Modal */}
      <FirebaseSettingsModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        t={t}
        lang={lang}
        setLang={setLang}
        onResetToDefaults={handleResetToDefaults}
        currentData={{
          villages,
          funds,
          transactions,
          electionData
        }}
      />

      {/* First-Time User Language Selection Modal */}
      <FirstTimeLanguageModal
        isOpen={isFirstTimeModalOpen}
        currentLang={lang}
        onConfirmLanguage={handleConfirmFirstTimeLanguage}
        t={t}
      />

      {/* Edit Dashboard Statistics Modal (Full Officer Edit Access) */}
      <EditDashboardModal
        isOpen={isEditDashboardModalOpen}
        onClose={() => setIsEditDashboardModalOpen(false)}
        stats={stats}
        villages={villages}
        funds={funds}
        onSaveDashboardStats={handleSaveDashboardStats}
        t={t}
        lang={lang}
      />

    </div>
  );
}
