import { NavLink } from "react-router-dom";
import logo from "../assets/basworld-logo.png";

const navItems = [
    { label: "Dashboard", icon: "⊞", path: "/dashboard" },
    { label: "Products", icon: "◈", path: "/products" },
    { label: "Depots", icon: "▦", path: "/depots" },
    { label: "Business Rules", icon: "⟳", path: "/business-rules" },
    { label: "Stock Alerts", icon: "△", path: "/stock-alerts" },
    { label: "Analytics", icon: "⌇", path: "/analytics" },
];

export default function Sidebar() {
    return (
        <div
            style={{
                width: 240,
                background: "#fff",
                borderRight: "1px solid #e8ede8",
                display: "flex",
                flexDirection: "column",
                padding: "0 0 24px 0",
            }}
        >
            <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #f0f4f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img
                        src={logo}
                        alt="BAS World"
                        style={{ width: 38, height: 38, borderRadius: 10, objectFit: "contain" }}
                    />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>
                            BAS World
                        </div>
                        <div style={{ fontSize: 10, color: "#888", letterSpacing: 1.2 }}>
                            PRODUCT MANAGEMENT
                        </div>
                    </div>
                </div>
            </div>

            <nav style={{ padding: "16px 12px", flex: 1 }}>
                {navItems.map(({ label, icon, path }) => (
                    <NavLink
                        key={label}
                        to={path}
                        style={({ isActive }) => ({
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 12px",
                            borderRadius: 8,
                            marginBottom: 2,
                            cursor: "pointer",
                            textDecoration: "none",
                            background: isActive ? "#e8f5e9" : "transparent",
                            color: isActive ? "#2e7d32" : "#555",
                            fontWeight: isActive ? 600 : 400,
                            fontSize: 14,
                            transition: "all 0.15s",
                        })}
                    >
                        <span style={{ fontSize: 16 }}>{icon}</span>
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div
                style={{
                    padding: "12px 20px",
                    margin: "0 12px",
                    background: "#f8faf8",
                    borderRadius: 8,
                }}
            >
                <div
                    style={{
                        fontSize: 10,
                        color: "#888",
                        letterSpacing: 1.2,
                        marginBottom: 6,
                    }}
                >
                    SYSTEM STATUS
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#4caf50",
                        }}
                    />
                    <span style={{ fontSize: 12, color: "#444", fontWeight: 500 }}>
                        All systems operational
                    </span>
                </div>
            </div>
        </div>
    );
}