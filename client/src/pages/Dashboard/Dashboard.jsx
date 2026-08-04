import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiFolder,
    FiFileText,
    FiBarChart2,
    FiActivity
} from "react-icons/fi";

import MainLayout from "../../layouts/MainLayout";
import { getDashboardStats } from "../../services/dashboard.service";

import StatsCard from "../../components/Dashboard/StatsCard";
import QuickActions from "../../components/Dashboard/QuickActions";
import RecentRepositories from "../../components/Dashboard/RecentRepositories";

import styles from "./Dashboard.module.css";

function Dashboard() {

    const navigate = useNavigate();
    const [stats, setStats] = useState({
        repositories: 0,
        files: 0,
        reports: 0,
        healthScore: 0
    });

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const response = await getDashboardStats();

                console.log(response.data);

                setStats(response.data);

            } catch (error) {

                console.error("Dashboard Error:", error);

            }

        };

        loadDashboard();

    }, []);

    return (

        <MainLayout>

            <div className={styles.header}>

                <h1>
                    Repository Overview
                </h1>

                <p>
                    Monitor your repositories and AI analysis.
                </p>

            </div>

            <div className={styles.stats}>

                <StatsCard
                    title="Repositories"
                    value={stats.repositories}
                    icon={<FiFolder />}
                    color="#32C2BF"
                    onClick={() => navigate("/repositories")}
                />

                <StatsCard
                    title="Files"
                    value={stats.files}
                    icon={<FiFileText />}
                    color="#315BFF"
                    onClick={() => navigate("/repositories")}
                />

                <StatsCard
                    title="AI Reports"
                    value={stats.reports}
                    icon={<FiBarChart2 />}
                    color="#F59E0B"
                    onClick={() => navigate("/reports")}
                />

                <StatsCard
                    title="Health Score"
                    value={stats.healthScore}
                    icon={<FiActivity />}
                    color="#22C55E"
                    onClick={() => navigate("/reports")}
                />

            </div>

            <div className={styles.bottomSection}>

                <QuickActions />

                <RecentRepositories />

            </div>

        </MainLayout>

    );

}

export default Dashboard;