const db = require("../config/db");
const UserModel = {};

UserModel.findUserByEmail = async (email) => {
    const query = `
        SELECT *
        FROM users
        WHERE email = $1
    `;

    const result = await db.query(query, [email]);

    return result.rows[0];
};

UserModel.createUser = async (userData) => {
    const { full_name, email, password } = userData;

    const query = `
        INSERT INTO users (
            full_name,
            email,
            password
        )
        VALUES ($1, $2, $3)
        RETURNING user_id, full_name, email, created_at;
    `;

    const values = [
        full_name,
        email,
        password
    ];

    const result = await db.query(query, values);

    return result.rows[0];
};

UserModel.findUserById = async (userId) => {

    const query = `
        SELECT
            user_id,
            full_name,
            email,
            profile_picture,
            created_at
        FROM users
        WHERE user_id = $1
    `;

    const result = await db.query(query, [userId]);

    return result.rows[0];
};

module.exports = UserModel;