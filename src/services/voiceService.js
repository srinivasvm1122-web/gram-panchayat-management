// src/services/voiceService.js
// Enterprise Web Speech Recognition & Speech Synthesis Service for Gram Panchayat
// Supports 6 languages: English, Kannada, Hindi, Tamil, Marathi, Telugu
// Zero API keys required (built-in native browser & Android WebView Web Speech API)

// BCP 47 Language mappings for Indian locales
export const LOCALE_BCP47_MAP = {
  en: "en-IN",
  kn: "kn-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  mr: "mr-IN",
  te: "te-IN"
};

// Fallback prefixes for voice matching
export const LOCALE_PREFIX_MAP = {
  en: ["en-IN", "en-GB", "en-US", "en"],
  kn: ["kn-IN", "kn"],
  hi: ["hi-IN", "hi"],
  ta: ["ta-IN", "ta"],
  mr: ["mr-IN", "mr"],
  te: ["te-IN", "te"]
};

/**
 * Check if Speech Recognition is supported in the current environment
 */
export const isSpeechRecognitionSupported = () => {
  if (typeof window === "undefined") return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
};

/**
 * Check if Speech Synthesis is supported in the current environment
 */
export const isSpeechSynthesisSupported = () => {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance !== "undefined";
};

/**
 * Request audio microphone permission explicitly (crucial for Android WebView)
 */
export const requestMicrophonePermission = async () => {
  if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop tracks immediately after permission check
      stream.getTracks().forEach(track => track.stop());
      return { granted: true };
    } catch (err) {
      console.warn("Microphone permission check failed:", err.name, err.message);
      return { 
        granted: false, 
        error: err.name === "NotAllowedError" || err.name === "PermissionDeniedError" 
          ? "permission_denied" 
          : "mic_unavailable" 
      };
    }
  }
  return { granted: true }; // Fallback to let SpeechRecognition prompt directly
};

// Active recognition instance tracker
let activeRecognition = null;

/**
 * Start listening for speech input in the target language
 */
export const startListening = async ({
  lang = "en",
  onStart = () => {},
  onInterim = () => {},
  onResult = () => {},
  onError = () => {},
  onEnd = () => {}
}) => {
  if (!isSpeechRecognitionSupported()) {
    onError("not_supported", "Speech recognition is not supported in this browser.");
    return null;
  }

  // Pre-check Android WebView audio permissions
  const permCheck = await requestMicrophonePermission();
  if (!permCheck.granted && permCheck.error === "permission_denied") {
    onError("permission_denied", "Microphone access was denied. Please allow microphone in settings.");
    return null;
  }

  // Cancel any ongoing instance
  stopListening();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  const bcp47Locale = LOCALE_BCP47_MAP[lang] || "en-IN";
  recognition.lang = bcp47Locale;
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let finalTranscript = "";

  recognition.onstart = () => {
    onStart();
  };

  recognition.onresult = (event) => {
    let interimText = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimText += transcript;
      }
    }

    if (interimText) {
      onInterim(interimText);
    }

    if (finalTranscript) {
      onResult(finalTranscript.trim());
    }
  };

  recognition.onerror = (event) => {
    console.warn("Speech recognition error:", event.error);
    onError(event.error, event.message || event.error);
  };

  recognition.onend = () => {
    activeRecognition = null;
    onEnd();
  };

  try {
    recognition.start();
    activeRecognition = recognition;
    return recognition;
  } catch (err) {
    console.error("Failed to start speech recognition:", err);
    onError("start_failed", err.message);
    return null;
  }
};

/**
 * Stop active speech recognition instance
 */
export const stopListening = () => {
  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch {
      // Ignore if already stopped
    }
    activeRecognition = null;
  }
};

/**
 * Clean markdown symbols, emojis, and formatting so text reads naturally via TTS
 */
export const cleanTextForSpeech = (rawText) => {
  if (!rawText) return "";

  return rawText
    // Remove markdown headers and bold/italic asterisks
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*{1,3}(.*?)\*{1,3}/g, "$1")
    .replace(/_{1,3}(.*?)_{1,3}/g, "$1")
    .replace(/`{1,3}(.*?)/g, "$1")
    // Replace bullet points and dashes
    .replace(/^[•\-\*]\s+/gm, "")
    // Clean currency symbol for smooth speech
    .replace(/₹\s?/g, "Rs. ")
    // Remove typical UI emojis
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    // Remove multiple consecutive dots or hyphens
    .replace(/[-_]{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Find best matching voice for the given language
 */
export const getMatchingVoice = (lang = "en") => {
  if (!isSpeechSynthesisSupported()) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const searchLocales = LOCALE_PREFIX_MAP[lang] || ["en-IN", "en"];

  // 1. Exact match on BCP 47 code (e.g. kn-IN)
  for (const code of searchLocales) {
    const match = voices.find(v => v.lang && v.lang.toLowerCase() === code.toLowerCase());
    if (match) return match;
  }

  // 2. Starts with language code (e.g. kn)
  const baseCode = lang.toLowerCase();
  const partialMatch = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(baseCode));
  if (partialMatch) return partialMatch;

  // 3. Fallback to any Indian English or default voice
  const fallbackIndian = voices.find(v => v.lang && v.lang.toLowerCase().includes("en-in"));
  if (fallbackIndian) return fallbackIndian;

  return voices[0] || null;
};

// Keep track of active utterance so it can be stopped anytime
let activeUtterance = null;

/**
 * Speak text in the specified language using Speech Synthesis
 */
export const speakText = (text, lang = "en", { onStart = () => {}, onEnd = () => {}, onError = () => {} } = {}) => {
  if (!isSpeechSynthesisSupported()) {
    onError("not_supported", "Text-to-speech is not supported on this device.");
    return false;
  }

  // Stop any currently playing audio
  stopSpeaking();

  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return false;

  try {
    const utterance = new SpeechSynthesisUtterance(cleaned);
    const bcp47Locale = LOCALE_BCP47_MAP[lang] || "en-IN";
    utterance.lang = bcp47Locale;
    utterance.rate = 0.95; // Slightly slower for clear government announcements
    utterance.pitch = 1.0;

    // Pick best voice
    const matchedVoice = getMatchingVoice(lang);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      onStart();
    };

    utterance.onend = () => {
      activeUtterance = null;
      onEnd();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis utterance error:", e);
      activeUtterance = null;
      onError(e.error || "playback_error");
    };

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error("Failed to execute text-to-speech:", err);
    activeUtterance = null;
    onError("speak_failed", err.message);
    return false;
  }
};

/**
 * Immediately stop any ongoing speech synthesis playback
 */
export const stopSpeaking = () => {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
  activeUtterance = null;
};

/**
 * Check if speech is currently playing
 */
export const isSpeaking = () => {
  if (!isSpeechSynthesisSupported()) return false;
  return window.speechSynthesis.speaking;
};

// Warm up voices cache for Chrome / Android WebView
if (typeof window !== "undefined" && isSpeechSynthesisSupported()) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Voices loaded into browser cache
  };
}
