const fs = require("fs");
const path = require("path");

const IGNORED_FOLDERS = [
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    "coverage",
    "vendor"
];

const scanDirectory = (directoryPath) => {

    const items = [];

    function scan(currentPath) {

        const files = fs.readdirSync(currentPath);

        for (const file of files) {

            if (IGNORED_FOLDERS.includes(file))
                continue;

            const fullPath = path.join(currentPath, file);

            const stats = fs.statSync(fullPath);

            const extension = path.extname(file);

            let language = "Unknown";

            switch (extension) {

                case ".js":
                case ".jsx":
                    language = "JavaScript";
                    break;

                case ".ts":
                case ".tsx":
                    language = "TypeScript";
                    break;

                case ".py":
                    language = "Python";
                    break;

                case ".java":
                    language = "Java";
                    break;

                case ".cpp":
                    language = "C++";
                    break;

                case ".c":
                    language = "C";
                    break;

                case ".cs":
                    language = "C#";
                    break;

            }

            items.push({

                name: file,

                path: fullPath,

                type: stats.isDirectory() ? "folder" : "file",

                extension,

                language,

                size: stats.size

            });

            if (stats.isDirectory()) {

                scan(fullPath);

            }

        }

    }

    scan(directoryPath);

    return items;

};

module.exports = {
    scanDirectory
};