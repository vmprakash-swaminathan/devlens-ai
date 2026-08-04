const express = require("express");

const RepositoryController = require("../controllers/repository.controller");
const authenticateUser = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Upload ZIP Repository
|--------------------------------------------------------------------------
*/

router.post(
    "/upload",
    authenticateUser,
    upload.single("project"),
    RepositoryController.uploadProject
);

/*
|--------------------------------------------------------------------------
| Import GitHub Repository
|--------------------------------------------------------------------------
*/

router.post(
    "/github",
    authenticateUser,
    RepositoryController.importGithubRepository
);

/*
|--------------------------------------------------------------------------
| Get All User Repositories
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authenticateUser,
    RepositoryController.getUserRepositories
);

/*
|--------------------------------------------------------------------------
| Get Repository Files
|--------------------------------------------------------------------------
*/

router.get(
    "/:repoId/files",
    authenticateUser,
    RepositoryController.getRepositoryFiles
);

/*
|--------------------------------------------------------------------------
| Get Repository Metrics & Analysis
|--------------------------------------------------------------------------
*/

router.get(
    "/:repoId/metrics",
    authenticateUser,
    RepositoryController.getRepositoryMetrics
);

/*
|--------------------------------------------------------------------------
| Get AI Analysis & Summary
|--------------------------------------------------------------------------
*/

router.get(
    "/:repoId/analysis",
    authenticateUser,
    RepositoryController.getAIAnalysis
);

/*
|--------------------------------------------------------------------------
| Chat with Repository Context
|--------------------------------------------------------------------------
*/

router.post(
    "/:repoId/chat",
    authenticateUser,
    RepositoryController.chatWithRepository
);

/*
|--------------------------------------------------------------------------
| Get Source File Content
|--------------------------------------------------------------------------
*/

router.get(
    "/:repoId/file-content",
    authenticateUser,
    RepositoryController.getFileContent
);

/*
|--------------------------------------------------------------------------
| Delete Repository
|--------------------------------------------------------------------------
*/

router.delete(
    "/:repoId",
    authenticateUser,
    RepositoryController.deleteRepository
);

/*
|--------------------------------------------------------------------------
| Summarize File Code
|--------------------------------------------------------------------------
*/

router.post(
    "/:repoId/file-summary",
    authenticateUser,
    RepositoryController.summarizeFile
);

/*
|--------------------------------------------------------------------------
| File-Specific AI Chat
|--------------------------------------------------------------------------
*/

router.post(
    "/:repoId/file-chat",
    authenticateUser,
    RepositoryController.chatWithFile
);

module.exports = router;