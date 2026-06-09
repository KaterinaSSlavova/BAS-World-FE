import { useEffect, useState } from "react";
import { getAllProductDepots } from "../lib/api/productDepots";
import { getDepotOverview } from "../lib/api/depots";
import { getProductInsights } from "../lib/api/productsInsights";
import AppLayout from "../components/AppLayout";

function formatPrice(value) {
    return new Intl.NumberFormat("en-EU", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));
}

function isActive(status) {
    return (status ?? "").toUpperCase() === "ACTIVE";
}

function isDraft(status) {
    return (status ?? "").toUpperCase() === "DRAFT";
}

function formatStatus(status) {
    const safeStatus = status ?? "UNKNOWN";
    return safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1).toLowerCase();
}

function StatCard({ label, value, sub, accentColor }) {
    return (
        <div style={{
            background: "#fff",
            border: "0.5px solid #e0ebe0",
            borderRadius: 12,
            padding: "18px 20px",
            borderLeft: `3px solid ${accentColor}`,
        }}>
            <div style={{ fontSize: 11, color: "#aaa", letterSpacing: "1px", fontWeight: 600, marginBottom: 8 }}>
                {label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", lineHeight: 1 }}>
                {value}
            </div>
            <div style={{ fontSize: 12, color: accentColor, marginTop: 6, fontWeight: 500 }}>
                {sub}
            </div>
        </div>
    );
}

function TableRow({ sku, name, category, price, status }) {
    const [hovered, setHovered] = useState(false);
    const active = isActive(status);
    const draft = isDraft(status);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr",
                padding: "18px 20px",
                borderBottom: "0.5px solid #f0f4f0",
                alignItems: "center",
                background: hovered ? "#f8faf8" : "#fff",
                transition: "background 0.15s",
            }}
        >
            <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>{sku}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{name}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{category}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{price}</div>
            <div>
                <span style={{
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600,
                    background: active ? "#e6f7ed" : draft ? "#fffbeb" : "#f3f4f6",
                    color: active ? "#17a84a" : draft ? "#d97706" : "#6b7280",
                }}>
                    {formatStatus(status)}
                </span>
            </div>
        </div>
    );
}

