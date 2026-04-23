import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import logo from "./assets/basworld-logo.png";

function LandingPage() {
    return (
        <div className="page">
            <div className="card">
                <img src={logo} alt="BAS World" className="logo" />
                <p className="subtitle">Smart Solutions</p>

                <Link
                    to="/dashboard"
                    style={{
                        marginTop: 20,
                        padding: "10px 24px",
                        background: "#2e7d32",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 600,
                        textDecoration: "none",
                        display: "inline-block",
                    }}
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;