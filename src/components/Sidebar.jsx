import { useEffect, useState } from "react";
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
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth <= 768;
    });

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);

            if (mobile) {
                setIsOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const closeSidebar = () => {
        if (isMobile) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {isMobile && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: "fixed",
                        top: 16,
                        left: 16,
                        zIndex: 1100,
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        border: "1px solid #dfe5df",
                        background: "#fff",
                        color: "#1f2937",
                        fontSize: 22,
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                    }}
                    aria-label="Open menu"
                >
                    ☰
                </button>
            )}

            {isMobile && isOpen && (
                <div
                    onClick={closeSidebar}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(15, 23, 42, 0.35)",
                        zIndex: 1050,
                    }}
                />
            )}

            <div
                style={{
                    width: 240,
                    background: "#fff",
                    borderRight: "1px solid #e8ede8",
                    display: "flex",
                    flexDirection: "column",
                    padding: "0 0 24px 0",
                    position: isMobile ? "fixed" : "relative",
                    top: 0,
                    left: 0,
                    height: isMobile ? "100vh" : "auto",
                    zIndex: 1101,
                    transform: isMobile
                        ? isOpen
                            ? "translateX(0)"
                            : "translateX(-100%)"
                        : "translateX(0)",
                    transition: "transform 0.25s ease",
                    boxShadow: isMobile
                        ? "0 10px 30px rgba(0,0,0,0.12)"
                        : "none",
                    overflowY: "auto",
                }}
            >
                <div
                    style={{
                        padding: "24px 20px 20px",
                        borderBottom: "1px solid #f0f4f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img
                            src={logo}
                            alt="BAS World"
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: 10,
                                objectFit: "contain",
                            }}
                        />
                        <div>
                            <div
                                style={{
                                    fontWeight: 700,
                                    fontSize: 15,
                                    color: "#1a1a1a",
                                }}
                            >
                                BAS World
                            </div>
                            <div
                                style={{
                                    fontSize: 10,
                                    color: "#888",
                                    letterSpacing: 1.2,
                                }}
                            >
                                PRODUCT MANAGEMENT
                            </div>
                        </div>
                    </div>

                    {isMobile && (
                        <button
                            onClick={closeSidebar}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                border: "1px solid #e5e7eb",
                                background: "#fff",
                                cursor: "pointer",
                                fontSize: 18,
                                color: "#374151",
                                flexShrink: 0,
                            }}
                            aria-label="Close menu"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <nav style={{ padding: "16px 12px", flex: 1 }}>
                    {navItems.map(({ label, icon, path }) => (
                        <NavLink
                            key={label}
                            to={path}
                            onClick={closeSidebar}
                            style={({ isActive }) => ({
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "12px 12px",
                                borderRadius: 8,
                                marginBottom: 4,
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
                        <span
                            style={{
                                fontSize: 12,
                                color: "#444",
                                fontWeight: 500,
                            }}
                        >
                            All systems operational
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}