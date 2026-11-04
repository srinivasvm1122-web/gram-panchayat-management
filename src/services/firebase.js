// Firebase Firestore & Authentication Service
// Seamlessly connects with Cloud Firestore with fallback to local persistent storage

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  enableIndexedDbPersistence
} from "firebase/firestore";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

// Default placeholder or configured credentials
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDemo-GramPanchayatKey-Karnataka",
  authDomain: "gram-panchayat-karnataka.firebaseapp.com",
  projectId: "gram-panchayat-karnataka",
  storageBucket: "gram-panchayat-karnataka.appspot.com",
  messagingSenderId: "109876543210",
  appId: "1:109876543210:web:8a9b7c6d5e4f3a2b1c"
};

// Retrieve custom saved config if user provided their live project keys
export const getActiveFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem("gp_firebase_config");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error reading saved Firebase config:", e);
  }
  return DEFAULT_FIREBASE_CONFIG;
};

export const saveFirebaseConfig = (config) => {
  localStorage.setItem("gp_firebase_config", JSON.stringify(config));
};

let app = null;
let db = null;
let auth = null;

export const initFirebase = () => {
  try {
    const config = getActiveFirebaseConfig();
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    db = getFirestore(app);
    auth = getAuth(app);
    return { app, db, auth, isConfigured: true };
  } catch (err) {
    console.warn("Firebase initialized in simulated offline/demo mode:", err.message);
    return { app: null, db: null, auth: null, isConfigured: false, error: err.message };
  }
};

// Initialize once
const firebaseInstance = initFirebase();

export { app, db, auth };

// Firestore Collections definition as required by specifications
export const COLLECTIONS = {
  ADMINS: "Admins",
  VILLAGES: "Villages",
  VILLAGE_STATISTICS: "VillageStatistics",
  RATION_CARD_SUMMARY: "RationCardSummary",
  ELECTION_STATISTICS: "ElectionStatistics",
  FUNDS: "Funds",
  TRANSACTIONS: "Transactions",
  MEMBERS: "Members",
  AUDIT_LOGS: "AuditLogs"
};

/**
 * Push all 10 village records and data into Firestore
 */
export const seedFirestoreCollections = async (data) => {
  const { db } = initFirebase();
  if (!db) throw new Error("Firestore not initialized");

  const results = { villages: 0, transactions: 0, funds: 0, elections: 0 };

  // 1. Seed Villages
  if (data.villages && data.villages.length) {
    for (const vil of data.villages) {
      await setDoc(doc(db, COLLECTIONS.VILLAGES, vil.id), vil);
      results.villages++;
    }
  }

  // 2. Seed Funds
  if (data.funds) {
    await setDoc(doc(db, COLLECTIONS.FUNDS, "current_financial_year"), data.funds);
    results.funds++;
  }

  // 3. Seed Transactions
  if (data.transactions && data.transactions.length) {
    for (const txn of data.transactions) {
      await setDoc(doc(db, COLLECTIONS.TRANSACTIONS, txn.id), txn);
      results.transactions++;
    }
  }

  // 4. Seed Election Stats
  if (data.electionData) {
    await setDoc(doc(db, COLLECTIONS.ELECTION_STATISTICS, "gp_general_elections"), data.electionData);
    results.elections++;
  }

  return results;
};
