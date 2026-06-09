import { useEffect, useState } from "react";
import { getAnalytics, type AnalyticsDTO } from "../lib/api/analytics";
import AppLayout from "../components/AppLayout";
import AnalyticsCard from "../components/analytics/AnalyticsCard";
import StockValueByCategoryChart from "../components/analytics/StockValueByCategoryChart";
import ProductCountByDepotChart from "../components/analytics/ProductCountByDepotChart";
import InventoryValueByDepotChart from "../components/analytics/InventoryValueByDepotChart";
import HighestQuantityProductCard from "../components/analytics/HighestQuantityProductCard";

const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

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
        return (
            <AppLayout scrollable>
                <div style={{ padding: 40, color: "#888", fontFamily: FONT, fontSize: 14 }}>Loading analytics...</div>
            </AppLayout>
        );
    }

    if (error || !analytics) {
        return (
            <AppLayout scrollable>
                <div style={{ padding: 40, color: "#dc2626", fontFamily: FONT, fontSize: 14 }}>{error}</div>
            </AppLayout>
        );
    }

    return (
        <AppLayout scrollable>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: FONT, textAlign: "left" }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.5px" }}>
                        Analytics
                    </h1>
                    <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>
                        Inventory and stock performance insights
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16, alignItems: "stretch" }}>
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