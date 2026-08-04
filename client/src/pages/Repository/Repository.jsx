import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiMessageSquare, FiFileText } from "react-icons/fi";

import MainLayout from "../../layouts/MainLayout";
import FileTree from "../../components/Repository/FileTree";
import FileDetails from "../../components/Repository/FileDetails";
import EmbeddedAIChat from "../../components/Repository/EmbeddedAIChat";

import { getRepositoryFiles } from "../../services/repository.service";
import styles from "./Repository.module.css";

function Repository() {
    const { repoId } = useParams();

    const [repository, setRepository] = useState(null);
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [activeTab, setActiveTab] = useState("file"); // "file" | "chat"

    useEffect(() => {
        const loadRepository = async () => {
            try {
                const response = await getRepositoryFiles(repoId);
                setRepository(response.data.repository);
                setFiles(response.data.files);
            } catch (error) {
                console.error(error);
            }
        };

        loadRepository();
    }, [repoId]);

    return (
        <MainLayout>
            <div className={styles.container}>
                <div className={styles.leftPanel}>
                    <div className={styles.leftHeader}>
                        <h2 className={styles.repoTitle}>
                            {repository?.repository_name || "Repository"}
                        </h2>
                    </div>

                    <FileTree
                        files={files}
                        onSelect={(file) => {
                            setSelectedFile(file);
                            setActiveTab("file");
                        }}
                        selectedFile={selectedFile}
                    />
                </div>

                <div className={styles.rightPanel}>
                    <div className={styles.tabBar}>
                        <button
                            onClick={() => setActiveTab("file")}
                            className={`${styles.tabBtn} ${activeTab === "file" ? styles.activeTabBtn : ""}`}
                        >
                            <FiFileText /> Code Inspector
                        </button>

                        <button
                            onClick={() => setActiveTab("chat")}
                            className={`${styles.tabBtn} ${activeTab === "chat" ? styles.activeTabBtn : ""}`}
                        >
                            <FiMessageSquare /> Ask AI Assistant
                        </button>
                    </div>

                    <div className={styles.tabContent}>
                        {activeTab === "file" ? (
                            <FileDetails
                                file={selectedFile}
                                repoId={repoId}
                            />
                        ) : (
                            <EmbeddedAIChat
                                repoId={repoId}
                                onClose={() => setActiveTab("file")}
                            />
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default Repository;