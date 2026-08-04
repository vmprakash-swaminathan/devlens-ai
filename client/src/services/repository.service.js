import API from "./auth.service";

/*
|--------------------------------------------------------------------------
| Repository APIs
|--------------------------------------------------------------------------
*/

/**
 * Get all files of a repository
 */

export const getRepositoryFiles = async (repoId) => {
    return await API.get(`/repositories/${repoId}/files`);
};

export const getUserRepositories = async () => {
    return await API.get("/repositories");
};

export const getRepositoryMetrics = async (repoId) => {
    return await API.get(`/repositories/${repoId}/metrics`);
};

export const getAIAnalysis = async (repoId) => {
    return await API.get(`/repositories/${repoId}/analysis`);
};

export const sendRepoChatMessage = async (repoId, message) => {
    return await API.post(`/repositories/${repoId}/chat`, { message });
};

export const uploadZipRepository = async (formData) => {
    return await API.post("/repositories/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export const importGithubRepo = async (github_url) => {
    return await API.post("/repositories/github", { github_url });
};

export const getFileContent = async (repoId, filePath) => {
    return await API.get(`/repositories/${repoId}/file-content`, {
        params: { path: filePath }
    });
};

export const deleteRepository = async (repoId) => {
    return await API.delete(`/repositories/${repoId}`);
};

export const getFileAISummary = async (repoId, filePath, content) => {
    return await API.post(`/repositories/${repoId}/file-summary`, {
        filePath,
        content
    });
};

export const sendFileChatMessage = async (repoId, filePath, content, message) => {
    return await API.post(`/repositories/${repoId}/file-chat`, {
        filePath,
        content,
        message
    });
};