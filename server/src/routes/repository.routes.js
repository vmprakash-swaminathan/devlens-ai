const express = require("express");
const RepositoryController = require("../controllers/repository.controller");
const authenticateUser = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.post(
    "/upload",
    authenticateUser,
    upload.single("project"),
    RepositoryController.uploadProject
);

module.exports = router;