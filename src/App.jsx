import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import logo from "./assets/basworld-logo.png";
import Brands from "./pages/Brands.jsx";
import Depots from "./pages/Depots.jsx";
import Configuration from "./pages/Configuration.jsx";
import StockAlerts from "./pages/StockAlerts.jsx";
import Analytics from "./pages/Analytics.jsx";

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
                <Route path="/depots" element={<Depots />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/types" element={<Configuration />} />
                <Route path="/categories" element={<Configuration />} />
                <Route path="/configuration" element={<Configuration />} />
                <Route path="/stock-alerts" element={<StockAlerts />} />
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/analytics" element={<Analytics />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;