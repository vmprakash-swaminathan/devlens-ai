import { useEffect, useState } from "react";
import { 
  FiFileText, 
  FiPrinter, 
  FiEye, 
  FiX, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiAward,
  FiBox,
  FiLayers,
  FiCpu
} from "react-icons/fi";
import MainLayout from "../../layouts/MainLayout";
import { getUserRepositories, getAIAnalysis } from "../../services/repository.service";
import styles from "./Reports.module.css";

function Reports() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await getUserRepositories();
        setRepositories(response.data.repositories || []);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const openReportModal = async (repoId) => {
    setReportLoading(true);
    try {
      const response = await getAIAnalysis(repoId);
      setActiveReport(response.data);
    } catch (error) {
      console.error("Failed to load report detail:", error);
    } finally {
      setReportLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const summary = typeof activeReport?.aiSummary === "object" ? activeReport?.aiSummary : {};

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>AI Reports & Export Center</h1>
            <div className={styles.subtitle}>
              Export printable PDF analysis reports and health evaluations for your codebases.
            </div>
          </div>
        </div>

        {loading ? (
          <div>Loading reports...</div>
        ) : repositories.length === 0 ? (
          <div>No reports available. Import a repository to generate AI reports.</div>
        ) : (
          <div className={styles.grid}>
            {repositories.map((repo) => (
              <div key={repo.repo_id} className={styles.card}>
                <div>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.repoName}>{repo.repository_name}</h3>
                    <span className={styles.scoreBadge}>AI Ready</span>
                  </div>
                  <p className={styles.summaryText}>
                    Comprehensive AI report including project purpose, core capabilities, architecture quality, and recommendations.
                  </p>
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.btn}
                    onClick={() => openReportModal(repo.repo_id)}
                  >
                    <FiEye /> View Report
                  </button>
                  <button
                    className={`${styles.btn} ${styles.primaryBtn}`}
                    onClick={() => openReportModal(repo.repo_id)}
                  >
                    <FiPrinter /> Export PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Report Preview Modal */}
        {(activeReport || reportLoading) && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              {reportLoading ? (
                <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#32c2bf" }}>
                  Generating Printable Executive Report...
                </div>
              ) : (
                <>
                  <div className={styles.reportHeader}>
                    <div>
                      <h2 className={styles.reportTitle}>
                        {activeReport?.repository?.repository_name} — Executive AI Intelligence Report
                      </h2>
                      <div className={styles.reportSubtitle}>
                        DevLens AI Automated Codebase Intelligence Evaluation
                      </div>
                    </div>
                    <div className={styles.noPrintActions}>
                      <button 
                        className={styles.primaryBtn} 
                        style={{ padding: "8px 16px", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }} 
                        onClick={handlePrint}
                      >
                        <FiPrinter /> Print / Save as PDF
                      </button>
                      <button 
                        className={styles.btn} 
                        style={{ padding: "8px 12px" }} 
                        onClick={() => setActiveReport(null)}
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>

                  <div className={styles.reportBody}>
                    {/* Repository Quality Rating */}
                    {summary?.overallScore && (
                      <div className={styles.scoreBanner}>
                        <div className={styles.scoreBannerLeft}>
                          <FiAward className={styles.scoreIcon} />
                          <span className={styles.scoreLabel}>Repository Code Quality Rating</span>
                        </div>
                        <span className={styles.scoreValue}>{summary.overallScore}</span>
                      </div>
                    )}

                    {/* Project Purpose & Domain */}
                    <div className={styles.reportSection}>
                      <h4 className={styles.sectionTitle}>
                        <FiFileText /> Project Purpose & Functionality
                      </h4>
                      <p className={styles.sectionText}>
                        {summary?.projectPurpose || summary?.summary || "Executive analysis completed for this repository."}
                      </p>
                    </div>

                    {/* Project Capabilities & Key Features */}
                    <div className={styles.reportSection}>
                      <h4 className={styles.sectionTitleBlue}>
                        <FiBox /> Project Capabilities & Features
                      </h4>
                      <ul className={styles.sectionList}>
                        {(summary?.capabilities || [
                          "Modular application execution logic",
                          "Integrated component architecture",
                          "Automated environment and config management"
                        ]).map((cap, idx) => (
                          <li key={idx}>{cap}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Executive Overview */}
                    <div className={styles.reportSection}>
                      <h4 className={styles.sectionTitle}>
                        <FiCpu /> Executive Overview
                      </h4>
                      <p className={styles.sectionText}>
                        {summary?.summary || "Codebase layout and metrics evaluated."}
                      </p>
                    </div>

                    {/* Architecture Assessment */}
                    <div className={styles.reportSection}>
                      <h4 className={styles.sectionTitle}>
                        <FiLayers /> Architecture & Tech Stack
                      </h4>
                      <p className={styles.sectionText}>
                        {summary?.architecture || "Modular software architecture featuring standard directory conventions."}
                      </p>
                    </div>

                    {/* Key Codebase Strengths */}
                    <div className={styles.reportSection}>
                      <h4 className={styles.sectionTitleGreen}>
                        <FiCheckCircle /> Key Codebase Strengths
                      </h4>
                      <ul className={styles.sectionList}>
                        {(summary?.strengths || ["Clean directory structure", "Separation of concerns"]).map((str, idx) => (
                          <li key={idx}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended Improvements */}
                    <div className={styles.reportSection}>
                      <h4 className={styles.sectionTitleAmber}>
                        <FiAlertTriangle /> Actionable Recommendations
                      </h4>
                      <ul className={styles.sectionList}>
                        {(summary?.improvements || ["Add automated test suite", "Configure CI/CD"]).map((imp, idx) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Reports;
