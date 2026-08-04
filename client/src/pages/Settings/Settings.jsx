import { useState } from "react";
import { FiUser, FiKey, FiCpu, FiCheck } from "react-icons/fi";
import MainLayout from "../../layouts/MainLayout";
import styles from "./Settings.module.css";

function Settings() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [provider, setProvider] = useState(localStorage.getItem("aiProvider") || "gemini");
  const [apiKey, setApiKey] = useState(localStorage.getItem("userApiKey") || localStorage.getItem("geminiApiKey") || "");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("aiProvider", provider);
    if (apiKey.trim()) {
      localStorage.setItem("userApiKey", apiKey.trim());
      localStorage.setItem("geminiApiKey", apiKey.trim());
    } else {
      localStorage.removeItem("userApiKey");
      localStorage.removeItem("geminiApiKey");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Settings & Configuration</h1>
          <div className={styles.subtitle}>
            Manage your account preferences, multi-provider LLM credentials, and engine settings.
          </div>
        </div>

        {/* Profile Card */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <FiUser className={styles.icon} /> User Profile
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="text"
              disabled
              value={user.email || "user@devlens.ai"}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              disabled
              value={user.full_name || "DevLens User"}
              className={styles.input}
            />
          </div>
        </div>

        {/* Universal Multi-Provider AI Configuration */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <FiKey className={styles.icon} /> Multi-Provider LLM Configuration
          </div>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0, lineHeight: "1.5" }}>
            DevLens AI supports <strong>Google Gemini</strong>, <strong>OpenAI (ChatGPT)</strong>, <strong>Groq (Llama 3)</strong>, or custom OpenAI-compatible API keys.
          </p>

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px" }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>AI Model Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className={styles.input}
                style={{ background: "#0f1117", cursor: "pointer" }}
              >
                <option value="gemini">Google Gemini (gemini-2.0-flash / 1.5-pro)</option>
                <option value="openai">OpenAI (gpt-4o / gpt-4o-mini)</option>
                <option value="groq">Groq (llama-3.3-70b / mixtral-8x7b)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>API Key</label>
              <input
                type="password"
                placeholder={
                  provider === "openai" ? "sk-..." : provider === "groq" ? "gsk_..." : "AIzaSy..."
                }
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.saveBtn}>
              <FiCheck /> {saved ? "Saved Preferences!" : "Save Provider & API Key"}
            </button>
          </form>
        </div>

        {/* System Information */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <FiCpu className={styles.icon} /> System & Engine Info
          </div>

          <div className={styles.infoRow}>
            <span>DevLens Platform</span>
            <span className={styles.infoVal}>v1.0.0 (Universal Multi-LLM)</span>
          </div>
          <div className={styles.infoRow}>
            <span>Supported LLM Providers</span>
            <span className={styles.infoVal}>Gemini, OpenAI, Groq</span>
          </div>
          <div className={styles.infoRow}>
            <span>Database Engine</span>
            <span className={styles.infoVal}>PostgreSQL</span>
          </div>
          <div className={styles.infoRow}>
            <span>Dynamic Code Fallback</span>
            <span className={styles.infoVal}>Active</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Settings;
