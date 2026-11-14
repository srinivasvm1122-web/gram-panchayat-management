// Central Multi-Language Translation System
// Gram Panchayat Digital Management System
// 6 Fully Supported Indic & Official Languages:
// 1. English (en)
// 2. Kannada (kn - ಕನ್ನಡ)
// 3. Hindi (hi - हिंदी)
// 4. Tamil (ta - தமிழ்)
// 5. Marathi (mr - मराठी)
// 6. Telugu (te - తెలుగు)

import { en } from "./locales/en.js";
import { kn } from "./locales/kn.js";
import { hi } from "./locales/hi.js";
import { ta } from "./locales/ta.js";
import { mr } from "./locales/mr.js";
import { te } from "./locales/te.js";

export const SUPPORTED_LANGUAGES = [
  { 
    code: "en", 
    name: "English", 
    nativeName: "English", 
    subtext: "Official Language", 
    flag: "🇬🇧",
    fontClass: "font-sans" 
  },
  { 
    code: "kn", 
    name: "Kannada", 
    nativeName: "ಕನ್ನಡ", 
    subtext: "ರಾಜ್ಯ ಭಾಷೆ (ಕರ್ನಾಟಕ)", 
    flag: "🇮🇳",
    fontClass: "font-kannada" 
  },
  { 
    code: "hi", 
    name: "Hindi", 
    nativeName: "हिंदी", 
    subtext: "राजभाषा (भारत)", 
    flag: "🇮🇳",
    fontClass: "font-devanagari" 
  },
  { 
    code: "ta", 
    name: "Tamil", 
    nativeName: "தமிழ்", 
    subtext: "தமிழ்நாடு & புதுச்சேரி", 
    flag: "🇮🇳",
    fontClass: "font-tamil" 
  },
  { 
    code: "mr", 
    name: "Marathi", 
    nativeName: "मराठी", 
    subtext: "महाराष्ट्र शासन", 
    flag: "🇮🇳",
    fontClass: "font-devanagari" 
  },
  { 
    code: "te", 
    name: "Telugu", 
    nativeName: "తెలుగు", 
    subtext: "ఆంధ్రప్రదేశ్ & తెలంగాణ", 
    flag: "🇮🇳",
    fontClass: "font-telugu" 
  }
];

export const translations = {
  en,
  kn,
  hi,
  ta,
  mr,
  te
};

export default translations;
