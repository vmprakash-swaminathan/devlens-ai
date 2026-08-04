const express = require("express");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/auth.routes");

const db = require("./config/db");

const app = express();

const dashboardRoutes = require("./routes/dashboard.routes");
const repositoryRoutes = require("./routes/repository.routes");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/repositories", repositoryRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to DevLens AI Backend 🚀",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "UP",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "DevLens AI API Server"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});