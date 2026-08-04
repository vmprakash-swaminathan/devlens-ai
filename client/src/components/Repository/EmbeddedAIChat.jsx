import { useState, useRef, useEffect } from "react";
import { FiCpu, FiUser, FiSend, FiX, FiArrowLeft } from "react-icons/fi";
import { sendRepoChatMessage } from "../../services/repository.service";
import styles from "./EmbeddedAIChat.module.css";

function EmbeddedAIChat({ repoId, onClose, onBack, isFullPage = false }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your AI repository assistant. Ask me anything about the architecture, files, technologies, or implementation details of this repository."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const suggestionChips = [
    "What is the main tech stack?",
    "Explain project structure",
    "Where is the entry point?",
    "Suggest security improvements"
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const response = await sendRepoChatMessage(repoId, query);
      const aiReply = response.data.reply || "I analyzed your query against the codebase.";
      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch (error) {
      console.error("AI Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, I ran into an error processing your query. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container} ${isFullPage ? styles.fullPageContainer : ""}`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIconBadge}>
            <FiCpu />
          </div>
          <div>
            <h3 className={styles.headerTitle}>
              Repository AI Assistant <span className={styles.statusIndicator} />
            </h3>
            <p className={styles.headerSubtitle}>
              Ask questions, explore code structure & analyze architecture
            </p>
          </div>
        </div>

        <div className={styles.headerActions}>
          {onBack && (
            <button className={styles.backBtn} onClick={onBack}>
              <FiArrowLeft /> Back
            </button>
          )}
          {onClose && (
            <button className={styles.closeBtn} onClick={onClose} title="Close AI Assistant">
              <FiX />
            </button>
          )}
        </div>
      </div>

      <div className={styles.messagesArea}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.messageRow} ${msg.sender === "user" ? styles.userRow : ""}`}
          >
            <div className={`${styles.avatar} ${msg.sender === "user" ? styles.userAvatar : ""}`}>
              {msg.sender === "user" ? <FiUser /> : <FiCpu />}
            </div>
            <div className={`${styles.bubble} ${msg.sender === "user" ? styles.userBubble : ""}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className={styles.messageRow}>
            <div className={styles.avatar}>
              <FiCpu />
            </div>
            <div className={`${styles.bubble} ${styles.loadingBubble}`}>
              Analyzing repository context...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className={styles.suggestions}>
        {suggestionChips.map((chip, idx) => (
          <span key={idx} className={styles.chip} onClick={() => handleSend(chip)}>
            {chip}
          </span>
        ))}
      </div>

      <form
        className={styles.inputBar}
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          className={styles.input}
          placeholder="Ask DevLens AI about this repository..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className={styles.sendBtn} disabled={loading || !input.trim()}>
          <FiSend />
        </button>
      </form>
    </div>
  );
}

export default EmbeddedAIChat;
