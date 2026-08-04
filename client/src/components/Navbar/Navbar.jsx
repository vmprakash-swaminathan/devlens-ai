import styles from "./Navbar.module.css";

import {
    FiBell,
    FiSearch,
    FiUser
} from "react-icons/fi";

function Navbar() {

    const user = JSON.parse(localStorage.getItem("user"));

    const currentHour = new Date().getHours();

    let greeting = "Good Evening";

    if (currentHour < 12) greeting = "Good Morning";
    else if (currentHour < 18) greeting = "Good Afternoon";

    return (

        <header className={styles.navbar}>

            <div>

                <h2>

                    {greeting},

                    <span>

                        {" "}
                        {user?.name || "Developer"} 👋

                    </span>

                </h2>

                <p>

                    Welcome back to DevLens AI

                </p>

            </div>

            <div className={styles.rightSection}>

                <div className={styles.searchBox}>

                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Search repositories..."
                    />

                </div>

                <button className={styles.iconButton}>

                    <FiBell />

                </button>

                <div className={styles.profile}>

                    <div className={styles.avatar}>

                        <FiUser />

                    </div>

                    <div>

                        <h4>

                            {user?.name || "Developer"}

                        </h4>

                        <p>

                            AI Developer

                        </p>

                    </div>

                </div>

            </div>

        </header>

    );

}

export default Navbar;