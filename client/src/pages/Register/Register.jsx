import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";

import styles from "./Register.module.css";
import Logo from "../../components/Logo/Logo";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Card from "../../components/Card/Card";

import { registerUser, loginUser } from "../../services/auth.service";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: ""
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

        if (!formData.full_name || !formData.email || !formData.password) {
            setError("All fields are required.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            // Register user
            await registerUser({
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password
            });

            // Automatically log in
            const loginRes = await loginUser({
                email: formData.email,
                password: formData.password
            });

            localStorage.setItem("token", loginRes.data.token);
            localStorage.setItem("user", JSON.stringify(loginRes.data.user));

            navigate("/dashboard");

        } catch (err) {
            console.error("Registration error:", err);
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
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
                    Create an account to start scanning codebases, analyzing
                    architectures, calculating metrics, and using Gemini AI insights.
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
                        Create Account
                    </h2>

                    <p className={styles.subtitle}>
                        Get started with DevLens AI today
                    </p>

                    <form onSubmit={handleSubmit}>

                        <Input
                            label="Full Name"
                            name="full_name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.full_name}
                            onChange={handleChange}
                            icon={<FiUser />}
                        />

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
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            icon={<FiLock />}
                        />

                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
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
                                ? "Creating Account..."
                                : (
                                    <>
                                        Get Started
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
                            Already have an account?
                        </span>

                        <button
                            type="button"
                            className={styles.link}
                            onClick={() => navigate("/")}
                        >
                            Sign In
                        </button>

                    </div>

                </Card>

            </div>

        </div>

    );
}

export default Register;