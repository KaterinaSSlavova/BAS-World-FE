import { useState, useEffect } from "react";
import { updateDepot, archiveDepot } from "../../lib/api/depots";
import { getAllProductDepots } from "../../lib/api/productDepots";

const BRAND = "#17a84a";
const BORDER = "0.5px solid #e0ebe0";
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

export default function DepotPanel({ depotId, depot, onClose, onUpdated, onArchived }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ depotName: depot.depotName, location: depot.location });
    const [saving, setSaving] = useState(false);
    const [archiving, setArchiving] = useState(false);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);

    const getDepotId = (d) => d?.depot?.id ?? d?.id ?? d?.depotId;

    const totalStock = products.reduce((sum, pd) => {
        const depotInfo = pd.depots?.find((d) => String(getDepotId(d)) === String(depotId));
        return sum + Number(depotInfo?.stockQuantity ?? 0);
    }, 0);

    const availableCount = products.filter((pd) => {
        const depotInfo = pd.depots?.find((d) => String(getDepotId(d)) === String(depotId));
        return depotInfo?.available;
    }).length;

    const unavailableCount = products.length - availableCount;

    useEffect(() => {
        setProductsLoading(true);
        getAllProductDepots()
            .then((data) => {
                const filtered = data.filter((pd) =>
                    pd.depots?.some((d) => String(getDepotId(d)) === String(depotId))
                );
                setProducts(filtered);
            })
            .catch((err) => { console.error(err); setProducts([]); })
            .finally(() => setProductsLoading(false));
    }, [depotId]);

    const handleSave = async () => {
        if (!form.depotName.trim() || !form.location.trim()) { setError("Name and location are required."); return; }
        setSaving(true); setError(null);
        try {
            const updated = await updateDepot(depotId, form);
            onUpdated(updated);
            setEditing(false);
        } catch { setError("Failed to save changes."); }
        finally { setSaving(false); }
    };

    const handleArchive = async () => {
        if (!window.confirm(`Archive "${depot.depotName}"? This cannot be undone.`)) return;
        setArchiving(true);
        try { await archiveDepot(depotId); onArchived(depotId); }
        catch { setError("Failed to archive depot."); }
        finally { setArchiving(false); }
    };

    const handleCancelEdit = () => {
        setEditing(false); setError(null);
        setForm({ depotName: depot.depotName, location: depot.location });
    };

    return (
        <>
            {editing && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
                     onClick={(e) => { if (e.target === e.currentTarget) handleCancelEdit(); }}>
                    <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 440, display: "flex", flexDirection: "column", gap: 18, boxShadow: "0 24px 60px rgba(0,0,0,0.15)", border: BORDER, fontFamily: FONT }}>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>Edit depot</div>
                            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Update the name or location of this depot.</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={labelStyle}>Depot name</label>
                                <input value={form.depotName} onChange={(e) => setForm((f) => ({ ...f, depotName: e.target.value }))} placeholder="e.g. Amsterdam North" style={inputStyle} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={labelStyle}>Location</label>
                                <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g. Amsterdam" style={inputStyle} />
                            </div>
                        </div>
                        {error && <div style={{ fontSize: 12, color: "#dc2626" }}>{error}</div>}
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={handleCancelEdit} style={btnCancel}>Cancel</button>
                            <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.75 : 1 }}>
                                {saving ? "Saving…" : "Save changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ background: "#fff", border: BORDER, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 20, fontFamily: FONT }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>{depot.depotName}</div>
                        <div style={{ fontSize: 13, color: "#888", marginTop: 3 }}>{depot.location}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button onClick={() => setEditing(true)} style={btnSecondary}>Edit</button>
                        <button onClick={handleArchive} disabled={archiving} style={btnDanger}>{archiving ? "Archiving…" : "Archive"}</button>
                        <button onClick={onClose} style={btnClose}>✕</button>
                    </div>
                </div>

                <div style={{ height: "0.5px", background: "#e0ebe0" }} />

                {/* Metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                    <Metric label="Total products" value={products.length} sub="product types stocked" accentColor="#17a84a" />
                    <Metric label="Available" value={availableCount} sub={`${unavailableCount} unavailable`} accentColor="#17a84a" />
                    <Metric label="Total stock" value={totalStock.toLocaleString()} sub="units across all products" accentColor="#6366f1" />
                </div>

                <div style={{ height: "0.5px", background: "#e0ebe0" }} />

                {/* Products table */}
                <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>
                        Products in this depot
                    </div>
                    {productsLoading ? (
                        <div style={{ fontSize: 13, color: "#aaa", padding: "16px 0" }}>Loading products…</div>
                    ) : products.length === 0 ? (
                        <div style={{ fontSize: 13, color: "#aaa", padding: "16px 0" }}>No products assigned to this depot yet.</div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                            <tr style={{ background: "#f7f9f7" }}>
                                {["Product", "SKU", "Brand", "Stock", "Status"].map((h) => (
                                    <th key={h} style={thStyle}>{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {products.map((pd) => {
                                const depotInfo = pd.depots?.find((d) => String(getDepotId(d)) === String(depotId));
                                const product = pd.product;
                                return (
                                    <tr key={product?.id} style={{ borderTop: BORDER }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = "#f8faf8"}
                                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                                        <td style={tdStyle}>{product?.name ?? "-"}</td>
                                        <td style={{ ...tdStyle, color: "#aaa", fontFamily: "monospace" }}>{product?.sku ?? "-"}</td>
                                        <td style={tdStyle}>{product?.brand?.name ?? product?.brand ?? "-"}</td>
                                        <td style={tdStyle}>{Number(depotInfo?.stockQuantity ?? 0).toLocaleString()}</td>
                                        <td style={tdStyle}>
                                                <span style={{
                                                    fontSize: 11, padding: "3px 10px", borderRadius: 999, fontWeight: 600,
                                                    background: depotInfo?.available ? "#e6f7ed" : "#f3f4f6",
                                                    color: depotInfo?.available ? BRAND : "#6b7280",
                                                }}>
                                                    {depotInfo?.available ? "Available" : "Unavailable"}
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}

function Metric({ label, value, sub, accentColor }) {
    return (
        <div style={{ background: "#f7f9f7", borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${accentColor}` }}>
            <div style={{ fontSize: 11, color: "#aaa", fontWeight: 600, letterSpacing: "0.5px" }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginTop: 4, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>{sub}</div>
        </div>
    );
}

const labelStyle = { fontSize: 12, fontWeight: 600, color: "#888", letterSpacing: "0.5px" };
const inputStyle = { border: "0.5px solid #e0ebe0", borderRadius: 10, padding: "10px 14px", fontSize: 14, color: "#1a1a1a", outline: "none", width: "100%", fontFamily: FONT };
const btnPrimary = { flex: 1, background: BRAND, color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT };
const btnCancel = { flex: 1, background: "#f7f9f7", color: "#888", border: BORDER, borderRadius: 10, padding: "11px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT };
const btnSecondary = { background: "#fff", color: "#1a1a1a", border: BORDER, borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT };
const btnDanger = { background: "#fff5f5", color: "#dc2626", border: "0.5px solid #fca5a5", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT };
const btnClose = { background: "#f7f9f7", border: BORDER, borderRadius: 10, padding: "8px 12px", fontSize: 13, color: "#aaa", cursor: "pointer", fontFamily: FONT };
const thStyle = { fontSize: 11, color: "#aaa", fontWeight: 600, textAlign: "left", padding: "8px 12px", textTransform: "uppercase", letterSpacing: "0.5px" };
const tdStyle = { fontSize: 13, color: "#1a1a1a", padding: "12px 12px", verticalAlign: "middle", fontFamily: FONT };