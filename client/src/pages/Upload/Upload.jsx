import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud, FiFile, FiCheck, FiX } from "react-icons/fi";
import MainLayout from "../../layouts/MainLayout";
import { uploadZipRepository } from "../../services/repository.service";
import styles from "./Upload.module.css";

function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith(".zip")) {
        setError("Please select a valid .zip file.");
        setSelectedFile(null);
        return;
      }
      setError("");
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.name.endsWith(".zip")) {
        setError("Please drop a valid .zip file.");
        return;
      }
      setError("");
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select a ZIP file to upload.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("project", selectedFile);

    try {
      const response = await uploadZipRepository(formData);
      const repoId = response.data?.repository?.repo_id;
      if (repoId) {
        navigate(`/repositories/${repoId}`);
      } else {
        navigate("/repositories");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload and analyze repository package.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>Upload ZIP Repository</h1>
            <div className={styles.subtitle}>
              Select or drop your project's .zip archive to extract files and analyze code metrics.
            </div>
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <div
            className={styles.dropzone}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <FiUploadCloud className={styles.icon} />
            <div className={styles.dropText}>
              {selectedFile ? selectedFile.name : "Click or Drag & Drop ZIP File"}
            </div>
            <div className={styles.subText}>Supports .zip archives containing project source code</div>

            <input
              type="file"
              accept=".zip"
              ref={fileInputRef}
              className={styles.fileInput}
              onChange={handleFileChange}
            />
          </div>

          {selectedFile && (
            <div className={styles.selectedFile}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FiFile style={{ color: "#32c2bf" }} />
                <span>{selectedFile.name}</span>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>
                  ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <FiX
                style={{ cursor: "pointer", color: "#ef4444" }}
                onClick={() => setSelectedFile(null)}
              />
            </div>
          )}

          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading || !selectedFile}
          >
            {loading ? (
              <>
                <FiUploadCloud style={{ animation: "spin 1s linear infinite" }} />
                Extracting & Analyzing Project...
              </>
            ) : (
              <>
                <FiCheck /> Start Analysis
              </>
            )}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default Upload;
