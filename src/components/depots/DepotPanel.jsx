const availabilityColor = (ratio) => {
    if (ratio >= 0.75) return "#2e9d5b";
    if (ratio >= 0.4) return "#e67e22";
    return "#dc2626";
};

export default function DepotPanel({ depot, productDepots = [], onEdit, onArchive, onClose }) {
    const total = productDepots.length;
    const available = productDepots.filter((pd) => pd.isAvailable).length;
    const unavailable = total - available;
    const totalStock = productDepots.reduce((sum, pd) => sum + pd.stockQuantity, 0);

    const maxStock = Math.max(...productDepots.map((pd) => pd.stockQuantity), 1);

    return (
        <div
            style={{
                background: "#fff",
                border: "0.5px solid #e6eaef",
                borderRadius: 18,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 20,
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 26 }}>{depot.flag}</span>
                    <div>
                        <div
                            style={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: "#273142",
                            }}
                        >
                            {depot.depotName}
                        </div>
                        <div
                            style={{
                                fontSize: 13,
                                color: "#7b8494",
                                marginTop: 2,
                            }}
                        >
                            {depot.location}
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => onEdit(depot)} style={btnGhost}>
                        Edit
                    </button>
                    <button
                        onClick={() => onArchive(depot)}
                        style={{ ...btnGhost, color: "#dc2626" }}
                    >
                        Archive
                    </button>
                    <button onClick={onClose} style={btnGhost}>
                        ✕ Close
                    </button>
                </div>
            </div>

            <Divider />

            {/* Summary metrics */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 10,
                }}
            >
                <Metric label="Total products" value={total} sub="product types stocked" />
                <Metric
                    label="Available"
                    value={available}
                    sub={`${unavailable} unavailable`}
                />
                <Metric
                    label="Total stock"
                    value={totalStock.toLocaleString()}
                    sub="units across all products"
                />
            </div>

            <Divider />

            {/* Product table */}
            <div>
                <div style={sectionLabel}>Products in this depot</div>

                {productDepots.length === 0 ? (
                    <div
                        style={{
                            padding: "32px 0",
                            textAlign: "center",
                            color: "#9ca3af",
                            fontSize: 14,
                        }}
                    >
                        No products assigned to this depot yet.
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr>
                            {["Product", "Status", "Stock"].map((h) => (
                                <th
                                    key={h}
                                    style={{
                                        fontSize: 11,
                                        color: "#9ca3af",
                                        fontWeight: 600,
                                        textAlign: h === "Stock" ? "right" : "left",
                                        padding: "0 12px 10px",
                                        textTransform: "uppercase",
                                        letterSpacing: ".4px",
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {productDepots.map((pd, i) => (
                            <ProductRow
                                key={i}
                                productDepot={pd}
                                maxStock={maxStock}
                            />
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

function ProductRow({ productDepot, maxStock }) {
    const { product, isAvailable, stockQuantity } = productDepot;
    const barPct = maxStock > 0 ? Math.round((stockQuantity / maxStock) * 100) : 0;
    const barColor = availabilityColor(isAvailable ? 1 : 0);

    return (
        <tr
            style={{
                borderTop: "0.5px solid #f3f4f6",
                transition: "background .1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfc")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
            {/* Product name */}
            <td
                style={{
                    fontSize: 13,
                    color: "#273142",
                    padding: "11px 12px",
                    fontWeight: 500,
                }}
            >
                {product.name ?? product.productName ?? `Product #${product.id}`}
            </td>

            {/* Availability pill */}
            <td style={{ padding: "11px 12px" }}>
                <span
                    style={{
                        fontSize: 11,
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontWeight: 600,
                        background: isAvailable ? "#eefaf2" : "#fff0f0",
                        color: isAvailable ? "#1a7a40" : "#b91c1c",
                        display: "inline-block",
                    }}
                >
                    {isAvailable ? "Available" : "Unavailable"}
                </span>
            </td>

            {/* Stock bar + number */}
            <td style={{ padding: "11px 12px", textAlign: "right" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 8,
                    }}
                >
                    <div
                        style={{
                            width: 60,
                            height: 4,
                            background: "#f3f4f6",
                            borderRadius: 2,
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: `${barPct}%`,
                                height: "100%",
                                background: barColor,
                                borderRadius: 2,
                            }}
                        />
                    </div>
                    <span
                        style={{
                            fontSize: 13,
                            color: "#273142",
                            minWidth: 36,
                            textAlign: "right",
                        }}
                    >
                        {stockQuantity.toLocaleString()}
                    </span>
                </div>
            </td>
        </tr>
    );
}

function Metric({ label, value, sub }) {
    return (
        <div
            style={{
                background: "#fafbfc",
                borderRadius: 12,
                padding: "12px 14px",
            }}
        >
            <div style={{ fontSize: 11, color: "#7b8494" }}>{label}</div>
            <div
                style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#273142",
                    marginTop: 4,
                }}
            >
                {value}
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{sub}</div>
        </div>
    );
}

function Divider() {
    return (
        <div style={{ height: "0.5px", background: "#f3f4f6" }} />
    );
}

const sectionLabel = {
    fontSize: 11,
    fontWeight: 600,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: ".5px",
    marginBottom: 10,
};

const btnGhost = {
    background: "#f9fafb",
    border: "0.5px solid #e6eaef",
    borderRadius: 10,
    padding: "6px 14px",
    fontSize: 12,
    color: "#7b8494",
    cursor: "pointer",
    fontWeight: 500,
};