import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

import styles from "./MainLayout.module.css";

function MainLayout({ children }) {

    return (

        <div className={styles.layout}>

            <Sidebar />

            <div className={styles.main}>

                <Navbar />

                <div className={styles.content}>

                    {children}

                </div>

            </div>

        </div>

    );

}

export default MainLayout;