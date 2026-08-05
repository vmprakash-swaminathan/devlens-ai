const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No token provided."
            });
        }

        const token = authHeader.split(" ")[1];

        const secretKey = process.env.JWT_SECRET || "devlens_ai_jwt_secret_key_2026";
        const decoded = jwt.verify(token, secretKey);

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token."
        });

    }
};

module.exports = authenticateUser;