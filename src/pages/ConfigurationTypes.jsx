import { useState, useMemo, useEffect } from "react";
import { createType, updateType, archiveType } from "../lib/api/types";
import { ConfirmArchiveModal } from "./ConfigurationShared.jsx";

const BRAND = "#17a84a";
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";
const BORDER = "0.5px solid #e0ebe0";
const PER_PAGE = 9;

function Pagination({ total, page, onPage }) {
    const totalPages = Math.ceil(total / PER_PAGE);
    if (totalPages <= 1) return null;
    return (
        <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", marginTop: 8 }}>
            <button onClick={() => onPage(page - 1)} disabled={page === 0} style={{ padding: "6px 12px", borderRadius: 8, border: BORDER, background: page === 0 ? "#f7f9f7" : "#fff", fontWeight: 600, fontSize: 13, color: page === 0 ? "#ccc" : BRAND, cursor: page === 0 ? "default" : "pointer", fontFamily: FONT }}>← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => onPage(i)} style={{ width: 32, height: 32, borderRadius: 8, border: i === page ? "none" : BORDER, background: i === page ? BRAND : "#fff", fontWeight: 600, fontSize: 13, color: i === page ? "#fff" : "#444", cursor: "pointer", fontFamily: FONT }}>{i + 1}</button>
            ))}
            <button onClick={() => onPage(page + 1)} disabled={page === totalPages - 1} style={{ padding: "6px 12px", borderRadius: 8, border: BORDER, background: page === totalPages - 1 ? "#f7f9f7" : "#fff", fontWeight: 600, fontSize: 13, color: page === totalPages - 1 ? "#ccc" : BRAND, cursor: page === totalPages - 1 ? "default" : "pointer", fontFamily: FONT }}>Next →</button>
        </div>
    );
}

function ItemModal({ open, mode, value, onChange, onSubmit, onClose }) {
    if (!open) return null;
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", width: "100%", maxWidth: 440, boxShadow: "0 24px 60px rgba(0,0,0,0.15)", border: BORDER, fontFamily: FONT }} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>{mode === "edit" ? "Edit Type" : "Add Type"}</h2>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#888", letterSpacing: "0.5px", marginBottom: 6 }}>NAME</label>
                <input
                    autoFocus value={value} onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter type name..."
                    onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                    style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 10, border: BORDER, fontSize: 14, color: "#1a1a1a", outline: "none", marginBottom: 24, fontFamily: FONT }}
                />
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 10, border: BORDER, background: "#fff", fontSize: 14, fontWeight: 600, color: "#1a1a1a", cursor: "pointer", fontFamily: FONT }}>Cancel</button>
                    <button onClick={onSubmit} style={{ padding: "9px 20px", borderRadius: 10, border: "none", background: BRAND, fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: FONT }}>{mode === "edit" ? "Save Changes" : "Add Type"}</button>
                </div>
            </div>
        </div>
    );
}

