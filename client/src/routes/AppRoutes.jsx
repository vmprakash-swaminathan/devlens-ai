import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Repository from "../pages/Repository/Repository";
import RepositoryList from "../pages/RepositoryList/RepositoryList";
import Metrics from "../pages/Metrics/Metrics";
import AIAnalysis from "../pages/AIAnalysis/AIAnalysis";
import AIChat from "../pages/AIChat/AIChat";
import GithubImport from "../pages/GithubImport/GithubImport";
import Upload from "../pages/Upload/Upload";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";

/*
|--------------------------------------------------------------------------
| Protected Route
|--------------------------------------------------------------------------
*/

function ProtectedRoute({ children }) {

    const token = localStorage.getItem("token");

    return token ? children : <Navigate to="/" replace />;

}

/*
|--------------------------------------------------------------------------
| Public Route
|--------------------------------------------------------------------------
*/

function PublicRoute({ children }) {

    const token = localStorage.getItem("token");

    return token ? <Navigate to="/dashboard" replace /> : children;

}

/*
|--------------------------------------------------------------------------
| App Routes
|--------------------------------------------------------------------------
*/

export default function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Login */}

                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                {/* Register */}

                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />

                {/* Dashboard */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* ZIP Upload */}
                <Route
                    path="/upload"
                    element={
                        <ProtectedRoute>
                            <Upload />
                        </ProtectedRoute>
                    }
                />

                {/* GitHub Import */}
                <Route
                    path="/github"
                    element={
                        <ProtectedRoute>
                            <GithubImport />
                        </ProtectedRoute>
                    }
                />

                {/* Reports Overview */}
                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <Reports />
                        </ProtectedRoute>
                    }
                />

                {/* Settings */}
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />

                {/* Repositories List */}
                <Route
                    path="/repositories"
                    element={
                        <ProtectedRoute>
                            <RepositoryList />
                        </ProtectedRoute>
                    }
                />

                {/* Repository Explorer */}
                <Route
                    path="/repositories/:repoId"
                    element={
                        <ProtectedRoute>
                            <Repository />
                        </ProtectedRoute>
                    }
                />

                {/* Repository Metrics */}
                <Route
                    path="/repositories/:repoId/metrics"
                    element={
                        <ProtectedRoute>
                            <Metrics />
                        </ProtectedRoute>
                    }
                />

                {/* Repository AI Analysis */}
                <Route
                    path="/repositories/:repoId/analysis"
                    element={
                        <ProtectedRoute>
                            <AIAnalysis />
                        </ProtectedRoute>
                    }
                />

                {/* Repository AI Chat */}
                <Route
                    path="/repositories/:repoId/chat"
                    element={
                        <ProtectedRoute>
                            <AIChat />
                        </ProtectedRoute>
                    }
                />
                {/* Redirect Unknown Routes */}

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>

        </BrowserRouter>

    );

}