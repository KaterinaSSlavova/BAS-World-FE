import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { getStockAlerts } from "../lib/api/productDepots";
import { createStockAlertSocket } from "../lib/api/alertSocket";

const STATUS_CONFIG = {
    LOW_STOCK: {
        label: "Low stock",
        color: "#d97706",
        bg: "#fffbeb",
        border: "#fbbf24",
    },
    OUT_OF_STOCK: {
        label: "Out of stock",
        color: "#dc2626",
        bg: "#fef2f2",
        border: "#f87171",
    },
};

function AlertCard({ alert }) {
    const config = STATUS_CONFIG[alert.status] ?? STATUS_CONFIG.LOW_STOCK;

    return (
        <div style={{
            background: "#fff",
            border: "0.5px solid #e6eaef",
            borderRadius: 14,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
        }}>
            <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: config.bg,
                border: `0.5px solid ${config.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", marginBottom: 2 }}>
                    {alert.productName}
                </div>
                <div style={{ fontSize: 13, color: "#7f8792" }}>
                    {alert.category} · {alert.depotName} · Stock: {alert.stockQuantity} · Threshold: {alert.stockThreshold}
                </div>
            </div>

            <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: config.color,
                background: config.bg,
                border: `1.5px solid ${config.border}`,
                borderRadius: 999,
                padding: "4px 14px",
                whiteSpace: "nowrap",
                flexShrink: 0,
            }}>
                {config.label}
            </span>
        </div>
    );
}

function StatCard({ label, count, color }) {
    return (
        <div style={{
            background: "#fff",
            border: "0.5px solid #e6eaef",
            borderRadius: 14,
            padding: "16px 20px",
        }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#7b8494", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color }}>
                {count}
            </div>
        </div>
    );
}

const FILTERS = [
    { key: "all", label: "All" },
    { key: "LOW_STOCK", label: "Low stock" },
    { key: "OUT_OF_STOCK", label: "Out of stock" },
];

export default function StockAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        loadAlerts();
    }, []);

   useEffect(() => {
       const client = createStockAlertSocket(() => loadAlerts());
       return () => { client.deactivate(); };
   }, []);

    const loadAlerts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getStockAlerts();
            setAlerts(data);
        } catch {
            setError("Failed to load stock alerts.");
        } finally {
            setLoading(false);
        }
    };

    const filtered = activeFilter === "all"
        ? alerts
        : alerts.filter((a) => a.status === activeFilter);

    const countByStatus = (status) => alerts.filter((a) => a.status === status).length;

    return (
        <AppLayout>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#1f2937" }}>
                            Stock alerts
                        </h1>
                        <p style={{ margin: "8px 0 0", color: "#7f8792", fontSize: 16 }}>
                            Products requiring attention
                        </p>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
                    <StatCard label="Low stock" count={countByStatus("LOW_STOCK")} color="#d97706" />
                    <StatCard label="Out of stock" count={countByStatus("OUT_OF_STOCK")} color="#dc2626" />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                    {FILTERS.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setActiveFilter(f.key)}
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                padding: "7px 16px",
                                borderRadius: 999,
                                border: "0.5px solid",
                                borderColor: activeFilter === f.key ? "#2e9d5b" : "#e6eaef",
                                background: activeFilter === f.key ? "#f0faf4" : "#fff",
                                color: activeFilter === f.key ? "#2e9d5b" : "#7b8494",
                                cursor: "pointer",
                            }}
                        >
                            {f.label}
                            {f.key !== "all" && (
                                <span style={{ marginLeft: 6, opacity: 0.7 }}>
                                    {countByStatus(f.key)}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {loading && (
                    <div style={{ fontSize: 14, color: "#9ca3af" }}>Loading alerts…</div>
                )}
                {error && (
                    <div style={{ fontSize: 14, color: "#dc2626" }}>{error}</div>
                )}

                {!loading && !error && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {filtered.length === 0 ? (
                            <div style={{
                                textAlign: "center",
                                padding: "48px 0",
                                color: "#9ca3af",
                                fontSize: 14,
                            }}>
                                No alerts found
                            </div>
                        ) : (
                            filtered.map((alert, i) => (
                                <AlertCard key={`${alert.productId}-${i}`} alert={alert} />
                            ))
                        )}
                    </div>
                )}

            </div>
        </AppLayout>
    );
}