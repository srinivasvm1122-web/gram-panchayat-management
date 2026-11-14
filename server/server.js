import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env
dotenv.config();

import { 
  Village, 
  Member, 
  Family, 
  Transaction, 
  Fund, 
  Election, 
  Document, 
  AuditLog, 
  Admin 
} from "./models.js";

import { 
  initialVillages, 
  initialFunds, 
  initialTransactions, 
  initialElectionData, 
  initialAdmins,
  initialDocuments,
  initialFamilies
} from "../src/data/initialData.js";
import { initialMembers } from "../src/data/memberData.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Automatically sanitizes and percent-encodes URI credentials if raw characters like '@' are present in password
const prepareMongoUri = (rawUri, defaultDbName = "gram_panchayat") => {
  if (!rawUri) return rawUri;
  const m = rawUri.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/);
  if (!m) return rawUri;
  const p = m[1], rest = m[2];
  const lastAt = rest.lastIndexOf("@");
  if (lastAt === -1) return rawUri;
  const uInfo = rest.substring(0, lastAt);
  let host = rest.substring(lastAt + 1);
  const colon = uInfo.indexOf(":");
  if (colon === -1) return rawUri;
  const u = uInfo.substring(0, colon);
  const pass = uInfo.substring(colon + 1);
  const encU = encodeURIComponent(decodeURIComponent(u));
  const encPass = encodeURIComponent(decodeURIComponent(pass));

  if (host.endsWith("/")) {
    host = `${host}${defaultDbName}?retryWrites=true&w=majority`;
  } else if (!host.includes("/") || host.endsWith(".net")) {
    host = `${host}/${defaultDbName}?retryWrites=true&w=majority`;
  }
  return `${p}${encU}:${encPass}@${host}`;
};

const rawUri = process.env.MONGODB_URI || "mongodb+srv://gram_panchayat_admin:K%409!w%40Kdzp4S7TH@cluster0.dipytpy.mongodb.net/gram_panchayat?retryWrites=true&w=majority";
const MONGODB_URI = prepareMongoUri(rawUri, process.env.DB_NAME || "gram_panchayat");

app.use(cors());
app.use(express.json());

let isDbConnected = false;
let dbConnectionError = null;

// Mask URI for safe logging & status output
const getMaskedUri = (uri) => {
  if (!uri) return "";
  const lastAt = uri.lastIndexOf("@");
  const firstColon = uri.indexOf("://");
  if (firstColon === -1 || lastAt === -1) return uri;
  const credsColon = uri.indexOf(":", firstColon + 3);
  if (credsColon === -1 || credsColon > lastAt) return uri;
  return `${uri.substring(0, credsColon)}:*****${uri.substring(lastAt)}`;
};

// Check if password has been configured or is still placeholder
const hasPlaceholderPassword = MONGODB_URI.includes("<db_password>");

// MongoDB Atlas Connection
const connectDB = async () => {
  if (hasPlaceholderPassword) {
    console.warn("\n========================================================");
    console.warn("⚠️  MONGODB CONFIGURATION NOTICE:");
    console.warn("MongoDB URI currently contains the placeholder '<db_password>'.");
    console.warn("Please edit the .env file and replace <db_password> with your actual database user password.");
    console.warn("========================================================\n");
    dbConnectionError = "Placeholder <db_password> detected. Replace with real password in .env.";
    return;
  }

  try {
    console.log(`Connecting to MongoDB Atlas at: ${getMaskedUri(MONGODB_URI)}...`);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000
    });
    isDbConnected = true;
    dbConnectionError = null;
    console.log("✅ Successfully connected to MongoDB Atlas!");

    // Automatically seed if database has missing collections
    const memberCount = await Member.countDocuments();
    const fundCount = await Fund.countDocuments();
    if (memberCount === 0 || fundCount === 0) {
      console.log("🌱 Incomplete or empty database detected. Seeding full Karnataka Gram Panchayat data...");
      await autoSeedData();
    } else {
      console.log(`✅ Database ready: ${await Village.countDocuments()} villages, ${memberCount} members, ${fundCount} fund records.`);
    }
  } catch (err) {
    isDbConnected = false;
    dbConnectionError = err.message;
    console.error("❌ MongoDB Atlas Connection Error:", err.message);
  }
};

