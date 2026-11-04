// MongoDB API Service for Gram Panchayat Digital Management System
// Connects to local/cloud Express backend which communicates with MongoDB Atlas

const API_BASE = "/api";

export const getDbStatus = async () => {
  try {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      connected: false,
      error: err.message,
      message: "Backend server offline or unreachable. Using local storage."
    };
  }
};

export const seedDatabase = async () => {
  try {
    const res = await fetch(`${API_BASE}/seed`, { method: "POST" });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const fetchVillagesFromDb = async () => {
  try {
    const res = await fetch(`${API_BASE}/villages`);
    if (!res.ok) throw new Error("Failed to fetch villages");
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const saveVillageToDb = async (village) => {
  try {
    const res = await fetch(`${API_BASE}/villages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(village)
    });
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const updateVillageInDb = async (village) => {
  try {
    const res = await fetch(`${API_BASE}/villages/${village.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(village)
    });
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const deleteVillageFromDb = async (villageId) => {
  try {
    const res = await fetch(`${API_BASE}/villages/${villageId}`, {
      method: "DELETE"
    });
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const fetchMembersFromDb = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/members?${query}`);
    if (!res.ok) throw new Error("Failed to fetch members");
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const saveMemberToDb = async (member) => {
  try {
    const res = await fetch(`${API_BASE}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member)
    });
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const updateMemberInDb = async (member) => {
  try {
    const res = await fetch(`${API_BASE}/members/${member.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member)
    });
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const deleteMemberFromDb = async (memberId) => {
  try {
    const res = await fetch(`${API_BASE}/members/${memberId}`, {
      method: "DELETE"
    });
    return await res.json();
  } catch (e) {
    return null;
  }
};
