const db = require("../config/db");

const RepositoryModel = {};

/*
|--------------------------------------------------------------------------
| Create Repository
|--------------------------------------------------------------------------
*/

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
        repositoryData.repository_type || "upload",
        repositoryData.github_url || null,
        repositoryData.upload_path || null,
        repositoryData.branch_name || null,
        "completed"
    ];

    const result = await db.query(query, values);

    return result.rows[0];

};

/*
|--------------------------------------------------------------------------
| Get Repository Files
|--------------------------------------------------------------------------
*/

RepositoryModel.getRepositoryFiles = async (repoId) => {

    const query = `
        SELECT
            file_id,
            file_name,
            file_path,
            file_extension,
            language,
            size
        FROM repository_files
        WHERE repo_id = $1
        ORDER BY file_path ASC;
    `;

    const result = await db.query(query, [repoId]);

    return result.rows;

};

/*
|--------------------------------------------------------------------------
| Get Repository By ID
|--------------------------------------------------------------------------
*/

RepositoryModel.getRepositoryById = async (repoId) => {

    const query = `
        SELECT *
        FROM repositories
        WHERE repo_id = $1;
    `;

    const result = await db.query(query, [repoId]);

    return result.rows[0];

};

/*
|--------------------------------------------------------------------------
| Get All Repositories of a User
|--------------------------------------------------------------------------
*/

RepositoryModel.getRepositoriesByUser = async (userId) => {

    const query = `
        SELECT
            repo_id,
            repository_name,
            repository_type,
            status,
            created_at
        FROM repositories
        WHERE user_id = $1
        ORDER BY created_at DESC;
    `;

    const result = await db.query(query, [userId]);

    return result.rows;

};

/*
|--------------------------------------------------------------------------
| Delete Repository
|--------------------------------------------------------------------------
*/

RepositoryModel.deleteRepository = async (repoId, userId) => {
    // Delete associated files first
    await db.query(`DELETE FROM repository_files WHERE repo_id = $1;`, [repoId]);
    // Delete repository
    const result = await db.query(`DELETE FROM repositories WHERE repo_id = $1 AND user_id = $2 RETURNING *;`, [repoId, userId]);
    return result.rows[0];
};

module.exports = RepositoryModel;