function TypesTable({ items, onEdit, onArchive, loading, error }) {
    if (loading) return <div style={{ padding: 24, color: "#888", fontSize: 14, fontFamily: FONT }}>Loading...</div>;
    if (error) return <div style={{ padding: 24, color: "#dc2626", fontSize: 14, fontFamily: FONT }}>{error}</div>;
    return (
        <div style={{ background: "#fff", borderRadius: 12, border: BORDER, overflow: "hidden", fontFamily: FONT }}>
            {items.length === 0 ? (
                <div style={{ padding: "28px 20px", color: "#888", fontSize: 14 }}>No types found.</div>
            ) : (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 16, padding: "10px 20px", background: "#f7f9f7", borderBottom: BORDER, fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", alignItems: "center" }}>
                        <div>ID</div><div>Name</div><div>Actions</div>
                    </div>
                    {items.map((item, i) => (
                        <div key={item.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 16, padding: "14px 20px", borderBottom: i === items.length - 1 ? "none" : BORDER, alignItems: "center", opacity: item.archived ? 0.6 : 1 }}>
                            <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>#{item.id}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{item.name}</span>
                                {item.archived && <span style={{ padding: "2px 8px", borderRadius: 999, background: "#fffbeb", color: "#d97706", fontSize: 11, fontWeight: 600 }}>Archived</span>}
                            </div>
                            {!item.archived && (
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button onClick={() => onEdit(item)} style={{ padding: "6px 14px", borderRadius: 8, border: BORDER, background: "#fff", fontSize: 13, fontWeight: 600, color: "#1a1a1a", cursor: "pointer", fontFamily: FONT }}>Edit</button>
                                    <button onClick={() => onArchive(item)} style={{ padding: "6px 14px", borderRadius: 8, border: "0.5px solid #f5d29c", background: "#fffbeb", fontSize: 13, fontWeight: 600, color: "#d97706", cursor: "pointer", fontFamily: FONT }}>Archive</button>
                                </div>
                            )}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default function ConfigurationTypes({ types, loading, error, search, onSearchChange, showArchived, onToggleArchived, onReload }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [modalValue, setModalValue] = useState("");
    const [editingItem, setEditingItem] = useState(null);
    const [archiveModal, setArchiveModal] = useState({ open: false, item: null });
    const [page, setPage] = useState(0);

    const filtered = useMemo(() => types
        .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) && (showArchived || !t.archived))
        .sort((a, b) => b.id - a.id), [types, search, showArchived]);

    useEffect(() => { setPage(0); }, [search, showArchived]);

    const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

    const openCreate = () => { setModalMode("create"); setModalValue(""); setEditingItem(null); setModalOpen(true); };
    const openEdit = (item) => { setModalMode("edit"); setModalValue(item.name); setEditingItem(item); setModalOpen(true); };

    const handleSubmit = async () => {
        const trimmed = modalValue.trim();
        if (!trimmed) return;
        try {
            if (modalMode === "create") await createType(trimmed);
            else await updateType(editingItem.id, trimmed);
            await onReload();
            setModalOpen(false);
        } catch (err) { console.error(err); alert("Failed to save type."); }
    };

    const confirmArchive = async () => {
        try { await archiveType(archiveModal.item.id); await onReload(); }
        catch (err) { console.error(err); alert("Failed to archive type."); }
        finally { setArchiveModal({ open: false, item: null }); }
    };

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontFamily: FONT }}>
                <div style={{ display: "flex", alignItems: "center", height: 42, width: 280, borderRadius: 10, border: BORDER, padding: "0 14px", background: "#fff", boxSizing: "border-box", gap: 8 }}>
                    <i className="ti ti-search" style={{ fontSize: 15, color: "#aaa" }} aria-hidden="true" />
                    <input placeholder="Search types..." value={search} onChange={(e) => onSearchChange(e.target.value)}
                           style={{ border: "none", outline: "none", width: "100%", fontSize: 13, background: "transparent", color: "#1a1a1a", fontFamily: FONT }} />
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button onClick={onToggleArchived} style={{ height: 42, borderRadius: 10, padding: "0 16px", border: showArchived ? `1px solid ${BRAND}` : BORDER, background: showArchived ? "#e6f7ed" : "#fff", color: showArchived ? BRAND : "#1a1a1a", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: FONT }}>
                        {showArchived ? "✓ Showing Archived" : "Show Archived"}
                    </button>
                    <button onClick={openCreate} style={{ height: 42, borderRadius: 10, padding: "0 18px", background: BRAND, color: "#fff", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: FONT, boxShadow: "0 2px 8px rgba(23,168,74,0.2)" }}>+ Add Type</button>
                </div>
            </div>
            <TypesTable items={paginated} onEdit={openEdit} onArchive={(item) => setArchiveModal({ open: true, item })} loading={loading} error={error} />
            <Pagination total={filtered.length} page={page} onPage={setPage} />
            <ItemModal open={modalOpen} mode={modalMode} value={modalValue} onChange={setModalValue} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} />
            <ConfirmArchiveModal open={archiveModal.open} item={archiveModal.item} entityLabel="Type" onConfirm={confirmArchive} onClose={() => setArchiveModal({ open: false, item: null })} />
        </>
    );
}