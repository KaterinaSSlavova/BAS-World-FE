import { useState, useMemo, useEffect } from "react";
import { createBrand, updateBrand, archiveBrand } from "../lib/api/brands";
import { uploadBrandPicture } from "../lib/uploadBrandPicture";
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

function BrandModal({ open, mode, brand, onSubmit, onClose }) {
    const [name, setName] = useState("");
    const [pictureUrl, setPictureUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (open) { setName(brand?.name ?? ""); setPictureUrl(brand?.picture ?? ""); setSelectedFile(null); setUploading(false); }
    }, [open, brand]);

    if (!open) return null;

    const handleSubmit = () => {
        if (!name.trim()) return;
        onSubmit({ name: name.trim(), pictureUrl: pictureUrl.trim() });
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", width: "100%", maxWidth: 460, boxShadow: "0 24px 60px rgba(0,0,0,0.15)", border: BORDER, fontFamily: FONT }} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>{mode === "edit" ? "Edit Brand" : "Add Brand"}</h2>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                    <div style={{ width: 80, height: 80, borderRadius: 12, border: BORDER, background: "#f7f9f7", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        {pictureUrl ? <img src={pictureUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} /> : <span style={{ fontSize: 28 }}>🏷️</span>}
                    </div>
                </div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#888", letterSpacing: "0.5px", marginBottom: 6 }}>NAME</label>
                <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter brand name..."
                       style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 10, border: BORDER, fontSize: 14, color: "#1a1a1a", outline: "none", marginBottom: 16, fontFamily: FONT }} />
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#888", letterSpacing: "0.5px", marginBottom: 6 }}>PICTURE</label>
                <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: `0.5px dashed #e0ebe0`, background: "#f7f9f7", cursor: "pointer", marginBottom: 24 }}>
                    <span style={{ fontSize: 18 }}>📁</span>
                    <span style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>{uploading ? "Uploading..." : selectedFile ? selectedFile.name : "Choose image..."}</span>
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => {
                        const file = e.target.files?.[0]; if (!file) return;
                        setSelectedFile(file); setUploading(true);
                        try { const url = await uploadBrandPicture(file); setPictureUrl(url); }
                        catch (err) { console.error(err); alert("Failed to upload image."); }
                        finally { setUploading(false); }
                    }} />
                </label>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 10, border: BORDER, background: "#fff", fontSize: 14, fontWeight: 600, color: "#1a1a1a", cursor: "pointer", fontFamily: FONT }}>Cancel</button>
                    <button onClick={handleSubmit} disabled={uploading} style={{ padding: "9px 20px", borderRadius: 10, border: "none", background: uploading ? "#a3d9b8" : BRAND, fontSize: 14, fontWeight: 600, color: "#fff", cursor: uploading ? "not-allowed" : "pointer", fontFamily: FONT }}>{mode === "edit" ? "Save Changes" : "Add Brand"}</button>
                </div>
            </div>
        </div>
    );
}

