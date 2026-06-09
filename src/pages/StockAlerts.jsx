import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { getStockAlerts } from "../lib/api/productDepots";
import { createStockAlertSocket } from "../lib/api/alertSocket";

const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";
const BORDER = "0.5px solid #e0ebe0";

const STATUS_CONFIG = {
    LOW_STOCK: { label: "Low stock", color: "#d97706", bg: "#fffbeb", border: "#fbbf24" },
    OUT_OF_STOCK: { label: "Out of stock", color: "#dc2626", bg: "#fef2f2", border: "#f87171" },
};

const FILTERS = [
    { key: "all", label: "All" },
    { key: "LOW_STOCK", label: "Low stock" },
    { key: "OUT_OF_STOCK", label: "Out of stock" },
];

function AlertCard({ alert }) {
    const config = STATUS_CONFIG[alert.status] ?? STATUS_CONFIG.LOW_STOCK;
    return (
        <div style={{ background: "#fff", border: BORDER, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, fontFamily: FONT }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: config.bg, border: `0.5px solid ${config.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 2 }}>{alert.productName}</div>
                <div style={{ fontSize: 12, color: "#888" }}>
                    {alert.category} · {alert.depotName} · Stock: <strong style={{ color: config.color }}>{alert.stockQuantity}</strong> · Threshold: {alert.stockThreshold}
                </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: config.color, background: config.bg, border: `0.5px solid ${config.border}`, borderRadius: 999, padding: "4px 12px", whiteSpace: "nowrap", flexShrink: 0 }}>
                {config.label}
            </span>
        </div>
    );
}

function StatCard({ label, count, color, accentColor }) {
    return (
        <div style={{ background: "#fff", border: BORDER, borderRadius: 12, padding: "16px 20px", borderLeft: `3px solid ${accentColor}`, fontFamily: FONT }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#aaa", marginBottom: 8, textTransform: "uppercase", letterSpacing: "1px" }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{count}</div>
        </div>
    );
}

export default function StockAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => { loadAlerts(); }, []);

    useEffect(() => {
        const client = createStockAlertSocket(() => loadAlerts());
        return () => { client.deactivate(); };
    }, []);

    const loadAlerts = async () => {
        setLoading(true); setError(null);
        try { setAlerts(await getStockAlerts()); }
        catch { setError("Failed to load stock alerts."); }
        finally { setLoading(false); }
    };

    const filtered = activeFilter === "all" ? alerts : alerts.filter((a) => a.status === activeFilter);
    const countByStatus = (status) => alerts.filter((a) => a.status === status).length;

    return (
        <AppLayout>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: FONT, textAlign: "left" }}>

                {/* Header */}
                <div>
                    <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.5px" }}>Stock Alerts</h1>
                    <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>Products requiring attention</p>
                </div>

                {/* Stat cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
                    <StatCard label="Low Stock" count={countByStatus("LOW_STOCK")} color="#d97706" accentColor="#f59e0b" />
                    <StatCard label="Out of Stock" count={countByStatus("OUT_OF_STOCK")} color="#dc2626" accentColor="#ef4444" />
                </div>

                {/* Filters */}
                <div style={{ display: "flex", gap: 8 }}>
                    {FILTERS.map((f) => (
                        <button key={f.key} onClick={() => setActiveFilter(f.key)} style={{
                            fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 999,
                            border: activeFilter === f.key ? "1px solid #17a84a" : BORDER,
                            background: activeFilter === f.key ? "#e6f7ed" : "#fff",
                            color: activeFilter === f.key ? "#17a84a" : "#888",
                            cursor: "pointer", fontFamily: FONT,
                        }}>
                            {f.label}
                            {f.key !== "all" && <span style={{ marginLeft: 6, opacity: 0.7 }}>{countByStatus(f.key)}</span>}
                        </button>
                    ))}
                </div>

                {loading && <div style={{ fontSize: 14, color: "#aaa" }}>Loading alerts…</div>}
                {error && <div style={{ fontSize: 14, color: "#dc2626" }}>{error}</div>}

                {!loading && !error && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {filtered.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa", fontSize: 14 }}>No alerts found</div>
                        ) : (
                            filtered.map((alert, i) => <AlertCard key={`${alert.productId}-${i}`} alert={alert} />)
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}