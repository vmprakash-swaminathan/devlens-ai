import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiGithub, FiLink, FiDownloadCloud, FiCheck } from "react-icons/fi";
import MainLayout from "../../layouts/MainLayout";
import { importGithubRepo } from "../../services/repository.service";
import styles from "./GithubImport.module.css";

function GithubImport() {
  const navigate = useNavigate();
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!githubUrl.trim()) {
      setError("Please enter a valid GitHub repository URL.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await importGithubRepo(githubUrl.trim());
      const repoId = response.data?.repository?.repo_id || response.data?.repository?.id;
      if (repoId) {
        navigate(`/repositories/${repoId}`);
      } else {
        navigate("/repositories");
      }
    } catch (err) {
      console.error("GitHub import error:", err);
      setError(err.response?.data?.message || "Failed to clone GitHub repository. Ensure the URL is public.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.iconHeader}>
            <FiGithub />
          </div>

          <div className={styles.titleGroup}>
            <h1 className={styles.title}>Import GitHub Repository</h1>
            <div className={styles.subtitle}>
              Paste a public GitHub repository link to clone, scan files, and analyze architecture.
            </div>
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>GitHub Repository URL</label>
              <div className={styles.inputWrapper}>
                <FiLink style={{ color: "#6b7280" }} />
                <input
                  type="url"
                  className={styles.input}
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading || !githubUrl.trim()}>
              {loading ? (
                <>
                  <FiDownloadCloud style={{ animation: "spin 1s linear infinite" }} />
                  Cloning & Scanning Repository...
                </>
              ) : (
                <>
                  <FiCheck /> Import & Analyze
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default GithubImport;