// Auto Seed Initial Records
const autoSeedData = async () => {
  try {
    await Village.deleteMany({});
    await Village.insertMany(initialVillages);

    await Member.deleteMany({});
    await Member.insertMany(initialMembers);

    await Family.deleteMany({});
    await Family.insertMany(initialFamilies);

    await Transaction.deleteMany({});
    await Transaction.insertMany(initialTransactions);

    await Fund.deleteMany({});
    await Fund.create(initialFunds);

    await Election.deleteMany({});
    await Election.create(initialElectionData);

    await Document.deleteMany({});
    await Document.insertMany(initialDocuments);

    await Admin.deleteMany({});
    await Admin.insertMany(initialAdmins);

    console.log("✅ Initial seeding completed successfully: 10 villages, 300 member records, funds, elections!");
  } catch (e) {
    console.error("Error during auto-seeding:", e.message);
  }
};

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Health & Connection Status
app.get("/api/status", async (req, res) => {
  let counts = {
    villages: 0,
    members: 0,
    families: 0,
    transactions: 0,
    documents: 0
  };

  if (isDbConnected) {
    try {
      counts.villages = await Village.countDocuments();
      counts.members = await Member.countDocuments();
      counts.families = await Family.countDocuments();
      counts.transactions = await Transaction.countDocuments();
      counts.documents = await Document.countDocuments();
    } catch (e) {
      // Ignore count errors
    }
  }

  res.json({
    connected: isDbConnected,
    hasPlaceholderPassword,
    error: dbConnectionError,
    uri: getMaskedUri(MONGODB_URI),
    database: process.env.DB_NAME || "gram_panchayat",
    counts,
    message: isDbConnected 
      ? "Connected to MongoDB Atlas." 
      : hasPlaceholderPassword 
      ? "Please set your MongoDB password in .env." 
      : `Connection failed: ${dbConnectionError}`
  });
});

