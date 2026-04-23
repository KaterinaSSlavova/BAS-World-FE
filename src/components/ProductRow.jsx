import Badge from "./Badge";

export default function ProductRow({ product, isLast }) {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 0",
            borderBottom: isLast ? "none" : "1px solid #f0f4f0",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 11, color: "#aaa", minWidth: 60 }}>{product.id}</span>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{product.name}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                        {product.category} · €{product.price.toLocaleString()}
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
                <Badge label={product.type} type="type" />
                <Badge label={product.status} type="status" />
            </div>
        </div>
    );
}