const db = require("../config/db");

const RepositoryFileModel = {};

RepositoryFileModel.createFile = async (fileData) => {

    const query = `
        INSERT INTO repository_files
        (
            repo_id,
            file_name,
            file_path,
            file_extension,
            language,
            size
        )
        VALUES ($1,$2,$3,$4,$5,$6);
    `;

    const values = [
        fileData.repo_id,
        fileData.file_name,
        fileData.file_path,
        fileData.file_extension,
        fileData.language,
        fileData.size
    ];

    await db.query(query, values);
};

RepositoryFileModel.createMultipleFiles = async (repo_id, projectFiles) => {

    for (const file of projectFiles) {

        await RepositoryFileModel.createFile({
            repo_id,
            file_name: file.name,
            file_path: file.path,
            file_extension: file.extension,
            language: file.language,
            size: file.size
        });

    }

};

module.exports = RepositoryFileModel;