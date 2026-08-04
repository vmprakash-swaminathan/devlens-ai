const db = require("../config/db");

const DashboardModel = {};

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

DashboardModel.getStats = async (userId) => {

    const repositoryResult = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM repositories
        WHERE user_id = $1
        `,
        [userId]
    );

    const fileResult = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM repository_files rf
        JOIN repositories r
        ON rf.repo_id = r.repo_id
        WHERE r.user_id = $1
        `,
        [userId]
    );

    return {
        repositories: Number(repositoryResult.rows[0].total),
        files: Number(fileResult.rows[0].total),
        reports: Number(repositoryResult.rows[0].total),
        healthScore: 9.4
    };

};

/*
|--------------------------------------------------------------------------
| Recent Repositories
|--------------------------------------------------------------------------
*/

DashboardModel.getRecentRepositories = async (userId) => {

    const result = await db.query(
        `
        SELECT
            repo_id,
            repository_name,
            created_at,
            status
        FROM repositories
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 5
        `,
        [userId]
    );

    return result.rows;

};

module.exports = DashboardModel;