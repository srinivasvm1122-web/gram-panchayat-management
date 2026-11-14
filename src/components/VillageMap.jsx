import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  MapPin, 
  Navigation as NavIcon, 
  ExternalLink, 
  Layers, 
  Info, 
  Edit3, 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Eye, 
  X, 
  Save, 
  Crosshair, 
  RotateCcw,
  Building2,
  Users,
  Home,
  ShieldCheck,
  Smartphone,
  ChevronRight
} from "lucide-react";

// Official known reference coordinates for the 10 Karnataka Gram Panchayat wards
// Used only as an optional helper for authorized Officers if they wish to apply standard ward reference points
export const KARNATAKA_WARD_COORDINATES_REFERENCE = {
  "VIL-001": { lat: 13.0970, lng: 77.3870, name: "Shivapura HQ" },
  "VIL-002": { lat: 13.1120, lng: 77.4050, name: "Doddakallahalli" },
  "VIL-003": { lat: 13.0850, lng: 77.3720, name: "Malleshwara" },
  "VIL-004": { lat: 12.7209, lng: 77.2799, name: "Ramanagara" },
  "VIL-005": { lat: 13.0910, lng: 77.3950, name: "Gandhinagar" },
  "VIL-006": { lat: 13.0030, lng: 77.6960, name: "Krishnarajapura" },
  "VIL-007": { lat: 13.0990, lng: 77.3790, name: "Nelamangala" },
  "VIL-008": { lat: 13.2484, lng: 77.7126, name: "Devanahalli" },
  "VIL-009": { lat: 13.0540, lng: 77.4200, name: "Someshwara" },
  "VIL-010": { lat: 13.0780, lng: 77.3620, name: "Kempegowda Nagar" }
};

// Check if a village has valid configured coordinates
export const isValidCoordinate = (lat, lng) => {
  if (lat === null || lat === undefined || lng === null || lng === undefined) return false;
  const nLat = Number(lat);
  const nLng = Number(lng);
  return !isNaN(nLat) && !isNaN(nLng) && nLat >= -90 && nLat <= 90 && nLng >= -180 && nLng <= 180 && (nLat !== 0 || nLng !== 0);
};

