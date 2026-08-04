import { useNavigate } from "react-router-dom";

import {
    FiUploadCloud,
    FiGithub
} from "react-icons/fi";

import styles from "./QuickActions.module.css";

function QuickActions() {

    const navigate = useNavigate();

    return (

        <div className={styles.card}>

            <div className={styles.header}>

                <h3>Quick Actions</h3>

                <p>
                    Start analyzing your repositories
                </p>

            </div>

            <button
                className={styles.primaryButton}
                onClick={() => navigate("/upload")}
            >

                <FiUploadCloud />

                Upload ZIP Repository

            </button>

            <button
                className={styles.secondaryButton}
                onClick={() => navigate("/github")}
            >

                <FiGithub />

                Import from GitHub

            </button>

        </div>

    );

}

export default QuickActions;