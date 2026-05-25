import axios from "axios";

/** Same origin in production (Flask serves UI). Local dev uses .env.development */
export const API_BASE =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://127.0.0.1:5000");

export const api = axios.create({ baseURL: API_BASE });

export const uploadsUrl = (filename) =>
  `${API_BASE}/uploads/documents/${filename}`;
