import { API_BASE } from "../config/api";

export const getSchemes = async () => {
  const res = await fetch(`${API_BASE}/api/schemes`);
  return res.json();
};

export const getSchemeById = async (id) => {
  const res = await fetch(`${API_BASE}/api/schemes/${id}`);
  return res.json();
};

export const applyScheme = async (data) => {
  const res = await fetch(`${API_BASE}/api/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};
