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

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const [productData, depotData] = await Promise.all([
                    getAllProductDepots(),
                    getDepotOverview(),
                ]);
                console.log("productData", productData);
                console.log("depotData", depotData);
                setProducts(productData.map(mapProduct));
                setDepots(depotData.depots ?? []);
                console.log("depotData", depotData);
                console.log("depots set to:", depotData.depots ?? []);
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
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1f2937", margin: 0 }}>
                    Dashboard
                </h1>
                <p style={{ color: "#7f8792", margin: "4px 0 0", fontSize: 16 }}>
                    Cross-sell product management overview
                </p>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
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

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {/* Recent Products */}
                <div style={{
                    flex: 2,
                    minWidth: 400,
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
                </div>

                {/* Depot Overview */}
                <div style={{
                    flex: 1,
                    minWidth: 260,
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
                    <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
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