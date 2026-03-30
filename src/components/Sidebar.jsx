
const navItems = [
    { label: "Dashboard", icon: "⊞" },
    { label: "Products", icon: "◈" },
    { label: "Depots", icon: "▦" },
    { label: "Business Rules", icon: "⟳" },
    { label: "Stock Alerts", icon: "△" },
    { label: "Analytics", icon: "⌇" },
];

export default function Sidebar({ active, setActive }) {
    return (
        <div style={{
            width: 240,
            background: "#fff",
            borderRight: "1px solid #e8ede8",
            display: "flex",
            flexDirection: "column",
            padding: "0 0 24px 0",
        }}>
            {/* Logo */}
            <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #f0f4f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={"../assets/basworld-logo.png"} alt="BAS World" style={{ width: 38, height: 38, borderRadius: 10, objectFit: "contain" }} />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>BAS World</div>
                        <div style={{ fontSize: 10, color: "#888", letterSpacing: 1.2 }}>PRODUCT MANAGEMENT</div>
                    </div>
                </div>
            </div>

            {/* Nav items */}
            <nav style={{ padding: "16px 12px", flex: 1 }}>
                {navItems.map(({ label, icon }) => (
                    <div
                        key={label}
                        onClick={() => setActive(label)}
                        style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "10px 12px", borderRadius: 8, marginBottom: 2,
                            cursor: "pointer",
                            background: active === label ? "#e8f5e9" : "transparent",
                            color: active === label ? "#2e7d32" : "#555",
                            fontWeight: active === label ? 600 : 400,
                            fontSize: 14,
                            transition: "all 0.15s",
                        }}
                    >
                        <span style={{ fontSize: 16 }}>{icon}</span>
                        {label}
                    </div>
                ))}
            </nav>

            {/* System status */}
            <div style={{ padding: "12px 20px", margin: "0 12px", background: "#f8faf8", borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: "#888", letterSpacing: 1.2, marginBottom: 6 }}>SYSTEM STATUS</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4caf50" }} />
                    <span style={{ fontSize: 12, color: "#444", fontWeight: 500 }}>All systems operational</span>
                </div>
            </div>
        </div>
    );
}