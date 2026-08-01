const ZipService = require("../services/zip.service");
const FileScanner = require("../services/fileScanner.service");
const ProjectAnalyzer = require("../services/projectAnalyzer.service");
const MetricsService = require("../services/metrics.service");
const RepositoryFileModel = require("../models/repositoryFile.model");
const RepositoryModel = require("../models/repository.model");
const path = require("path");

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

        // Save repository
        const repository = await RepositoryModel.createRepository({
            user_id,
            repository_name,
            upload_path
        });

        console.log("✅ Step 2: Repository Saved");

        // Extract ZIP
        const extractedPath = ZipService.extractRepository(upload_path);

        console.log("✅ Step 3: ZIP Extracted");

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

        // Response
        return res.status(201).json({

            success: true,

            message: "Repository uploaded successfully.",

            repository,

            extractedPath,

            totalFiles: projectFiles.length,

            projectAnalysis,

            projectMetrics,

            preview: projectFiles.slice(0, 20)

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

module.exports = RepositoryController;