// AI Gram Panchayat Village Information Assistant Service
// Multilingual, Database-Connected, Privacy-Preserving

export const KNOWN_VILLAGE_ALIASES = [
  {
    id: "VIL-001",
    wardNo: 1,
    nameEn: "Shivapura",
    nameKn: "ಶಿವಪುರ",
    aliases: ["shivapura", "shivapur", "sivapura", "shiva pura", "ward 1", "ward1", "1", "ಶಿವಪುರ", "शिवपुरा", "शिवपूर", "சிவபுரா", "శివపుర"]
  },
  {
    id: "VIL-002",
    wardNo: 2,
    nameEn: "Doddakallahalli",
    nameKn: "ದೊಡ್ಡಕಲ್ಲಹಳ್ಳಿ",
    aliases: ["doddakallahalli", "doddakallhalli", "doddakalla halli", "kallahalli", "ward 2", "ward2", "2", "ದೊಡ್ಡಕಲ್ಲಹಳ್ಳಿ", "डोड्डकल्लहल्ली", "दोड्डकल्लहल्ली", "தொட்டகல்லஹள்ளி", "దొడ్డకల్లహల్లి"]
  },
  {
    id: "VIL-003",
    wardNo: 3,
    nameEn: "Malleshwara",
    nameKn: "ಮಲ್ಲೇಶ್ವರ",
    aliases: ["malleshwara", "malleswaram", "malleswara", "malleswar", "ward 3", "ward3", "3", "ಮಲ್ಲೇಶ್ವರ", "मल्लेश्वरा", "मल्लेश्वर", "மல்லேஸ்வரம்", "మల్లేశ్వరం"]
  },
  {
    id: "VIL-004",
    wardNo: 4,
    nameEn: "Ramanagara",
    nameKn: "ರಾಮನಗರ",
    aliases: ["ramanagara", "ramanagar", "ram nagar", "ramnagara", "ward 4", "ward4", "4", "ರಾಮನಗರ", "रामनगर", "ராமநகரா", "రామనగర"]
  },
  {
    id: "VIL-005",
    wardNo: 5,
    nameEn: "Gandhinagar",
    nameKn: "ಗಾಂಧಿನಗರ",
    aliases: ["gandhinagar", "gandhi nagar", "ward 5", "ward5", "5", "ಗಾಂಧಿನಗರ", "गांधीनगर", "காந்திநகர்", "గాంధీనగర్"]
  },
  {
    id: "VIL-006",
    wardNo: 6,
    nameEn: "Krishnarajapura",
    nameKn: "ಕೃಷ್ಣರಾಜಪುರ",
    aliases: ["krishnarajapura", "krishnarajapur", "kr puram", "krishnarajapuram", "ward 6", "ward6", "6", "ಕೃಷ್ಣರಾಜಪುರ", "कृष्णराजपुरा", "कृष्णराजपूर", "கிருஷ்ணராஜபுரம்", "కృష్ణరాజపురం"]
  },
  {
    id: "VIL-007",
    wardNo: 7,
    nameEn: "Nelamangala",
    nameKn: "ನೆಲಮಂಗಲ",
    aliases: ["nelamangala", "nelamangal", "ward 7", "ward7", "7", "ನೆಲಮಂಗಲ", "नेलमंगला", "நெலமங்கலா", "నెలమంగళ"]
  },
  {
    id: "VIL-008",
    wardNo: 8,
    nameEn: "Devanahalli",
    nameKn: "ದೇವನಹಳ್ಳಿ",
    aliases: ["devanahalli", "devanhalli", "devanahalli town", "ward 8", "ward8", "8", "ದೇವನಹಳ್ಳಿ", "देवनहल्ली", "தேவநஹள்ளி", "దేవనహల్లి"]
  },
  {
    id: "VIL-009",
    wardNo: 9,
    nameEn: "Someshwara",
    nameKn: "ಸೋಮೇಶ್ವರ",
    aliases: ["someshwara", "someswara", "someshwar", "ward 9", "ward9", "9", "ಸೋಮೇಶ್ವರ", "सोमेश्वर", "சோமேஸ்வரா", "సోమేశ్వరం"]
  },
  {
    id: "VIL-010",
    wardNo: 10,
    nameEn: "Kempegowda Nagar",
    nameKn: "ಕೆಂಪೇಗೌಡ ನಗರ",
    aliases: ["kempegowda nagar", "kempegowda", "kempegowdanagar", "kg nagar", "ward 10", "ward10", "10", "ಕೆಂಪೇಗೌಡ ನಗರ", "केम्पेगौड़ा नगर", "केंपेगौडा नगर", "கெம்பேகவுடா நகர்", "కెంపేగౌడ నగర్"]
  }
];

