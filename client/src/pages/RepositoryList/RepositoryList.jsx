import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiFolder, 
  FiSearch, 
  FiEye, 
  FiBarChart2, 
  FiCalendar, 
  FiGitBranch,
  FiCpu,
  FiMessageSquare,
  FiTrash2
} from "react-icons/fi";
import MainLayout from "../../layouts/MainLayout";
import { getUserRepositories, deleteRepository } from "../../services/repository.service";
import styles from "./RepositoryList.module.css";

function RepositoryList() {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRepositories = async () => {
    try {
      const response = await getUserRepositories();
      setRepositories(response.data.repositories || []);
    } catch (error) {
      console.error("Failed to fetch repositories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const handleDeleteRepo = async (repoId, repoName) => {
    if (window.confirm(`Are you sure you want to delete "${repoName}"? This will remove all files and records.`)) {
      try {
        await deleteRepository(repoId);
        setRepositories((prev) => prev.filter((r) => r.repo_id !== repoId));
      } catch (err) {
        console.error("Delete repository error:", err);
        alert("Failed to delete repository.");
      }
    }
  };

  const filteredRepositories = repositories.filter((repo) =>
    (repo.repository_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Repositories</h1>
            <div className={styles.subtitle}>
              Browse and analyze all your imported projects and codebases.
            </div>
          </div>

          <div className={styles.controls}>
            <div className={styles.searchBox}>
              <FiSearch style={{ color: "#6b7280" }} />
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className={styles.emptyState}>Loading repositories...</div>
        ) : filteredRepositories.length === 0 ? (
          <div className={styles.emptyState}>
            <FiFolder style={{ fontSize: "36px", marginBottom: "12px" }} />
            <div>No repositories found. Upload a ZIP file or import from GitHub to get started.</div>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredRepositories.map((repo) => (
              <div key={repo.repo_id} className={styles.card}>
                <div>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.repoName}>{repo.repository_name}</h3>
                    <span className={styles.badge}>{repo.status || "Ready"}</span>
                  </div>

                  <div className={styles.metaRow}>
                    <div className={styles.metaItem}>
                      <FiGitBranch />
                      <span>{repo.repository_type || "Upload"}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <FiCalendar />
                      <span>
                        {new Date(repo.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => navigate(`/repositories/${repo.repo_id}`)}
                  >
                    <FiEye /> Explorer
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() => navigate(`/repositories/${repo.repo_id}/metrics`)}
                  >
                    <FiBarChart2 /> Metrics
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() => navigate(`/repositories/${repo.repo_id}/analysis`)}
                  >
                    <FiCpu /> AI Report
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() => navigate(`/repositories/${repo.repo_id}/chat`)}
                  >
                    <FiMessageSquare /> Chat
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => handleDeleteRepo(repo.repo_id, repo.repository_name)}
                  >
                    <FiTrash2 /> Delete Repository
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default RepositoryList;
