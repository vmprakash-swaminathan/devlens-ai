import {
    FiGrid,
    FiFolder,
    FiUploadCloud,
    FiGithub,
    FiBarChart2,
    FiSettings,
    FiLogOut
} from "react-icons/fi";

import { NavLink, useNavigate } from "react-router-dom";

import Logo from "../Logo/Logo";
import styles from "./Sidebar.module.css";

function Sidebar() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };

    return (

        <aside className={styles.sidebar}>

            <div>

                <div className={styles.logo}>

                    <Logo />

                </div>

                <p className={styles.caption}>
                    Repository Intelligence
                </p>

                <nav className={styles.menu}>

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.item} ${styles.active}`
                                : styles.item
                        }
                    >
                        <FiGrid />
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/repositories"
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.item} ${styles.active}`
                                : styles.item
                        }
                    >
                        <FiFolder />
                        Repositories
                    </NavLink>

                    <NavLink
                        to="/upload"
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.item} ${styles.active}`
                                : styles.item
                        }
                    >
                        <FiUploadCloud />
                        Upload
                    </NavLink>

                    <NavLink
                        to="/github"
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.item} ${styles.active}`
                                : styles.item
                        }
                    >
                        <FiGithub />
                        GitHub Import
                    </NavLink>

                    <NavLink
                        to="/reports"
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.item} ${styles.active}`
                                : styles.item
                        }
                    >
                        <FiBarChart2 />
                        Reports
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.item} ${styles.active}`
                                : styles.item
                        }
                    >
                        <FiSettings />
                        Settings
                    </NavLink>

                </nav>

            </div>

            <button
                onClick={logout}
                className={styles.logout}
            >
                <FiLogOut />
                Logout
            </button>

        </aside>

    );

}

export default Sidebar;