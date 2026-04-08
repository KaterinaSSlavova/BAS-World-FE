import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";
import ProductRow from "../components/ProductRow";
import DepotCard from "../components/DepotCard";

const mockProducts = [
    { id: "PRD-001", name: "Continental Tyre Set (315/80R22.5)", category: "Tyres", price: 1240, type: "Opt-in", status: "Active" },
    { id: "PRD-002", name: "Full Maintenance Package - 12 months", category: "Maintenance", price: 3500, type: "Mandatory", status: "Active" },
    { id: "PRD-003", name: "Exterior Deep Clean", category: "Cleaning", price: 180, type: "Opt-out", status: "Active" },
    { id: "PRD-004", name: "Diesel Fill-up 500L", category: "Diesel", price: 750, type: "Opt-in", status: "Active" },
    { id: "PRD-005", name: "Windshield Replacement - Truck", category: "Windshield", price: 890, type: "Opt-in", status: "Low Stock" },
];

const mockDepots = [
    { country: "NL", city: "Veghel", status: "Operational", products: 8, vehicles: 342 },
    { country: "AT", city: "Vienna", status: "Operational", products: 6, vehicles: 128 },
    { country: "ES", city: "Madrid", status: "Operational", products: 4, vehicles: 89 },
    { country: "PL", city: "Warsaw", status: "Setting Up", products: 0, vehicles: 45 },
];

export default function Dashboard() {
    return (
        <AppLayout>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                    Dashboard
                </h1>
                <p style={{ color: "#888", margin: "4px 0 0", fontSize: 14 }}>
                    Cross-sell product management overview
                </p>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
                <StatCard label="TOTAL PRODUCTS" value="10" sub="+2 this week" subColor="#4caf50" />
                <StatCard label="ACTIVE DEPOTS" value="3" sub="of 4 total" subColor="#888" />
                <StatCard label="STOCK ALERTS" value="2" sub="Needs attention" subColor="#f44336" />
                <StatCard label="ACTIVE RULES" value="3" sub="of 4 total" subColor="#888" />
            </div>

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div
                    style={{
                        flex: 2,
                        minWidth: 400,
                        background: "#fff",
                        border: "1px solid #e8ede8",
                        borderRadius: 12,
                        padding: "20px 24px",
                    }}
                >
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", margin: "0 0 16px" }}>
                        Recent Products
                    </h2>
                    {mockProducts.map((p, i) => (
                        <ProductRow key={p.id} product={p} isLast={i === mockProducts.length - 1} />
                    ))}
                </div>

                <div
                    style={{
                        flex: 1,
                        minWidth: 260,
                        background: "#fff",
                        border: "1px solid #e8ede8",
                        borderRadius: 12,
                        padding: "20px 24px",
                    }}
                >
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", margin: "0 0 16px" }}>
                        Depot Overview
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {mockDepots.map((d) => (
                            <DepotCard key={d.city} depot={d} />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}