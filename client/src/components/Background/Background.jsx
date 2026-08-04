import styles from "./Background.module.css";

export default function Background(){

    return(

        <div className={styles.background}>

            <div className={styles.orb1}></div>

            <div className={styles.orb2}></div>

            <div className={styles.grid}></div>

        </div>

    );

}