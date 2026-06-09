import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import DepotCard from "../components/depots/DepotCard";
import DepotPanel from "../components/depots/DepotPanel";
import { getDepotOverview, createDepot, getProductsForDepot } from "../lib/api/depots";

const BRAND = "#17a84a";
const BORDER = "0.5px solid #e0ebe0";
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

export default function Depots() {
    const [depots, setDepots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeDepot, setActiveDepot] = useState(null);
    const [panelLoading, setPanelLoading] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [createForm, setCreateForm] = useState({ depotName: "", location: "" });
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState(null);

    useEffect(() => { loadDepots(); }, []);

    const loadDepots = async () => {
        setLoading(true); setError(null);
        try {
            const data = await getDepotOverview();
            setDepots(data.depots ?? []);
        } catch (err) { console.error(err); setError("Failed to load depots."); }
        finally { setLoading(false); }
    };

    const handleCardClick = async (depot) => {
        if (activeDepot?.id === depot.id) { setActiveDepot(null); return; }
        setPanelLoading(true); setError(null);
        try {
            const products = await getProductsForDepot(depot.id);
            setActiveDepot({ ...depot, products });
        } catch (err) { console.error(err); setError("Failed to load depot details."); }
        finally { setPanelLoading(false); }
    };

    const handleCreate = async () => {
        if (!createForm.depotName.trim() || !createForm.location.trim()) { setCreateError("Name and location are required."); return; }
        setCreating(true); setCreateError(null);
        try {
            await createDepot(createForm);
            setShowCreate(false);
            setCreateForm({ depotName: "", location: "" });
            await loadDepots();
        } catch (err) { console.error(err); setCreateError("Failed to create depot. Please try again."); }
        finally { setCreating(false); }
    };

    return (
        <AppLayout>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: FONT, textAlign: "left" }}>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.5px" }}>Depots</h1>
                        <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>Manage depot locations and storage hubs</p>
                    </div>
                    <button onClick={() => setShowCreate(true)} style={{
                        background: BRAND, color: "#fff", border: "none", borderRadius: 10,
                        padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer",
                        fontFamily: FONT, boxShadow: "0 2px 8px rgba(23,168,74,0.2)",
                    }}>
                        + Add Depot
                    </button>
                </div>

                {loading && <div style={{ fontSize: 14, color: "#aaa" }}>Loading depots…</div>}
                {error && <div style={{ fontSize: 14, color: "#dc2626" }}>{error}</div>}

                {/* Depot cards */}
                {!loading && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                        {depots.map((depot) => (
                            <DepotCard
                                key={depot.id ?? depot.depotName}
                                depot={depot}
                                active={activeDepot?.id === depot.id}
                                onClick={() => handleCardClick(depot)}
                            />
                        ))}
                    </div>
                )}

                {panelLoading && <div style={{ fontSize: 14, color: "#aaa" }}>Loading depot…</div>}

                {activeDepot && !panelLoading && (
                    <DepotPanel
                        depotId={activeDepot.id}
                        depot={activeDepot}
                        onClose={() => setActiveDepot(null)}
                        onUpdated={(updated) => { setActiveDepot((prev) => ({ ...prev, ...updated })); loadDepots(); }}
                        onArchived={() => { setActiveDepot(null); loadDepots(); }}
                    />
                )}

                {/* Create modal */}
                {showCreate && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
                         onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}>
                        <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 420, display: "flex", flexDirection: "column", gap: 18, boxShadow: "0 24px 60px rgba(0,0,0,0.15)", border: BORDER, fontFamily: FONT }}>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>New depot</div>
                                <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Add a new depot location to your network.</div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={labelStyle}>Depot name</label>
                                    <input value={createForm.depotName} onChange={(e) => setCreateForm((f) => ({ ...f, depotName: e.target.value }))} placeholder="e.g. Amsterdam North" style={inputStyle} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={labelStyle}>Location</label>
                                    <input value={createForm.location} onChange={(e) => setCreateForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g. Amsterdam" style={inputStyle} />
                                </div>
                            </div>
                            {createError && <div style={{ fontSize: 12, color: "#dc2626" }}>{createError}</div>}
                            <div style={{ display: "flex", gap: 10 }}>
                                <button onClick={() => { setShowCreate(false); setCreateError(null); }} style={btnCancel}>Cancel</button>
                                <button onClick={handleCreate} disabled={creating} style={{ ...btnPrimary, opacity: creating ? 0.75 : 1 }}>
                                    {creating ? "Creating…" : "Create depot"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

const labelStyle = { fontSize: 12, fontWeight: 600, color: "#888", letterSpacing: "0.5px" };
const inputStyle = { border: BORDER, borderRadius: 10, padding: "10px 14px", fontSize: 14, color: "#1a1a1a", outline: "none", width: "100%", fontFamily: FONT, boxSizing: "border-box" };
const btnPrimary = { flex: 1, background: BRAND, color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT };
const btnCancel = { flex: 1, background: "#f7f9f7", color: "#888", border: BORDER, borderRadius: 10, padding: "11px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT };