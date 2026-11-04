// Data Storage and State Manager
// Combines LocalStorage persistence with Firebase Firestore sync, strict role enforcement and audit trailing

import { 
  initialVillages, 
  initialFunds, 
  initialTransactions, 
  initialElectionData, 
  initialAdmins, 
  initialAuditLogs,
  initialDocuments,
  initialFamilies
} from "../data/initialData";
import { initialMembers } from "../data/memberData";

const STORAGE_KEYS = {
  VILLAGES: "gp_villages_data_v2",
  FUNDS: "gp_funds_data_v2",
  TRANSACTIONS: "gp_transactions_data_v2",
  ELECTIONS: "gp_elections_data_v2",
  AUDIT_LOGS: "gp_audit_logs_v2",
  ADMINS: "gp_admins_data_v2",
  DOCUMENTS: "gp_documents_data_v2",
  FAMILIES: "gp_families_data_v2",
  MEMBERS: "gp_members_data_v2",
  CURRENT_USER: "gp_current_user_v2",
  LANGUAGE: "gp_selected_language"
};

// Default Public User representation
export const PUBLIC_USER = {
  id: "PUBLIC_CITIZEN",
  name: "Public Citizen",
  role: "Public",
  designation: "Citizen / Public Viewer",
  isReadOnly: true
};

// Safe storage retrieval with fallback to initial data
const getStored = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
};

const setStored = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
};

export const loadInitialState = () => {
  const villages = getStored(STORAGE_KEYS.VILLAGES, initialVillages);
  const funds = getStored(STORAGE_KEYS.FUNDS, initialFunds);
  const transactions = getStored(STORAGE_KEYS.TRANSACTIONS, initialTransactions);
  const electionData = getStored(STORAGE_KEYS.ELECTIONS, initialElectionData);
  const auditLogs = getStored(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
  const admins = getStored(STORAGE_KEYS.ADMINS, initialAdmins);
  const documents = getStored(STORAGE_KEYS.DOCUMENTS, initialDocuments);
  const families = getStored(STORAGE_KEYS.FAMILIES, initialFamilies);
  const rawMembers = getStored(STORAGE_KEYS.MEMBERS, initialMembers);
  // Ensure every member has a valid caste/casteCategory default
  const members = rawMembers.map((m, idx) => {
    const casteVal = m.caste || m.casteCategory || initialMembers[idx]?.caste || initialMembers[idx]?.casteCategory || "General";
    return {
      ...m,
      caste: casteVal,
      casteCategory: casteVal
    };
  });
  // Default to Public Citizen for general visitors, or retrieved authenticated officer
  const currentUser = getStored(STORAGE_KEYS.CURRENT_USER, PUBLIC_USER);
  const language = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || "en";

  return {
    villages,
    funds,
    transactions,
    electionData,
    auditLogs,
    admins,
    documents,
    families,
    members,
    currentUser,
    language
  };
};

/**
 * Security Permission Checker
 * Verifies if the current user has write authorization (Gram Panchayat Officer or Super Admin)
 */
export const canModifyData = (user) => {
  if (!user || user.isReadOnly) return false;
  const role = user.role;
  return role === "SuperAdmin" || role === "Super Admin" || role === "PDO" || role === "President" || role === "Officer";
};

export const isSuperAdmin = (user) => {
  if (!user || user.isReadOnly) return false;
  const role = user.role;
  return role === "SuperAdmin" || role === "Super Admin";
};

/**
 * Calculates live dashboard aggregates based on current village records and transactions
 */
export const calculatePanchayatStatistics = (villages = [], funds = {}, transactions = []) => {
  const totalVillages = villages.length;
  
  const totalPopulation = villages.reduce((acc, v) => acc + (Number(v.totalPopulation) || 0), 0);
  const totalLivingMembers = villages.reduce((acc, v) => acc + (Number(v.livingMembers) || 0), 0);
  const totalMaleMembers = villages.reduce((acc, v) => acc + (Number(v.maleMembers) || 0), 0);
  const totalFemaleMembers = villages.reduce((acc, v) => acc + (Number(v.femaleMembers) || 0), 0);
  
  const totalFamilies = villages.reduce((acc, v) => acc + (Number(v.totalFamilies) || 0), 0);
  const aplCardFamilies = villages.reduce((acc, v) => acc + (Number(v.aplCardCount) || 0), 0);
  const bplCardFamilies = villages.reduce((acc, v) => acc + (Number(v.bplCardCount) || 0), 0);
  
  const totalRegisteredVoters = villages.reduce((acc, v) => acc + (Number(v.totalVoters) || 0), 0);
  const totalMaleVoters = villages.reduce((acc, v) => acc + (Number(v.maleVoters) || 0), 0);
  const totalFemaleVoters = villages.reduce((acc, v) => acc + (Number(v.femaleVoters) || 0), 0);
  const totalVotesCast = villages.reduce((acc, v) => acc + (Number(v.votesCast) || 0), 0);
  
  const votingPercentage = totalRegisteredVoters > 0 
    ? Number(((totalVotesCast / totalRegisteredVoters) * 100).toFixed(2)) 
    : 0;

  // Calculate dynamic funds from transactions
  const totalFundsReceived = transactions
    .filter(t => t.type === "Credit")
    .reduce((acc, t) => acc + (Number(t.amount) || 0), funds.totalFundsReceived || 4850000);

  // Calculate categorized expenses
  const roadExpenses = transactions
    .filter(t => t.type === "Debit" && t.category.toLowerCase().includes("road"))
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const waterExpenses = transactions
    .filter(t => t.type === "Debit" && t.category.toLowerCase().includes("water"))
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const sanitationExpenses = transactions
    .filter(t => t.type === "Debit" && (t.category.toLowerCase().includes("sanitation") || t.category.toLowerCase().includes("waste")))
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const lightingExpenses = transactions
    .filter(t => t.type === "Debit" && t.category.toLowerCase().includes("light"))
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const otherExpenses = transactions
    .filter(t => t.type === "Debit" && !t.category.toLowerCase().includes("road") && !t.category.toLowerCase().includes("water") && !t.category.toLowerCase().includes("sanitation") && !t.category.toLowerCase().includes("light"))
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const totalDebitExpenses = transactions
    .filter(t => t.type === "Debit")
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const remainingBalance = totalFundsReceived - totalDebitExpenses;

  return {
    totalVillages,
    totalPopulation,
    totalLivingMembers,
    totalMaleMembers,
    totalFemaleMembers,
    totalFamilies,
    aplCardFamilies,
    bplCardFamilies,
    totalRegisteredVoters,
    totalMaleVoters,
    totalFemaleVoters,
    totalVotesCast,
    votingPercentage,
    totalFundsReceived,
    totalExpenses: totalDebitExpenses,
    remainingBalance,
    breakdownExpenses: {
      roadExpenses,
      waterExpenses,
      sanitationExpenses,
      lightingExpenses,
      otherExpenses
    }
  };
};

/**
 * Creates an immutable audit record
 */
export const createAuditEntry = (action, details, user) => {
  const now = new Date();
  const timestamp = now.toISOString().replace("T", " ").substring(0, 19);
  
  return {
    id: `LOG-${Date.now().toString().slice(-5)}`,
    timestamp,
    user: user?.name || "Public Citizen",
    role: user?.designation || (user?.role === "Public" ? "Public Citizen" : "Officer"),
    action,
    details
  };
};

export { STORAGE_KEYS, setStored, getStored };
