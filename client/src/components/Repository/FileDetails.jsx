import { useState, useEffect, useRef } from "react";
import { FiFile, FiCopy, FiCheck, FiCpu, FiMessageSquare, FiSend, FiUser, FiCode } from "react-icons/fi";
import { getFileContent, getFileAISummary, sendFileChatMessage } from "../../services/repository.service";
import styles from "./FileDetails.module.css";

function FileDetails({ file, repoId }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Summary state
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Active View Tab: "code" | "fileChat"
  const [activeTab, setActiveTab] = useState("code");

  // File Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const fileChatChips = [
    "How does this file work?",
    "Check for security vulnerabilities",
    "How can I refactor this file?"
  ];

  useEffect(() => {
    setAiSummary(null);
    setActiveTab("code");
    setChatMessages([
      {
        sender: "ai",
        text: `Ask me any question about "${file?.file_name || file?.file_path || "this file"}". I have analyzed its source code.`
      }
    ]);

    if (!file || !file.file_path) {
      setContent("");
      return;
    }

    const targetRepoId = file.repo_id || repoId;
    if (!targetRepoId) return;

    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await getFileContent(targetRepoId, file.file_path);
        setContent(response.data.content || "");
      } catch (error) {
        console.error("Failed to load file content:", error);
        setContent(`// Unable to load live content for ${file.file_path}\n// File may be binary or unavailable.`);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [file, repoId]);

  useEffect(() => {
    if (activeTab === "fileChat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab]);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateSummary = async () => {
    const targetRepoId = file?.repo_id || repoId;
    if (!targetRepoId || !content) return;

    setAiLoading(true);
    try {
      const res = await getFileAISummary(targetRepoId, file.file_path, content);
      setAiSummary(res.data.summary);
    } catch (err) {
      console.error("Failed to generate file summary:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendFileChat = async (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim() || chatLoading || !content) return;

    const targetRepoId = file?.repo_id || repoId;
    const userMsg = { sender: "user", text: query };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput("");
    setChatLoading(true);

    try {
      const res = await sendFileChatMessage(targetRepoId, file.file_path, content, query);
      const reply = res.data.reply || "Analyzed file source code.";
      setChatMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    } catch (err) {
      console.error("File chat error:", err);
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, I ran into an issue analyzing this file's code. Please try again." }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (!file) {
    return (
      <div className={styles.detailsContainer}>
        <div className={styles.emptyState}>
          <FiFile className={styles.emptyIcon} />
          <div className={styles.emptyTitle}>No File Selected</div>
          <div className={styles.emptyDesc}>
            Select a file from the repository tree on the left to inspect its source code, AI summary, or chat with AI.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <FiFile style={{ color: "#32c2bf", fontSize: "20px" }} />
          <div>
            <div className={styles.fileName}>{file.file_name || file.file_path?.split("/").pop()}</div>
            <div className={styles.filePath}>{file.file_path}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {content && (
            <button
              onClick={handleGenerateSummary}
              disabled={aiLoading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(50, 194, 191, 0.15)",
                border: "1px solid rgba(50, 194, 191, 0.3)",
                color: "#32c2bf",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              <FiCpu />
              {aiLoading ? "Generating..." : "✨ AI Summary"}
            </button>
          )}

          {content && (
            <button
              onClick={handleCopy}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#e5e7eb",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              {copied ? <FiCheck style={{ color: "#22c55e" }} /> : <FiCopy />}
              {copied ? "Copied" : "Copy Code"}
            </button>
          )}
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <button
          onClick={() => setActiveTab("code")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "8px",
            background: activeTab === "code" ? "rgba(50, 194, 191, 0.15)" : "rgba(255, 255, 255, 0.03)",
            border: `1px solid ${activeTab === "code" ? "#32c2bf" : "rgba(255, 255, 255, 0.08)"}`,
            color: activeTab === "code" ? "#32c2bf" : "#9ca3af",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "pointer"
          }}
        >
          <FiCode /> Source Code
        </button>

        <button
          onClick={() => setActiveTab("fileChat")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "8px",
            background: activeTab === "fileChat" ? "rgba(49, 91, 255, 0.15)" : "rgba(255, 255, 255, 0.03)",
            border: `1px solid ${activeTab === "fileChat" ? "#315bff" : "rgba(255, 255, 255, 0.08)"}`,
            color: activeTab === "fileChat" ? "#60a5fa" : "#9ca3af",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "pointer"
          }}
        >
          <FiMessageSquare /> Chat about this File
        </button>
      </div>

      <div className={styles.metaGrid}>
        <div className={styles.metaCard}>
          <div className={styles.metaLabel}>Language</div>
          <div className={styles.metaValue}>{file.language || file.file_extension || "Plain Text"}</div>
        </div>
        <div className={styles.metaCard}>
          <div className={styles.metaLabel}>Extension</div>
          <div className={styles.metaValue}>{file.file_extension || "N/A"}</div>
        </div>
        <div className={styles.metaCard}>
          <div className={styles.metaLabel}>Size</div>
          <div className={styles.metaValue}>{file.size || "N/A"}</div>
        </div>
        <div className={styles.metaCard}>
          <div className={styles.metaLabel}>Lines</div>
          <div className={styles.metaValue}>
            {loading ? "..." : content ? content.split("\n").length : 0}
          </div>
        </div>
      </div>

      {aiSummary && activeTab === "code" && (
        <div
          style={{
            marginBottom: "16px",
            padding: "14px 16px",
            background: "rgba(50, 194, 191, 0.08)",
            border: "1px solid rgba(50, 194, 191, 0.25)",
            borderRadius: "12px",
            color: "#e5e7eb"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#32c2bf", fontWeight: "700", marginBottom: "8px" }}>
            <FiCpu /> AI Code Analysis
          </div>
          <p style={{ margin: "0 0 10px 0", fontSize: "13px", lineHeight: "1.5" }}>
            {aiSummary.purpose}
          </p>
          {aiSummary.keyFunctions && aiSummary.keyFunctions.length > 0 && (
            <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>
              <strong>Exports & Key Functions:</strong> {aiSummary.keyFunctions.join(", ")}
            </div>
          )}
          {aiSummary.dependencies && aiSummary.dependencies.length > 0 && (
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
              <strong>Modules Used:</strong> {aiSummary.dependencies.join(", ")}
            </div>
          )}
        </div>
      )}

      {activeTab === "code" ? (
        <div className={styles.contentArea}>
          {loading ? (
            <div style={{ color: "#6b7280", padding: "16px" }}>Loading file content...</div>
          ) : (
            <pre className={styles.codePre}>
              {content || `// File is empty or binary.`}
            </pre>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "450px",
            background: "#0f1117",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            overflow: "hidden"
          }}
        >
          <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%"
                }}
              >
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: msg.sender === "user" ? "rgba(49, 91, 255, 0.2)" : "rgba(50, 194, 191, 0.2)",
                    color: msg.sender === "user" ? "#60a5fa" : "#32c2bf",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    flexShrink: 0
                  }}
                >
                  {msg.sender === "user" ? <FiUser /> : <FiCpu />}
                </div>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: msg.sender === "user" ? "#315bff" : "#1c1f26",
                    color: "#ffffff",
                    fontSize: "13px",
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: "flex", gap: "10px", color: "#6b7280", fontSize: "13px", padding: "8px" }}>
                <FiCpu style={{ color: "#32c2bf" }} /> Analyzing file code...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ display: "flex", gap: "6px", padding: "8px 12px", overflowX: "auto", borderTop: "1px solid rgba(255, 255, 255, 0.04)" }}>
            {fileChatChips.map((chip, idx) => (
              <span
                key={idx}
                onClick={() => handleSendFileChat(chip)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "14px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#9ca3af",
                  fontSize: "11px",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {chip}
              </span>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendFileChat();
            }}
            style={{ padding: "10px 14px", display: "flex", gap: "8px", borderTop: "1px solid rgba(255, 255, 255, 0.06)", background: "#15171d" }}
          >
            <input
              type="text"
              placeholder={`Ask anything about ${file.file_name}...`}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              style={{
                flex: 1,
                background: "#0f1117",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "#ffffff",
                fontSize: "13px",
                outline: "none"
              }}
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                background: "#315bff",
                border: "none",
                color: "#ffffff",
                cursor: "pointer"
              }}
            >
              <FiSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default FileDetails;