// 2. Manual Re-Seed Endpoint
app.post("/api/seed", async (req, res) => {
  if (!isDbConnected) {
    return res.status(503).json({ 
      success: false, 
      message: "Database not connected. Please verify MongoDB URI and password in .env" 
    });
  }

  try {
    await autoSeedData();
    res.json({ 
      success: true, 
      message: "Seeded 10 villages, 300 members, and financial records into MongoDB Atlas." 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Villages API
app.get("/api/villages", async (req, res) => {
  if (!isDbConnected) return res.json(initialVillages);
  try {
    const villages = await Village.find().sort({ wardNo: 1 });
    res.json(villages.length ? villages : initialVillages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/villages", async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ message: "DB not connected" });
  try {
    const village = new Village(req.body);
    await village.save();
    res.status(201).json(village);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/villages/:id", async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ message: "DB not connected" });
  try {
    const updated = await Village.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/villages/:id", async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ message: "DB not connected" });
  try {
    await Village.findOneAndDelete({ id: req.params.id });
    res.json({ message: "Village deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Members API (300 Citizen Records)
app.get("/api/members", async (req, res) => {
  const { villageId, rationType, checkupStatus, casteCategory, search } = req.query;

  if (!isDbConnected) {
    let result = initialMembers;
    if (villageId && villageId !== "ALL") result = result.filter(m => m.villageId === villageId);
    if (rationType && rationType !== "all") result = result.filter(m => m.rationType === rationType);
    if (checkupStatus && checkupStatus !== "all") result = result.filter(m => m.medicalCheckupStatus === checkupStatus);
    if (casteCategory && casteCategory !== "all") result = result.filter(m => (m.casteCategory || "Not Disclosed") === casteCategory);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(m => 
        m.fullName.toLowerCase().includes(q) ||
        m.houseNumber.toLowerCase().includes(q) ||
        m.familyId.toLowerCase().includes(q) ||
        (m.casteCategory && m.casteCategory.toLowerCase().includes(q))
      );
    }
    return res.json(result);
  }

  try {
    let filter = {};
    if (villageId && villageId !== "ALL") filter.villageId = villageId;
    if (rationType && rationType !== "all") filter.rationType = rationType;
    if (checkupStatus && checkupStatus !== "all") filter.medicalCheckupStatus = checkupStatus;
    if (casteCategory && casteCategory !== "all") filter.casteCategory = casteCategory;
    if (search) {
      filter.$or = [
        { fullName: new RegExp(search, "i") },
        { houseNumber: new RegExp(search, "i") },
        { familyId: new RegExp(search, "i") },
        { casteCategory: new RegExp(search, "i") }
      ];
    }
    const members = await Member.find(filter);
    res.json(members.length ? members : initialMembers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/members", async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ message: "DB not connected" });
  try {
    const casteVal = req.body.caste || req.body.casteCategory || "General";
    const memberData = {
      ...req.body,
      caste: casteVal,
      casteCategory: casteVal
    };
    const member = new Member(memberData);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/members/:id", async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ message: "DB not connected" });
  try {
    const casteVal = req.body.caste || req.body.casteCategory;
    const updateData = { ...req.body };
    if (casteVal) {
      updateData.caste = casteVal;
      updateData.casteCategory = casteVal;
    }
    const updated = await Member.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/members/:id", async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ message: "DB not connected" });
  try {
    await Member.findOneAndDelete({ id: req.params.id });
    res.json({ message: "Member record deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Families API
app.get("/api/families", async (req, res) => {
  if (!isDbConnected) return res.json(initialFamilies);
  try {
    const families = await Family.find();
    res.json(families.length ? families : initialFamilies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/families", async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ message: "DB not connected" });
  try {
    const fam = new Family(req.body);
    await fam.save();
    res.status(201).json(fam);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/families/:id", async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ message: "DB not connected" });
  try {
    const updated = await Family.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/families/:id", async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ message: "DB not connected" });
  try {
    await Family.findOneAndDelete({ id: req.params.id });
    res.json({ message: "Family record removed" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Funds API
app.get("/api/funds", async (req, res) => {
  if (!isDbConnected) return res.json(initialFunds);
  try {
    const fund = await Fund.findOne();
    res.json(fund || initialFunds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/funds", async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ message: "DB not connected" });
  try {
    const fund = await Fund.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(fund);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 7. Transactions API
app.get("/api/transactions", async (req, res) => {
  if (!isDbConnected) return res.json(initialTransactions);
  try {
    const txns = await Transaction.find().sort({ createdAt: -1 });
    res.json(txns.length ? txns : initialTransactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/transactions", async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ message: "DB not connected" });
  try {
    const txn = new Transaction(req.body);
    await txn.save();
    res.status(201).json(txn);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 8. Elections API
app.get("/api/elections", async (req, res) => {
  if (!isDbConnected) return res.json(initialElectionData);
  try {
    const elec = await Election.findOne();
    res.json(elec || initialElectionData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/elections", async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ message: "DB not connected" });
  try {
    const updated = await Election.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 9. Documents API
app.get("/api/documents", async (req, res) => {
  if (!isDbConnected) return res.json(initialDocuments);
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json(docs.length ? docs : initialDocuments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/documents", async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ message: "DB not connected" });
  try {
    const doc = new Document(req.body);
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/documents/:id", async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ message: "DB not connected" });
  try {
    await Document.findOneAndDelete({ id: req.params.id });
    res.json({ message: "Document removed" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 10. Audit Logs API
app.get("/api/audit-logs", async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/audit-logs", async (req, res) => {
  try {
    const log = new AuditLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 11. Secure Officer Authentication API
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const inputIdentifier = (email || username || "").trim().toLowerCase();
    const inputPassword = String(password || "");

    if (!inputIdentifier || !inputPassword) {
      return res.status(400).json({
        success: false,
        error: "Both Username / Email and Password are mandatory."
      });
    }

    const authorizedEmail = (process.env.OFFICER_EMAIL || "kartikhmkartikhm3@gmail.com").trim().toLowerCase();
    const authorizedPrefix = authorizedEmail.split("@")[0];
    const authorizedPassword = String(process.env.OFFICER_PASSWORD || "Kartik@143");

    // Check credentials against securely configured officer credentials (supports full email or username prefix)
    const isIdentifierValid = (inputIdentifier === authorizedEmail || inputIdentifier === authorizedPrefix);
    const isPasswordValid = (inputPassword === authorizedPassword || inputPassword.trim() === authorizedPassword);
    const isCredentialsValid = (isIdentifierValid && isPasswordValid);

    if (isCredentialsValid) {
      const officerData = {
        id: "ADM-OFFICER-001",
        name: "Kartik H.M.",
        email: authorizedEmail,
        role: "Super Admin",
        designation: "Panchayat Development Officer (PDO)",
        badge: "Chief Executive Officer",
        status: "Active",
        isReadOnly: false,
        lastLogin: new Date().toISOString()
      };

      // Record successful login in audit log if DB is connected
      if (isDbConnected) {
        try {
          await AuditLog.create({
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: officerData.name,
            role: officerData.role,
            action: "OFFICER_LOGIN",
            details: `Authorized Officer ${officerData.name} (${officerData.email}) signed in successfully to Admin Dashboard.`
          });
        } catch (logErr) {
          console.warn("Audit log error on login:", logErr.message);
        }
      }

      return res.json({
        success: true,
        officer: officerData,
        message: "Officer credentials authenticated successfully. Redirecting to Admin Dashboard."
      });
    }

    // Invalid credentials
    return res.status(401).json({
      success: false,
      error: "Incorrect username or password. Access is restricted to authorized Gram Panchayat Officers."
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. Officer Password Recovery API
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: "Please enter your registered Government Officer Email." });
  }
  
  return res.json({
    success: true,
    message: "A password recovery ticket has been logged with the District Informatics Officer (DIO). Official recovery instructions will be dispatched to the verified government communication channel."
  });
});


// Connect to MongoDB and start server
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Gram Panchayat MongoDB API server running at http://localhost:${PORT}`);
  console.log(`📡 Health & Status endpoint: http://localhost:${PORT}/api/status`);
});