export const VillageMap = ({
  villages = [],
  t = {},
  lang = "en",
  isOfficer = false,
  onUpdateVillage,
  onSelectVillageForDetails
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const activeTileLayerRef = useRef(null);

  // Map state
  const [mapType, setMapType] = useState("google_streets"); // "google_streets" | "google_satellite" | "osm"
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" | "mapped" | "unmapped"
  const [selectedVillage, setSelectedVillage] = useState(null);

  // Officer Edit Coordinates Modal State
  const [editingVillage, setEditingVillage] = useState(null);
  const [editLat, setEditLat] = useState("");
  const [editLng, setEditLng] = useState("");
  const [geoLocating, setGeoLocating] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccessMsg, setEditSuccessMsg] = useState("");

  // Categorize villages
  const mappedVillages = villages.filter(v => isValidCoordinate(v.latitude, v.longitude));
  const unmappedVillages = villages.filter(v => !isValidCoordinate(v.latitude, v.longitude));

  // Filtered list based on search and tab
  const filteredVillages = villages.filter(v => {
    const matchesSearch = 
      v.nameEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.nameKn?.includes(searchQuery) ||
      `ward ${v.wardNo}`.includes(searchQuery.toLowerCase()) ||
      v.id?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === "mapped") return isValidCoordinate(v.latitude, v.longitude);
    if (filterType === "unmapped") return !isValidCoordinate(v.latitude, v.longitude);
    return true;
  });

  // Tile layer configurations
  const getTileUrl = (type) => {
    switch (type) {
      case "google_satellite":
        return "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
      case "osm":
        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      case "google_streets":
      default:
        return "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
    }
  };

  const getTileAttribution = (type) => {
    switch (type) {
      case "google_satellite":
        return '&copy; <a href="https://maps.google.com">Google Maps Satellite</a>';
      case "osm":
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
      case "google_streets":
      default:
        return '&copy; <a href="https://maps.google.com">Google Maps</a>';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map is already initialized
    if (!mapInstanceRef.current) {
      // Default center: Karnataka Gram Panchayat area (Nelamangala / Bengaluru Rural HQ)
      const defaultCenter = [13.0970, 77.3870];
      const defaultZoom = 11;

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false,
        attributionControl: true
      });

      // Add Zoom Control at bottom right for thumb accessibility on mobile
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Add Tile Layer
      const tileLayer = L.tileLayer(getTileUrl(mapType), {
        attribution: getTileAttribution(mapType),
        maxZoom: 20
      }).addTo(map);
      activeTileLayerRef.current = tileLayer;

      // Create a layer group for markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      mapInstanceRef.current = map;
    }

    return () => {
      // Clean up map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when mapType changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (activeTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(activeTileLayerRef.current);
    }
    const newTileLayer = L.tileLayer(getTileUrl(mapType), {
      attribution: getTileAttribution(mapType),
      maxZoom: 20
    }).addTo(mapInstanceRef.current);
    activeTileLayerRef.current = newTileLayer;
  }, [mapType]);

  // Update Markers whenever villages list changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    const bounds = L.latLngBounds();
    let hasValidBounds = false;

    mappedVillages.forEach(village => {
      const lat = Number(village.latitude);
      const lng = Number(village.longitude);

      bounds.extend([lat, lng]);
      hasValidBounds = true;

      // Custom styled Karnataka Panchayat marker icon
      const customIcon = L.divIcon({
        className: "custom-panchayat-marker",
        html: `
          <div style="
            position: relative;
            transform: translate(-50%, -100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
          ">
            <div style="
              background: linear-gradient(135deg, #091e3a 0%, #173b6c 100%);
              border: 2.5px solid #f59e0b;
              color: #ffffff;
              padding: 4px 8px;
              border-radius: 12px;
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 11px;
              font-weight: 800;
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span style="background: #f59e0b; color: #091e3a; font-size: 9px; font-weight: 900; padding: 1px 4px; border-radius: 4px;">
                W-${village.wardNo}
              </span>
              <span>${lang === "kn" ? village.nameKn : village.nameEn}</span>
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 8px solid #f59e0b;
              margin-top: -1px;
            "></div>
            <div style="
              width: 8px;
              height: 8px;
              background: #f59e0b;
              border: 2px solid #091e3a;
              border-radius: 50%;
              margin-top: -4px;
            "></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Directions URL in Google Maps
      const gmapsDirUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

      // Build Popup Content
      const popupDiv = document.createElement("div");
      popupDiv.className = "p-1 min-w-[240px]";
      popupDiv.innerHTML = `
        <div style="font-family: system-ui, sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">
            <div>
              <span style="background: #0f172a; color: #f59e0b; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; text-transform: uppercase;">
                Ward ${village.wardNo} • ${village.id}
              </span>
              <h4 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 4px 0 0 0;">
                ${village.nameEn} (${village.nameKn})
              </h4>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px; font-size: 11px;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px; border-radius: 8px;">
              <span style="color: #64748b; font-size: 10px; display: block;">Population</span>
              <strong style="color: #0f172a; font-size: 13px;">${(Number(village.totalPopulation) || 0).toLocaleString()}</strong>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px; border-radius: 8px;">
              <span style="color: #64748b; font-size: 10px; display: block;">Total Families</span>
              <strong style="color: #0f172a; font-size: 13px;">${(Number(village.totalFamilies) || 0).toLocaleString()}</strong>
            </div>
          </div>

          <div style="font-size: 11px; color: #334155; margin-bottom: 8px; line-height: 1.4;">
            <div><strong>Sarpanch:</strong> ${village.sarpanchName || "Official Representative"}</div>
            <div><strong>Rations:</strong> BPL: ${village.bplCardCount} | APL: ${village.aplCardCount}</div>
            <div style="color: #0284c7; font-family: monospace; font-size: 10px; margin-top: 3px;">
              GPS: ${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 5px; margin-top: 8px;">
            <button id="btn-details-${village.id}" style="
              width: 100%;
              padding: 6px 10px;
              background: #0f172a;
              color: #ffffff;
              font-weight: 700;
              font-size: 11px;
              border: none;
              border-radius: 8px;
              cursor: pointer;
            ">
              ${t.viewDetails || "View Details"}
            </button>
            <a href="${gmapsDirUrl}" target="_blank" rel="noopener noreferrer" style="
              width: 100%;
              text-align: center;
              padding: 6px 10px;
              background: #10b981;
              color: #ffffff;
              font-weight: 700;
              font-size: 11px;
              border-radius: 8px;
              text-decoration: none;
              box-sizing: border-box;
            ">
              ${t.mapOpenDirections || "Open Directions in Google Maps"}
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupDiv, { maxWidth: 300 });

      // Handle popup open
      marker.on("popupopen", () => {
        setSelectedVillage(village);
        const detailsBtn = document.getElementById(`btn-details-${village.id}`);
        if (detailsBtn) {
          detailsBtn.onclick = () => {
            if (onSelectVillageForDetails) {
              onSelectVillageForDetails(village);
            }
          };
        }
      });

      marker.on("click", () => {
        setSelectedVillage(village);
      });

      markersLayerRef.current.addLayer(marker);
    });

    // Auto-fit bounds if we have mapped villages
    if (hasValidBounds && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [villages, lang, onSelectVillageForDetails]);

  // Handle flyTo when clicking a village in directory list
  const handleFlyToVillage = (village) => {
    if (!mapInstanceRef.current) return;
    if (isValidCoordinate(village.latitude, village.longitude)) {
      const lat = Number(village.latitude);
      const lng = Number(village.longitude);
      mapInstanceRef.current.flyTo([lat, lng], 14, { duration: 1.5 });
      setSelectedVillage(village);

      // Scroll to map smoothly on mobile
      if (window.innerWidth < 1024 && mapContainerRef.current) {
        mapContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      setSelectedVillage(village);
    }
  };

  // Center map on all villages
  const handleResetMapView = () => {
    if (!mapInstanceRef.current) return;
    if (mappedVillages.length > 0) {
      const bounds = L.latLngBounds();
      mappedVillages.forEach(v => bounds.extend([Number(v.latitude), Number(v.longitude)]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    } else {
      mapInstanceRef.current.setView([13.0970, 77.3870], 11);
    }
  };

  // Officer Edit Coordinates Handlers
  const handleOpenEditModal = (village) => {
    if (!isOfficer) return;
    setEditingVillage(village);
    setEditLat(village.latitude !== null && village.latitude !== undefined ? String(village.latitude) : "");
    setEditLng(village.longitude !== null && village.longitude !== undefined ? String(village.longitude) : "");
    setEditError("");
    setEditSuccessMsg("");
  };

  const handleCaptureDeviceGps = () => {
    if (!navigator.geolocation) {
      setEditError("Geolocation is not supported by your browser or device.");
      return;
    }
    setGeoLocating(true);
    setEditError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLocating(false);
        setEditLat(position.coords.latitude.toFixed(6));
        setEditLng(position.coords.longitude.toFixed(6));
        setEditSuccessMsg("Current device GPS coordinates captured successfully!");
      },
      (error) => {
        setGeoLocating(false);
        setEditError(`GPS error: ${error.message}. Please allow location permission in your browser.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleApplyPresetCoordinates = () => {
    if (!editingVillage) return;
    const ref = KARNATAKA_WARD_COORDINATES_REFERENCE[editingVillage.id];
    if (ref) {
      setEditLat(String(ref.lat));
      setEditLng(String(ref.lng));
      setEditSuccessMsg(`Loaded official ${ref.name} center reference coordinates.`);
    }
  };

  const handleSaveCoordinates = () => {
    if (!editingVillage || !onUpdateVillage) return;
    setEditError("");

    const numLat = parseFloat(editLat.trim());
    const numLng = parseFloat(editLng.trim());

    if (isNaN(numLat) || isNaN(numLng)) {
      setEditError("Please enter valid decimal coordinates (e.g. Latitude: 13.0970, Longitude: 77.3870).");
      return;
    }

    if (numLat < -90 || numLat > 90) {
      setEditError("Latitude must be between -90 and 90 degrees.");
      return;
    }

    if (numLng < -180 || numLng > 180) {
      setEditError("Longitude must be between -180 and 180 degrees.");
      return;
    }

    const updated = {
      ...editingVillage,
      latitude: numLat,
      longitude: numLng
    };

    onUpdateVillage(updated);
    setEditingVillage(null);
  };

  const handleClearCoordinates = () => {
    if (!editingVillage || !onUpdateVillage) return;
    const updated = {
      ...editingVillage,
      latitude: null,
      longitude: null
    };
    onUpdateVillage(updated);
    setEditingVillage(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-gov-950 via-gov-900 to-gov-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>GIS & GPS Geographic Map</span>
              </span>
              <span className="text-xs text-sky-200">
                • 10 Gram Panchayat Wards
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {t.mapTitle || "10 Gram Panchayat Villages GIS Map"}
            </h2>
            <p className="text-xs sm:text-sm text-sky-200 max-w-2xl leading-relaxed">
              {t.mapSubtitle || "Interactive geographic information system (GIS) mapping for all 10 Gram Panchayat wards with live GPS coordinates, demographic profiles and Google Maps directions."}
            </p>
          </div>

          {/* Quick Stat Indicators */}
          <div className="flex flex-wrap items-center gap-2.5 bg-gov-900/80 p-3 rounded-2xl border border-slate-700/60 self-start md:self-auto">
            <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
              <span className="text-[10px] text-emerald-300 font-bold block uppercase tracking-wider">
                {t.mapTotalMapped || "GPS Mapped"}
              </span>
              <span className="text-lg font-black text-emerald-400">
                {mappedVillages.length} / {villages.length}
              </span>
            </div>

            <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
              <span className="text-[10px] text-amber-300 font-bold block uppercase tracking-wider">
                {t.mapTotalUnmapped || "Unmapped"}
              </span>
              <span className="text-lg font-black text-amber-400">
                {unmappedVillages.length}
              </span>
            </div>
          </div>
        </div>

        {/* Public vs Officer Banner */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs gap-2">
          {isOfficer ? (
            <div className="flex items-center space-x-2 text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>Officer Privileges Active:</strong> You can add, edit, or capture real-time GPS coordinates for all 10 villages.
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-sky-200">
              <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span>
                <strong>Public Citizen View:</strong> Interactive exploration and Google Maps directions. Coordinate editing is restricted to authorized Officers.
              </span>
            </div>
          )}

          <div className="flex items-center space-x-2 text-slate-300 text-[11px]">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Mobile & Android Touch Optimized</span>
          </div>
        </div>
      </div>

      {/* Map Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Layer Switchers */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setMapType("google_streets")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              mapType === "google_streets"
                ? "bg-gov-900 text-white shadow-sm"
                : "text-slate-600 hover:text-gov-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.mapStreets || "Google Streets"}</span>
          </button>

          <button
            onClick={() => setMapType("google_satellite")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              mapType === "google_satellite"
                ? "bg-gov-900 text-white shadow-sm"
                : "text-slate-600 hover:text-gov-900"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.mapSatellite || "Google Satellite"}</span>
          </button>

          <button
            onClick={() => setMapType("osm")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              mapType === "osm"
                ? "bg-gov-900 text-white shadow-sm"
                : "text-slate-600 hover:text-gov-900"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.mapOpenStreet || "Standard"}</span>
          </button>
        </div>

        {/* Center / Reset View Button */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleResetMapView}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
            title="Center Map on all 10 villages"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === "kn" ? "ಮಧ್ಯಕ್ಕೆ ಹೊಂದಿಸಿ" : "Fit All Villages"}</span>
          </button>
        </div>
      </div>

      {/* Main Map Canvas */}
      <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200">
        
        {/* Leaflet DOM container */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-[450px] sm:h-[520px] md:h-[580px] z-10"
          style={{ touchAction: "pan-x pan-y" }}
        />

        {/* Floating Quick Action Overlay on Map */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200 pointer-events-auto text-xs font-semibold text-slate-800 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{mappedVillages.length} of 10 Villages Active on Map</span>
          </div>
        </div>

        {/* Notice overlay if some villages lack coordinates */}
        {unmappedVillages.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-20 pointer-events-none max-w-md">
            <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-amber-200 pointer-events-auto text-xs text-slate-800 space-y-1">
              <div className="font-bold flex items-center space-x-1 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Notice: No Fake Coordinates Used</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                {unmappedVillages.length} village location(s) are not configured yet. Fake random pins are strictly avoided.
                {isOfficer ? " Use the directory below to configure their official coordinates." : " Only authorized officers can input coordinates."}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Directory & Village Selector List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        
        {/* Filter and Search Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-gov-800" />
              <span>{t.mapAllVillagesList || "All 10 Villages Directory"}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {t.mapClickMarkerPrompt || "Click any village to navigate on map, open Google Maps directions, or edit coordinates."}
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "kn" ? "ಗ್ರಾಮದ ಹೆಸರು ಹುಡುಕಿ..." : "Search village..."}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-gov-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setFilterType("all")}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  filterType === "all" ? "bg-white text-gov-900 shadow-sm" : "text-slate-500"
                }`}
              >
                All ({villages.length})
              </button>
              <button
                onClick={() => setFilterType("mapped")}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  filterType === "mapped" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-500"
                }`}
              >
                Mapped ({mappedVillages.length})
              </button>
              <button
                onClick={() => setFilterType("unmapped")}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  filterType === "unmapped" ? "bg-white text-amber-800 shadow-sm" : "text-slate-500"
                }`}
              >
                Unmapped ({unmappedVillages.length})
              </button>
            </div>
          </div>
        </div>

        {/* 10 Villages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {filteredVillages.map((village) => {
            const hasGps = isValidCoordinate(village.latitude, village.longitude);
            const isSelected = selectedVillage?.id === village.id;
            const gmapsUrl = hasGps 
              ? `https://www.google.com/maps/dir/?api=1&destination=${village.latitude},${village.longitude}`
              : null;

            return (
              <div 
                key={village.id}
                className={`rounded-2xl border p-4 transition-all duration-200 space-y-3 ${
                  isSelected 
                    ? "border-amber-400 bg-amber-50/40 shadow-md ring-1 ring-amber-400"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gov-800 bg-gov-100 px-2 py-0.5 rounded-md">
                      Ward {village.wardNo} • {village.id}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-base mt-1">
                      {village.nameEn}
                    </h4>
                    <p className="text-xs text-slate-500 font-kannada">
                      {village.nameKn}
                    </p>
                  </div>

                  {/* Status Badge */}
                  {hasGps ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{t.mapLocationConfigured || "GPS Configured"}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>{t.mapLocationNotConfigured || "Not Configured"}</span>
                    </span>
                  )}
                </div>

                {/* Demographic Mini Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs py-1">
                  <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center space-x-2">
                    <Users className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Population</span>
                      <span className="font-bold text-slate-800">{(Number(village.totalPopulation) || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center space-x-2">
                    <Home className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Families</span>
                      <span className="font-bold text-slate-800">{(Number(village.totalFamilies) || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* GPS Coordinates or Unconfigured Notice */}
                {hasGps ? (
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 font-mono flex items-center justify-between">
                    <span>GPS: {Number(village.latitude).toFixed(4)}°, {Number(village.longitude).toFixed(4)}°</span>
                    <span className="text-[10px] text-emerald-700 font-sans font-bold">Active</span>
                  </div>
                ) : (
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug">
                    <span className="font-bold block mb-0.5">Location Not Configured:</span>
                    <span>{t.mapNotConfiguredMsg || "GPS coordinates for this village have not been mapped yet. No fake coordinates are shown."}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-1.5">
                  {/* Fly to on map */}
                  {hasGps && (
                    <button
                      onClick={() => handleFlyToVillage(village)}
                      className="px-2.5 py-1.5 rounded-lg bg-gov-900 hover:bg-gov-800 text-white text-xs font-bold transition flex items-center space-x-1"
                      title="Fly to marker on map"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.pageVillageMap || "View on Map"}</span>
                    </button>
                  )}

                  {/* Directions via Google Maps */}
                  {hasGps && (
                    <a
                      href={gmapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1"
                      title="Open Google Maps Route Directions"
                    >
                      <NavIcon className="w-3.5 h-3.5" />
                      <span>{t.mapOpenDirections ? (t.mapOpenDirections.split(" ")[0] || "Directions") : "Directions"}</span>
                    </a>
                  )}

                  {/* View Details Modal Trigger */}
                  <button
                    onClick={() => onSelectVillageForDetails && onSelectVillageForDetails(village)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition flex items-center space-x-1"
                    title="View full demographic profile"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>{t.viewDetails || "Details"}</span>
                  </button>

                  {/* Officer Only: Add/Edit GPS Coordinates */}
                  {isOfficer && (
                    <button
                      onClick={() => handleOpenEditModal(village)}
                      className="ml-auto px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-gov-950 text-xs font-extrabold transition flex items-center space-x-1 shadow-sm"
                      title="Authorized Officer: Configure GPS coordinates"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{hasGps ? (t.mapEditCoordinates || "Edit GPS") : (t.mapAddCoordinates || "+ Add GPS")}</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* OFFICER ONLY: EDIT VILLAGE GPS COORDINATES MODAL */}
      {isOfficer && editingVillage && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    {t.mapTitle || "Manage Village GPS Coordinates"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingVillage.nameEn} ({editingVillage.nameKn}) • Ward {editingVillage.wardNo}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingVillage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error or Success Notice */}
            {editError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            {editSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{editSuccessMsg}</span>
              </div>
            )}

            {/* Coordinates Input Form */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.mapLatitude || "Latitude"} *
                </label>
                <input
                  type="text"
                  value={editLat}
                  onChange={(e) => setEditLat(e.target.value)}
                  placeholder="e.g. 13.0970"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono bg-slate-50 focus:bg-white focus:ring-2 focus:ring-gov-500"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Decimal degree format (-90 to 90)</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.mapLongitude || "Longitude"} *
                </label>
                <input
                  type="text"
                  value={editLng}
                  onChange={(e) => setEditLng(e.target.value)}
                  placeholder="e.g. 77.3870"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono bg-slate-50 focus:bg-white focus:ring-2 focus:ring-gov-500"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Decimal degree format (-180 to 180)</span>
              </div>
            </div>

            {/* Helper Action Buttons */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase block">
                Officer GPS Assistant Tools:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCaptureDeviceGps}
                  disabled={geoLocating}
                  className="px-3 py-1.5 rounded-xl bg-gov-900 hover:bg-gov-800 text-white text-xs font-bold transition flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                  <span>{geoLocating ? "Reading GPS..." : (t.mapUseDeviceGps || "Use Device GPS")}</span>
                </button>

                {KARNATAKA_WARD_COORDINATES_REFERENCE[editingVillage.id] && (
                  <button
                    type="button"
                    onClick={handleApplyPresetCoordinates}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-gov-950 text-xs font-bold transition flex items-center space-x-1.5"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{t.mapPresetNotice || "Load Ward Center Reference"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              {isValidCoordinate(editingVillage.latitude, editingVillage.longitude) ? (
                <button
                  type="button"
                  onClick={handleClearCoordinates}
                  className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition"
                >
                  {t.mapResetCoordinates || "Clear Location"}
                </button>
              ) : <div></div>}

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingVillage(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  {t.cancel || "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={handleSaveCoordinates}
                  className="px-5 py-2 rounded-xl bg-gov-900 hover:bg-gov-800 text-white text-xs font-extrabold transition flex items-center space-x-1.5 shadow-md"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.mapSaveCoordinates || "Save Coordinates"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
