const express = require("express");
const AuthController = require("../controllers/auth.controller");
const authenticateUser = require("../middleware/auth.middleware");

const router = express.Router();

// Existing routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Add the new test route here
router.get("/test", authenticateUser, (req, res) => {
    res.json({
        message: "Middleware Passed Successfully"
    });
});

module.exports = router;