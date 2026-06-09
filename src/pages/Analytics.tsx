import { useEffect, useState } from "react";
import { getAnalytics, type AnalyticsDTO } from "../lib/api/analytics";
import AppLayout from "../components/AppLayout";
import AnalyticsCard from "../components/analytics/AnalyticsCard";
import StockValueByCategoryChart from "../components/analytics/StockValueByCategoryChart";
import ProductCountByDepotChart from "../components/analytics/ProductCountByDepotChart";
import InventoryValueByDepotChart from "../components/analytics/InventoryValueByDepotChart";
import HighestQuantityProductCard from "../components/analytics/HighestQuantityProductCard";

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadAnalytics() {
            try {
                const data = await getAnalytics();
                setAnalytics(data);
            } catch {
                setError("Failed to load analytics.");
            } finally {
                setLoading(false);
            }
        }

        loadAnalytics();
    }, []);

    if (loading) {
        return <p className="p-8 text-gray-500">Loading analytics...</p>;
    }

    if (error || !analytics) {
        return <p className="p-8 text-red-500">{error}</p>;
    }

    return (
        <AppLayout>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#1f2937" }}>
                        Analytics
                    </h1>
                    <p style={{ margin: "8px 0 0", color: "#7f8792", fontSize: 16 }}>
                        Inventory and stock performance insights
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: 24,
                        alignItems: "stretch",
                    }}
                >
                    <AnalyticsCard title="Stock Value by Category" subtitle="Total stock value grouped by category">
                        <div style={{ height: 260 }}>
                            <StockValueByCategoryChart data={analytics.stockValueByCategory} />
                        </div>
                    </AnalyticsCard>

                    <AnalyticsCard title="Product Count by Depot" subtitle="Products stored per depot">
                        <div style={{ height: 260, maxWidth: 330, margin: "0 auto" }}>
                            <ProductCountByDepotChart data={analytics.productCountByDepot} />
                        </div>
                    </AnalyticsCard>

                    <AnalyticsCard title="Inventory Value by Depot" subtitle="Inventory totals across depots">
                        <div style={{ height: 260 }}>
                            <InventoryValueByDepotChart data={analytics.inventoryValueByDepot} />
                        </div>
                    </AnalyticsCard>

                    <AnalyticsCard title="Highest Quantity Product" subtitle="Highest combined stock across all depots">
                        <HighestQuantityProductCard product={analytics.highestQuantityProduct} />
                    </AnalyticsCard>
                </div>
            </div>
        </AppLayout>
    );
}