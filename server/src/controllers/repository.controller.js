const ZipService = require("../services/zip.service");
const FileScanner = require("../services/fileScanner.service");
const ProjectAnalyzer = require("../services/projectAnalyzer.service");
const MetricsService = require("../services/metrics.service");
const RepositoryFileModel = require("../models/repositoryFile.model");
const RepositoryModel = require("../models/repository.model");
const path = require("path");
const fs = require("fs");
const GithubService = require("../services/github.service");
const AIService = require("../services/ai.service");

const RepositoryController = {};

RepositoryController.uploadProject = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded."
            });
        }

        console.log("✅ Step 1: File Uploaded");

        const user_id = req.user.userId;
        const repository_name = path.parse(req.file.originalname).name;
        const upload_path = req.file.path;
        // Extract ZIP
        const extractedPath = ZipService.extractRepository(upload_path);

        console.log("✅ Step 2: ZIP Extracted:", extractedPath);

        // Save repository with extracted path
        const repository = await RepositoryModel.createRepository({
            user_id,
            repository_name,
            upload_path: extractedPath
        });

        console.log("✅ Step 3: Repository Saved to Database");

        // Scan Files
        const projectFiles = FileScanner.scanDirectory(extractedPath);

        console.log(`✅ Step 4: ${projectFiles.length} Files Scanned`);

        // Save Files
        await RepositoryFileModel.createMultipleFiles(
            repository.repo_id,
            projectFiles
        );

        console.log("✅ Step 5: Files Saved to Database");

        // Analyze Project
        const projectAnalysis =
            ProjectAnalyzer.analyzeProject(projectFiles);

        console.log("✅ Step 6: Project Analysis Completed");

        // Metrics
        const projectMetrics =
            MetricsService.calculateMetrics(projectFiles);

        console.log("✅ Step 7: Metrics Generated");

        console.log("🤖 Step 8: Generating AI Summary...");

        const aiSummary =
            await AIService.generateProjectSummary(
            projectAnalysis,
            projectMetrics
        );

        console.log("✅ Step 9: AI Summary Generated");

        // Response
        return res.status(201).json({

            success: true,

            message: "Repository analyzed successfully.",

            repository,

            extractedPath,

            totalFiles: projectFiles.length,

            projectAnalysis,

            projectMetrics,

            aiSummary,

            preview: projectFiles.slice(0,20)

        });

    } catch (error) {

        console.error("❌ Upload Error");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

RepositoryController.importGithubRepository = async (req, res) => {
    try {

        const { github_url } = req.body;
        const user_id = req.user.userId;

        if (!github_url) {
            return res.status(400).json({
                success: false,
                message: "GitHub URL is required."
            });
        }

        console.log("📥 Step 1: Cloning GitHub Repository...", github_url);

        const cloned = await GithubService.cloneRepository(github_url);

        console.log("✅ Step 2: Repository Cloned Successfully:", cloned.repositoryName);

        // Save Repository Record
        const repository = await RepositoryModel.createRepository({
            user_id,
            repository_name: cloned.repositoryName,
            repository_type: "github",
            github_url,
            upload_path: cloned.repositoryPath
        });

        console.log("✅ Step 3: Repository Saved to DB:", repository.repo_id);

        // Scan Files
        const projectFiles = FileScanner.scanDirectory(cloned.repositoryPath);

        console.log(`✅ Step 4: ${projectFiles.length} Files Scanned`);

        // Save Files to DB
        await RepositoryFileModel.createMultipleFiles(
            repository.repo_id,
            projectFiles
        );

        console.log("✅ Step 5: Files Saved to Database");

        // Analyze Project
        const projectAnalysis = ProjectAnalyzer.analyzeProject(projectFiles);
        const projectMetrics = MetricsService.calculateMetrics(projectFiles);

        return res.status(200).json({
            success: true,
            message: "GitHub repository cloned and scanned successfully.",
            repository,
            totalFiles: projectFiles.length,
            projectAnalysis,
            projectMetrics
        });

    } catch (error) {

        console.error("❌ GitHub Import Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
/*
|--------------------------------------------------------------------------
| Get Repository Files
|--------------------------------------------------------------------------
*/

RepositoryController.getRepositoryFiles = async (req, res) => {

    try {

        const { repoId } = req.params;

        const repository =
            await RepositoryModel.getRepositoryById(repoId);

        if (!repository) {

            return res.status(404).json({
                success: false,
                message: "Repository not found."
            });

        }

        const files =
            await RepositoryModel.getRepositoryFiles(repoId);

        return res.status(200).json({
            success: true,
            repository: {
                repo_id: repository.repo_id,
                repository_name: repository.repository_name,
                status: repository.status
            },
            totalFiles: files.length,
            files
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
|--------------------------------------------------------------------------
| Get All Repositories for Logged-In User
|--------------------------------------------------------------------------
*/

RepositoryController.getUserRepositories = async (req, res) => {
    try {
        const userId = req.user.userId;
        const repositories = await RepositoryModel.getRepositoriesByUser(userId);

        return res.status(200).json({
            success: true,
            count: repositories.length,
            repositories
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/*
|--------------------------------------------------------------------------
| Get Repository Metrics & Health Analysis
|--------------------------------------------------------------------------
*/

RepositoryController.getRepositoryMetrics = async (req, res) => {
    try {
        const { repoId } = req.params;
        const repository = await RepositoryModel.getRepositoryById(repoId);

        if (!repository) {
            return res.status(404).json({
                success: false,
                message: "Repository not found."
            });
        }

        const files = await RepositoryModel.getRepositoryFiles(repoId);
        
        // Transform files format if needed by services
        const formattedFiles = files.map(f => ({
            name: f.file_name,
            path: f.file_path,
            type: f.size === "0" ? "folder" : "file",
            extension: f.file_extension,
            language: f.language,
            size: f.size
        }));

        const projectMetrics = MetricsService.calculateMetrics(formattedFiles);
        const projectAnalysis = ProjectAnalyzer.analyzeProject(formattedFiles);

        // Calculate Health Score
        let healthScore = 70;
        if (projectAnalysis.hasReadme) healthScore += 10;
        if (projectAnalysis.hasGitIgnore) healthScore += 10;
        if (projectAnalysis.entryPoint) healthScore += 10;
        if (projectMetrics.totalFiles > 0) healthScore = Math.min(100, healthScore);

        return res.status(200).json({
            success: true,
            repository,
            metrics: projectMetrics,
            analysis: projectAnalysis,
            healthScore
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/*
|--------------------------------------------------------------------------
| Get AI Analysis & Recommendations
|--------------------------------------------------------------------------
*/

RepositoryController.getAIAnalysis = async (req, res) => {
    try {
        const { repoId } = req.params;
        const repository = await RepositoryModel.getRepositoryById(repoId);

        if (!repository) {
            return res.status(404).json({
                success: false,
                message: "Repository not found."
            });
        }

        const files = await RepositoryModel.getRepositoryFiles(repoId);
        const formattedFiles = files.map(f => ({
            name: f.file_name,
            path: f.file_path,
            type: f.size === "0" ? "folder" : "file",
            extension: f.file_extension,
            language: f.language,
            size: f.size
        }));

        const projectMetrics = MetricsService.calculateMetrics(formattedFiles);
        const projectAnalysis = ProjectAnalyzer.analyzeProject(formattedFiles);

        // Build File Tree and Codebase Context
        const fileTreeList = files.map(f => f.file_path || f.file_name).slice(0, 150).join("\n");
        let keyCodeSnippets = "";
        const baseDir = repository.upload_path;

        if (baseDir && fs.existsSync(baseDir)) {
            const snippets = [];
            const keyFiles = files.filter(f => {
                const lowerName = (f.file_name || "").toLowerCase();
                return (
                    lowerName === "package.json" ||
                    lowerName === "readme.md" ||
                    lowerName.includes("index") ||
                    lowerName.includes("app") ||
                    lowerName.includes("server") ||
                    lowerName.includes("main") ||
                    lowerName.includes("schema")
                );
            }).slice(0, 8);

            for (const fileObj of keyFiles) {
                try {
                    const fullPath = path.isAbsolute(fileObj.file_path)
                        ? fileObj.file_path
                        : path.join(baseDir, fileObj.file_path);

                    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
                        const fileContent = fs.readFileSync(fullPath, "utf-8");
                        snippets.push(`--- File: ${fileObj.file_path} ---\n${fileContent.slice(0, 3000)}`);
                    }
                } catch (e) {
                    // Ignore individual read errors
                }
            }

            keyCodeSnippets = snippets.join("\n\n");
        }

        const repoInfo = {
            name: repository.repository_name,
            fileTreeList,
            keyCodeSnippets
        };

        const userApiKey = req.headers["x-ai-api-key"] || req.headers["x-gemini-api-key"];
        const aiProvider = req.headers["x-ai-provider"];

        const aiSummary = await AIService.generateProjectSummary(projectAnalysis, projectMetrics, repoInfo, userApiKey, aiProvider);

        return res.status(200).json({
            success: true,
            repository,
            aiSummary
        });
    } catch (error) {
        console.error("Get AI Analysis Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/*
|--------------------------------------------------------------------------
| Interactive AI Chat with Repository Context
|--------------------------------------------------------------------------
*/

RepositoryController.chatWithRepository = async (req, res) => {
    try {
        const { repoId } = req.params;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required."
            });
        }

        const repository = await RepositoryModel.getRepositoryById(repoId);
        if (!repository) {
            return res.status(404).json({
                success: false,
                message: "Repository not found."
            });
        }

        const files = await RepositoryModel.getRepositoryFiles(repoId);
        const formattedFiles = files.map(f => ({
            name: f.file_name,
            path: f.file_path,
            type: f.size === "0" ? "folder" : "file",
            extension: f.file_extension,
            language: f.language
        }));

        const projectMetrics = MetricsService.calculateMetrics(formattedFiles);
        const projectAnalysis = ProjectAnalyzer.analyzeProject(formattedFiles);

        // Build File Tree List Context
        const fileTreeList = files.map(f => f.file_path || f.file_name).slice(0, 150).join("\n");

        // Read Source Code Snippets for Key Files and Query Matches
        let keyCodeSnippets = "";
        const baseDir = repository.upload_path;

        if (baseDir && fs.existsSync(baseDir)) {
            const snippets = [];
            const queryLower = message.toLowerCase();
            const wordsInMsg = queryLower.split(/\W+/).filter(w => w.length > 2);

            const selectedFiles = files.filter(f => {
                const lowerPath = (f.file_path || "").toLowerCase();
                const lowerName = (f.file_name || "").toLowerCase();

                // Always include key configuration and entry point files
                if (
                    lowerName === "package.json" ||
                    lowerName === "readme.md" ||
                    lowerName.includes("index") ||
                    lowerName.includes("app") ||
                    lowerName.includes("server") ||
                    lowerName.includes("main")
                ) {
                    return true;
                }

                // Match query terms against filenames/paths
                return wordsInMsg.some(word => lowerPath.includes(word) || lowerName.includes(word));
            }).slice(0, 8); // Top 8 relevant files

            for (const fileObj of selectedFiles) {
                try {
                    const fullPath = path.isAbsolute(fileObj.file_path)
                        ? fileObj.file_path
                        : path.join(baseDir, fileObj.file_path);

                    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
                        const fileContent = fs.readFileSync(fullPath, "utf-8");
                        snippets.push(`--- File: ${fileObj.file_path} ---\n${fileContent.slice(0, 3000)}`);
                    }
                } catch (e) {
                    // Ignore read errors for binary or restricted files
                }
            }

            keyCodeSnippets = snippets.join("\n\n");
        }

        const repoInfo = {
            name: repository.repository_name,
            fileTreeList,
            keyCodeSnippets
        };

        const userApiKey = req.headers["x-ai-api-key"] || req.headers["x-gemini-api-key"];
        const aiProvider = req.headers["x-ai-provider"];
        const reply = await AIService.chatWithRepository(message, projectAnalysis, projectMetrics, repoInfo, userApiKey, aiProvider);

        return res.status(200).json({
            success: true,
            reply
        });
    } catch (error) {
        console.error("Chat with Repository Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/*
|--------------------------------------------------------------------------
| Read Source File Content
|--------------------------------------------------------------------------
*/

RepositoryController.getFileContent = async (req, res) => {
    try {
        const { repoId } = req.params;
        const filePath = req.query.path;

        if (!filePath) {
            return res.status(400).json({
                success: false,
                message: "File path parameter is required."
            });
        }

        const repository = await RepositoryModel.getRepositoryById(repoId);
        if (!repository || !repository.upload_path) {
            return res.status(404).json({
                success: false,
                message: "Repository source path not found."
            });
        }

        const fs = require("fs");
        const path = require("path");

        let rootPath = path.resolve(repository.upload_path);

        // If rootPath points to a .zip file or does not exist as a directory, find extracted directory
        if (fs.existsSync(rootPath) && fs.statSync(rootPath).isFile()) {
            const possibleDir = rootPath.replace(/\.zip$/i, "");
            if (fs.existsSync(possibleDir) && fs.statSync(possibleDir).isDirectory()) {
                rootPath = possibleDir;
            } else {
                const parentDir = path.dirname(rootPath);
                const extractedDir = path.join(parentDir, "extracted-" + path.basename(rootPath, ".zip"));
                if (fs.existsSync(extractedDir)) {
                    rootPath = extractedDir;
                }
            }
        }

        let targetPath = path.resolve(rootPath, filePath);

        // Security check
        if (!targetPath.startsWith(rootPath)) {
            const cleanPath = filePath.replace(/^[/\\]+/, "");
            targetPath = path.resolve(rootPath, cleanPath);
        }

        if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
            const content = fs.readFileSync(targetPath, "utf8");
            return res.status(200).json({
                success: true,
                filePath,
                content
            });
        }

        // Search recursively if target file path is slightly nested
        const filename = path.basename(filePath);
        const findFileRecursively = (dir) => {
            if (!fs.existsSync(dir)) return null;
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const full = path.join(dir, entry.name);
                if (entry.isDirectory() && !entry.name.startsWith("node_modules") && !entry.name.startsWith(".")) {
                    const found = findFileRecursively(full);
                    if (found) return found;
                } else if (entry.isFile() && entry.name === filename) {
                    return full;
                }
            }
            return null;
        };

        const resolvedPath = findFileRecursively(rootPath);
        if (resolvedPath && fs.existsSync(resolvedPath)) {
            const content = fs.readFileSync(resolvedPath, "utf8");
            return res.status(200).json({
                success: true,
                filePath,
                content
            });
        }

        return res.status(404).json({
            success: false,
            message: "File not found on disk."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/*
|--------------------------------------------------------------------------
| Delete Repository & Clean Files
|--------------------------------------------------------------------------
*/

RepositoryController.deleteRepository = async (req, res) => {
    try {
        const { repoId } = req.params;
        const userId = req.user.userId;

        const repository = await RepositoryModel.getRepositoryById(repoId);
        if (!repository) {
            return res.status(404).json({
                success: false,
                message: "Repository not found."
            });
        }

        // Delete records from database
        const deletedRepo = await RepositoryModel.deleteRepository(repoId, userId);

        // Delete disk folder if it exists
        if (repository.upload_path) {
            const fs = require("fs");
            if (fs.existsSync(repository.upload_path)) {
                fs.rmSync(repository.upload_path, { recursive: true, force: true });
            }
        }

        return res.status(200).json({
            success: true,
            message: "Repository deleted successfully.",
            repository: deletedRepo
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/*
|--------------------------------------------------------------------------
| Summarize File Source Code with Gemini AI
|--------------------------------------------------------------------------
*/

RepositoryController.summarizeFile = async (req, res) => {
    try {
        const { filePath, content } = req.body;
        const userApiKey = req.headers["x-ai-api-key"] || req.headers["x-gemini-api-key"];
        const aiProvider = req.headers["x-ai-provider"];

        if (!filePath || !content) {
            return res.status(400).json({
                success: false,
                message: "filePath and content are required."
            });
        }

        const summary = await AIService.generateFileSummary(filePath, content, userApiKey, aiProvider);

        return res.status(200).json({
            success: true,
            filePath,
            summary
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/*
|--------------------------------------------------------------------------
| File-Specific AI Chat
|--------------------------------------------------------------------------
*/

RepositoryController.chatWithFile = async (req, res) => {
    try {
        const { filePath, content, message } = req.body;
        const userApiKey = req.headers["x-ai-api-key"] || req.headers["x-gemini-api-key"];
        const aiProvider = req.headers["x-ai-provider"];

        if (!filePath || !content || !message) {
            return res.status(400).json({
                success: false,
                message: "filePath, content, and message are required."
            });
        }

        const reply = await AIService.chatWithFile(filePath, content, message, userApiKey, aiProvider);

        return res.status(200).json({
            success: true,
            reply
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = RepositoryController;