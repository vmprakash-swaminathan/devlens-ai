const path = require("path");

const detectTechnologies = (projectFiles) => {

    const technologies = [];

    const fileNames = projectFiles.map(file =>
        path.basename(file.path).toLowerCase()
    );

    if (fileNames.includes("package.json")) {
        technologies.push("Node.js");
    }

    if (fileNames.includes("vite.config.js")) {
        technologies.push("Vite");
    }

    if (fileNames.includes("next.config.js")) {
        technologies.push("Next.js");
    }

    if (fileNames.includes("angular.json")) {
        technologies.push("Angular");
    }

    if (fileNames.includes("pom.xml")) {
        technologies.push("Java Spring Boot");
    }

    if (fileNames.includes("requirements.txt")) {
        technologies.push("Python");
    }

    if (fileNames.includes("manage.py")) {
        technologies.push("Django");
    }

    if (fileNames.includes("pubspec.yaml")) {
        technologies.push("Flutter");
    }

    if (fileNames.includes("cargo.toml")) {
        technologies.push("Rust");
    }

    if (fileNames.includes("composer.json")) {
        technologies.push("Laravel / PHP");
    }

    return [...new Set(technologies)];
};

module.exports = {
    detectTechnologies
};