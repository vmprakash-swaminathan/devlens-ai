const db = require("../config/db");

const RepositoryModel = {};

RepositoryModel.createRepository = async (repositoryData) => {

    const query = `
        INSERT INTO repositories
        (
            user_id,
            repository_name,
            repository_type,
            github_url,
            upload_path,
            branch_name,
            status
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *;
    `;

    const values = [
        repositoryData.user_id,
        repositoryData.repository_name,
        "upload",
        null,
        repositoryData.upload_path,
        null,
        "pending"
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};

module.exports = RepositoryModel;