import { useState, useMemo, useEffect } from "react";
import { createBrand, updateBrand, archiveBrand } from "../lib/api/brands";
import { uploadBrandPicture } from "../lib/uploadBrandPicture";
import { ConfirmArchiveModal } from "./ConfigurationShared";

// ─── Brand Modal ──────────────────────────────────────────────

function BrandModal({ open, mode, brand, onSubmit, onClose }) {
    const [name, setName] = useState("");
    const [pictureUrl, setPictureUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (open) {
            setName(brand?.name ?? "");
            setPictureUrl(brand?.picture ?? "");
            setSelectedFile(null);
            setUploading(false);
        }
    }, [open, brand]);

    if (!open) return null;

    const handleSubmit = () => {
        if (!name.trim()) return;
        onSubmit({ name: name.trim(), pictureUrl: pictureUrl.trim() });
    };

    return (
        <div
            style={{
                position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)",
                zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "#fff", borderRadius: 18, padding: "32px 28px",
                    width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 800, color: "#1f2937" }}>
                    {mode === "edit" ? "Edit Brand" : "Add Brand"}
                </h2>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                    <div style={{
                        width: 96, height: 96, borderRadius: 16, border: "2px dashed #d9dee5",
                        background: "#f8fafc", display: "flex", alignItems: "center",
                        justifyContent: "center", overflow: "hidden",
                    }}>
                        {pictureUrl ? (
                            <img src={pictureUrl} alt="preview"
                                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                 onError={(e) => { e.target.style.display = "none"; }} />
                        ) : (
                            <span style={{ fontSize: 32 }}>🏷️</span>
                        )}
                    </div>
                </div>

                <label style={{
                    display: "block", fontSize: 13, fontWeight: 700, color: "#7b8494",
                    textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8,
                }}>Name</label>
                <input
                    autoFocus value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Enter brand name..."
                    style={{
                        width: "100%", boxSizing: "border-box", padding: "13px 16px",
                        borderRadius: 12, border: "1.5px solid #d9dee5", fontSize: 16,
                        color: "#273142", outline: "none", marginBottom: 20, fontFamily: "inherit",
                    }}
                />

                <label style={{
                    display: "block", fontSize: 13, fontWeight: 700, color: "#7b8494",
                    textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8,
                }}>Picture</label>
                <label style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                    borderRadius: 12, border: "1.5px dashed #d9dee5", background: "#f8fafc",
                    cursor: "pointer", marginBottom: 28,
                }}>
                    <span style={{ fontSize: 20 }}>📁</span>
                    <span style={{ fontSize: 14, color: "#7b8494", fontWeight: 600 }}>
                        {uploading ? "Uploading..." : selectedFile ? selectedFile.name : "Choose image..."}
                    </span>
                    <input type="file" accept="image/*" style={{ display: "none" }}
                           onChange={async (e) => {
                               const file = e.target.files?.[0];
                               if (!file) return;
                               setSelectedFile(file);
                               setUploading(true);
                               try {
                                   const url = await uploadBrandPicture(file);
                                   setPictureUrl(url);
                               } catch (err) {
                                   console.error(err);
                                   alert("Failed to upload image.");
                               } finally {
                                   setUploading(false);
                               }
                           }}
                    />
                </label>

                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <button onClick={onClose} style={{
                        padding: "12px 22px", borderRadius: 10, border: "1px solid #d9dee5",
                        background: "#fff", fontSize: 15, fontWeight: 700, color: "#374151", cursor: "pointer",
                    }}>Cancel</button>
                    <button onClick={handleSubmit} disabled={uploading} style={{
                        padding: "12px 22px", borderRadius: 10, border: "none",
                        background: uploading ? "#a3d9b8" : "#2e9d5b",
                        fontSize: 15, fontWeight: 700, color: "#fff",
                        cursor: uploading ? "not-allowed" : "pointer",
                        boxShadow: "0 4px 12px rgba(46,157,91,0.18)",
                    }}>
                        {mode === "edit" ? "Save Changes" : "Add Brand"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Brand Card ───────────────────────────────────────────────

function BrandCard({ brand, onEdit, onArchive }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div style={{
            background: "#fff", borderRadius: 16,
            border: `1px solid ${expanded ? "#b9dec6" : "#e6eaef"}`,
            overflow: "hidden", transition: "border-color 0.15s",
            opacity: brand.archived ? 0.6 : 1,
        }}>
            <div onClick={() => setExpanded((v) => !v)} style={{
                padding: "20px 18px 16px", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            }}>
                <div style={{
                    width: 72, height: 72, borderRadius: 14, background: "#f1f3f6",
                    border: "1px solid #e6eaef", display: "flex", alignItems: "center",
                    justifyContent: "center", overflow: "hidden", flexShrink: 0,
                }}>
                    {brand.picture ? (
                        <img src={brand.picture} alt={brand.name}
                             style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <span style={{ fontSize: 28, color: "#b0b8c4" }}>🏷️</span>
                    )}
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#273142" }}>{brand.name}</div>
                    {brand.archived && (
                        <span style={{
                            display: "inline-block", marginTop: 6, padding: "3px 10px",
                            borderRadius: 999, background: "#fff7e8", color: "#d97706",
                            border: "1px solid #f5d29c", fontSize: 12, fontWeight: 700,
                        }}>Archived</span>
                    )}
                </div>
                <div style={{
                    fontSize: 13, color: "#b0b8c4",
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                }}>▼</div>
            </div>

            {expanded && (
                <div style={{
                    borderTop: "1px solid #eef1f4", padding: "14px 18px 18px",
                    display: "flex", flexDirection: "column", gap: 10,
                }}>
                    <div style={{ fontSize: 13, color: "#7b8494" }}>
                        <span style={{ fontWeight: 700 }}>ID:</span> #{brand.id}
                    </div>
                    {brand.picture && (
                        <div style={{ fontSize: 13, color: "#7b8494", wordBreak: "break-all" }}>
                            <span style={{ fontWeight: 700 }}>URL:</span>{" "}
                            <a href={brand.picture} target="_blank" rel="noreferrer"
                               onClick={(e) => e.stopPropagation()}
                               style={{ color: "#2e9d5b", textDecoration: "underline", cursor: "pointer" }}>
                                {brand.picture}
                            </a>
                        </div>
                    )}
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <button onClick={(e) => { e.stopPropagation(); onEdit(brand); }} style={{
                            flex: 1, padding: "9px 0", borderRadius: 9,
                            border: "1px solid #d9dee5", background: "#fff",
                            fontSize: 14, fontWeight: 700, color: "#374151", cursor: "pointer",
                        }}>Edit</button>
                        <button onClick={(e) => { e.stopPropagation(); onArchive(brand); }} style={{
                            flex: 1, padding: "9px 0", borderRadius: 9,
                            border: brand.archived ? "1px solid #b9dec6" : "1px solid #fde9b0",
                            background: brand.archived ? "#f0faf4" : "#fffbf0",
                            fontSize: 14, fontWeight: 700,
                            color: brand.archived ? "#2e9d5b" : "#d97706", cursor: "pointer",
                        }}>
                            {brand.archived ? "Unarchive" : "Archive"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Configuration Brands Tab ─────────────────────────────────

export default function ConfigurationBrands({ brands, loading, error, search, onSearchChange, showArchived, onToggleArchived, onReload }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [editingBrand, setEditingBrand] = useState(null);
    const [archiveModal, setArchiveModal] = useState({ open: false, brand: null });

    const filtered = useMemo(() => brands
            .filter((b) => b.name.toLowerCase().includes(search.toLowerCase()) && (showArchived || !b.archived))
            .sort((a, b) => b.id - a.id),
        [brands, search, showArchived]);

    const openCreate = () => { setModalMode("create"); setEditingBrand(null); setModalOpen(true); };
    const openEdit = (brand) => { setModalMode("edit"); setEditingBrand(brand); setModalOpen(true); };

    const handleSubmit = async ({ name, pictureUrl }) => {
        try {
            if (modalMode === "create") await createBrand(name, pictureUrl ?? undefined);
            else await updateBrand(editingBrand.id, name, pictureUrl ?? undefined);
            await onReload();
            setModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Failed to save brand.");
        }
    };

    const confirmArchive = async () => {
        try {
            await archiveBrand(archiveModal.brand.id);
            await onReload();
        } catch (err) {
            console.error(err);
            alert("Failed to archive brand.");
        } finally {
            setArchiveModal({ open: false, brand: null });
        }
    };

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{
                    display: "flex", alignItems: "center", height: 50, width: 300,
                    borderRadius: 12, border: "1px solid #d9dee5",
                    padding: "0 16px", background: "#fff", boxSizing: "border-box",
                }}>
                    <input
                        placeholder="Search brands..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{
                            border: "none", outline: "none", width: "100%",
                            fontSize: 15, background: "transparent",
                            color: "#2d3340", fontFamily: "inherit",
                        }}
                    />
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <button onClick={onToggleArchived} style={{
                        height: 50, borderRadius: 12, padding: "0 18px",
                        border: showArchived ? "1px solid #2e9d5b" : "1px solid #d9dee5",
                        background: showArchived ? "#f0faf4" : "#fff",
                        color: showArchived ? "#2e9d5b" : "#273142",
                        fontWeight: 600, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap",
                    }}>
                        {showArchived ? "✓ Showing Archived" : "Show Archived"}
                    </button>
                    <button onClick={openCreate} style={{
                        height: 50, borderRadius: 12, padding: "0 22px",
                        background: "#2e9d5b", color: "#fff", border: "none",
                        fontWeight: 700, fontSize: 15, cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(46,157,91,0.18)", whiteSpace: "nowrap",
                    }}>+ Add Brand</button>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: 24, color: "#7f8792", fontSize: 15 }}>Loading...</div>
            ) : error ? (
                <div style={{ padding: 24, color: "#d14343", fontSize: 15 }}>{error}</div>
            ) : filtered.length === 0 ? (
                <div style={{ padding: 24, color: "#7f8792", fontSize: 15 }}>No brands found.</div>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 16,
                }}>
                    {filtered.map((brand) => (
                        <BrandCard key={brand.id} brand={brand}
                                   onEdit={openEdit}
                                   onArchive={(b) => setArchiveModal({ open: true, brand: b })}
                        />
                    ))}
                </div>
            )}

            <BrandModal open={modalOpen} mode={modalMode} brand={editingBrand}
                        onSubmit={handleSubmit} onClose={() => setModalOpen(false)} />
            <ConfirmArchiveModal open={archiveModal.open} item={archiveModal.brand}
                                 entityLabel="Brand" onConfirm={confirmArchive}
                                 onClose={() => setArchiveModal({ open: false, brand: null })} />
        </>
    );
}