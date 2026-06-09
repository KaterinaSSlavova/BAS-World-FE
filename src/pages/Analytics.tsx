import { useEffect, useState } from "react";
import { getAnalytics, type AnalyticsDTO } from "../lib/api/analytics";
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
        <main className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="mt-1 text-gray-500">
                    Inventory and stock performance insights
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <AnalyticsCard
                    title="Stock Value by Category"
                    subtitle="Total stock value grouped by product category"
                >
                    <StockValueByCategoryChart data={analytics.stockValueByCategory} />
                </AnalyticsCard>

                <AnalyticsCard
                    title="Product Count by Depot"
                    subtitle="Amount of products stored per depot"
                >
                    <ProductCountByDepotChart data={analytics.productCountByDepot} />
                </AnalyticsCard>

                <AnalyticsCard
                    title="Inventory Value by Depot"
                    subtitle="Inventory totals across each depot"
                >
                    <InventoryValueByDepotChart data={analytics.inventoryValueByDepot} />
                </AnalyticsCard>

                <AnalyticsCard
                    title="Highest Quantity Product"
                    subtitle="Product with the highest combined stock across all depots"
                >
                    <HighestQuantityProductCard
                        product={analytics.highestQuantityProduct}
                    />
                </AnalyticsCard>
            </div>
        </main>
    );
}