function BrandCard({ brand, onEdit, onArchive }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div style={{ background: "#fff", borderRadius: 12, border: expanded ? `1px solid ${BRAND}` : BORDER, overflow: "hidden", transition: "border-color 0.15s", opacity: brand.archived ? 0.6 : 1, fontFamily: FONT }}>
            <div onClick={() => setExpanded((v) => !v)} style={{ padding: "18px 16px 14px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, background: "#f7f9f7", border: BORDER, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {brand.picture ? <img src={brand.picture} alt={brand.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 26, color: "#bbb" }}>🏷️</span>}
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{brand.name}</div>
                    {brand.archived && <span style={{ display: "inline-block", marginTop: 4, padding: "2px 8px", borderRadius: 999, background: "#fffbeb", color: "#d97706", fontSize: 11, fontWeight: 600 }}>Archived</span>}
                </div>
                <div style={{ fontSize: 12, color: "#bbb", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</div>
            </div>
            {expanded && (
                <div style={{ borderTop: BORDER, padding: "12px 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 12, color: "#888" }}><span style={{ fontWeight: 600 }}>ID:</span> #{brand.id}</div>
                    {brand.picture && (
                        <div style={{ fontSize: 12, color: "#888", wordBreak: "break-all" }}>
                            <span style={{ fontWeight: 600 }}>URL:</span>{" "}
                            <a href={brand.picture} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: BRAND, textDecoration: "underline" }}>{brand.picture}</a>
                        </div>
                    )}
                    {!brand.archived && (
                        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                            <button onClick={(e) => { e.stopPropagation(); onEdit(brand); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: BORDER, background: "#fff", fontSize: 13, fontWeight: 600, color: "#1a1a1a", cursor: "pointer", fontFamily: FONT }}>Edit</button>
                            <button onClick={(e) => { e.stopPropagation(); onArchive(brand); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "0.5px solid #f5d29c", background: "#fffbeb", fontSize: 13, fontWeight: 600, color: "#d97706", cursor: "pointer", fontFamily: FONT }}>Archive</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function ConfigurationBrands({ brands, loading, error, search, onSearchChange, showArchived, onToggleArchived, onReload }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [editingBrand, setEditingBrand] = useState(null);
    const [archiveModal, setArchiveModal] = useState({ open: false, brand: null });
    const [page, setPage] = useState(0);

    const filtered = useMemo(() => brands.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()) && (showArchived || !b.archived)).sort((a, b) => b.id - a.id), [brands, search, showArchived]);
    useEffect(() => { setPage(0); }, [search, showArchived]);
    const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

    const openCreate = () => { setModalMode("create"); setEditingBrand(null); setModalOpen(true); };
    const openEdit = (brand) => { setModalMode("edit"); setEditingBrand(brand); setModalOpen(true); };

    const handleSubmit = async ({ name, pictureUrl }) => {
        try {
            if (modalMode === "create") await createBrand(name, pictureUrl ?? undefined);
            else await updateBrand(editingBrand.id, name, pictureUrl ?? undefined);
            await onReload(); setModalOpen(false);
        } catch (err) { console.error(err); alert("Failed to save brand."); }
    };

    const confirmArchive = async () => {
        try { await archiveBrand(archiveModal.brand.id); await onReload(); }
        catch (err) { console.error(err); alert("Failed to archive brand."); }
        finally { setArchiveModal({ open: false, brand: null }); }
    };

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontFamily: FONT }}>
                <div style={{ display: "flex", alignItems: "center", height: 42, width: 280, borderRadius: 10, border: BORDER, padding: "0 14px", background: "#fff", boxSizing: "border-box", gap: 8 }}>
                    <i className="ti ti-search" style={{ fontSize: 15, color: "#aaa" }} aria-hidden="true" />
                    <input placeholder="Search brands..." value={search} onChange={(e) => onSearchChange(e.target.value)} style={{ border: "none", outline: "none", width: "100%", fontSize: 13, background: "transparent", color: "#1a1a1a", fontFamily: FONT }} />
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button onClick={onToggleArchived} style={{ height: 42, borderRadius: 10, padding: "0 16px", border: showArchived ? `1px solid ${BRAND}` : BORDER, background: showArchived ? "#e6f7ed" : "#fff", color: showArchived ? BRAND : "#1a1a1a", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: FONT }}>{showArchived ? "✓ Showing Archived" : "Show Archived"}</button>
                    <button onClick={openCreate} style={{ height: 42, borderRadius: 10, padding: "0 18px", background: BRAND, color: "#fff", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: FONT, boxShadow: "0 2px 8px rgba(23,168,74,0.2)" }}>+ Add Brand</button>
                </div>
            </div>
            {loading ? <div style={{ padding: 24, color: "#888", fontSize: 14, fontFamily: FONT }}>Loading...</div>
                : error ? <div style={{ padding: 24, color: "#dc2626", fontSize: 14, fontFamily: FONT }}>{error}</div>
                    : filtered.length === 0 ? <div style={{ padding: 24, color: "#888", fontSize: 14, fontFamily: FONT }}>No brands found.</div>
                        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
                            {paginated.map((brand) => <BrandCard key={brand.id} brand={brand} onEdit={openEdit} onArchive={(b) => setArchiveModal({ open: true, brand: b })} />)}
                        </div>}
            <Pagination total={filtered.length} page={page} onPage={setPage} />
            <BrandModal open={modalOpen} mode={modalMode} brand={editingBrand} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} />
            <ConfirmArchiveModal open={archiveModal.open} item={archiveModal.brand} entityLabel="Brand" onConfirm={confirmArchive} onClose={() => setArchiveModal({ open: false, brand: null })} />
        </>
    );
}