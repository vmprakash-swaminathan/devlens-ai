const AdmZip = require("adm-zip");
const path = require("path");
const fs = require("fs");

const extractRepository = (zipPath) => {

    const folderName = path.parse(path.basename(zipPath)).name;

    const extractPath = path.join("extracted", folderName);

    if (!fs.existsSync(extractPath)) {
        fs.mkdirSync(extractPath, { recursive: true });
    }

    const zip = new AdmZip(zipPath);

    zip.extractAllTo(extractPath, true);

    return extractPath;
};

module.exports = {
    extractRepository
};