import axios from "axios";

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

/*
|--------------------------------------------------------------------------
| Automatically Attach JWT Token
|--------------------------------------------------------------------------
*/

API.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");
    const aiApiKey = localStorage.getItem("userApiKey") || localStorage.getItem("geminiApiKey");
    const aiProvider = localStorage.getItem("aiProvider") || "gemini";

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (aiApiKey) {
        config.headers["x-ai-api-key"] = aiApiKey;
        config.headers["x-gemini-api-key"] = aiApiKey;
    }

    if (aiProvider) {
        config.headers["x-ai-provider"] = aiProvider;
    }

    return config;

});

/*
|--------------------------------------------------------------------------
| Authentication APIs
|--------------------------------------------------------------------------
*/

/**
 * Register User
 */

export const registerUser = (userData) => {

    return API.post("/auth/register", userData);

};

/**
 * Login User
 */

export const loginUser = (credentials) => {

    return API.post("/auth/login", credentials);

};

/**
 * Get Current User Profile
 */

export const getProfile = () => {

    return API.get("/auth/profile");

};

/**
 * Logout User
 */

export const logoutUser = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

};

export default API;