import mongoose from "mongoose";

// 1. Village Model
const villageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  nameEn: { type: String, required: true },
  nameKn: { type: String, required: true },
  wardNo: { type: Number, required: true },
  totalPopulation: { type: Number, default: 0 },
  livingMembers: { type: Number, default: 0 },
  maleMembers: { type: Number, default: 0 },
  femaleMembers: { type: Number, default: 0 },
  totalFamilies: { type: Number, default: 0 },
  aplCardCount: { type: Number, default: 0 },
  bplCardCount: { type: Number, default: 0 },
  totalVoters: { type: Number, default: 0 },
  maleVoters: { type: Number, default: 0 },
  femaleVoters: { type: Number, default: 0 },
  votesCast: { type: Number, default: 0 },
  sarpanchName: { type: String, default: "" },
  sarpanchContact: { type: String, default: "" },
  notes: { type: String, default: "" }
}, { timestamps: true, strict: false });

// 2. Member Model (Village Citizens)
const memberSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  villageId: { type: String, required: true },
  villageName: { type: String, required: true },
  fullName: { type: String, required: true },
  guardianName: { type: String, default: "" },
  houseNumber: { type: String, default: "" },
  familyId: { type: String, default: "" },
  gender: { type: String, enum: ["Male", "Female", "Other", ""], default: "Male" },
  age: { type: Number, default: 35 },
  rationType: { type: String, enum: ["APL", "BPL"], default: "BPL" },
  caste: { 
    type: String, 
    enum: ["General", "OBC", "SC", "ST", "Other", "Not Disclosed", ""], 
    default: "General" 
  },
  casteCategory: { 
    type: String, 
    enum: ["General", "OBC", "SC", "ST", "Other", "Not Disclosed", ""], 
    default: "General" 
  },
  phone: { type: String, default: "" },
  medicalCheckupStatus: { 
    type: String, 
    enum: ["Completed", "Not Completed", "Not Applicable"], 
    default: "Not Completed" 
  },
  lastCheckupMonth: { type: String, default: "November 2024" },
  remarks: { type: String, default: "" }
}, { timestamps: true, strict: false });

// 3. Family Model
const familySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  wardNo: { type: Number, required: true },
  villageName: { type: String, required: true },
  totalHouseholds: { type: Number, default: 0 },
  headOfFamilySample: { type: String, default: "" },
  rationType: { type: String, enum: ["APL", "BPL"], default: "BPL" },
  housingScheme: { type: String, default: "PMAY (Gramin)" },
  schemeStatus: { type: String, default: "Sanctioned & Completed" },
  membersCount: { type: Number, default: 4 },
  electricityConnection: { type: String, default: "Yes (Bescom)" },
  tapWater: { type: String, default: "Yes (Jal Jeevan)" }
}, { timestamps: true, strict: false });

// 4. Transaction Model
const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ["Credit", "Debit"], required: true },
  amount: { type: Number, required: true },
  purpose: { type: String, required: true },
  purposeKn: { type: String, default: "" },
  paidTo: { type: String, default: "" },
  approvalAuthority: { type: String, default: "Panchayat Development Officer (PDO)" },
  voucherNumber: { type: String, default: "" },
  status: { type: String, default: "Audited & Approved" },
  receiptUrl: { type: String, default: "" }
}, { timestamps: true, strict: false });

// 5. Funds Model
const fundSchema = new mongoose.Schema({
  financialYear: { type: String, default: "2024-2025" },
  totalFundsReceived: { type: Number, default: 4850000 },
  governmentGrants: { type: mongoose.Schema.Types.Mixed, default: {} },
  developmentFunds: { type: Number, default: 4850000 },
  sfcGrants: { type: Number, default: 800000 },
  roadDevelopmentExpenses: { type: Number, default: 1420000 },
  roadExpenses: { type: Number, default: 1420000 },
  waterSupplyExpenses: { type: Number, default: 1180000 },
  sanitationExpenses: { type: Number, default: 450000 },
  streetLightingExpenses: { type: Number, default: 310000 },
  healthcareExpenses: { type: Number, default: 120000 },
  officeAdministration: { type: Number, default: 350000 },
  otherExpenses: { type: Number, default: 170000 },
  totalExpenses: { type: Number, default: 3650000 },
  remainingBalance: { type: Number, default: 1200000 }
}, { timestamps: true, strict: false });

// 6. Election Statistics Model
const electionSchema = new mongoose.Schema({
  electionId: { type: String, default: "GP-ELEC-2024" },
  electionName: { type: String, default: "Karnataka Gram Panchayat General Elections 2024-25" },
  electionDate: { type: String, default: "2024-12-18" },
  officialGazetteNumber: { type: String, default: "" },
  returningOfficer: { type: String, default: "" },
  officialDeclarationDate: { type: String, default: "2024-12-21" },
  declaredDate: { type: String, default: "2024-12-21" },
  totalRegisteredVoters: { type: Number, default: 17980 },
  totalVotesCast: { type: Number, default: 15300 },
  votingPercentage: { type: Number, default: 85.09 },
  privacyCompliance: { type: String, default: "" },
  electionType: { type: String, default: "Karnataka Gram Panchayat General Elections" },
  declaredResults: { type: mongoose.Schema.Types.Mixed, default: [] },
  wardWiseTurnout: { type: mongoose.Schema.Types.Mixed, default: [] }
}, { timestamps: true, strict: false });

// 7. Document Model
const documentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  fileNumber: { type: String, required: true },
  issueDate: { type: String, required: true },
  issuingAuthority: { type: String, default: "Panchayat Development Officer (PDO)" },
  fileSize: { type: String, default: "1.2 MB" },
  fileType: { type: String, default: "PDF" },
  status: { type: String, default: "Approved" },
  uploadedBy: { type: String, default: "Authorized Officer" }
}, { timestamps: true });

// 8. Audit Log Model
const auditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  timestamp: { type: String, required: true },
  user: { type: String, required: true },
  role: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String, required: true }
}, { timestamps: true });

// 9. Admin / Officer Model
const adminSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  designation: { type: String, required: true },
  status: { type: String, default: "Active" },
  lastLogin: { type: String, default: "" },
  phone: { type: String, default: "" }
}, { timestamps: true });

export const Village = mongoose.model("Village", villageSchema);
export const Member = mongoose.model("Member", memberSchema);
export const Family = mongoose.model("Family", familySchema);
export const Transaction = mongoose.model("Transaction", transactionSchema);
export const Fund = mongoose.model("Fund", fundSchema);
export const Election = mongoose.model("Election", electionSchema);
export const Document = mongoose.model("Document", documentSchema);
export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export const Admin = mongoose.model("Admin", adminSchema);
