import styles from "./Logo.module.css";

export default function Logo() {
    return (
        <div className={styles.logo}>
            <div className={styles.icon}>
                <div className={styles.dot}></div>
            </div>

            <div className={styles.text}>
                <span className={styles.dev}>Dev</span>
                <span className={styles.lens}>Lens</span>
                <span className={styles.ai}>AI</span>
            </div>
        </div>
    );
}