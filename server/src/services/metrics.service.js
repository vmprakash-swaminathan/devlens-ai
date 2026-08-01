const path = require("path");

const calculateMetrics = (projectFiles) => {

    const metrics = {
        totalFiles: 0,
        totalFolders: 0,
        javascriptFiles: 0,
        typescriptFiles: 0,
        reactComponents: 0,
        cssFiles: 0,
        htmlFiles: 0,
        jsonFiles: 0,
        markdownFiles: 0,
        imageFiles: 0
    };

    projectFiles.forEach(item => {

        if (item.type === "folder") {
            metrics.totalFolders++;
            return;
        }

        metrics.totalFiles++;

        const ext = path.extname(item.name).toLowerCase();

        switch (ext) {

            case ".js":
                metrics.javascriptFiles++;
                break;

            case ".jsx":
                metrics.javascriptFiles++;
                metrics.reactComponents++;
                break;

            case ".ts":
                metrics.typescriptFiles++;
                break;

            case ".tsx":
                metrics.typescriptFiles++;
                metrics.reactComponents++;
                break;

            case ".css":
                metrics.cssFiles++;
                break;

            case ".html":
                metrics.htmlFiles++;
                break;

            case ".json":
                metrics.jsonFiles++;
                break;

            case ".md":
                metrics.markdownFiles++;
                break;

            case ".png":
            case ".jpg":
            case ".jpeg":
            case ".gif":
            case ".svg":
                metrics.imageFiles++;
                break;

        }

    });

    return metrics;
};

module.exports = {
    calculateMetrics
};