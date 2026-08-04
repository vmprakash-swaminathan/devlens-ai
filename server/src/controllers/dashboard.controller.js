const DashboardModel = require("../models/dashboard.model");

const DashboardController = {};

DashboardController.getDashboardStats = async (req, res) => {

    try {

        const userId = req.user.userId;

        const stats = await DashboardModel.getStats(userId);

        res.json(stats);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

DashboardController.getRecentRepositories = async (req, res) => {

    try {

        const userId = req.user.userId;

        const repositories =
            await DashboardModel.getRecentRepositories(userId);

        res.json(repositories);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = DashboardController;