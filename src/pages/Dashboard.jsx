import { useEffect, useMemo, useState } from "react";
import { getAllProductDepots } from "../lib/api/productDepots";
import { getDepotOverview } from "../lib/api/depots";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";

function mapProduct(item) {
    return {
        sku: item.sku,
        name: item.productName,
        category: item.category,
        price: Number(item.price),
        status: item.status,
        available: Boolean(item.available),
        depotName: item.depotName,
    };
}

function formatPrice(value) {
    return new Intl.NumberFormat("en-EU", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
    }).format(value);
}

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [depots, setDepots] = useState([]);
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
                const [productData, depotData] = await Promise.all([
                    getAllProductDepots(),
                    getDepotOverview(),
                ]);
                setProducts(productData.map(mapProduct));
                setDepots(depotData.depots ?? []);
            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        void load();
    }, []);

    const activeCount = useMemo(
        () => products.filter(p => p.status.toUpperCase() === "ACTIVE").length,
        [products]
    );
    const unavailableCount = useMemo(
        () => products.filter(p => !p.available).length,
        [products]
    );
    const lowStockCount = useMemo(
        () => products.filter(p => p.status.toUpperCase() === "LOW_STOCK").length,
        [products]
    );
    const inventoryValue = useMemo(
        () => products.reduce((sum, p) => sum + p.price, 0),
        [products]
    );

    if (loading) {
        return <AppLayout><div style={{ padding: 40, color: "#7f8792" }}>Loading...</div></AppLayout>;
    }

    if (error) {
        return <AppLayout><div style={{ padding: 40, color: "#d14343" }}>{error}</div></AppLayout>;
    }

    return (
        <AppLayout>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 800, color: "#1f2937", margin: 0 }}>
                    Dashboard
                </h1>
                <p style={{ color: "#7f8792", margin: "4px 0 0", fontSize: isMobile ? 14 : 16 }}>
                    Cross-sell product management overview
                </p>
            </div>

            {/* Stat Cards */}
            <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
                gap: 16,
                marginBottom: 28,
            }}>
                <StatCard
                    label="ACTIVE PRODUCTS"
                    value={String(activeCount)}
                    sub="Currently available"
                    subColor="#2e9d5b"
                />
                <StatCard
                    label="UNAVAILABLE"
                    value={String(unavailableCount)}
                    sub="Not available"
                    subColor="#d14343"
                />
                <StatCard
                    label="LOW STOCK"
                    value={String(lowStockCount)}
                    sub="Needs attention"
                    subColor="#d97706"
                />
                <StatCard
                    label="INVENTORY VALUE"
                    value={formatPrice(inventoryValue)}
                    sub="Across all products"
                    subColor="#7f8792"
                />
            </div>

            {/* Bottom panels — stack on mobile */}
            <div style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 20,
            }}>
                {/* Recent Products */}
                <div style={{
                    flex: 2,
                    background: "#fff",
                    border: "1px solid #e6eaef",
                    borderRadius: 18,
                    overflow: "hidden",
                }}>
                    <div style={{ padding: "20px 24px", borderBottom: "1px solid #eef1f4" }}>
                        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", margin: 0 }}>
                            Recent Products
                        </h2>
                    </div>

                    {isMobile ? (
                        /* Mobile: card list */
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 12 }}>
                            {products.slice(0, 8).map((p) => (
                                <div
                                    key={p.sku}
                                    style={{
                                        border: "1px solid #eef1f4",
                                        borderRadius: 12,
                                        padding: "12px 14px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 6,
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#273142", flex: 1, marginRight: 8 }}>
                                            {p.name}
                                        </div>
                                        <span style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            padding: "4px 10px",
                                            borderRadius: 999,
                                            fontSize: 11,
                                            fontWeight: 700,
                                            background: p.status.toUpperCase() === "ACTIVE" ? "#e8f5ec" : "#f3f4f6",
                                            color: p.status.toUpperCase() === "ACTIVE" ? "#2e9d5b" : "#6b7280",
                                            border: p.status.toUpperCase() === "ACTIVE" ? "1px solid #b9dec6" : "1px solid #d1d5db",
                                            whiteSpace: "nowrap",
                                        }}>
                                            {p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase()}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 12, color: "#7b8494", fontWeight: 600 }}>SKU: {p.sku}</div>
                                    <div style={{ display: "flex", gap: 16 }}>
                                        <div style={{ fontSize: 12, color: "#6b7280" }}>{p.category}</div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: "#273142" }}>{formatPrice(p.price)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Desktop: table */
                        <>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr",
                                gap: 12,
                                padding: "12px 24px",
                                background: "#fbfcfd",
                                borderBottom: "1px solid #eef1f4",
                                fontSize: 11,
                                fontWeight: 800,
                                color: "#7b8494",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                            }}>
                                <div>SKU</div>
                                <div>Product</div>
                                <div>Category</div>
                                <div>Price</div>
                                <div>Status</div>
                            </div>
                            {products.slice(0, 8).map((p, i) => (
                                <div
                                    key={p.sku}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr",
                                        gap: 12,
                                        padding: "14px 24px",
                                        borderBottom: i === Math.min(products.length, 8) - 1 ? "none" : "1px solid #f0f4f0",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ fontSize: 13, color: "#7b8494", fontWeight: 600 }}>{p.sku}</div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#273142" }}>{p.name}</div>
                                    <div style={{ fontSize: 13, color: "#6b7280" }}>{p.category}</div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: "#273142" }}>{formatPrice(p.price)}</div>
                                    <div>
                                        <span style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            padding: "4px 10px",
                                            borderRadius: 999,
                                            fontSize: 12,
                                            fontWeight: 700,
                                            background: p.status.toUpperCase() === "ACTIVE" ? "#e8f5ec" : "#f3f4f6",
                                            color: p.status.toUpperCase() === "ACTIVE" ? "#2e9d5b" : "#6b7280",
                                            border: p.status.toUpperCase() === "ACTIVE" ? "1px solid #b9dec6" : "1px solid #d1d5db",
                                        }}>
                                            {p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Depot Overview */}
                <div style={{
                    flex: isMobile ? "unset" : 1,
                    background: "#fff",
                    border: "1px solid #e6eaef",
                    borderRadius: 18,
                    overflow: "hidden",
                }}>
                    <div style={{ padding: "20px 24px", borderBottom: "1px solid #eef1f4" }}>
                        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", margin: 0 }}>
                            Depot Overview
                        </h2>
                    </div>
                    <div style={{
                        padding: "12px 16px",
                        display: isMobile ? "grid" : "flex",
                        gridTemplateColumns: isMobile ? "1fr 1fr" : undefined,
                        flexDirection: isMobile ? undefined : "column",
                        gap: 10,
                    }}>
                        {depots.map((d) => (
                            <div
                                key={d.depotName}
                                style={{
                                    border: "1px solid #f0f4f0",
                                    borderRadius: 10,
                                    padding: "14px 16px",
                                }}
                            >
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#273142", marginBottom: 4 }}>
                                    {d.depotName}
                                </div>
                                <div style={{ fontSize: 12, color: "#7f8792", marginBottom: 8 }}>
                                    📍 {d.location}
                                </div>
                                <div style={{ fontSize: 12, color: "#555", fontWeight: 500 }}>
                                    ◈ {d.numberOfProducts} products
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}