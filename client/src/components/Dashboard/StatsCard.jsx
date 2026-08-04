import styles from "./StatsCard.module.css";

function StatsCard({

    title,

    value,

    icon,

    color,

    onClick

}){

    return(

        <div
            className={styles.card}
            onClick={onClick}
            style={{ cursor: onClick ? "pointer" : "default" }}
        >

            <div
                className={styles.top}
            >

                <div
                    className={styles.icon}
                    style={{
                        background:color
                    }}
                >

                    {icon}

                </div>

            </div>

            <h3>

                {value}

            </h3>

            <p>

                {title}

            </p>

        </div>

    );

}

export default StatsCard;