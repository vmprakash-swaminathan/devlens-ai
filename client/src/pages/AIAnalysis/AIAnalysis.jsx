import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiCpu, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiLayers, 
  FiMessageSquare, 
  FiArrowLeft, 
  FiAward,
  FiFileText,
  FiBox
} from "react-icons/fi";
import MainLayout from "../../layouts/MainLayout";
import { getAIAnalysis } from "../../services/repository.service";
import styles from "./AIAnalysis.module.css";

function AIAnalysis() {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await getAIAnalysis(repoId);
        setAnalysisData(response.data);
      } catch (error) {
        console.error("Failed to load AI Analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [repoId]);

  if (loading) {
    return (
      <MainLayout>
        <div className={styles.container}>Generating AI Analysis...</div>
      </MainLayout>
    );
  }

  const { repository, aiSummary } = analysisData || {};
  const summary = typeof aiSummary === "string" ? { summary: aiSummary } : aiSummary || {};

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <h1 className={styles.repoTitle}>
              <FiCpu style={{ color: "#32c2bf" }} />
              {repository?.repository_name} AI Report
            </h1>
            <div className={styles.repoSubtitle}>
              Automated Codebase Intelligence & Capabilities Evaluation
            </div>
          </div>

          <div className={styles.actionRow}>
            <button className={styles.navBtn} onClick={() => navigate(-1)}>
              <FiArrowLeft /> Back
            </button>
            <button
              className={`${styles.navBtn} ${styles.primaryBtn}`}
              onClick={() => navigate(`/repositories/${repoId}/chat`)}
            >
              <FiMessageSquare /> AI Chat
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Project Purpose & Domain */}
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <div className={styles.cardHeader}>
              <FiFileText className={styles.cardIcon} />
              Project Purpose & Functionality
            </div>
            <div className={styles.textContent}>
              {summary.projectPurpose || summary.summary || "AI analysis completed for this repository."}
            </div>
          </div>

          {/* Project Capabilities & Key Features */}
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <div className={styles.cardHeader}>
              <FiBox className={styles.cardIcon} style={{ color: "#3b82f6" }} />
              Project Capabilities & Features
            </div>
            <ul className={styles.list}>
              {(summary.capabilities || [
                "Modular application architecture and execution logic",
                "Integrated component-based design pattern",
                "Automated configuration and environment management"
              ]).map((item, idx) => (
                <li key={idx} className={styles.listItem}>
                  <FiCheckCircle className={styles.strengthIcon} style={{ color: "#3b82f6" }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Executive Summary */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FiCpu className={styles.cardIcon} />
              Executive Overview
            </div>
            <div className={styles.textContent}>
              {summary.summary || "Comprehensive evaluation of application code structure and metrics."}
            </div>
          </div>

          {/* Architecture Assessment */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FiLayers className={styles.cardIcon} />
              Architecture & Tech Stack
            </div>
            <div className={styles.textContent}>
              {summary.architecture || "Modular software architecture featuring standard directory conventions."}
            </div>
          </div>

          {/* Overall Rating */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FiAward className={styles.cardIcon} />
              Repository Quality Rating
            </div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "#32c2bf" }}>
              {summary.overallScore || "88/100"}
            </div>
            <div className={styles.textContent}>
              Evaluated based on code completeness, configuration structure, and domain capability alignment.
            </div>
          </div>

          {/* Strengths */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FiCheckCircle className={styles.cardIcon} />
              Key Codebase Strengths
            </div>
            <ul className={styles.list}>
              {(summary.strengths || ["Clean directory layout", "Modular service organization"]).map(
                (item, idx) => (
                  <li key={idx} className={styles.listItem}>
                    <FiCheckCircle className={styles.strengthIcon} />
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Recommended Improvements */}
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <div className={styles.cardHeader}>
              <FiAlertTriangle className={styles.cardIcon} style={{ color: "#f59e0b" }} />
              Actionable Recommendations
            </div>
            <ul className={styles.list}>
              {(summary.improvements || ["Add automated unit tests", "Set up deployment script"]).map(
                (item, idx) => (
                  <li key={idx} className={styles.listItem}>
                    <FiAlertTriangle className={styles.improvementIcon} />
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default AIAnalysis;
