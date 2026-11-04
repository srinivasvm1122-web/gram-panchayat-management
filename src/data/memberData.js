// Fictional realistic sample records for 10 Karnataka Gram Panchayat villages
// Exactly 30 members per village (Total 300 records)
// Fields: id, fullName, guardianName, villageId, villageName, houseNumber, familyId, gender, age, rationType, phone, medicalCheckupStatus, lastCheckupMonth, remarks

const VILLAGES_CONFIG = [
  { id: "VIL-001", code: "SHIV", name: "Shivapura", knName: "ಶಿವಪುರ", ward: 1 },
  { id: "VIL-002", code: "DODD", name: "Doddakallahalli", knName: "ದೊಡ್ಡಕಲ್ಲಹಳ್ಳಿ", ward: 2 },
  { id: "VIL-003", code: "MALL", name: "Malleshwara", knName: "ಮಲ್ಲೇಶ್ವರ", ward: 3 },
  { id: "VIL-004", code: "RAMA", name: "Ramanagara", knName: "ರಾಮನಗರ", ward: 4 },
  { id: "VIL-005", code: "GAND", name: "Gandhinagar", knName: "ಗಾಂಧಿನಗರ", ward: 5 },
  { id: "VIL-006", code: "KRIS", name: "Krishnarajapura", knName: "ಕೃಷ್ಣರಾಜಪುರ", ward: 6 },
  { id: "VIL-007", code: "NELA", name: "Nelamangala", knName: "ನೆಲಮಂಗಲ", ward: 7 },
  { id: "VIL-008", code: "DEVA", name: "Devanahalli", knName: "ದೇವನಹಳ್ಳಿ", ward: 8 },
  { id: "VIL-009", code: "SOME", name: "Someshwara", knName: "ಸೋಮೇಶ್ವರ", ward: 9 },
  { id: "VIL-010", code: "KEMP", name: "Kempegowda Nagar", knName: "ಕೆಂಪೇಗೌಡ ನಗರ", ward: 10 }
];

// Karnataka first & last names pool for realistic fictional data
const FIRST_NAMES = [
  "Ramesh", "Manjunath", "Suresh", "Laxmi", "Shobha", 
  "Basavaraju", "Giridhar", "Anitha", "Manjula", "Siddaramaiah", 
  "Sunitha", "Narayana", "Venkatesh", "Channappa", "Kemparaju",
  "Radha", "Parvathamma", "Mallesh", "Kumar", "Renuka",
  "Shivakumar", "Kavitha", "Gowramma", "Eshwarappa", "Prashanth",
  "Nagaraju", "Padmavathi", "Hanumanthappa", "Gangadhar", "Sharada"
];

const LAST_NAMES = [
  "Gowda", "Patil", "Reddy", "Shetty", "Nayaka", 
  "Kulkarni", "Hegde", "Bhat", "Acharya", "Kumari"
];

const GUARDIAN_PREFIXES = ["Late ", "K. ", "M. ", "B. ", "S. ", "N. "];

// Statutory Caste Categories
export const CASTE_CATEGORIES = [
  "General",
  "OBC",
  "SC",
  "ST",
  "Other",
  "Not Disclosed"
];

// Generate 30 distinct records for a given village
const generateVillageMembers = (village) => {
  const members = [];
  for (let i = 1; i <= 30; i++) {
    const firstName = FIRST_NAMES[i - 1];
    const lastName = LAST_NAMES[(i * 3 + village.ward) % LAST_NAMES.length];
    const isFemale = ["Laxmi", "Shobha", "Anitha", "Manjula", "Sunitha", "Radha", "Parvathamma", "Renuka", "Kavitha", "Gowramma", "Padmavathi", "Sharada"].includes(firstName);
    
    const guardianFirst = FIRST_NAMES[(i + 7) % FIRST_NAMES.length];
    const guardianPrefix = GUARDIAN_PREFIXES[i % GUARDIAN_PREFIXES.length];
    
    // Auto-generated ID, e.g. MEM-SHIV-001
    const memberId = `MEM-${village.code}-${String(i).padStart(3, "0")}`;
    const familyId = `FAM-${String(village.ward).padStart(2, "0")}-${String(Math.floor((i - 1) / 3) + 1).padStart(3, "0")}`;
    const houseNo = `H-${village.ward}/${Math.floor((i - 1) / 2) + 1}${i % 2 === 0 ? "B" : "A"}`;
    
    // Ration card distribution: approx 65% BPL, 35% APL
    const rationType = (i % 3 === 0) ? "APL" : "BPL";
    
    // Medical checkup: ~70% Completed, ~20% Not Completed, ~10% Not Applicable
    let checkupStatus = "Completed";
    if (i % 5 === 0) checkupStatus = "Not Completed";
    if (i % 9 === 0) checkupStatus = "Not Applicable";
    
    const checkupMonths = ["October 2024", "November 2024", "September 2024"];
    const lastMonth = checkupStatus === "Completed" ? checkupMonths[i % 2] : (checkupStatus === "Not Completed" ? "August 2024" : "N/A");

    const phoneNum = `+91 98450 ${String(10000 + (village.ward * 100) + i).slice(-5)}`;
    const age = 20 + ((i * 7 + village.ward * 3) % 55);

    const remarksList = [
      "Routine blood pressure and glucose test completed at PHC.",
      "General health checkup camp conducted by Taluk Hospital.",
      "Maternal and child health tracking verified by Anganwadi worker.",
      "Senior citizen routine mobility and eye screening attended.",
      "Annual preventive health checkup completed successfully.",
      "Follow-up visit scheduled next month at Primary Health Center."
    ];

    // Caste category distribution across the 30 village members
    // 1. General, 2. OBC, 3. SC, 4. ST, 5. Other, 6. Not Disclosed
    const castePattern = [
      "OBC", "General", "SC", "OBC", "ST", "General",
      "OBC", "SC", "Not Disclosed", "OBC", "General", "ST",
      "SC", "OBC", "General", "Other", "OBC", "SC",
      "General", "Not Disclosed", "ST", "OBC", "General", "SC",
      "OBC", "Other", "ST", "General", "SC", "Not Disclosed"
    ];
    const memberCaste = castePattern[(i - 1 + village.ward) % castePattern.length];

    members.push({
      id: memberId,
      fullName: `${firstName} ${lastName}`,
      guardianName: `${guardianPrefix}${guardianFirst} ${lastName}`,
      villageId: village.id,
      villageName: village.name,
      villageKnName: village.knName,
      wardNo: village.ward,
      houseNumber: houseNo,
      familyId: familyId,
      gender: isFemale ? "Female" : "Male",
      age: age,
      rationType: rationType,
      caste: memberCaste,
      casteCategory: memberCaste,
      phone: phoneNum,
      medicalCheckupStatus: checkupStatus,
      lastCheckupMonth: lastMonth,
      remarks: checkupStatus === "Completed" ? remarksList[i % remarksList.length] : (checkupStatus === "Not Completed" ? "Checkup pending due to outstation work." : "Exempt from routine screening.")
    });
  }
  return members;
};

// Generate 300 fictional members (30 per village)
export const initialMembers = VILLAGES_CONFIG.flatMap(v => generateVillageMembers(v));

export { VILLAGES_CONFIG };
