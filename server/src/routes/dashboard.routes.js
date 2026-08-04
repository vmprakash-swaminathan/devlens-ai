const express = require("express");

const router = express.Router();

const DashboardController = require("../controllers/dashboard.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.get(
    "/stats",
    authMiddleware,
    DashboardController.getDashboardStats
);

router.get(
    "/recent",
    authMiddleware,
    DashboardController.getRecentRepositories
);

module.exports = router;