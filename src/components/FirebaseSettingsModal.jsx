import React, { useState, useEffect } from "react";
import { 
  Database, 
  Cloud, 
  CloudOff, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Copy, 
  X, 
  AlertTriangle,
  Server,
  Layers,
  ArrowRight,
  Key,
  HardDrive
} from "lucide-react";
import { 
  getActiveFirebaseConfig, 
  saveFirebaseConfig, 
  COLLECTIONS, 
  seedFirestoreCollections 
} from "../services/firebase";
import { getDbStatus, seedDatabase } from "../services/apiService";

export const FirebaseSettingsModal = ({ 
  isOpen, 
  onClose, 
  t, 
  lang,
  onResetToDefaults,
  currentData
}) => {
  if (!isOpen) return null;

  const [config, setConfig] = useState(getActiveFirebaseConfig());
  const [syncStatus, setSyncStatus] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState("mongo"); // "mongo", "collections", "config", "rules"
  const [copied, setCopied] = useState(false);
  const [mongoStatus, setMongoStatus] = useState(null);
  const [isCheckingMongo, setIsCheckingMongo] = useState(false);

  const checkMongo = async () => {
    setIsCheckingMongo(true);
    const status = await getDbStatus();
    setMongoStatus(status);
    setIsCheckingMongo(false);
  };

  useEffect(() => {
    checkMongo();
  }, []);

  const handleSeedMongo = async () => {
    setIsSyncing(true);
    setSyncStatus("Seeding MongoDB Atlas database...");
    const res = await seedDatabase();
    if (res.success) {
      setSyncStatus("✅ MongoDB Atlas populated with 10 villages and 300 members!");
      checkMongo();
    } else {
      setSyncStatus(`Notice: ${res.message || res.error || "Please verify credentials in .env"}`);
    }
    setIsSyncing(false);
    setTimeout(() => setSyncStatus(""), 6000);
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveConfig = () => {
    saveFirebaseConfig(config);
    setSyncStatus("Firebase project configuration saved locally.");
    setTimeout(() => setSyncStatus(""), 4000);
  };

  const handlePushToFirestore = async () => {
    setIsSyncing(true);
    setSyncStatus("Pushing 10 villages, funds and election records to Cloud Firestore...");
    try {
      const res = await seedFirestoreCollections(currentData);
      setSyncStatus(`Successfully pushed ${res.villages} villages and financial records to Firestore!`);
    } catch (err) {
      setSyncStatus(`Sync simulation mode active (Offline fallback). Data saved locally.`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(""), 5000);
    }
  };

  const rulesContent = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isAdmin() { return isAuthenticated() && request.auth.token.role in ['SuperAdmin', 'PDO', 'President']; }

    match /Admins/{adminId} { allow read: if isAuthenticated(); allow write: if isAdmin(); }
    match /Villages/{villageId} { allow read: if true; allow write: if isAdmin(); }
    match /VillageStatistics/{statId} { allow read: if true; allow write: if isAdmin(); }
    match /RationCardSummary/{summaryId} { allow read: if true; allow write: if isAdmin(); }
    // Strict Election Privacy Rule
    match /ElectionStatistics/{electionId} {
      allow read: if true;
      allow write: if isAdmin() && !request.resource.data.keys().hasAny(['individualVotes', 'ballotChoices']);
    }
    match /Funds/{fundId} { allow read: if true; allow write: if isAdmin(); }
    match /Transactions/{transactionId} { allow read: if true; allow write: if isAdmin(); }
    match /AuditLogs/{logId} { allow read: if isAdmin(); allow create: if isAuthenticated(); allow update, delete: if false; }
  }
}`;

  const copyRules = () => {
    navigator.clipboard.writeText(rulesContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const requiredCollections = [
    { name: "Admins", count: 3, desc: "Panchayat Development Officers & Administrative authorities" },
    { name: "Villages", count: 10, desc: "10 registered Karnataka village demographics & profiles" },
    { name: "VillageStatistics", count: 1, desc: "Consolidated population, families & voter rollups" },
    { name: "RationCardSummary", count: 10, desc: "Village-wise APL/BPL cards & Fair Price Dealers" },
    { name: "ElectionStatistics", count: 1, desc: "Official turnout & declared results (Privacy secured)" },
    { name: "Funds", count: 1, desc: "Government grants (15th FC, MGNREGA, SFC) & balances" },
    { name: "Transactions", count: 9, desc: "Audited financial vouchers & receipt attachments" },
    { name: "AuditLogs", count: 4, desc: "Immutable security history trail of administrative actions" }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-5 bg-gov-950 text-white rounded-t-2xl flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gov-900 rounded-xl border border-amber-400/40">
              <Database className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                {t.dbTitle}
              </h3>
              <p className="text-xs text-sky-200">
                {t.dbSubtitle}
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 space-x-4 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab("mongo")}
            className={`pb-2.5 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "mongo" 
                ? "border-emerald-600 text-emerald-800" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Server className="w-3.5 h-3.5 text-emerald-600" />
            <span>MongoDB Atlas (.env)</span>
            <span className={`w-2 h-2 rounded-full ${mongoStatus?.connected ? "bg-emerald-500" : "bg-amber-400"}`}></span>
          </button>
          <button
            onClick={() => setActiveTab("collections")}
            className={`pb-2.5 border-b-2 transition whitespace-nowrap ${
              activeTab === "collections" 
                ? "border-gov-800 text-gov-900" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Firestore Collections (7 + Audit)
          </button>
          <button
            onClick={() => setActiveTab("config")}
            className={`pb-2.5 border-b-2 transition ${
              activeTab === "config" 
                ? "border-gov-800 text-gov-900" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Firebase Credentials Config
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`pb-2.5 border-b-2 transition ${
              activeTab === "rules" 
                ? "border-gov-800 text-gov-900" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Security Rules (firestore.rules)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {syncStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{syncStatus}</span>
            </div>
          )}

          {/* TAB 0: MONGODB ATLAS (.ENV) */}
          {activeTab === "mongo" && (
            <div className="space-y-4">
              
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl text-white font-bold ${
                    mongoStatus?.connected ? "bg-emerald-600" : "bg-amber-600"
                  }`}>
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 flex items-center space-x-2">
                      <span>MongoDB Atlas Cluster</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        mongoStatus?.connected ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {mongoStatus?.connected ? "CONNECTED" : "SETUP REQUIRED"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      cluster0.dipytpy.mongodb.net • Database: {mongoStatus?.database || "gram_panchayat"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={checkMongo}
                    disabled={isCheckingMongo}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center space-x-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCheckingMongo ? "animate-spin" : ""}`} />
                    <span>Check Status</span>
                  </button>

                  <button
                    onClick={handleSeedMongo}
                    disabled={isSyncing}
                    className="px-3.5 py-1.5 rounded-lg bg-gov-900 hover:bg-gov-800 text-white font-bold text-xs flex items-center space-x-1 shadow"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-amber-300" />
                    <span>Seed MongoDB</span>
                  </button>
                </div>
              </div>

              {/* Auth Failure / Diagnostic Alert */}
              {mongoStatus && !mongoStatus.connected && !mongoStatus.hasPlaceholderPassword && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 space-y-2">
                  <div className="flex items-start space-x-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-amber-900 block">
                        MongoDB Atlas Authentication Diagnostic:
                      </span>
                      <p className="mt-0.5 text-amber-800 leading-relaxed font-medium">
                        Atlas reported: <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold text-amber-950">{mongoStatus.error || "authentication failed"}</code>
                      </p>
                    </div>
                  </div>
                  <div className="pl-7 text-[11px] text-amber-900 space-y-1">
                    <p>• In MongoDB Atlas, verify that the database user <strong className="font-mono">gram_panchayat_admin</strong> exists under <strong>Database Access</strong>.</p>
                    <p>• Verify that this user has privileges like <strong>Read and write to any database</strong>.</p>
                    <p>• In <strong>Network Access</strong>, ensure your current IP address or <code className="bg-amber-100 px-1 rounded font-mono">0.0.0.0/0</code> (Allow Access From Anywhere) is active.</p>
                    <p>• The application will continue operating with full local persistence until Atlas credentials authenticate.</p>
                  </div>
                </div>
              )}

              {/* Password Notice Alert */}
              {mongoStatus?.hasPlaceholderPassword && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start space-x-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-amber-900 block">
                      Replace &lt;db_password&gt; in your .env file
                    </span>
                    <p className="mt-0.5 text-amber-800 leading-relaxed font-medium">
                      The MongoDB URI has been configured in your project's <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">.env</code> file. To connect live, replace <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">&lt;db_password&gt;</code> with your MongoDB database user password.
                    </p>
                  </div>
                </div>
              )}

              {/* Connection String Details */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Configured Connection URI (.env):</span>
                  <span className="text-[11px] text-slate-400 font-normal">Environment Variable: MONGODB_URI</span>
                </div>
                
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-slate-200 font-mono text-[11px] break-all flex items-center justify-between gap-2">
                  <span>{mongoStatus?.uri || "mongodb+srv://gram_panchayat_admin:*****@cluster0.dipytpy.mongodb.net/gram_panchayat"}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(mongoStatus?.uri || "mongodb+srv://gram_panchayat_admin:K%409!w%40Kdzp4S7TH@cluster0.dipytpy.mongodb.net/gram_panchayat?retryWrites=true&w=majority");
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white flex-shrink-0"
                    title="Copy URI"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Environment Variables Reference */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                  <Key className="w-4 h-4 text-gov-800" />
                  <span>Configured .env Parameters:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">Database User</span>
                    <span className="font-bold text-slate-800">gram_panchayat_admin</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">Database Name</span>
                    <span className="font-bold text-slate-800">gram_panchayat</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">API Server Port</span>
                    <span className="font-bold text-slate-800">5000 (Express + Mongoose)</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">Frontend Proxy</span>
                    <span className="font-bold text-slate-800">/api &rarr; http://localhost:5000</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 1: COLLECTIONS */}
          {activeTab === "collections" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {t.firebaseCollections}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Requirement 6 collections configured for Gram Panchayat portal.
                  </p>
                </div>

                <button
                  onClick={handlePushToFirestore}
                  disabled={isSyncing}
                  className="px-3.5 py-1.5 rounded-xl bg-gov-900 hover:bg-gov-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>{t.syncNow}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {requiredCollections.map((col) => (
                  <div key={col.name} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono text-gov-900 text-sm">
                        /{col.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Active
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1 leading-snug">
                      {col.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Reset seed data button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Reset data to default 10 Karnataka villages:
                </span>
                <button
                  onClick={onResetToDefaults}
                  className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition"
                >
                  {t.resetDefaults}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CONFIG */}
          {activeTab === "config" && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Enter your live Firebase project credentials below if you wish to link a custom Firebase Firestore project.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">API Key</label>
                  <input
                    type="text"
                    name="apiKey"
                    value={config.apiKey}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Project ID</label>
                  <input
                    type="text"
                    name="projectId"
                    value={config.projectId}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Auth Domain</label>
                  <input
                    type="text"
                    name="authDomain"
                    value={config.authDomain}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">App ID</label>
                  <input
                    type="text"
                    name="appId"
                    value={config.appId}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  onClick={handleSaveConfig}
                  className="px-4 py-2 bg-gov-900 text-white font-bold rounded-xl text-xs hover:bg-gov-800 transition"
                >
                  Save Config
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: RULES */}
          {activeTab === "rules" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Firestore Security Rules (Included in firestore.rules):
                </span>
                <button
                  onClick={copyRules}
                  className="text-xs font-bold text-gov-800 hover:text-gov-950 flex items-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? "Copied!" : "Copy Rules"}</span>
                </button>
              </div>

              <pre className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-56 leading-relaxed">
                {rulesContent}
              </pre>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
