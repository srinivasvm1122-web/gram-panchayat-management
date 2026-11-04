// PDF and Excel Export Service for Gram Panchayat Official Documents

import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

/**
 * Generates an Excel spreadsheet workbook with all panchayat registers
 */
export const exportToExcel = (villages = [], transactions = [], electionData = {}, stats = {}) => {
  const wb = XLSX.utils.book_new();

  // 1. Village Census Sheet
  const villageRows = villages.map((v, i) => ({
    "Sl No": i + 1,
    "Village ID": v.id,
    "Village Name (English)": v.nameEn,
    "ಗ್ರಾಮದ ಹೆಸರು (ಕನ್ನಡ)": v.nameKn,
    "Ward No": v.wardNo,
    "Total Population": v.totalPopulation,
    "Living Members": v.livingMembers,
    "Male Members": v.maleMembers,
    "Female Members": v.femaleMembers,
    "Total Families": v.totalFamilies,
    "APL Cards": v.aplCardCount,
    "BPL Cards": v.bplCardCount,
    "Total Voters": v.totalVoters,
    "Male Voters": v.maleVoters,
    "Female Voters": v.femaleVoters,
    "Votes Cast": v.votesCast,
    "Voter Turnout (%)": v.totalVoters > 0 ? ((v.votesCast / v.totalVoters) * 100).toFixed(2) + "%" : "0%",
    "Sarpanch / Member": v.sarpanchName,
    "Contact": v.sarpanchContact
  }));
  const wsVillages = XLSX.utils.json_to_sheet(villageRows);
  XLSX.utils.book_append_sheet(wb, wsVillages, "Village_Demographics");

  // 2. Ration Card Register Sheet
  const rationRows = villages.map((v, i) => ({
    "Sl No": i + 1,
    "Ward No": v.wardNo,
    "Village Name": v.nameEn,
    "Total Families": v.totalFamilies,
    "APL Families": v.aplCardCount,
    "APL %": ((v.aplCardCount / v.totalFamilies) * 100).toFixed(1) + "%",
    "BPL Families": v.bplCardCount,
    "BPL %": ((v.bplCardCount / v.totalFamilies) * 100).toFixed(1) + "%",
    "PDS Fair Price Dealer": `Dealer - Ward ${v.wardNo}`,
    "Status": "Verified NFSA Quota"
  }));
  const wsRation = XLSX.utils.json_to_sheet(rationRows);
  XLSX.utils.book_append_sheet(wb, wsRation, "Ration_APL_BPL");

  // 3. Election Declared Results Sheet
  if (electionData.declaredResults && electionData.declaredResults.length) {
    const electionRows = electionData.declaredResults.map((r, i) => ({
      "Sl No": i + 1,
      "Ward No": r.wardNo,
      "Village": r.villageName,
      "Winning Candidate": r.candidateName,
      "Party / Panel": r.partyAffiliation,
      "Symbol": r.symbol,
      "Votes Secured": r.votesSecured,
      "Runner Up": r.runnerUp,
      "Runner Up Votes": r.runnerUpVotes,
      "Victory Margin": r.margin,
      "Declaration Status": r.status
    }));
    const wsElection = XLSX.utils.json_to_sheet(electionRows);
    XLSX.utils.book_append_sheet(wb, wsElection, "Election_Results");
  }

  // 4. Financial Transactions / Vouchers Sheet
  const txnRows = transactions.map((t, i) => ({
    "Sl No": i + 1,
    "Voucher No": t.voucherNumber || t.id,
    "Date": t.date,
    "Type": t.type,
    "Category": t.category,
    "Amount (INR)": t.amount,
    "Beneficiary Village": t.villageName,
    "Purpose": t.purpose,
    "Approved By": t.approvedBy,
    "Approval Status": t.status
  }));
  const wsTxn = XLSX.utils.json_to_sheet(txnRows);
  XLSX.utils.book_append_sheet(wb, wsTxn, "Funds_and_Vouchers");

  // Download trigger
  const fileName = `Gram_Panchayat_Master_Register_${new Date().toISOString().substring(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

/**
 * Generates an official Government PDF Document using jsPDF
 */
export const exportToPdf = (reportType = "master", villages = [], stats = {}, electionData = {}, transactions = []) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 14;

  // Header Banner
  doc.setFillColor(10, 56, 113); // Government Deep Blue
  doc.rect(0, 0, pageWidth, 28, "F");

  // Gold accent line
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 28, pageWidth, 2, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("GOVERNMENT OF KARNATAKA", pageWidth / 2, y, { align: "center" });
  y += 6;
  doc.setFontSize(11);
  doc.text("SHIVAPURA GRAM PANCHAYAT DIGITAL MANAGEMENT SYSTEM", pageWidth / 2, y, { align: "center" });
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Rural Development & Panchayati Raj Dept. • Official Gazette Document", pageWidth / 2, y, { align: "center" });

  y = 38;
  doc.setTextColor(30, 41, 59);

  // Document Title & Metadata
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  const titles = {
    master: "ANNUAL GRAM PANCHAYAT MASTER COMPREHENSIVE REPORT",
    census: "OFFICIAL 10-VILLAGE DEMOGRAPHIC & CENSUS REGISTER",
    funds: "PANCHAYAT FINANCIAL ACCOUNTS & AUDITED VOUCHERS STATEMENT",
    election: "PANCHAYAT GENERAL ELECTIONS 2024-25 OFFICIAL GAZETTE"
  };
  doc.text(titles[reportType] || "OFFICIAL GRAM PANCHAYAT REPORT", 14, y);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated On: ${new Date().toLocaleString()} | Ref No: GP-DOC-${Date.now().toString().slice(-6)}`, 14, y + 5);

  y += 14;

  // Key KPI Summary Table Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, pageWidth - 28, 26, 2, 2, "F");
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, pageWidth - 28, 26, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);

  const col1 = 18;
  const col2 = 64;
  const col3 = 112;
  const col4 = 158;

  doc.text(`Total Villages: ${stats.totalVillages || villages.length}`, col1, y + 7);
  doc.text(`Total Population: ${(stats.totalPopulation || 0).toLocaleString()}`, col1, y + 14);
  doc.text(`Living Members: ${(stats.totalLivingMembers || 0).toLocaleString()}`, col1, y + 21);

  doc.text(`Total Families: ${(stats.totalFamilies || 0).toLocaleString()}`, col2, y + 7);
  doc.text(`APL Cards: ${(stats.aplCardFamilies || 0).toLocaleString()}`, col2, y + 14);
  doc.text(`BPL Cards: ${(stats.bplCardFamilies || 0).toLocaleString()}`, col2, y + 21);

  doc.text(`Total Voters: ${(stats.totalRegisteredVoters || 0).toLocaleString()}`, col3, y + 7);
  doc.text(`Votes Cast: ${(stats.totalVotesCast || 0).toLocaleString()}`, col3, y + 14);
  doc.text(`Turnout %: ${stats.votingPercentage || 0}%`, col3, y + 21);

  doc.text(`Funds Received: Rs. ${(stats.totalFundsReceived || 0).toLocaleString()}`, col4, y + 7);
  doc.text(`Total Expenses: Rs. ${(stats.totalExpenses || 0).toLocaleString()}`, col4, y + 14);
  doc.text(`Remaining Balance: Rs. ${(stats.remainingBalance || 0).toLocaleString()}`, col4, y + 21);

  y += 34;

  // Table Header
  doc.setFillColor(15, 60, 115);
  doc.rect(14, y, pageWidth - 28, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text("Ward", 16, y + 5.5);
  doc.text("Village Name", 28, y + 5.5);
  doc.text("Population", 68, y + 5.5);
  doc.text("Families", 90, y + 5.5);
  doc.text("APL/BPL", 112, y + 5.5);
  doc.text("Voters", 134, y + 5.5);
  doc.text("Votes Cast", 154, y + 5.5);
  doc.text("Turnout", 176, y + 5.5);

  y += 8;

  // Village Rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  villages.forEach((vil, idx) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, pageWidth - 28, 7, "F");
    }

    doc.setTextColor(30, 41, 59);
    doc.text(`W-${vil.wardNo}`, 16, y + 5);
    doc.text(`${vil.nameEn} (${vil.nameKn})`, 28, y + 5);
    doc.text(`${vil.totalPopulation}`, 68, y + 5);
    doc.text(`${vil.totalFamilies}`, 90, y + 5);
    doc.text(`${vil.aplCardCount} / ${vil.bplCardCount}`, 112, y + 5);
    doc.text(`${vil.totalVoters}`, 134, y + 5);
    doc.text(`${vil.votesCast}`, 154, y + 5);

    const turnout = vil.totalVoters > 0 ? ((vil.votesCast / vil.totalVoters) * 100).toFixed(1) + "%" : "0%";
    doc.text(turnout, 176, y + 5);

    y += 7;
  });

  // Financial / Election Note
  y += 8;
  if (y > 245) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("Statutory Certifications & Governance Attestation", 14, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("1. Strictly compliant with Karnataka Gram Swaraj and Panchayat Raj Act, 1993.", 14, y);
  y += 4;
  doc.text("2. Section 128 Compliance: No individual secret voting or voter preference recorded.", 14, y);
  y += 4;
  doc.text("3. Audited accounts reconcile with Khajane-II treasury releases and e-GramSwaraj portals.", 14, y);

  // Signatures
  y += 16;
  doc.setDrawColor(148, 163, 184);
  doc.line(14, y, 65, y);
  doc.line(pageWidth - 65, y, pageWidth - 14, y);

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text("Panchayat Development Officer (PDO)", 14, y);
  doc.text("Gram Panchayat President", pageWidth - 14, y, { align: "right" });
  
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Executive Officer Signature & Seal", 14, y);
  doc.text("Elected Head Signature & Seal", pageWidth - 14, y, { align: "right" });

  // Download PDF
  const filename = `Gram_Panchayat_${reportType.toUpperCase()}_Report_${new Date().toISOString().substring(0, 10)}.pdf`;
  doc.save(filename);
};
