import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

import styles from "./Login.module.css";
import Logo from "../../components/Logo/Logo";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Card from "../../components/Card/Card";

import { loginUser } from "../../services/auth.service";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await loginUser(formData);

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className={styles.page}>

            <div className={styles.left}>

                <Logo />

                <h1>
                    Repository Intelligence
                </h1>

                <p>
                    Analyze repositories, detect technologies,
                    calculate metrics, and generate AI-powered
                    insights for every project.
                </p>

                <div className={styles.graph}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

            </div>

            <div className={styles.right}>

                <Card>

                    <h2>
                        Welcome Back
                    </h2>

                    <p className={styles.subtitle}>
                        Sign in to continue to DevLens AI
                    </p>

                    <form onSubmit={handleSubmit}>

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            icon={<FiMail />}
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            icon={<FiLock />}
                        />

                        {error && (
                            <p className={styles.error}>
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing In..."
                                : (
                                    <>
                                        Continue
                                        <FiArrowRight
                                            style={{
                                                marginLeft: 8
                                            }}
                                        />
                                    </>
                                )}
                        </Button>

                    </form>

                    <div className={styles.footer}>

                        <span>
                            Don't have an account?
                        </span>

                        <button
                            type="button"
                            className={styles.link}
                            onClick={() => navigate("/register")}
                        >
                            Create Account
                        </button>

                    </div>

                </Card>

            </div>

        </div>

    );
}

export default Login;