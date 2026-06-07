import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/basworld-logo.png";

const BRAND = "#17a84a";
const BRAND_LIGHT = "#e6f7ed";
const BRAND_HOVER = "#f0faf3";
const SIDEBAR_WIDTH = 260;

const navItems = [
    {
        group: "MAIN",
        items: [
            { label: "Dashboard", icon: "ti-layout-dashboard", path: "/dashboard" },
            { label: "Products", icon: "ti-box", path: "/products" },
            { label: "Depots", icon: "ti-building-warehouse", path: "/depots" },
            { label: "Configuration", icon: "ti-settings", path: "/configuration" },
        ],
    },
    {
        group: "OPERATIONS",
        items: [
            { label: "Business Rules", icon: "ti-list-check", path: "/business-rules" },
            { label: "Stock Alerts", icon: "ti-alert-triangle", path: "/stock-alerts" },
            { label: "Analytics", icon: "ti-chart-bar", path: "/analytics" },
        ],
    },
];

const styles = {
    sidebar: {
        width: SIDEBAR_WIDTH,
        background: "#fff",
        borderRight: "1px solid #e0ebe0",
        display: "flex",
        flexDirection: "column",
        padding: "0 0 24px 0",
    },
    sidebarMobile: {
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 1101,
        overflowY: "auto",
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        transition: "transform 0.25s ease",
    },
    header: {
        padding: "22px 18px 18px",
        borderBottom: "1px solid #e0ebe0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    logoWrap: {
        display: "flex",
        alignItems: "center",
        gap: 12,
    },
    logoIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        background: BRAND_LIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    brandName: {
        fontWeight: 600,
        fontSize: 15,
        color: "#1a1a1a",
    },
    brandSub: {
        fontSize: 11,
        color: "#888",
        letterSpacing: "0.8px",
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        background: "#fff",
        cursor: "pointer",
        fontSize: 16,
        color: "#374151",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    nav: {
        padding: "14px 12px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        textAlign: "left",  // add this
    },
    groupLabel: {
        fontSize: 11,
        color: "#aaa",
        letterSpacing: "1px",
        padding: "8px 10px 4px",
        fontWeight: 600,
    },
    groupLabelOps: {
        fontSize: 11,
        color: "#aaa",
        letterSpacing: "1px",
        padding: "14px 10px 4px",
        fontWeight: 600,
    },
    hamburger: {
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 1100,
        width: 40,
        height: 40,
        borderRadius: 10,
        border: "1px solid #e0ebe0",
        background: "#fff",
        color: "#1f2937",
        fontSize: 20,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.35)",
        zIndex: 1050,
    },
};

function NavItem({ label, icon, path, onClick }) {
    const [hovered, setHovered] = useState(false);

    return (
        <NavLink
            to={path}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: isActive ? 500 : 400,
                background: isActive ? BRAND_LIGHT : hovered ? BRAND_HOVER : "transparent",
                color: isActive || hovered ? BRAND : "#3a3a3a",
                transition: "background 0.15s, color 0.15s",
            })}
        >
            {({ isActive }) => (
                <>
                    <i
                        className={`ti ${icon}`}
                        style={{
                            fontSize: 20,
                            color: BRAND,
                            opacity: isActive || hovered ? 1 : 0.6,
                            transition: "opacity 0.15s",
                        }}
                        aria-hidden="true"
                    />
                    {label}
                    {isActive && (
                        <div
                            style={{
                                marginLeft: "auto",
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: BRAND,
                            }}
                        />
                    )}
                </>
            )}
        </NavLink>
    );
}

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
            if (mobile) setIsOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const closeSidebar = () => {
        if (isMobile) setIsOpen(false);
    };

    const sidebarStyle = {
        ...styles.sidebar,
        ...(isMobile ? styles.sidebarMobile : {}),
        ...(isMobile ? { transform: isOpen ? "translateX(0)" : "translateX(-100%)" } : {}),
    };

    return (
        <>
            {isMobile && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={styles.hamburger}
                    aria-label="Open menu"
                >
                    ☰
                </button>
            )}

            {isMobile && isOpen && (
                <div onClick={closeSidebar} style={styles.overlay} />
            )}

            <div style={sidebarStyle}>
                <div style={styles.header}>
                    <div style={styles.logoWrap}>
                        <div style={styles.logoIcon}>
                            <img
                                src={logo}
                                alt="BAS World"
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                        </div>
                        <div>
                            <div style={styles.brandName}>BAS World</div>
                            <div style={styles.brandSub}>PRODUCT MGMT</div>
                        </div>
                    </div>
                    {isMobile && (
                        <button onClick={closeSidebar} style={styles.closeBtn} aria-label="Close menu">
                            ✕
                        </button>
                    )}
                </div>

                <nav style={styles.nav}>
                    {navItems.map(({ group, items }, gi) => (
                        <div key={group}>
                            <div style={gi === 0 ? styles.groupLabel : styles.groupLabelOps}>
                                {group}
                            </div>
                            {items.map(({ label, icon, path }) => (
                                <NavItem
                                    key={label}
                                    label={label}
                                    icon={icon}
                                    path={path}
                                    onClick={closeSidebar}
                                />
                            ))}
                        </div>
                    ))}
                </nav>
            </div>
        </>
    );
}