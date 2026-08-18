import axios from "axios";
import { API_BASE_URL, TOKEN_KEY } from "../lib/utils";
import { beginSlowRequest, endSlowRequest } from "../lib/serverStatus";

// Render free tier can take 30-50s to wake from sleep. If a request takes
// longer than this to respond, we assume that's what's happening and show
// the wake banner rather than let the app look frozen or crashed.
const SLOW_REQUEST_THRESHOLD_MS = 3500;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config._slowTimer = setTimeout(() => {
    config._firedSlow = true;
    beginSlowRequest();
  }, SLOW_REQUEST_THRESHOLD_MS);
  return config;
});

const clearSlowTracking = (config) => {
  if (!config) return;
  if (config._slowTimer) clearTimeout(config._slowTimer);
  if (config._firedSlow) endSlowRequest();
};

api.interceptors.response.use(
  (response) => {
    clearSlowTracking(response.config);
    return response;
  },
  (error) => {
    clearSlowTracking(error.config);
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;