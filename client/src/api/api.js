import axios from "axios";

const rawBaseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const getFormattedBaseURL = (url) => {
  if (!url) return "http://localhost:5000/api";
  const trimmed = url.trim().replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const api = axios.create({
    baseURL: getFormattedBaseURL(rawBaseURL),
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;