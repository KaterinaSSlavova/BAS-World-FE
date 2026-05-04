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
                const filtered = data.filter((pd) => pd.depotId == depotId);
                setProducts(filtered);
            })
            .catch(() => setProducts([]))
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

    const handleCancelEdit = () => {
        setEditing(false);
        setError(null);
        setForm({ depotName: depot.depotName, location: depot.location });
    };

    return (
        <>
            {/* Edit modal */}
            {editing && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(15,23,42,.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 50,
                    }}
                    onClick={(e) => { if (e.target === e.currentTarget) handleCancelEdit(); }}
                >
                    <div style={{
                        background: "#fff",
                        borderRadius: 18,
                        padding: 32,
                        width: 440,
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                        boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                    }}>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "#273142" }}>Edit depot</div>
                            <div style={{ fontSize: 13, color: "#7b8494", marginTop: 4 }}>
                                Update the name or location of this depot.
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={labelStyle}>Depot name</label>
                                <input
                                    value={form.depotName}
                                    onChange={(e) => setForm((f) => ({ ...f, depotName: e.target.value }))}
                                    placeholder="e.g. Amsterdam North"
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={labelStyle}>Location</label>
                                <input
                                    value={form.location}
                                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                                    placeholder="e.g. Amsterdam"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {error && <div style={{ fontSize: 12, color: "#dc2626" }}>{error}</div>}

                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={handleCancelEdit} style={btnModalCancel}>
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                style={{ ...btnModalSave, opacity: saving ? 0.75 : 1 }}
                            >
                                {saving ? "Saving…" : "Save changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Panel */}
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
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#273142" }}>{depot.depotName}</div>
                        <div style={{ fontSize: 13, color: "#7b8494", marginTop: 3 }}>{depot.location}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button onClick={() => setEditing(true)} style={btnSecondary}>Edit</button>
                        <button onClick={handleArchive} disabled={archiving} style={btnDanger}>
                            {archiving ? "Archiving…" : "Archive"}
                        </button>
                        <button onClick={onClose} style={btnClose}>✕</button>
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
                        <div style={{ fontSize: 13, color: "#9ca3af", padding: "16px 0" }}>Loading products…</div>
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
        </>
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

const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "#7b8494",
};

const inputStyle = {
    border: "0.5px solid #d1d5db",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 14,
    color: "#273142",
    outline: "none",
    width: "100%",
};

const btnModalSave = {
    flex: 1,
    background: "#2e9d5b",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "13px 0",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(46,157,91,0.25)",
};

const btnModalCancel = {
    flex: 1,
    background: "#f4f5f7",
    color: "#7b8494",
    border: "none",
    borderRadius: 12,
    padding: "13px 0",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
};

const btnSecondary = {
    background: "#fff",
    color: "#273142",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    padding: "9px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
};

const btnDanger = {
    background: "#fff5f5",
    color: "#dc2626",
    border: "1px solid #fca5a5",
    borderRadius: 10,
    padding: "9px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(220,38,38,0.1)",
};

const btnClose = {
    background: "#f9fafb",
    border: "1px solid #e6eaef",
    borderRadius: 10,
    padding: "9px 12px",
    fontSize: 13,
    color: "#9ca3af",
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