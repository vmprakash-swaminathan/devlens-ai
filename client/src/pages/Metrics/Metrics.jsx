import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiFile, 
  FiFolder, 
  FiCode, 
  FiCheckCircle, 
  FiCpu, 
  FiLayers 
} from "react-icons/fi";
import MainLayout from "../../layouts/MainLayout";
import { getRepositoryMetrics } from "../../services/repository.service";
import styles from "./Metrics.module.css";

function Metrics() {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const response = await getRepositoryMetrics(repoId);
        setData(response.data);
      } catch (error) {
        console.error("Failed to load metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [repoId]);

  if (loading) {
    return (
      <MainLayout>
        <div className={styles.container}>Loading metrics...</div>
      </MainLayout>
    );
  }

  const { repository, metrics = {}, analysis = {}, healthScore = 75 } = data || {};
  const totalFiles = metrics.totalFiles || 1;

  const fileTypes = [
    { label: "JavaScript / JSX", count: metrics.javascriptFiles || 0, color: "#f7df1e" },
    { label: "TypeScript / TSX", count: metrics.typescriptFiles || 0, color: "#38bdf8" },
    { label: "React Components", count: metrics.reactComponents || 0, color: "#61dafb" },
    { label: "CSS / Styles", count: metrics.cssFiles || 0, color: "#32c2bf" },
    { label: "HTML Files", count: metrics.htmlFiles || 0, color: "#f97316" },
    { label: "JSON Configurations", count: metrics.jsonFiles || 0, color: "#a855f7" },
    { label: "Markdown Docs", count: metrics.markdownFiles || 0, color: "#e5e7eb" }
  ];

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <h1 className={styles.repoTitle}>{repository?.repository_name}</h1>
            <div className={styles.repoSubtitle}>Project Metrics & Health Score Analysis</div>
          </div>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back to Explorer
          </button>
        </div>

        <div className={styles.topGrid}>
          <div className={styles.healthCard}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#9ca3af" }}>
              Project Health Score
            </div>
            <div 
              className={styles.gaugeCircle}
              style={{ "--score-percent": `${healthScore}%` }}
            >
              <div className={styles.gaugeInner}>
                <span className={styles.scoreValue}>{healthScore}</span>
                <span className={styles.scoreLabel}>Out of 100</span>
              </div>
            </div>
            <div style={{ fontSize: "12px", color: "#32c2bf" }}>
              {healthScore >= 80 ? "Healthy Codebase Structure" : "Moderate Codebase Structure"}
            </div>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Total Files</span>
                <FiFile className={styles.statIcon} />
              </div>
              <div className={styles.statVal}>{metrics.totalFiles || 0}</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Total Folders</span>
                <FiFolder className={styles.statIcon} />
              </div>
              <div className={styles.statVal}>{metrics.totalFolders || 0}</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Primary Language</span>
                <FiCode className={styles.statIcon} />
              </div>
              <div className={styles.statVal} style={{ fontSize: "16px" }}>
                {analysis.language || "JavaScript"}
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Framework</span>
                <FiLayers className={styles.statIcon} />
              </div>
              <div className={styles.statVal} style={{ fontSize: "16px" }}>
                {analysis.framework || "Express / React"}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mainGrid}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              <FiFile style={{ color: "#32c2bf" }} /> File Composition
            </div>
            {fileTypes.map(
              (item) =>
                item.count > 0 && (
                  <div key={item.label} className={styles.breakdownRow}>
                    <div className={styles.breakdownMeta}>
                      <span>{item.label}</span>
                      <span style={{ color: "#9ca3af" }}>
                        {item.count} ({Math.round((item.count / totalFiles) * 100)}%)
                      </span>
                    </div>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{
                          width: `${Math.min(100, Math.round((item.count / totalFiles) * 100))}%`,
                          background: item.color
                        }}
                      />
                    </div>
                  </div>
                )
            )}
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              <FiCpu style={{ color: "#32c2bf" }} /> Technology & Environment
            </div>
            <div className={styles.techGrid}>
              <div className={styles.techBox}>
                <div className={styles.techLabel}>Build Tool</div>
                <div className={styles.techVal}>{analysis.buildTool || "NPM / Webpack"}</div>
              </div>

              <div className={styles.techBox}>
                <div className={styles.techLabel}>Entry Point</div>
                <div className={styles.techVal}>{analysis.entryPoint || "src/index.js"}</div>
              </div>

              <div className={styles.techBox}>
                <div className={styles.techLabel}>Frontend Detected</div>
                <div className={styles.techVal}>{analysis.frontend ? "Yes" : "No"}</div>
              </div>

              <div className={styles.techBox}>
                <div className={styles.techLabel}>Backend Detected</div>
                <div className={styles.techVal}>{analysis.backend ? "Yes" : "No"}</div>
              </div>

              <div className={styles.techBox}>
                <div className={styles.techLabel}>Documentation (README)</div>
                <div className={styles.techVal}>{analysis.hasReadme ? "Present" : "Missing"}</div>
              </div>

              <div className={styles.techBox}>
                <div className={styles.techLabel}>Version Control (.gitignore)</div>
                <div className={styles.techVal}>{analysis.hasGitIgnore ? "Present" : "Missing"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Metrics;
