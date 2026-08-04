import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecentRepositories } from "../../services/dashboard.service";

import styles from "./RecentRepositories.module.css";

function RecentRepositories() {

    const navigate = useNavigate();
    const [repositories, setRepositories] = useState([]);

    useEffect(() => {

        const loadRepositories = async () => {

            try {

                const response = await getRecentRepositories();

                setRepositories(response.data);

            } catch (error) {

                console.error(error);

            }

        };

        loadRepositories();

    }, []);

    return (

        <div className={styles.card}>

            <h3>
                Recent Repositories
            </h3>

            {
                repositories.length === 0 ? (

                    <p>No repositories found.</p>

                ) : (

                    repositories.map((repo) => (

                        <div
                            className={styles.item}
                            key={repo.repo_id}
                            onClick={() => navigate(`/repositories/${repo.repo_id}`)}
                            style={{ cursor: "pointer" }}
                        >

                            <div>

                                <h4>
                                    {repo.repository_name}
                                </h4>

                                <p>
                                    {new Date(repo.created_at)
                                        .toLocaleDateString()}
                                </p>

                            </div>

                            <span>

                                {repo.status}

                            </span>

                        </div>

                    ))

                )

            }

        </div>

    );

}

export default RecentRepositories;