function DepotCard({ name, location, count }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? "#f0faf3" : "#fff",
                border: "0.5px solid #e0ebe0",
                borderRadius: 10,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                transition: "background 0.15s",
            }}
        >
            <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "#e6f7ed", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
                <i className="ti ti-building-warehouse" style={{ fontSize: 18, color: "#17a84a" }} aria-hidden="true" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{name}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{location}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#17a84a", whiteSpace: "nowrap" }}>
                {count} products
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [depots, setDepots] = useState([]);
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth <= 768;
    });

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const [productData, depotData, insightsData] = await Promise.all([
                    getAllProductDepots(),
                    getDepotOverview(),
                    getProductInsights(),
                ]);
                setProducts(productData ?? []);
                setDepots(depotData?.depots ?? []);
                setInsights(insightsData);
            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        void load();
    }, []);

    if (loading) {
        return (
            <AppLayout>
                <div style={{ padding: 40, color: "#7f8792" }}>Loading...</div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout>
                <div style={{ padding: 40, color: "#d14343" }}>{error}</div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                background: "#f7f9f7",
                height: "100vh",
                overflow: "hidden",
                padding: isMobile ? 16 : 28,
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
            }}>
                <div style={{ marginBottom: 20 }}>
                    <h1 style={{
                        fontSize: isMobile ? 22 : 26,
                        fontWeight: 700,
                        color: "#1a1a1a",
                        margin: 0,
                        letterSpacing: "-0.5px",
                        textAlign: "left",
                    }}>
                        Dashboard
                    </h1>
                    <p style={{ color: "#888", margin: "4px 0 0", fontSize: 14, fontWeight: 400 }}>
                        Cross-sell product management overview
                    </p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
                    gap: 14,
                    marginBottom: 20,
                }}>
                    <StatCard label="TOTAL PRODUCTS" value={String(insights?.totalProducts ?? 0)} sub="All products" accentColor="#17a84a" />
                    <StatCard label="UNAVAILABLE" value={String(insights?.unavailableItems ?? 0)} sub="Out of stock" accentColor="#e53935" />
                    <StatCard label="LOW STOCK" value={String(insights?.lowStockProducts ?? 0)} sub="Needs attention" accentColor="#f59e0b" />
                    <StatCard label="INVENTORY VALUE" value={formatPrice(insights?.inventoryValue ?? 0)} sub="Across all products" accentColor="#6366f1" />
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
                    gap: 16,
                    flex: 1,
                    overflow: "hidden",
                    minHeight: 0,
                    alignItems: "start",
                }}>
                    <div style={{
                        background: "#fff",
                        border: "0.5px solid #e0ebe0",
                        borderRadius: 12,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <div style={{
                            padding: "16px 20px",
                            borderBottom: "0.5px solid #e0ebe0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexShrink: 0,
                        }}>
                            <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>Recent Products</div>
                            <span style={{ fontSize: 12, color: "#17a84a", cursor: "pointer", fontWeight: 500 }}>View all →</span>
                        </div>

                        {isMobile ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 12, overflowY: "auto" }}>
                                {products.slice(0, 8).map((item, i) => {
                                    const p = item.product ?? {};
                                    const firstDepot = item.depots?.[0] ?? {};
                                    return (
                                        <div key={`${p.sku}-${i}`} style={{
                                            border: "0.5px solid #e0ebe0",
                                            borderRadius: 10,
                                            padding: "12px 14px",
                                        }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", flex: 1, marginRight: 8 }}>{p.name}</div>
                                                <span style={{
                                                    padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                                                    background: isActive(p.status) ? "#e6f7ed" : isDraft(p.status) ? "#fffbeb" : "#f3f4f6",
                                                    color: isActive(p.status) ? "#17a84a" : isDraft(p.status) ? "#d97706" : "#6b7280",
                                                }}>
                                                    {formatStatus(p.status)}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: 11, color: "#aaa", fontWeight: 600, marginBottom: 4 }}>SKU: {p.sku}</div>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <div style={{ fontSize: 12, color: "#888" }}>{p.category?.name ?? "Unknown"}</div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{formatPrice(firstDepot.salePrice ?? 0)}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <>
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr",
                                    padding: "8px 20px",
                                    background: "#f7f9f7",
                                    borderBottom: "0.5px solid #e0ebe0",
                                    flexShrink: 0,
                                }}>
                                    {["SKU", "PRODUCT", "CATEGORY", "PRICE", "STATUS"].map(h => (
                                        <div key={h} style={{ fontSize: 11, color: "#aaa", fontWeight: 600, letterSpacing: "1px" }}>{h}</div>
                                    ))}
                                </div>
                                <div style={{ overflowY: "auto", flex: 1 }}>
                                    {products.slice(0, 8).map((item, i) => {
                                        const p = item.product ?? {};
                                        const firstDepot = item.depots?.[0] ?? {};
                                        return (
                                            <TableRow
                                                key={`${p.sku}-${i}`}
                                                sku={p.sku}
                                                name={p.name}
                                                category={p.category?.name ?? "Unknown"}
                                                price={formatPrice(firstDepot.salePrice ?? 0)}
                                                status={p.status}
                                            />
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>

                    <div style={{
                        background: "#fff",
                        border: "0.5px solid #e0ebe0",
                        borderRadius: 12,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid #e0ebe0", flexShrink: 0 }}>
                            <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>Depot Overview</div>
                        </div>
                        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto", flex: 1 }}>
                            {depots.map((d, i) => (
                                <DepotCard
                                    key={`${d.depotName}-${i}`}
                                    name={d.depotName ?? "Unknown depot"}
                                    location={d.location ?? "Unknown location"}
                                    count={d.numberOfProducts ?? 0}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}