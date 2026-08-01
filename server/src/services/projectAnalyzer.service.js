const path = require("path");

const analyzeProject = (projectFiles) => {

    const fileNames = projectFiles.map(file =>
        path.basename(file.path).toLowerCase()
    );

    const analysis = {
        framework: "Unknown",
        buildTool: "Unknown",
        language: "Unknown",
        frontend: false,
        backend: false,
        hasReadme: false,
        hasGitIgnore: false,
        entryPoint: null
    };

    if (fileNames.includes("package.json")) {
        analysis.language = "JavaScript / TypeScript";
    }

    if (fileNames.includes("vite.config.js")) {
        analysis.framework = "React";
        analysis.buildTool = "Vite";
        analysis.frontend = true;
    }

    if (fileNames.includes("next.config.js")) {
        analysis.framework = "Next.js";
        analysis.frontend = true;
        analysis.backend = true;
    }

    if (fileNames.includes("pom.xml")) {
        analysis.framework = "Spring Boot";
        analysis.language = "Java";
        analysis.backend = true;
    }

    if (fileNames.includes("requirements.txt")) {
        analysis.language = "Python";
        analysis.backend = true;
    }

    if (fileNames.includes("readme.md")) {
        analysis.hasReadme = true;
    }

    if (fileNames.includes(".gitignore")) {
        analysis.hasGitIgnore = true;
    }

    if (fileNames.includes("main.jsx")) {
        analysis.entryPoint = "src/main.jsx";
    }

    if (fileNames.includes("index.js")) {
        analysis.entryPoint = "src/index.js";
    }

    return analysis;
};

module.exports = {
    analyzeProject
};