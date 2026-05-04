import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import DepotCard from "../components/depots/DepotCard";
import DepotPanel from "../components/depots/DepotPanel";
import { getDepotOverview, getDepotById, createDepot } from "../lib/api/depots";

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

    useEffect(() => {
        loadDepots();
    }, []);

    const loadDepots = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDepotOverview();
            setDepots(data.depots);
        } catch {
            setError("Failed to load depots.");
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = async (depot) => {
        if (activeDepot?.id === depot.id) {
            console.log("depot clicked:", depot);
            setActiveDepot(null);
            return;
        }
        setPanelLoading(true);
        try {
            const full = await getDepotById(depot.id);
            setActiveDepot(full);
        } catch {
            setError("Failed to load depot details.");
        } finally {
            setPanelLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!createForm.depotName.trim() || !createForm.location.trim()) {
            setCreateError("Name and location are required.");
            return;
        }
        setCreating(true);
        setCreateError(null);
        try {
            await createDepot(createForm);
            setShowCreate(false);
            setCreateForm({ depotName: "", location: "" });
            loadDepots();
        } catch {
            setCreateError("Failed to create depot. Please try again.");
        } finally {
            setCreating(false);
        }
    };

    return (
        <AppLayout>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#1f2937" }}>
                            Depots
                        </h1>
                        <p style={{ margin: "8px 0 0", color: "#7f8792", fontSize: 16 }}>
                            Manage depot locations and storage hubs
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreate(true)}
                        style={{
                            background: "#2e9d5b",
                            color: "#fff",
                            border: "none",
                            borderRadius: 12,
                            padding: "14px 22px",
                            fontWeight: 700,
                            fontSize: 16,
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(46,157,91,0.18)",
                        }}
                    >
                        + Add Depot
                    </button>
                </div>

                {loading && <div style={{ fontSize: 14, color: "#9ca3af" }}>Loading depots…</div>}
                {error && <div style={{ fontSize: 14, color: "#dc2626" }}>{error}</div>}

                {/* Grid */}
                {!loading && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
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

                {panelLoading && <div style={{ fontSize: 14, color: "#9ca3af" }}>Loading depot…</div>}

                {activeDepot && !panelLoading && (
                    <DepotPanel
                        depotId={activeDepot.id}
                        depot={activeDepot}
                        onClose={() => setActiveDepot(null)}
                        onUpdated={(updated) => { setActiveDepot(updated); loadDepots(); }}
                        onArchived={() => { setActiveDepot(null); loadDepots(); }}
                    />
                )}

                {/* Create modal */}
                {showCreate && (
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(15,23,42,.35)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 50,
                        }}
                        onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}
                    >
                        <div style={{
                            background: "#fff",
                            borderRadius: 18,
                            padding: 28,
                            width: 420,
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                        }}>
                            <div style={{ fontSize: 17, fontWeight: 700, color: "#273142" }}>
                                New depot
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <label style={labelStyle}>Depot name</label>
                                <input
                                    value={createForm.depotName}
                                    onChange={(e) => setCreateForm((f) => ({ ...f, depotName: e.target.value }))}
                                    placeholder="e.g. Amsterdam North"
                                    style={inputStyle}
                                />
                                <label style={labelStyle}>Location</label>
                                <input
                                    value={createForm.location}
                                    onChange={(e) => setCreateForm((f) => ({ ...f, location: e.target.value }))}
                                    placeholder="e.g. Amsterdam"
                                    style={inputStyle}
                                />
                            </div>

                            {createError && (
                                <div style={{ fontSize: 12, color: "#dc2626" }}>{createError}</div>
                            )}

                            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                                <button
                                    onClick={() => { setShowCreate(false); setCreateError(null); }}
                                    style={btnGhost}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    disabled={creating}
                                    style={{ ...btnGhost, background: "#2e9d5b", color: "#fff", border: "none", opacity: creating ? 0.7 : 1 }}
                                >
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

const btnGhost = {
    background: "#f9fafb",
    border: "0.5px solid #e6eaef",
    borderRadius: 10,
    padding: "8px 18px",
    fontSize: 13,
    color: "#7b8494",
    cursor: "pointer",
    fontWeight: 600,
};