// Sensitive Privacy Restricted Keywords
const PRIVACY_RESTRICTED_KEYWORDS = [
  "caste", "jaati", "jati", "ಜಾತಿ", "ಪ್ರವರ್ಗ", "जाति", "साधी", "சாதி", "కుల", "కులం",
  "phone", "mobile", "contact number", "call", "ಮೊಬೈಲ್", "ದೂರವಾಣಿ", "ಫೋನ್", "फोन", "मोबाइल", "தொலைபேசி", "போன்", "ఫోన్",
  "password", "passcode", "pin", "credential", "security pin", "ಪಾಸ್‌ವರ್ಡ್", "ಪಿನ್", "पासवर्ड", "पिन", "கடவுச்சொல்", "పాస్‌వర్డ్",
  "medical", "health", "checkup", "disease", "patient", "doctor", "ವೈದ್ಯಕೀಯ", "ಆರೋಗ್ಯ", "ತಪಾಸಣೆ", "स्वास्थ्य", "चिकित्सा", "மருத்துவ", "ஆரோக்கிய", "వైద్య", "ఆరోగ్య",
  "who lives in", "house number", "home address", "aadhar", "voter id number", "ವೈಯಕ್ತಿಕ", "ಖಾಸಗಿ", "व्यक्तिगत", "தனிப்பட்ட", "వ్యక్తిగత"
];

// General keywords
const FUNDS_KEYWORDS = ["fund", "funds", "budget", "grant", "expense", "balance", "sfc", "mgnrega", "treasury", "ಅನುದಾನ", "ನಿಧಿ", "ವೆಚ್ಚ", "ಬಾಕಿ", "अनुदान", "निधि", "बजट", "खर्च", "நிதிகள்", "மானியங்கள்", "செலவு", "నిధులు", "గ్రాంట్లు", "ఖర్చు"];
const POPULATION_KEYWORDS = ["population", "census", "demographics", "people", "living", "male", "female", "families", "ಜನಸಂಖ್ಯೆ", "ಕುಟುಂಬಗಳು", "ನಾಗರಿಕರು", "जनसंख्या", "लोग", "परिवार", "மக்கள் தொகை", "குடும்பங்கள்", "జనాభా", "కుటుంబాలు"];
const ELECTION_KEYWORDS = ["election", "voter", "voters", "turnout", "winner", "candidate", "vote", "ಚುನಾವಣೆ", "ಮತದಾರರು", "ಮತದಾನ", "ಫಲಿತಾಂಶ", "चुनाव", "मतदाता", "परिणाम", "தேர்தல்", "வாக்காளர்கள்", "முடிவுகள்", "ఎన్నికలు", "ఓటర్లు", "ఫలితాలు"];
const ALL_VILLAGES_KEYWORDS = ["all villages", "village list", "how many villages", "wards", "ಎಲ್ಲ ಗ್ರಾಮಗಳು", "ಗ್ರಾಮಗಳ ಪಟ್ಟಿ", "10 ಗ್ರಾಮಗಳು", "सभी गाँव", "गाँवों की सूची", "அனைத்து கிராமங்கள்", "கிராமங்களின் பட்டியல்", "అన్ని గ్రామాలు", "గ్రామాల జాబితా"];
const GREETING_KEYWORDS = ["hi", "hello", "namaskara", "namaste", "vanakkam", "help", "who are you", "ನಮಸ್ಕಾರ", "ಹಲೋ", "नमस्ते", "வணக்கம்", "నమస్కారం"];

/**
 * Clean & normalize search string
 */
export const normalizeQuery = (text = "") => {
  return text.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ").replace(/\s+/g, " ");
};

/**
 * Checks if query violates citizen privacy rules
 */
export const checkPrivacyViolation = (query = "") => {
  const norm = normalizeQuery(query);
  return PRIVACY_RESTRICTED_KEYWORDS.some(kw => norm.includes(kw.toLowerCase()));
};

/**
 * Matches a village from the database using aliases, ward numbers, or fuzzy substrings
 */
export const findMatchingVillage = (query = "", villages = []) => {
  const norm = normalizeQuery(query);
  if (!norm) return null;

  // 1. Direct match on known aliases
  for (const item of KNOWN_VILLAGE_ALIASES) {
    for (const alias of item.aliases) {
      if (norm === alias || norm.includes(alias)) {
        const found = villages.find(v => v.id === item.id || v.wardNo === item.wardNo || v.nameEn.toLowerCase() === item.nameEn.toLowerCase());
        if (found) return found;
      }
    }
  }

  // 2. Direct match on villages prop (English & Kannada names)
  for (const v of villages) {
    const enName = (v.nameEn || "").toLowerCase();
    const knName = v.nameKn || "";
    const wardStr = `ward ${v.wardNo}`;

    if (norm === enName || norm.includes(enName) || norm === wardStr || norm.includes(wardStr)) {
      return v;
    }
    if (knName && norm.includes(knName)) {
      return v;
    }
  }

  // 3. Partial substring matching (minimum 4 characters)
  for (const v of villages) {
    const enName = (v.nameEn || "").toLowerCase();
    if (enName.length >= 4 && norm.includes(enName.substring(0, 4))) {
      return v;
    }
  }

  return null;
};

/**
 * Detects general query intent
 */
export const detectGeneralIntent = (query = "") => {
  const norm = normalizeQuery(query);
  if (!norm) return null;

  if (FUNDS_KEYWORDS.some(kw => norm.includes(kw))) return "funds";
  if (POPULATION_KEYWORDS.some(kw => norm.includes(kw))) return "population";
  if (ELECTION_KEYWORDS.some(kw => norm.includes(kw))) return "elections";
  if (ALL_VILLAGES_KEYWORDS.some(kw => norm.includes(kw))) return "all_villages";
  if (GREETING_KEYWORDS.some(kw => norm === kw || norm.startsWith(kw))) return "greeting";

  return null;
};

/**
 * Process a user chatbot query and return structured response
 */
export const processChatbotQuery = ({
  query = "",
  lang = "en",
  villages = [],
  funds = {},
  transactions = [],
  electionData = {},
  isOfficer = false,
  t = {}
}) => {
  const trimmed = query.trim();

  // 1. Empty query
  if (!trimmed) {
    return {
      type: "empty",
      text: t.chatbotPlaceholder || "Please type a village name (e.g. Shivapura, Doddakallahalli, Ward 3) or ask about funds/population."
    };
  }

  // 2. Strict Citizen Privacy Guardrail
  if (checkPrivacyViolation(trimmed)) {
    const privacyNotice = {
      kn: "🔒 ಗೌಪ್ಯತೆ ರಕ್ಷಣೆ ಸೂಚನೆ: ಕರ್ನಾಟಕ ಇ-ಆಡಳಿತ ಮತ್ತು ನಾಗರಿಕ ದತ್ತಾಂಶ ಸಂರಕ್ಷಣಾ ನಿಯಮಾವಳಿಗಳ ಪ್ರಕಾರ, ಪ್ರತ್ಯೇಕ ನಾಗರಿಕರ ಹೆಸರುಗಳು, ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗಳು, ಜಾತಿ ವಿವರಗಳು, ವೈದ್ಯಕೀಯ ಆರೋಗ್ಯ ದಾಖಲೆಗಳು ಹಾಗೂ ಅಧಿಕಾರಿಗಳ ಭದ್ರತಾ ರುಜುವಾತುಗಳು ಅತ್ಯಂತ ಗೌಪ್ಯವಾಗಿದ್ದು, ಸಾರ್ವಜನಿಕವಾಗಿ ಬಹಿರಂಗಪಡಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.",
      hi: "🔒 गोपनीयता संरक्षण सूचना: कर्नाटक ई-शासन एवं डेटा सुरक्षा नियमों के तहत, नागरिकों के व्यक्तिगत नाम, मोबाइल नंबर, जाति विवरण, स्वास्थ्य रिकॉर्ड और अधिकारियों के सुरक्षा पासवर्ड पूरी तरह गोपनीय हैं और सार्वजनिक रूप से साझा नहीं किए जा सकते।",
      mr: "🔒 गोपनीयता संरक्षण सूचना: कर्नाटक ई-प्रशासन व डेटा सुरक्षा नियमांनुसार, नागरिकांची वैयक्तिक नावे, मोबाईल क्रमांक, जात प्रवर्ग, आरोग्य नोंदी आणि अधिकाऱ्यांचे पासवर्ड गोपनीय आहेत.",
      ta: "🔒 தனியுரிமை பாதுகாப்பு அறிவிப்பு: கர்நாடக மின்-ஆளுமை மற்றும் தரவுப் பாதுகாப்பு விதிகளின்படி, தனிநபர் குடிமக்கள் பெயர்கள், மொபைல் எண்கள், சாதி விவரங்கள், மருத்துவப் பதிவுகள் மற்றும் அதிகாரிகளின் கடவுச்சொற்கள் ரகசியமானவை.",
      te: "🔒 గోప్యతా రక్షణ నోటీసు: కర్ణాటక ఇ-పాలన నిబంధనల ప్రకారం, పౌరుల వ్యక్తిగత పేర్లు, మొబైల్ నంబర్లు, కుల వివరాలు, వైద్య రికార్డులు మరియు అధికారుల పాస్‌వర్డ్‌లు ఖచ్చితంగా గోప్యమైనవి.",
      en: "🔒 Privacy Protection Notice: Under Karnataka E-Governance and Citizen Data Protection Protocols, individual citizen names, personal phone numbers, caste categories, medical health checkups, and administrative security credentials are strictly confidential and cannot be disclosed."
    }[lang] || "🔒 Privacy Protection Notice: Individual citizen records, phone numbers, caste details, and medical records are strictly confidential under Karnataka E-Governance protocols.";

    return {
      type: "privacy_warning",
      text: privacyNotice,
      isRestricted: true
    };
  }

  // 3. Search for Village Match in live database
  const villageMatch = findMatchingVillage(trimmed, villages);

  if (villageMatch) {
    // Collect related development works for this village/ward
    const wardNo = villageMatch.wardNo;
    const villageNameLower = villageMatch.nameEn.toLowerCase();

    const relatedWorks = transactions.filter(tr => {
      const p = (tr.purpose || "").toLowerCase();
      return p.includes(villageNameLower) || p.includes(`ward ${wardNo}`) || p.includes(`ward-${wardNo}`);
    });

    const refCoords = {
      "VIL-001": { lat: 13.0970, lng: 77.3870 },
      "VIL-002": { lat: 13.1120, lng: 77.4050 },
      "VIL-003": { lat: 13.0850, lng: 77.3720 },
      "VIL-004": { lat: 12.7209, lng: 77.2799 },
      "VIL-005": { lat: 13.0910, lng: 77.3950 },
      "VIL-006": { lat: 13.0030, lng: 77.6960 },
      "VIL-007": { lat: 13.0990, lng: 77.3790 },
      "VIL-008": { lat: 13.2484, lng: 77.7126 },
      "VIL-009": { lat: 13.0540, lng: 77.4200 },
      "VIL-010": { lat: 13.0780, lng: 77.3620 }
    }[villageMatch.id];

    const lat = villageMatch.latitude || refCoords?.lat;
    const lng = villageMatch.longitude || refCoords?.lng;
    const hasGps = Boolean(lat && lng);

    const enrichedVillage = {
      ...villageMatch,
      latitude: lat,
      longitude: lng
    };

    // Turnout calculation
    const turnout = villageMatch.totalVoters > 0
      ? ((villageMatch.votesCast / villageMatch.totalVoters) * 100).toFixed(1)
      : "0";

    // Text summary in user's selected language
    let summaryText = "";
    if (lang === "kn") {
      summaryText = `📍 ${villageMatch.nameKn} (ವಾರ್ಡ್ ${villageMatch.wardNo}) - ಅಧಿಕೃತ ಪಂಚಾಯತಿ ಮಾಹಿತಿ:\n` +
        `• ಒಟ್ಟು ಜನಸಂಖ್ಯೆ: ${villageMatch.totalPopulation.toLocaleString()} (ಸಕ್ರಿಯ ನಾಗರಿಕರು: ${villageMatch.livingMembers.toLocaleString()})\n` +
        `• ಪುರುಷರು: ${villageMatch.maleMembers} | ಮಹಿಳೆಯರು: ${villageMatch.femaleMembers}\n` +
        `• ಒಟ್ಟು ಕುಟುಂಬಗಳು: ${villageMatch.totalFamilies} | ಬಿ.ಪಿ.ಎಲ್: ${villageMatch.bplCardCount} | ಎ.ಪಿ.ಎಲ್: ${villageMatch.aplCardCount}\n` +
        `• ಮತದಾರರು: ${villageMatch.totalVoters} (ಮತದಾನ: ${turnout}%)\n` +
        `• ವಾರ್ಡ್ ಪ್ರತಿನಿಧಿ: ${villageMatch.sarpanchName || "ಅಧಿಕೃತ ಸದಸ್ಯರು"}`;
    } else if (lang === "hi") {
      summaryText = `📍 ${villageMatch.nameEn} (वार्ड ${villageMatch.wardNo}) - आधिकारिक ग्राम पंचायत विवरण:\n` +
        `• कुल जनसंख्या: ${villageMatch.totalPopulation.toLocaleString()} (सत्यापित जीवित नागरिक: ${villageMatch.livingMembers.toLocaleString()})\n` +
        `• पुरुष: ${villageMatch.maleMembers} | महिला: ${villageMatch.femaleMembers}\n` +
        `• कुल परिवार: ${villageMatch.totalFamilies} | बीपीएल: ${villageMatch.bplCardCount} | एपीएल: ${villageMatch.aplCardCount}\n` +
        `• कुल मतदाता: ${villageMatch.totalVoters} (मतदान: ${turnout}%)\n` +
        `• वार्ड प्रतिनिधि: ${villageMatch.sarpanchName || "अधिकृत प्रतिनिधि"}`;
    } else if (lang === "ta") {
      summaryText = `📍 ${villageMatch.nameEn} (வார்டு ${villageMatch.wardNo}) - கிராம பஞ்சாயத்து தகவல்:\n` +
        `• மொத்த மக்கள் தொகை: ${villageMatch.totalPopulation.toLocaleString()} (வாழும் உறுப்பினர்கள்: ${villageMatch.livingMembers.toLocaleString()})\n` +
        `• ஆண்கள்: ${villageMatch.maleMembers} | பெண்கள்: ${villageMatch.femaleMembers}\n` +
        `• மொத்த குடும்பங்கள்: ${villageMatch.totalFamilies} | பிபிஎல்: ${villageMatch.bplCardCount} | ஏபிஎல்: ${villageMatch.aplCardCount}\n` +
        `• வாக்காளர்கள்: ${villageMatch.totalVoters} (வாக்குப்பதிவு: ${turnout}%)\n` +
        `• வார்டு உறுப்பினர்: ${villageMatch.sarpanchName || "அங்கீகரிக்கப்பட்ட பிரதிநிதி"}`;
    } else if (lang === "mr") {
      summaryText = `📍 ${villageMatch.nameEn} (वॉर्ड ${villageMatch.wardNo}) - अधिकृत ग्रामपंचायत माहिती:\n` +
        `• एकूण लोकसंख्या: ${villageMatch.totalPopulation.toLocaleString()} (जिवंत नागरिक: ${villageMatch.livingMembers.toLocaleString()})\n` +
        `• पुरुष: ${villageMatch.maleMembers} | महिला: ${villageMatch.femaleMembers}\n` +
        `• एकूण कुटुंबे: ${villageMatch.totalFamilies} | बीपीएल: ${villageMatch.bplCardCount} | एपीएल: ${villageMatch.aplCardCount}\n` +
        `• एकूण मतदार: ${villageMatch.totalVoters} (झालेले मतदान: ${turnout}%)\n` +
        `• वॉर्ड प्रतिनिधी: ${villageMatch.sarpanchName || "अधिकृत सदस्य"}`;
    } else if (lang === "te") {
      summaryText = `📍 ${villageMatch.nameEn} (వార్డు ${villageMatch.wardNo}) - అధికారిక గ్రామ పంచాయతీ సమాచారం:\n` +
        `• మొత్తం జనాభా: ${villageMatch.totalPopulation.toLocaleString()} (జీవించి ఉన్న పౌరులు: ${villageMatch.livingMembers.toLocaleString()})\n` +
        `• పురుషులు: ${villageMatch.maleMembers} | స్త్రీలు: ${villageMatch.femaleMembers}\n` +
        `• మొత్తం కుటుంబాలు: ${villageMatch.totalFamilies} | బీపీఎల్: ${villageMatch.bplCardCount} | ఏపీఎల్: ${villageMatch.aplCardCount}\n` +
        `• మొత్తం ఓటర్లు: ${villageMatch.totalVoters} (ఓటింగ్: ${turnout}%)\n` +
        `• వార్డు ప్రతినిధి: ${villageMatch.sarpanchName || "అధికారిక ప్రతినిధి"}`;
    } else {
      summaryText = `📍 ${villageMatch.nameEn} (Ward ${villageMatch.wardNo}) - Official Demographics & Summary:\n` +
        `• Total Population: ${villageMatch.totalPopulation.toLocaleString()} (Living Residents: ${villageMatch.livingMembers.toLocaleString()})\n` +
        `• Demographics: ${villageMatch.maleMembers} Male • ${villageMatch.femaleMembers} Female\n` +
        `• Households: ${villageMatch.totalFamilies} | BPL Cards: ${villageMatch.bplCardCount} | APL Cards: ${villageMatch.aplCardCount}\n` +
        `• Voters: ${villageMatch.totalVoters} Registered (${turnout}% Turnout)\n` +
        `• Ward Representative: ${villageMatch.sarpanchName || "Elected Member"}`;
    }

    return {
      type: "village_details",
      text: summaryText,
      village: enrichedVillage,
      turnout,
      hasGps,
      developmentWorks: relatedWorks,
      isOfficer
    };
  }

  // 4. Check for General Intents (Funds, Demographics, Elections, All Villages)
  const generalIntent = detectGeneralIntent(trimmed);

  if (generalIntent === "funds") {
    const totalGrants = funds.totalFundsReceived || 4850000;
    const roadExp = funds.roadDevelopmentExpenses || 1420000;
    const waterExp = funds.waterSupplyExpenses || 1180000;
    const sanExp = funds.sanitationExpenses || 450000;
    const totalExp = roadExp + waterExp + sanExp + 420000;
    const balance = totalGrants - totalExp;

    const fundsText = {
      kn: `💰 ಗ್ರಾಮ ಪಂಚಾಯತಿ ಸಾರ್ವಜನಿಕ ನಿಧಿಗಳ ಸಾರಾಂಶ (FY 2024-25):\n` +
        `• ಒಟ್ಟು ಪಡೆದ ಸರ್ಕಾರಿ ಅನುದಾನ: ₹ ${totalGrants.toLocaleString("en-IN")}\n` +
        `• 15ನೇ ಹಣಕಾಸು ಆಯೋಗ + ನರೇಗಾ: ₹ 36,50,000\n` +
        `• ರಸ್ತೆ ಅಭಿವೃದ್ಧಿ ವೆಚ್ಚಗಳು: ₹ ${roadExp.toLocaleString("en-IN")}\n` +
        `• ಕುಡಿಯುವ ನೀರು ಯೋಜನೆ: ₹ ${waterExp.toLocaleString("en-IN")}\n` +
        `• ನೈರ್ಮಲ್ಯ ಮತ್ತು ಸ್ವಚ್ಛತಾ ಕಾಮಗಾರಿ: ₹ ${sanExp.toLocaleString("en-IN")}\n` +
        `• ಖಜಾನೆಯಲ್ಲಿ ಲಭ್ಯವಿರುವ ಉಳಿಕೆ ಮೊತ್ತ: ₹ ${balance.toLocaleString("en-IN")}`,
      hi: `💰 ग्राम पंचायत सार्वजनिक विकास निधि सारांश (FY 2024-25):\n` +
        `• कुल प्राप्त सरकारी अनुदान: ₹ ${totalGrants.toLocaleString("en-IN")}\n` +
        `• 15वां वित्त आयोग + मनरेगा: ₹ 36,50,000\n` +
        `• सड़क निर्माण एवं मरम्मत: ₹ ${roadExp.toLocaleString("en-IN")}\n` +
        `• पेयजल आपूर्ति योजना: ₹ ${waterExp.toLocaleString("en-IN")}\n` +
        `• स्वच्छता एवं अपशिष्ट प्रबंधन: ₹ ${sanExp.toLocaleString("en-IN")}\n` +
        `• खजाने में शेष उपलब्ध राशि: ₹ ${balance.toLocaleString("en-IN")}`,
      ta: `💰 கிராம பஞ்சாயத்து பொது நிதி விவரம் (FY 2024-25):\n` +
        `• பெறப்பட்ட மொத்த அரசு நிதி: ₹ ${totalGrants.toLocaleString("en-IN")}\n` +
        `• 15வது நிதிக் குழு + மகாத்மா காந்தி திட்டம்: ₹ 36,50,000\n` +
        `• சாலை அமைத்தல் செலவு: ₹ ${roadExp.toLocaleString("en-IN")}\n` +
        `• குடிநீர் விநியோகச் செலவு: ₹ ${waterExp.toLocaleString("en-IN")}\n` +
        `• மீதமுள்ள கருவூல இருப்பு: ₹ ${balance.toLocaleString("en-IN")}`,
      mr: `💰 ग्रामपंचायत शासकीय निधी सारांश (FY 2024-25):\n` +
        `• एकूण प्राप्त शासकीय अनुदान: ₹ ${totalGrants.toLocaleString("en-IN")}\n` +
        `• 15 वा वित्त आयोग + मनरेगा: ₹ 36,50,000\n` +
        `• रस्ते बांधकाम खर्च: ₹ ${roadExp.toLocaleString("en-IN")}\n` +
        `• पिण्याचे पाणी योजना खर्च: ₹ ${waterExp.toLocaleString("en-IN")}\n` +
        `• तिजोरीतील शिल्लक निधी: ₹ ${balance.toLocaleString("en-IN")}`,
      te: `💰 గ్రామ పంచాయతీ ప్రభుత్వ నిధుల సారాంశం (FY 2024-25):\n` +
        `• మొత్తం లభించిన ప్రభుత్వ గ్రాంట్లు: ₹ ${totalGrants.toLocaleString("en-IN")}\n` +
        `• 15వ ఆర్థిక సంఘం + ఉపాధి హామీ: ₹ 36,50,000\n` +
        `• రోడ్ల నిర్మాణం ఖర్చు: ₹ ${roadExp.toLocaleString("en-IN")}\n` +
        `• తాగునీటి సరఫరా ఖర్చు: ₹ ${waterExp.toLocaleString("en-IN")}\n` +
        `• ట్రెజరీలో మిగిలిన నిల్వ: ₹ ${balance.toLocaleString("en-IN")}`,
      en: `💰 Gram Panchayat Public Treasury Overview (FY 2024-25):\n` +
        `• Total Government Grants Received: ₹ ${totalGrants.toLocaleString("en-IN")}\n` +
        `• 15th Finance Commission + MGNREGA: ₹ 36,50,000\n` +
        `• Road Concreting & Drainage: ₹ ${roadExp.toLocaleString("en-IN")}\n` +
        `• Drinking Water Supply: ₹ ${waterExp.toLocaleString("en-IN")}\n` +
        `• Sanitation & Solid Waste: ₹ ${sanExp.toLocaleString("en-IN")}\n` +
        `• Available Treasury Balance: ₹ ${balance.toLocaleString("en-IN")}`
    }[lang] || `Total Grants: ₹ ${totalGrants.toLocaleString("en-IN")} | Balance: ₹ ${balance.toLocaleString("en-IN")}`;

    return {
      type: "funds_summary",
      text: fundsText
    };
  }

  if (generalIntent === "population") {
    const totalPop = villages.reduce((acc, v) => acc + (Number(v.totalPopulation) || 0), 0);
    const totalLiving = villages.reduce((acc, v) => acc + (Number(v.livingMembers) || 0), 0);
    const totalFamilies = villages.reduce((acc, v) => acc + (Number(v.totalFamilies) || 0), 0);
    const totalVoters = villages.reduce((acc, v) => acc + (Number(v.totalVoters) || 0), 0);

    const popText = {
      kn: `👥 ಶಿವಪುರ ಗ್ರಾಮ ಪಂಚಾಯತಿ 10 ಗ್ರಾಮಗಳ ಒಟ್ಟು ಜನಸಂಖ್ಯಾ ಸಾರಾಂಶ:\n` +
        `• ಒಟ್ಟು ಜನಸಂಖ್ಯೆ: ${totalPop.toLocaleString()} ನಾಗರಿಕರು\n` +
        `• ಸಕ್ರಿಯ ಜೀವಂತ ನಾಗರಿಕರು: ${totalLiving.toLocaleString()}\n` +
        `• ಒಟ್ಟು ದಾಖಲಾದ ಕುಟುಂಬಗಳು: ${totalFamilies.toLocaleString()}\n` +
        `• ಒಟ್ಟು ನೋಂದಾಯಿತ ಮತದಾರರು: ${totalVoters.toLocaleString()}\n` +
        `• ಯಾವುದೇ ನಿರ್ದಿಷ್ಟ ಗ್ರಾಮದ ವಿವರಕ್ಕೆ ಆ ಗ್ರಾಮದ ಹೆಸರನ್ನು ಟೈಪ್ ಮಾಡಿ.`,
      hi: `👥 शिवपुरा ग्राम पंचायत के सभी 10 गाँवों का समग्र जनसंख्या सारांश:\n` +
        `• कुल जनसंख्या: ${totalPop.toLocaleString()} नागरिक\n` +
        `• सत्यापित जीवित नागरिक: ${totalLiving.toLocaleString()}\n` +
        `• कुल पंजीकृत परिवार: ${totalFamilies.toLocaleString()}\n` +
        `• कुल पंजीकृत मतदाता: ${totalVoters.toLocaleString()}\n` +
        `• किसी विशेष गाँव की जानकारी हेतु उसका नाम लिखें।`,
      ta: `👥 சிவபுரா கிராம பஞ்சாயத்தின் 10 கிராமங்களின் மக்கள் தொகை சுருக்கம்:\n` +
        `• மொத்த மக்கள் தொகை: ${totalPop.toLocaleString()}\n` +
        `• பதிவு செய்யப்பட்ட குடும்பங்கள்: ${totalFamilies.toLocaleString()}\n` +
        `• வாக்காளர்கள்: ${totalVoters.toLocaleString()}`,
      mr: `👥 शिवपूर ग्रामपंचायतीच्या 10 गावांमधील एकूण लोकसंख्या सारांश:\n` +
        `• एकूण लोकसंख्या: ${totalPop.toLocaleString()}\n` +
        `• नोंदणीकृत कुटुंबे: ${totalFamilies.toLocaleString()}\n` +
        `• एकूण मतदार: ${totalVoters.toLocaleString()}`,
      te: `👥 శివపుర గ్రామ పంచాయతీ 10 గ్రామాల మొత్తం జనాభా సారాంశం:\n` +
        `• మొత్తం జనాభా: ${totalPop.toLocaleString()}\n` +
        `• మొత్తం కుటుంబాలు: ${totalFamilies.toLocaleString()}\n` +
        `• నమోదైన ఓటర్లు: ${totalVoters.toLocaleString()}`,
      en: `👥 Shivapura Gram Panchayat Consolidated Demographics (10 Villages):\n` +
        `• Total Population: ${totalPop.toLocaleString()} residents\n` +
        `• Verified Living Residents: ${totalLiving.toLocaleString()}\n` +
        `• Total Registered Households: ${totalFamilies.toLocaleString()}\n` +
        `• Total Registered Voters: ${totalVoters.toLocaleString()}\n` +
        `• Type any village name to view its dedicated ward profile.`
    }[lang] || `Total Population across 10 villages: ${totalPop.toLocaleString()}`;

    return {
      type: "population_summary",
      text: popText
    };
  }

  if (generalIntent === "all_villages" || generalIntent === "greeting") {
    const welcomeGuide = {
      kn: `🏛️ ಸುಸ್ವಾಗತ! ಶಿವಪುರ ಗ್ರಾಮ ಪಂಚಾಯತಿ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಸಹಾಯಕ.\n` +
        `ಕೆಳಗಿನ 10 ನೋಂದಾಯಿತ ಗ್ರಾಮಗಳ ಜನಸಂಖ್ಯೆ, ಪಡಿತರ ಚೀಟಿ, ಮತದಾನ ಮತ್ತು ನಕ್ಷೆಯನ್ನು ವೀಕ್ಷಿಸಲು ಗ್ರಾಮದ ಹೆಸರನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ:`,
      hi: `🏛️ स्वागत है! शिवपुरा ग्राम पंचायत एआई सूचना सहायक।\n` +
        `नीचे दिए गए 10 पंजीकृत गाँवों की जनसंख्या, राशन, मतदाता और नक्शा देखने के लिए गाँव के नाम पर क्लिक करें या नाम लिखें:`,
      ta: `🏛️ நல்வரவு! சிவபுரா கிராம பஞ்சாயத்து AI தகவல் உதவியாளர்.\n` +
        `10 கிராமங்களின் விவரங்களைக் காண கிராமத்தின் பெயரைத் தட்டச்சு செய்யவும் அல்லது கிளிக் செய்யவும்:`,
      mr: `🏛️ आपले स्वागत आहे! शिवपूर ग्रामपंचायत एआय माहिती सहाय्यक.\n` +
        `10 गावांमधील लोकसंख्या, रेशन आणि नकाशा पाहण्यासाठी गावाचे नाव टाइप करा किंवा क्लिक करा:`,
      te: `🏛️ స్వాగతం! శివపుర గ్రామ పంచాయతీ AI సమాచార సహాయకుడు.\n` +
        `10 గ్రామాల జనాభా, రేషన్ మరియు మ్యాప్ వివరాలు చూడటానికి గ్రామం పేరును టైప్ చేయండి లేదా క్లిక్ చేయండి:`,
      en: `🏛️ Welcome to Shivapura Gram Panchayat AI Information Assistant.\n` +
        `Click or type any of the 10 registered villages below to view demographics, rations, voters, development works, and GPS map location:`
    }[lang] || "Welcome to Gram Panchayat AI Assistant. Select a village below:";

    return {
      type: "all_villages",
      text: welcomeGuide,
      villagesList: villages.map(v => ({ id: v.id, wardNo: v.wardNo, nameEn: v.nameEn, nameKn: v.nameKn }))
    };
  }

  // 5. Village Not Found Fallback - Ask to check spelling and provide 10 pills
  const notFoundText = {
    kn: `⚠️ '${trimmed}' ಹೆಸರಿನ ಗ್ರಾಮ ಅಥವಾ ಮಾಹಿತಿ ನಮ್ಮ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಕಾಗುಣಿತವನ್ನು (spelling) ಪರಿಶೀಲಿಸಿ ಅಥವಾ ನಮ್ಮ 10 ಅಧಿಕೃತ ಗ್ರಾಮಗಳಲ್ಲಿ ಒಂದನ್ನು ಕೆಳಗೆ ಆಯ್ಕೆಮಾಡಿ:`,
    hi: `⚠️ '${trimmed}' नाम का गाँव डेटाबेस में नहीं मिला। कृपया वर्तनी (spelling) जांचें या नीचे दी गई 10 आधिकारिक ग्राम पंचायतों में से चुनें:`,
    ta: `⚠️ '${trimmed}' என்ற கிராமம் தரவுத்தளத்தில் கிடைக்கவில்லை. தயவுசெய்து எழுத்துப்பிழையைச் சரிபார்க்கவும் அல்லது கீழே உள்ள 10 அதிகாரப்பூர்வ கிராமங்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:`,
    mr: `⚠️ '${trimmed}' नावाचे गाव डेटाबेसमध्ये आढळले नाही. कृपया स्पेलिंग तपासा किंवा खालील 10 अधिकृत गावांमधून निवडा:`,
    te: `⚠️ '${trimmed}' పేరుతో గ్రామం డేటాబేస్‌లో కనుగొనబడలేదు. దయచేసి స్పెల్లింగ్ సరిచూడండి లేదా క్రింది 10 అధికారిక గ్రామాలలో ఒకదాన్ని ఎంచుకోండి:`,
    en: `⚠️ We could not find a village matching '${trimmed}'. Please check the spelling or select from our 10 registered Gram Panchayat villages below:`
  }[lang] || `Could not find village '${trimmed}'. Please check the spelling or choose from below:`;

  return {
    type: "not_found",
    text: notFoundText,
    searchQuery: trimmed,
    suggestedVillages: villages.map(v => ({ id: v.id, wardNo: v.wardNo, nameEn: v.nameEn, nameKn: v.nameKn }))
  };
};
