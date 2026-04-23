import Badge from "./Badge";

export default function DepotCard({ depot }) {
    return (
        <div style={{
            border: "1px solid #f0f4f0",
            borderRadius: 10,
            padding: "14px 16px",
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#888" }}>{depot.country}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{depot.city}</span>
                </div>
                <Badge label={depot.status} type="status" />
            </div>
            <div style={{ display: "flex", gap: 16 }}>
                <span style={{ fontSize: 12, color: "#888" }}>◈ {depot.products} products</span>
                <span style={{ fontSize: 12, color: "#888" }}>⊡ {depot.vehicles} vehicles</span>
            </div>
        </div>
    );
}