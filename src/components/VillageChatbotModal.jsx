import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  X, 
  RotateCcw, 
  Building2, 
  Users, 
  MapPin, 
  Navigation as NavIcon, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  Wallet, 
  CreditCard, 
  Vote, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  ChevronRight,
  Layers,
  HelpCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio
} from "lucide-react";
import { processChatbotQuery } from "../services/chatbotService";
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  requestMicrophonePermission,
  startListening,
  stopListening,
  speakText,
  stopSpeaking,
  isSpeaking,
  isSecureOrigin
} from "../services/voiceService";

const LANGUAGE_DISPLAY_NAMES = {
  en: "English",
  kn: "ಕನ್ನಡ",
  hi: "हिंदी",
  ta: "தமிழ்",
  mr: "मराठी",
  te: "తెలుగు"
};

export const VillageChatbotModal = ({
  isOpen = false,
  autoStartVoice = false,
  onClose,
  villages = [],
  funds = {},
  transactions = [],
  electionData = {},
  isOfficer = false,
  currentUser = {},
  lang = "en",
  t = {},
  onNavigateToMap,
  onSelectVillageForDetails
}) => {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Voice AI States
  const [isListening, setIsListening] = useState(false);
  const [interimSpeech, setInterimSpeech] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("idle"); // "idle" | "listening" | "processing" | "error"
  const [voiceErrorMessage, setVoiceErrorMessage] = useState("");
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showMicHelpModal, setShowMicHelpModal] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize greeting on first open or language switch
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome-1",
          sender: "bot",
          text: t.chatbotWelcome || "Namaskara! I am your official Gram Panchayat AI Assistant. You can ask me about any of the 10 registered villages, population demographics, APL/BPL ration cards, registered voters, or public development funds.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: ["Shivapura", "Doddakallahalli", "Malleshwara", "Funds", "Total Population"]
        }
      ]);
    }
  }, [lang, t]);

  // Auto-scroll to bottom of message thread
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen]);

  // Clean up any ongoing audio and voice listening when modal closes or unmounts
  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, []);

  // Auto-start voice if requested from launcher
  useEffect(() => {
    if (isOpen && autoStartVoice) {
      const timer = setTimeout(() => {
        toggleVoiceListening();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoStartVoice]);

  const handleModalClose = () => {
    stopListening();
    stopSpeaking();
    setIsListening(false);
    setIsAudioPlaying(false);
    setCurrentlySpeakingId(null);
    setInterimSpeech("");
    setVoiceStatus("idle");
    if (onClose) onClose();
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    setCurrentlySpeakingId(null);
    setIsAudioPlaying(false);
  };

  const handleToggleSpeakMessage = (msg) => {
    if (currentlySpeakingId === msg.id) {
      handleStopSpeaking();
    } else {
      handleStopSpeaking();
      setCurrentlySpeakingId(msg.id);
      setIsAudioPlaying(true);
      speakText(msg.text, lang, {
        onStart: () => {
          setIsAudioPlaying(true);
        },
        onEnd: () => {
          setCurrentlySpeakingId(null);
          setIsAudioPlaying(false);
        },
        onError: () => {
          setCurrentlySpeakingId(null);
          setIsAudioPlaying(false);
        }
      });
    }
  };

  const handleRequestMicPermission = async () => {
    setVoiceErrorMessage("");
    const res = await requestMicrophonePermission();
    if (res.granted) {
      setShowMicHelpModal(false);
      setTimeout(() => {
        toggleVoiceListening();
      }, 100);
    } else {
      setShowMicHelpModal(true);
      if (res.error === "insecure_origin") {
        setVoiceErrorMessage(
          lang === "kn"
            ? "HTTP ನೆಟ್‌ವರ್ಕ್‌ನಲ್ಲಿ ಮೈಕ್ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ. 'ಸಹಾಯ' ಒತ್ತಿ."
            : "Microphone blocked on HTTP IP address. Tap 'How to Fix'."
        );
      } else {
        setVoiceErrorMessage(
          t.micPermissionDenied ||
          "Microphone access was denied. Please allow microphone in your browser address bar or device settings."
        );
      }
    }
  };

  const toggleVoiceListening = () => {
    // If audio is playing, stop it first
    if (isAudioPlaying) {
      handleStopSpeaking();
    }

    if (isListening) {
      stopListening();
      setIsListening(false);
      setVoiceStatus("idle");
      // If user had spoken something, send it
      if (inputQuery.trim()) {
        handleSendMessage(inputQuery.trim(), { autoSpeak: true });
      }
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setVoiceErrorMessage(
        t.micNotSupported || 
        "Speech recognition is not supported on this browser. Please use Google Chrome or Android WebView."
      );
      return;
    }

    setVoiceErrorMessage("");
    setInterimSpeech("");
    setVoiceStatus("listening");
    setIsListening(true);

    const recognition = startListening({
      lang,
      onStart: () => {
        setIsListening(true);
        setVoiceStatus("listening");
        setVoiceErrorMessage("");
      },
      onInterim: (text) => {
        setInterimSpeech(text);
        setInputQuery(text);
      },
      onResult: (finalTranscript) => {
        setIsListening(false);
        setInterimSpeech("");
        setVoiceStatus("processing");
        if (finalTranscript && finalTranscript.trim()) {
          setInputQuery(finalTranscript.trim());
          handleSendMessage(finalTranscript.trim(), { autoSpeak: true });
        } else {
          setVoiceStatus("idle");
        }
      },
      onError: (errCode, errMsg) => {
        setIsListening(false);
        setVoiceStatus("error");
        setInterimSpeech("");
        if (errCode === "not-allowed" || errCode === "permission_denied") {
          setVoiceErrorMessage(
            t.micPermissionDenied || 
            "Microphone permission blocked. Tap 'How to Fix' or allow in browser settings."
          );
        } else if (errCode === "insecure_origin") {
          setVoiceErrorMessage(
            lang === "kn"
              ? "HTTP ನೆಟ್‌ವರ್ಕ್‌ನಲ್ಲಿ ಮೈಕ್ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ. 'ಸಹಾಯ' ಒತ್ತಿ."
              : "Microphone blocked on HTTP IP address. Tap 'How to Fix'."
          );
        } else if (errCode === "no-speech") {
          setVoiceErrorMessage(t.micErrorNoSpeech || "No speech detected. Please tap mic and speak again.");
        } else if (errCode === "not_supported") {
          setVoiceErrorMessage(t.micNotSupported || "Speech recognition is not supported in this browser.");
        } else {
          setVoiceErrorMessage(errMsg || "Microphone error occurred. Please try again.");
        }
      },
      onEnd: () => {
        setIsListening(false);
        setVoiceStatus(prev => (prev === "listening" ? "idle" : prev));
      }
    });

    if (!recognition) {
      setIsListening(false);
      setVoiceStatus("idle");
    }
  };

  const handleSendMessage = (textToSend, options = {}) => {
    const { autoSpeak = false } = options;
    const query = typeof textToSend === "string" ? textToSend : inputQuery;
    if (!query.trim()) return;

    // Reset voice statuses
    setVoiceErrorMessage("");
    setVoiceStatus("idle");
    setInterimSpeech("");

    if (isAudioPlaying) {
      handleStopSpeaking();
    }

    const userMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery("");
    setIsTyping(true);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const response = processChatbotQuery({
        query,
        lang,
        villages,
        funds,
        transactions,
        electionData,
        isOfficer,
        t
      });

      const botMessageId = "bot-" + Date.now();
      const botMessage = {
        id: botMessageId,
        sender: "bot",
        ...response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Auto-speak response if query was input by voice
      if (autoSpeak && botMessage.text) {
        setCurrentlySpeakingId(botMessageId);
        setIsAudioPlaying(true);
        speakText(botMessage.text, lang, {
          onStart: () => setIsAudioPlaying(true),
          onEnd: () => {
            setCurrentlySpeakingId(null);
            setIsAudioPlaying(false);
          },
          onError: () => {
            setCurrentlySpeakingId(null);
            setIsAudioPlaying(false);
          }
        });
      }
    }, 400);
  };

  const handleClearChat = () => {
    handleStopSpeaking();
    setMessages([
      {
        id: "welcome-reset-" + Date.now(),
        sender: "bot",
        text: t.chatbotWelcome || "Chat cleared. Ask about any of the 10 villages, population, ration cards, or funds.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ["Shivapura", "Doddakallahalli", "Ward 4", "Funds"]
      }
    ]);
  };

  const quickPills = [
    { label: "Shivapura", query: "Shivapura" },
    { label: "Doddakallahalli", query: "Doddakallahalli" },
    { label: "Malleshwara", query: "Malleshwara" },
    { label: "Ramanagara", query: "Ramanagara" },
    { label: "Gandhinagar", query: "Gandhinagar" },
    { label: "Krishnarajapura", query: "Krishnarajapura" },
    { label: "Nelamangala", query: "Nelamangala" },
    { label: "Devanahalli", query: "Devanahalli" },
    { label: "Someshwara", query: "Someshwara" },
    { label: "Kempegowda Nagar", query: "Kempegowda Nagar" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className={`bg-white w-full shadow-2xl flex flex-col border border-amber-500/30 overflow-hidden transition-all duration-200 ${
          isExpanded 
            ? "sm:max-w-4xl h-[94vh] rounded-3xl" 
            : "sm:max-w-xl h-[88vh] sm:h-[680px] rounded-t-3xl sm:rounded-3xl"
        }`}
      >
        
        {/* Tricolor Header Accent */}
        <div className="h-1.5 w-full flex flex-shrink-0">
          <div className="w-1/3 bg-[#FF9933]"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-[#138808]"></div>
        </div>

        {/* Chatbot Top Bar */}
        <div className="p-4 bg-gradient-to-r from-gov-950 via-gov-900 to-gov-800 text-white flex items-center justify-between border-b border-amber-500/30 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow flex items-center justify-center">
                <div className="w-full h-full bg-gov-950 rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-gov-950 rounded-full" title="Online"></span>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                  {t.chatbotTitle || "AI Gram Panchayat Assistant"}
                </h3>
                <span className="text-[9px] bg-amber-400 text-gov-950 font-black px-1.5 py-0.2 rounded uppercase">
                  Voice AI
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-400/30">
                  {LANGUAGE_DISPLAY_NAMES[lang] || lang.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-sky-200/90 truncate max-w-[220px] sm:max-w-xs">
                {t.chatbotSubtitle || "Instant village demographics, rations, voters & funds"}
              </p>
            </div>
          </div>

          {/* Action Buttons: Stop Voice, Clear, Expand, Close */}
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            {/* Global Stop Voice Button (Active when TTS is reading) */}
            {isAudioPlaying && (
              <button
                type="button"
                onClick={handleStopSpeaking}
                className="px-2 py-1 rounded-lg bg-red-500/25 border border-red-400/50 text-red-200 hover:bg-red-500/40 transition text-xs flex items-center space-x-1 animate-pulse"
                title={t.stopSpeaking || "Stop Voice"}
              >
                <VolumeX className="w-3.5 h-3.5 text-red-300" />
                <span className="text-[11px] font-bold">{t.stopSpeaking || "Stop"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClearChat}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-gov-800 transition text-xs"
              title={t.chatbotClear || "Clear chat history"}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:inline-flex p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-gov-800 transition"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleModalClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-red-500/20 transition"
              title="Close Chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Officer Status Sub-banner */}
        {isOfficer && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-[11px] font-bold text-amber-900 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.chatbotOfficerModeBadge || "Authorized Officer Access"} ({currentUser?.name || "Officer"})</span>
            </div>
            <span className="text-[10px] bg-amber-400 text-gov-950 px-2 py-0.2 rounded font-black uppercase">
              Full Query Access
            </span>
          </div>
        )}

        {/* Message Thread Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/60 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            const isMsgSpeaking = currentlySpeakingId === msg.id;

            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isUser ? "items-end" : "items-start"} animate-in fade-in duration-150`}
              >
                {/* Bubble */}
                <div 
                  className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-3.5 shadow-sm text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-gov-900 text-white rounded-br-xs font-medium"
                      : msg.type === "privacy_warning"
                      ? "bg-red-50 border border-red-200 text-red-900 rounded-bl-xs"
                      : "bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs"
                  }`}
                >
                  {/* Sender label and Speaker button */}
                  {!isUser && (
                    <div className="flex items-center space-x-1.5 mb-1.5 pb-1 border-b border-slate-100">
                      <Bot className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-extrabold text-[11px] text-slate-600">
                        {t.chatbotTitle || "GP Assistant"}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-auto">{msg.timestamp}</span>

                      {/* Speaker Read Aloud Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleSpeakMessage(msg)}
                        className={`p-1 px-2 rounded-lg transition text-xs flex items-center space-x-1 ml-1.5 ${
                          isMsgSpeaking
                            ? "bg-red-100 text-red-700 hover:bg-red-200 font-bold border border-red-300 animate-pulse"
                            : "bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-900 border border-slate-200"
                        }`}
                        title={isMsgSpeaking ? (t.stopSpeaking || "Stop Voice") : (t.speakAnswer || "Read Aloud")}
                      >
                        {isMsgSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-red-600" />
                            <span className="text-[10px]">{t.stopSpeaking || "Stop"}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                            <span className="text-[10px]">{t.speakAnswer || "Speak"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Main text message */}
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* CASE 1: STRUCTURED VILLAGE DETAILS CARD */}
                  {msg.type === "village_details" && msg.village && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
                      
                      {/* Demographics KPI Pill Grid */}
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">{t.totalPopulation || "Population"}</span>
                          <strong className="text-slate-900 text-xs font-black">
                            {(Number(msg.village.totalPopulation) || 0).toLocaleString()}
                          </strong>
                          <span className="text-[10px] text-slate-500 block">
                            {msg.village.maleMembers} M • {msg.village.femaleMembers} F
                          </span>
                        </div>

                        <div className="bg-cyan-50 p-2 rounded-xl border border-cyan-100">
                          <span className="text-cyan-800 block text-[10px] uppercase font-bold">{t.totalFamilies || "Families & Rations"}</span>
                          <strong className="text-cyan-950 text-xs font-black">
                            {msg.village.totalFamilies} Families
                          </strong>
                          <span className="text-[10px] text-cyan-700 block">
                            BPL: {msg.village.bplCardCount} • APL: {msg.village.aplCardCount}
                          </span>
                        </div>
                      </div>

                      {/* Voter Turnout Bar */}
                      <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100 text-[11px]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-purple-900 flex items-center space-x-1">
                            <Vote className="w-3.5 h-3.5 text-purple-700" />
                            <span>{t.votingTurnout || "Turnout"}: {msg.turnout}%</span>
                          </span>
                          <span className="text-[10px] text-purple-800 font-semibold">
                            {msg.village.votesCast} / {msg.village.totalVoters} Voters
                          </span>
                        </div>
                        <div className="w-full bg-purple-200/80 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-purple-700 h-1.5 rounded-full" 
                            style={{ width: `${Math.min(100, Number(msg.turnout))}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* GPS Location Snippet */}
                      <div className={`p-2 rounded-xl border flex items-center justify-between text-[11px] ${
                        msg.hasGps 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
                          : "bg-slate-100 border-slate-200 text-slate-600"
                      }`}>
                        <div className="flex items-center space-x-1.5 truncate">
                          <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${msg.hasGps ? "text-emerald-600" : "text-slate-400"}`} />
                          <span className="truncate font-semibold">
                            {msg.hasGps 
                              ? `GPS: ${Number(msg.village.latitude).toFixed(4)}° N, ${Number(msg.village.longitude).toFixed(4)}° E`
                              : (t.mapLocationNotConfigured || "GPS Location Not Configured")}
                          </span>
                        </div>
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                          msg.hasGps ? "bg-emerald-200 text-emerald-900" : "bg-slate-200 text-slate-700"
                        }`}>
                          {msg.hasGps ? "Mapped" : "Pending"}
                        </span>
                      </div>

                      {/* Recent Public Development Works */}
                      {msg.developmentWorks && msg.developmentWorks.length > 0 && (
                        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] space-y-1">
                          <span className="font-extrabold text-amber-900 flex items-center space-x-1">
                            <Layers className="w-3.5 h-3.5 text-amber-700" />
                            <span>{t.developmentFunds || "Public Development Works"}:</span>
                          </span>
                          <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-950">
                            {msg.developmentWorks.slice(0, 2).map((work, idx) => (
                              <li key={idx} className="truncate">
                                {work.purpose} (₹ {Number(work.amount || 0).toLocaleString("en-IN")})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Buttons for Village */}
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (onNavigateToMap) onNavigateToMap(msg.village);
                            handleModalClose();
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-gov-900 hover:bg-gov-800 text-white font-bold text-[11px] transition flex items-center space-x-1 shadow-sm"
                        >
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{t.chatbotViewOnMap || "View on Map"}</span>
                        </button>

                        {msg.hasGps && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${msg.village.latitude},${msg.village.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition flex items-center space-x-1 shadow-sm"
                          >
                            <NavIcon className="w-3 h-3" />
                            <span>{t.chatbotDirections || "Google Maps"}</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectVillageForDetails) onSelectVillageForDetails(msg.village);
                            handleModalClose();
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition flex items-center space-x-1 border border-slate-300"
                        >
                          <Eye className="w-3 h-3 text-slate-600" />
                          <span>{t.chatbotViewDetails || "Details"}</span>
                        </button>
                      </div>

                    </div>
                  )}

                  {/* CASE 2: VILLAGE NOT FOUND FALLBACK SUGGESTION PILLS */}
                  {msg.type === "not_found" && msg.suggestedVillages && (
                    <div className="mt-3 pt-2.5 border-t border-amber-200/60">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        {t.chatbotQuickSuggestions || "Click a village to view official details:"}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedVillages.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => handleSendMessage(v.nameEn)}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-gov-950 font-bold text-xs border border-amber-300 transition shadow-xs flex items-center space-x-1"
                          >
                            <span>{v.nameEn}</span>
                            <span className="text-[10px] text-amber-700">({v.nameKn})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CASE 3: ALL VILLAGES LIST INTENT */}
                  {msg.type === "all_villages" && msg.villagesList && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-1.5">
                        {msg.villagesList.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => handleSendMessage(v.nameEn)}
                            className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition flex items-center justify-between group"
                          >
                            <div>
                              <div className="font-bold text-slate-900 text-xs group-hover:text-gov-900">
                                {v.nameEn}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {v.nameKn} • Ward {v.wardNo}
                              </div>
                            </div>
                            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-gov-900 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {isUser && (
                  <span className="text-[10px] text-slate-400 mt-0.5 mr-1">{msg.timestamp}</span>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white p-3 rounded-2xl w-max border border-slate-200 animate-pulse">
              <Bot className="w-4 h-4 text-amber-500 animate-spin" />
              <span>Searching Gram Panchayat database...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills Bar */}
        <div className="px-4 py-2 bg-slate-100/90 border-t border-slate-200 overflow-x-auto scrollbar-none flex items-center space-x-1.5 flex-shrink-0">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase flex-shrink-0 mr-1 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Fast:</span>
          </span>
          {quickPills.map((pill) => (
            <button
              key={pill.label}
              type="button"
              onClick={() => handleSendMessage(pill.query)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-amber-50 text-slate-700 hover:text-gov-950 text-xs font-semibold border border-slate-200 hover:border-amber-400 transition whitespace-nowrap shadow-xs flex-shrink-0"
            >
              {pill.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleSendMessage("Funds")}
            className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 transition whitespace-nowrap shadow-xs flex-shrink-0"
          >
            💰 Funds
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage("Total Population")}
            className="px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold border border-indigo-300 transition whitespace-nowrap shadow-xs flex-shrink-0"
          >
            👥 Population
          </button>
        </div>

        {/* Voice AI Listening Banner with Audio Waves */}
        {isListening && (
          <div className="px-4 py-2.5 bg-gradient-to-r from-red-500/10 via-amber-500/15 to-red-500/10 border-t border-amber-300 flex items-center justify-between animate-in fade-in duration-150 flex-shrink-0">
            <div className="flex items-center space-x-2.5 min-w-0">
              <span className="relative flex h-3.5 w-3.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600"></span>
              </span>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 truncate">
                  {interimSpeech ? (
                    <span className="text-red-700 font-extrabold italic">"{interimSpeech}"</span>
                  ) : (
                    <span>{t.micListening || `Listening... Speak in ${LANGUAGE_DISPLAY_NAMES[lang] || 'your language'}`}</span>
                  )}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold">
                  🎙️ {t.voiceAssistantActive || "Voice Assistant Listening"} ({LANGUAGE_DISPLAY_NAMES[lang] || lang.toUpperCase()}) — Tap Red Mic to send
                </p>
              </div>
            </div>

            {/* Audio waveform bouncing bars */}
            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
              <span className="w-1.5 h-3.5 bg-red-600 rounded-full animate-bounce [animation-delay:0ms]"></span>
              <span className="w-1.5 h-6 bg-amber-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
              <span className="w-1.5 h-4.5 bg-red-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
              <span className="w-1.5 h-3 bg-amber-600 rounded-full animate-bounce [animation-delay:450ms]"></span>
            </div>
          </div>
        )}

        {/* Voice Processing Status */}
        {voiceStatus === "processing" && (
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 text-xs font-medium text-amber-900 flex items-center space-x-2 animate-pulse flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>{t.micProcessing || "Processing your voice query..."}</span>
          </div>
        )}

        {/* Voice Error Notice with direct Allow Permission and Help action */}
        {voiceErrorMessage && (
          <div className="px-3.5 py-2.5 bg-red-50 border-t border-red-200 text-xs text-red-900 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 flex-shrink-0 animate-in fade-in duration-150">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="text-[11px] leading-tight font-medium text-red-950">
                {voiceErrorMessage}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 flex-shrink-0 ml-auto">
              <button
                type="button"
                onClick={() => setShowMicHelpModal(true)}
                className="px-2 py-1 bg-white hover:bg-slate-100 border border-red-300 text-red-800 rounded-lg font-bold text-[10px] shadow-xs flex items-center space-x-1 transition active:scale-95"
              >
                <HelpCircle className="w-3 h-3 text-red-600" />
                <span>{lang === "kn" ? "ಸಹಾಯ (ಹೇಗೆ?)" : "How to Fix"}</span>
              </button>
              <button
                type="button"
                onClick={handleRequestMicPermission}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[11px] shadow-sm flex items-center space-x-1 transition active:scale-95"
              >
                <Mic className="w-3 h-3" />
                <span>{lang === "kn" ? "ಮೈಕ್ ಅನುಮತಿಸಿ" : "Allow Mic"}</span>
              </button>
              <button
                type="button"
                onClick={() => setVoiceErrorMessage("")}
                className="text-red-500 hover:text-red-700 font-black text-sm p-1 ml-0.5"
                title="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Query Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }} 
          className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center space-x-2 flex-shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              isListening
                ? (t.micListening || `Listening in ${LANGUAGE_DISPLAY_NAMES[lang]}... Speak now`)
                : (t.chatbotPlaceholder || "Type or tap mic to speak (e.g. Shivapura, Funds)...")
            }
            className={`flex-1 px-4 py-2.5 rounded-2xl border text-xs sm:text-sm transition shadow-inner ${
              isListening 
                ? "bg-red-50/50 border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400 text-gov-950 font-medium" 
                : "bg-slate-50 focus:bg-white border-slate-300 focus:ring-2 focus:ring-gov-500 focus:border-gov-500"
            }`}
          />

          {/* Voice Microphone Button */}
          <button
            type="button"
            onClick={toggleVoiceListening}
            className={`p-2.5 rounded-2xl font-bold transition flex items-center justify-center flex-shrink-0 shadow-md ${
              isListening
                ? "bg-red-600 hover:bg-red-700 text-white animate-pulse ring-4 ring-red-400/40"
                : "bg-amber-500 hover:bg-amber-600 text-gov-950 active:scale-95"
            }`}
            title={isListening ? (t.stopSpeaking || "Stop Listening / Send") : (t.micListening || `Speak in ${LANGUAGE_DISPLAY_NAMES[lang]}`)}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-gov-950" />
            )}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="px-4 py-2.5 bg-gov-900 hover:bg-gov-800 disabled:opacity-50 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition flex items-center space-x-1.5 flex-shrink-0 active:scale-95"
          >
            <span>{t.chatbotSend || "Send"}</span>
            <Send className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </form>

        {/* Microphone Permission Guide Popover / Modal */}
        {showMicHelpModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 text-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                    <Mic className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {lang === "kn" ? "ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿಸುವ ವಿಧಾನ" : "Enable Microphone Access"}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {lang === "kn" ? "ಧ್ವನಿ ಸಹಾಯಕ ಬಳಸಲು ಮೈಕ್ ಆನ್ ಮಾಡಿ" : "Allow microphone to speak with Voice AI"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMicHelpModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Special Alert for Insecure Context (HTTP IP on Wi-Fi) */}
              {typeof window !== "undefined" && !isSecureOrigin() && (
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 text-xs text-amber-950 space-y-2">
                  <div className="flex items-center space-x-1.5 font-extrabold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>{lang === "kn" ? "ಸ್ಥಳೀಯ HTTP ವಿಳಾಸ ಕಂಡುಬಂದಿದೆ" : "Notice: Insecure Wi-Fi IP Address"}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-900/90">
                    {lang === "kn"
                      ? `ನೀವು "${window.location.host}" (HTTP) ಮೂಲಕ ತೆರೆದಿದ್ದೀರಿ. ಆಂಡ್ರಾಯ್ಡ್ Chrome ಭದ್ರತೆಯ ಕಾರಣದಿಂದ HTTP ವಿಳಾಸಗಳಲ್ಲಿ ಮೈಕ್ ತಡೆಹಿಡಿಯುತ್ತದೆ.`
                      : `You are opening "${window.location.host}" over HTTP Wi-Fi. Android Chrome restricts microphone on HTTP IP addresses.`
                    }
                  </p>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 text-[11px] space-y-1">
                    <p className="font-bold text-slate-900">
                      {lang === "kn" ? "📱 ಮೊಬೈಲ್ Chrome ನಲ್ಲಿ ಸರಿಪಡಿಸಲು (1 ನಿಮಿಷ):" : "📱 1-Minute Fix in Mobile Chrome:"}
                    </p>
                    <ol className="list-decimal list-inside space-y-0.5 text-slate-700">
                      <li>Open a new tab in Chrome on your phone</li>
                      <li>Go to: <code className="bg-amber-100 px-1 rounded text-amber-900 font-mono text-[10px]">chrome://flags/#unsafely-treat-insecure-origin-as-secure</code></li>
                      <li>Enable it and type: <code className="bg-amber-100 px-1 rounded text-amber-900 font-mono text-[10px]">http://{window.location.host}</code></li>
                      <li>Tap <strong>Relaunch</strong> button!</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Standard Step-by-Step Instructions */}
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-gov-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-bold mb-0.5">
                      {lang === "kn" ? "ವಿಧಾನ 1: Chrome ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಅನ್‌ಬ್ಲಾಕ್ ಮಾಡಿ" : "Method 1: Unblock in Chrome Browser"}
                    </strong>
                    <p className="text-[11px] text-slate-600 leading-normal">
                      {lang === "kn"
                        ? "ಮೇಲಿನ ಅಡ್ರೆಸ್ ಬಾರ್‌ನಲ್ಲಿರುವ 🔒 ಲಾಕ್ ಅಥವಾ ⚙️ ಟ್ಯೂನ್ ಐಕಾನ್ ಒತ್ತಿ → Permissions → Microphone → 'Allow' ಆಯ್ಕೆಮಾಡಿ."
                        : "Tap the 🔒 Lock or ⚙️ Tune icon next to the URL at the top → Permissions → Microphone → select 'Allow'."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-gov-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-bold mb-0.5">
                      {lang === "kn" ? "ವಿಧಾನ 2: ಮೊಬೈಲ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಅನ್‌ಬ್ಲಾಕ್ ಮಾಡಿ" : "Method 2: Phone Android Settings"}
                    </strong>
                    <p className="text-[11px] text-slate-600 leading-normal">
                      {lang === "kn"
                        ? "ಫೋನ್ Settings → Apps → Chrome (ಅಥವಾ GramPanchayat) → Permissions → Microphone → 'Allow only while using app' ಆಯ್ಕೆಮಾಡಿ."
                        : "Go to Phone Settings → Apps → Chrome (or this App) → Permissions → Microphone → select 'Allow only while using the app'."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleRequestMicPermission}
                  className="flex-1 py-2.5 bg-gov-900 hover:bg-gov-800 text-white font-extrabold rounded-2xl text-xs shadow-md flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  <Mic className="w-4 h-4 text-amber-400" />
                  <span>{lang === "kn" ? "ಮೈಕ್ ಪರೀಕ್ಷಿಸಿ & ಆನ್ ಮಾಡಿ" : "Test & Allow Microphone"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMicHelpModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition"
                >
                  {lang === "kn" ? "ಮುಚ್ಚಿ" : "Close"}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VillageChatbotModal;
