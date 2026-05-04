import { useState, useEffect } from "react";
import { updateDepot, archiveDepot } from "../../lib/api/depots";
import { getAllProductDepots } from "../../lib/api/productDepots";

export default function DepotPanel({ depotId, depot, onClose, onUpdated, onArchived }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ depotName: depot.depotName, location: depot.location });
    const [saving, setSaving] = useState(false);
    const [archiving, setArchiving] = useState(false);
    const [error, setError] = useState(null);

    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);

    const totalStock = products.reduce((sum, pd) => sum + pd.stockQuantity, 0);
    const availableCount = products.filter((pd) => pd.available).length;
    const unavailableCount = products.length - availableCount;

    useEffect(() => {
        setProductsLoading(true);
        getAllProductDepots()
            .then((data) => {
                console.log("raw product depots:", data);
                console.log("filtering for depotId:", depotId);
                const filtered = data.filter((pd) => pd.depotId == depotId);
                console.log("filtered:", filtered);
                setProducts(filtered);
            })
            .catch((err) => {
                console.log("error fetching products:", err);
                setProducts([]);
            })
            .finally(() => setProductsLoading(false));
    }, [depotId]);

    const handleSave = async () => {
        if (!form.depotName.trim() || !form.location.trim()) {
            setError("Name and location are required.");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const updated = await updateDepot(depotId, form);
            onUpdated(updated);
            setEditing(false);
        } catch {
            setError("Failed to save changes. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleArchive = async () => {
        if (!window.confirm(`Archive "${depot.depotName}"? This cannot be undone.`)) return;
        setArchiving(true);
        try {
            await archiveDepot(depotId);
            onArchived(depotId);
        } catch {
            setError("Failed to archive depot.");
        } finally {
            setArchiving(false);
        }
    };

    return (
        <div style={{
            background: "#fff",
            border: "0.5px solid #e6eaef",
            borderRadius: 18,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 20,
        }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    {editing ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <input
                                value={form.depotName}
                                onChange={(e) => setForm((f) => ({ ...f, depotName: e.target.value }))}
                                placeholder="Depot name"
                                style={inputStyle}
                            />
                            <input
                                value={form.location}
                                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                                placeholder="Location"
                                style={inputStyle}
                            />
                            {error && <span style={{ fontSize: 12, color: "#dc2626" }}>{error}</span>}
                        </div>
                    ) : (
                        <>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "#273142" }}>
                                {depot.depotName}
                            </div>
                            <div style={{ fontSize: 13, color: "#7b8494", marginTop: 3 }}>
                                {depot.location}
                            </div>
                        </>
                    )}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                    {editing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                style={{ ...btnGhost, background: "#2e9d5b", color: "#fff", border: "none" }}
                            >
                                {saving ? "Saving…" : "Save"}
                            </button>
                            <button
                                onClick={() => {
                                    setEditing(false);
                                    setError(null);
                                    setForm({ depotName: depot.depotName, location: depot.location });
                                }}
                                style={btnGhost}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setEditing(true)} style={btnGhost}>Edit</button>
                            <button
                                onClick={handleArchive}
                                disabled={archiving}
                                style={{ ...btnGhost, color: "#dc2626" }}
                            >
                                {archiving ? "Archiving…" : "Archive"}
                            </button>
                            <button onClick={onClose} style={btnGhost}>✕ Close</button>
                        </>
                    )}
                </div>
            </div>

            <div style={{ height: "0.5px", background: "#f3f4f6" }} />

            {/* Summary metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                <Metric label="Total products" value={products.length} sub="product types stocked" />
                <Metric label="Available" value={availableCount} sub={`${unavailableCount} unavailable`} />
                <Metric label="Total stock" value={totalStock.toLocaleString()} sub="units across all products" />
            </div>

            <div style={{ height: "0.5px", background: "#f3f4f6" }} />

            {/* Product table */}
            <div>
                <div style={sectionLabel}>Products in this depot</div>

                {productsLoading ? (
                    <div style={{ fontSize: 13, color: "#9ca3af", padding: "16px 0" }}>
                        Loading products…
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ fontSize: 13, color: "#9ca3af", padding: "16px 0" }}>
                        No products assigned to this depot yet.
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr>
                            {["Product", "SKU", "Brand", "Stock", "Status"].map((h) => (
                                <th key={h} style={thStyle}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((pd) => (
                            <tr
                                key={pd.productId}
                                style={{ borderTop: "0.5px solid #f3f4f6" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfc")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                <td style={tdStyle}>{pd.productName}</td>
                                <td style={{ ...tdStyle, color: "#7b8494", fontFamily: "monospace" }}>{pd.sku}</td>
                                <td style={tdStyle}>{pd.brand}</td>
                                <td style={tdStyle}>{pd.stockQuantity.toLocaleString()}</td>
                                <td style={tdStyle}>
                                        <span style={{
                                            fontSize: 11,
                                            padding: "3px 10px",
                                            borderRadius: 20,
                                            fontWeight: 600,
                                            display: "inline-block",
                                            background: pd.available ? "#eefaf2" : "#fff0f0",
                                            color: pd.available ? "#1a7a40" : "#b91c1c",
                                        }}>
                                            {pd.available ? "Available" : "Unavailable"}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

function Metric({ label, value, sub }) {
    return (
        <div style={{ background: "#fafbfc", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "#7b8494" }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#273142", marginTop: 4 }}>{value}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{sub}</div>
        </div>
    );
}

const inputStyle = {
    border: "0.5px solid #d1d5db",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 14,
    color: "#273142",
    outline: "none",
    width: 260,
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

const sectionLabel = {
    fontSize: 11,
    fontWeight: 600,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: ".5px",
    marginBottom: 10,
};

const thStyle = {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: 600,
    textAlign: "left",
    padding: "0 12px 10px",
    textTransform: "uppercase",
    letterSpacing: ".4px",
};

const tdStyle = {
    fontSize: 13,
    color: "#273142",
    padding: "11px 12px",
    verticalAlign: "middle",
};