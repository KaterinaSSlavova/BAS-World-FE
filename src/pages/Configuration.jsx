import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";
import { getAllBrands, createBrand, updateBrand, archiveBrand } from "../lib/api/brands";
import { getAllCategories, createCategory, updateCategory, archiveCategory } from "../lib/api/categories";
import { getAllTypes, createType, updateType, archiveType } from "../lib/api/types";
import { uploadBrandPicture } from "../lib/uploadBrandPicture";

// ─── Helpers ─────────────────────────────────────────────────

function CountPill({ count }) {
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            minWidth: 28, padding: "4px 10px", borderRadius: 999,
            background: "#e8f5ec", color: "#2e9d5b", border: "1px solid #b9dec6",
            fontSize: 13, fontWeight: 700, marginLeft: 8,
        }}>
            {count}
        </span>
    );
}

// ─── Confirm Archive Modal ────────────────────────────────────

function ConfirmArchiveModal({ open, item, entityLabel, onConfirm, onClose }) {
    if (!open) return null;
    const isArchived = item?.archived;

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
                    width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 800, color: "#1f2937" }}>
                    {isArchived ? "Unarchive" : "Archive"} "{item?.name}"?
                </h2>
                <p style={{ margin: "0 0 28px", color: "#7f8792", fontSize: 15 }}>
                    {isArchived
                        ? `This ${entityLabel.toLowerCase()} will become active again.`
                        : `This ${entityLabel.toLowerCase()} will be hidden from active use.`}
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <button onClick={onClose} style={{
                        padding: "11px 22px", borderRadius: 10, border: "1px solid #d9dee5",
                        background: "#fff", fontSize: 15, fontWeight: 700, color: "#374151", cursor: "pointer",
                    }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} style={{
                        padding: "11px 22px", borderRadius: 10, border: "none",
                        background: isArchived ? "#2e9d5b" : "#f59e0b",
                        fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer",
                    }}>
                        {isArchived ? "Unarchive" : "Archive"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Item Modal (Types) ───────────────────────────────────────

function ItemModal({ open, mode, entityLabel, value, onChange, onSubmit, onClose }) {
    if (!open) return null;

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
                    width: "100%", maxWidth: 460, boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 800, color: "#1f2937" }}>
                    {mode === "edit" ? `Edit ${entityLabel}` : `Add ${entityLabel}`}
                </h2>
                <label style={{
                    display: "block", fontSize: 13, fontWeight: 700, color: "#7b8494",
                    textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8,
                }}>
                    Name
                </label>
                <input
                    autoFocus
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`Enter ${entityLabel.toLowerCase()} name...`}
                    onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                    style={{
                        width: "100%", boxSizing: "border-box", padding: "13px 16px",
                        borderRadius: 12, border: "1.5px solid #d9dee5", fontSize: 16,
                        color: "#273142", outline: "none", marginBottom: 28, fontFamily: "inherit",
                    }}
                />
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <button onClick={onClose} style={{
                        padding: "12px 22px", borderRadius: 10, border: "1px solid #d9dee5",
                        background: "#fff", fontSize: 15, fontWeight: 700, color: "#374151", cursor: "pointer",
                    }}>
                        Cancel
                    </button>
                    <button onClick={onSubmit} style={{
                        padding: "12px 22px", borderRadius: 10, border: "none",
                        background: "#2e9d5b", fontSize: 15, fontWeight: 700, color: "#fff",
                        cursor: "pointer", boxShadow: "0 4px 12px rgba(46,157,91,0.18)",
                    }}>
                        {mode === "edit" ? "Save Changes" : `Add ${entityLabel}`}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Category Modal ───────────────────────────────────────────

function CategoryModal({ open, mode, category, allCategories, onSubmit, onClose }) {
    const [name, setName] = useState(category?.name ?? "");
    const [parentId, setParentId] = useState(category?.parentId ?? "");

    if (!open) return null;

    const handleSubmit = () => {
        if (!name.trim()) return;
        onSubmit({ name: name.trim(), parentId: parentId !== "" ? Number(parentId) : undefined });
    };

    const parentOptions = allCategories.filter((c) => !c.archived && c.id !== category?.id);

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
                    {mode === "edit" ? "Edit Category" : "Add Category"}
                </h2>

                <label style={{
                    display: "block", fontSize: 13, fontWeight: 700, color: "#7b8494",
                    textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8,
                }}>
                    Name
                </label>
                <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter category name..."
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    style={{
                        width: "100%", boxSizing: "border-box", padding: "13px 16px",
                        borderRadius: 12, border: "1.5px solid #d9dee5", fontSize: 16,
                        color: "#273142", outline: "none", marginBottom: 20, fontFamily: "inherit",
                    }}
                />

                <label style={{
                    display: "block", fontSize: 13, fontWeight: 700, color: "#7b8494",
                    textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8,
                }}>
                    Parent Category <span style={{ fontWeight: 400, textTransform: "none", color: "#b0b8c4" }}>(optional)</span>
                </label>
                <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    style={{
                        width: "100%", boxSizing: "border-box", padding: "13px 16px",
                        borderRadius: 12, border: "1.5px solid #d9dee5", fontSize: 16,
                        color: parentId === "" ? "#b0b8c4" : "#273142",
                        outline: "none", marginBottom: 28, fontFamily: "inherit",
                        background: "#fff", cursor: "pointer",
                    }}
                >
                    <option value="">No parent</option>
                    {parentOptions.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <button onClick={onClose} style={{
                        padding: "12px 22px", borderRadius: 10, border: "1px solid #d9dee5",
                        background: "#fff", fontSize: 15, fontWeight: 700, color: "#374151", cursor: "pointer",
                    }}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} style={{
                        padding: "12px 22px", borderRadius: 10, border: "none",
                        background: "#2e9d5b", fontSize: 15, fontWeight: 700, color: "#fff",
                        cursor: "pointer", boxShadow: "0 4px 12px rgba(46,157,91,0.18)",
                    }}>
                        {mode === "edit" ? "Save Changes" : "Add Category"}
                    </button>
                </div>
            </div>
        </div>
    );
}

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
                            <a

                            href={brand.picture}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{ color: "#2e9d5b", textDecoration: "underline", cursor: "pointer" }}
                            >
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

// ─── Types Table ──────────────────────────────────────────────

function TypesTable({ items, onEdit, onArchive, loading, error }) {
    if (loading) return <div style={{ padding: 24, color: "#7f8792", fontSize: 15 }}>Loading...</div>;
    if (error) return <div style={{ padding: 24, color: "#d14343", fontSize: 15 }}>{error}</div>;

    return (
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #e6eaef", overflow: "hidden" }}>
            {items.length === 0 ? (
                <div style={{ padding: "32px 24px", color: "#7f8792", fontSize: 15 }}>No types found.</div>
            ) : (
                <>
                    <div style={{
                        display: "grid", gridTemplateColumns: "80px 1fr auto",
                        gap: 16, padding: "18px 24px", borderBottom: "1px solid #eef1f4",
                        background: "#fbfcfd", fontSize: 12, fontWeight: 800, color: "#7b8494",
                        textTransform: "uppercase", letterSpacing: "0.08em", alignItems: "center",
                    }}>
                        <div>ID</div><div>Name</div><div>Actions</div>
                    </div>
                    {items.map((item) => (
                        <div key={item.id} style={{
                            display: "grid", gridTemplateColumns: "80px 1fr auto",
                            gap: 16, padding: "20px 24px",
                            borderBottom: "1px solid #eef1f4", alignItems: "center",
                            opacity: item.archived ? 0.6 : 1,
                        }}>
                            <div style={{ fontSize: 14, color: "#7b8494", fontWeight: 600 }}>#{item.id}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ fontSize: 16, fontWeight: 700, color: "#273142" }}>{item.name}</span>
                                {item.archived && (
                                    <span style={{
                                        padding: "2px 8px", borderRadius: 999, background: "#fff7e8",
                                        color: "#d97706", border: "1px solid #f5d29c", fontSize: 11, fontWeight: 700,
                                    }}>Archived</span>
                                )}
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => onEdit(item)} style={{
                                    padding: "8px 16px", borderRadius: 9, border: "1px solid #d9dee5",
                                    background: "#fff", fontSize: 14, fontWeight: 700, color: "#374151", cursor: "pointer",
                                }}>Edit</button>
                                <button onClick={() => onArchive(item)} style={{
                                    padding: "8px 16px", borderRadius: 9,
                                    border: item.archived ? "1px solid #b9dec6" : "1px solid #fde9b0",
                                    background: item.archived ? "#f0faf4" : "#fffbf0",
                                    fontSize: 14, fontWeight: 700,
                                    color: item.archived ? "#2e9d5b" : "#d97706", cursor: "pointer",
                                }}>
                                    {item.archived ? "Unarchive" : "Archive"}
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

// ─── Category Table ───────────────────────────────────────────

function CategoryTable({ items, allCategories, onEdit, onArchive, loading, error }) {
    if (loading) return <div style={{ padding: 24, color: "#7f8792", fontSize: 15 }}>Loading...</div>;
    if (error) return <div style={{ padding: 24, color: "#d14343", fontSize: 15 }}>{error}</div>;

    const getParentName = (parentId) => {
        if (!parentId) return null;
        return allCategories.find((c) => c.id === parentId)?.name ?? `#${parentId}`;
    };

    return (
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #e6eaef", overflow: "hidden" }}>
            {items.length === 0 ? (
                <div style={{ padding: "32px 24px", color: "#7f8792", fontSize: 15 }}>No categories found.</div>
            ) : (
                <>
                    <div style={{
                        display: "grid", gridTemplateColumns: "80px 1fr 160px auto",
                        gap: 16, padding: "18px 24px", borderBottom: "1px solid #eef1f4",
                        background: "#fbfcfd", fontSize: 12, fontWeight: 800, color: "#7b8494",
                        textTransform: "uppercase", letterSpacing: "0.08em", alignItems: "center",
                    }}>
                        <div>ID</div><div>Name</div><div>Parent</div><div>Actions</div>
                    </div>
                    {items.map((item) => {
                        const parentName = getParentName(item.parentId);
                        return (
                            <div key={item.id} style={{
                                display: "grid", gridTemplateColumns: "80px 1fr 160px auto",
                                gap: 16, padding: "20px 24px",
                                borderBottom: "1px solid #eef1f4", alignItems: "center",
                                opacity: item.archived ? 0.6 : 1,
                            }}>
                                <div style={{ fontSize: 14, color: "#7b8494", fontWeight: 600 }}>#{item.id}</div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ fontSize: 16, fontWeight: 700, color: "#273142" }}>{item.name}</span>
                                    {item.archived && (
                                        <span style={{
                                            padding: "2px 8px", borderRadius: 999, background: "#fff7e8",
                                            color: "#d97706", border: "1px solid #f5d29c", fontSize: 11, fontWeight: 700,
                                        }}>Archived</span>
                                    )}
                                </div>
                                <div style={{ fontSize: 14, color: "#7b8494" }}>
                                    {parentName
                                        ? <span style={{
                                            padding: "3px 10px", borderRadius: 999,
                                            background: "#f1f3f6", color: "#5b6475",
                                            fontSize: 13, fontWeight: 600,
                                        }}>{parentName}</span>
                                        : <span style={{ color: "#c4c9d2" }}>—</span>}
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button onClick={() => onEdit(item)} style={{
                                        padding: "8px 16px", borderRadius: 9, border: "1px solid #d9dee5",
                                        background: "#fff", fontSize: 14, fontWeight: 700, color: "#374151", cursor: "pointer",
                                    }}>Edit</button>
                                    <button onClick={() => onArchive(item)} style={{
                                        padding: "8px 16px", borderRadius: 9,
                                        border: item.archived ? "1px solid #b9dec6" : "1px solid #fde9b0",
                                        background: item.archived ? "#f0faf4" : "#fffbf0",
                                        fontSize: 14, fontWeight: 700,
                                        color: item.archived ? "#2e9d5b" : "#d97706", cursor: "pointer",
                                    }}>
                                        {item.archived ? "Unarchive" : "Archive"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────

export default function Configuration() {
    const [activeTab, setActiveTab] = useState("types");

    const [types, setTypes] = useState([]);
    const [typesLoading, setTypesLoading] = useState(false);
    const [typesError, setTypesError] = useState("");
    const [showArchivedTypes, setShowArchivedTypes] = useState(false);

    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categoriesError, setCategoriesError] = useState("");
    const [showArchivedCategories, setShowArchivedCategories] = useState(false);

    const [brands, setBrands] = useState([]);
    const [brandsLoading, setBrandsLoading] = useState(false);
    const [brandsError, setBrandsError] = useState("");
    const [showArchivedBrands, setShowArchivedBrands] = useState(false);

    const [search, setSearch] = useState("");

    // Types modal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [modalValue, setModalValue] = useState("");
    const [editingItem, setEditingItem] = useState(null);
    const [archiveTypeModal, setArchiveTypeModal] = useState({ open: false, item: null });

    // Category modal
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [categoryModalMode, setCategoryModalMode] = useState("create");
    const [editingCategory, setEditingCategory] = useState(null);
    const [archiveCategoryModal, setArchiveCategoryModal] = useState({ open: false, item: null });

    // Brand modal
    const [brandModalOpen, setBrandModalOpen] = useState(false);
    const [brandModalMode, setBrandModalMode] = useState("create");
    const [editingBrand, setEditingBrand] = useState(null);
    const [archiveBrandModal, setArchiveBrandModal] = useState({ open: false, brand: null });

    // ── Load all on mount ──
    useEffect(() => {
        const loadAll = async () => {
            setTypesLoading(true);
            try {
                const data = await getAllTypes();
                setTypes(data);
            } catch { setTypesError("Failed to load types."); }
            finally { setTypesLoading(false); }

            setCategoriesLoading(true);
            try {
                const data = await getAllCategories();
                setCategories(data);
            } catch { setCategoriesError("Failed to load categories."); }
            finally { setCategoriesLoading(false); }

            setBrandsLoading(true);
            try {
                const data = await getAllBrands();
                setBrands(data);
            } catch { setBrandsError("Failed to load brands."); }
            finally { setBrandsLoading(false); }
        };
        void loadAll();
    }, []);

    // ── Reload all (called after any mutation) ──
    const reloadAll = async () => {
        const [t, c, b] = await Promise.all([getAllTypes(), getAllCategories(), getAllBrands()]);
        setTypes(t);
        setCategories(c);
        setBrands(b);
    };

    // ── Filtered + sorted lists ──
    const filteredTypes = useMemo(() => types
            .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) && (showArchivedTypes || !t.archived))
            .sort((a, b) => b.id - a.id),
        [types, search, showArchivedTypes]);

    const filteredCategories = useMemo(() => categories
            .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) && (showArchivedCategories || !c.archived))
            .sort((a, b) => b.id - a.id),
        [categories, search, showArchivedCategories]);

    const filteredBrands = useMemo(() => brands
            .filter((b) => b.name.toLowerCase().includes(search.toLowerCase()) && (showArchivedBrands || !b.archived))
            .sort((a, b) => b.id - a.id),
        [brands, search, showArchivedBrands]);

    // ── Types handlers ──
    const openCreateType = () => { setModalMode("create"); setModalValue(""); setEditingItem(null); setModalOpen(true); };
    const openEditType = (item) => { setModalMode("edit"); setModalValue(item.name); setEditingItem(item); setModalOpen(true); };

    const handleTypeSubmit = async () => {
        const trimmed = modalValue.trim();
        if (!trimmed) return;
        try {
            if (modalMode === "create") {
                await createType(trimmed);
            } else {
                await updateType(editingItem.id, trimmed);
            }
            await reloadAll();
            setModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Failed to save type.");
        }
    };

    const confirmArchiveType = async () => {
        try {
            await archiveType(archiveTypeModal.item.id);
            await reloadAll();
        } catch (err) {
            console.error(err);
            alert("Failed to archive type.");
        } finally {
            setArchiveTypeModal({ open: false, item: null });
        }
    };

    // ── Category handlers ──
    const openCreateCategory = () => { setCategoryModalMode("create"); setEditingCategory(null); setCategoryModalOpen(true); };
    const openEditCategory = (cat) => { setCategoryModalMode("edit"); setEditingCategory(cat); setCategoryModalOpen(true); };

    const handleCategorySubmit = async ({ name, parentId }) => {
        try {
            if (categoryModalMode === "create") {
                await createCategory(name, parentId);
            } else {
                await updateCategory(editingCategory.id, name, parentId);
            }
            await reloadAll();
            setCategoryModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Failed to save category.");
        }
    };

    const confirmArchiveCategory = async () => {
        try {
            await archiveCategory(archiveCategoryModal.item.id);
            await reloadAll();
        } catch (err) {
            console.error(err);
            alert("Failed to archive category.");
        } finally {
            setArchiveCategoryModal({ open: false, item: null });
        }
    };

    // ── Brand handlers ──
    const openCreateBrand = () => { setBrandModalMode("create"); setEditingBrand(null); setBrandModalOpen(true); };
    const openEditBrand = (brand) => { setBrandModalMode("edit"); setEditingBrand(brand); setBrandModalOpen(true); };

    const handleBrandSubmit = async ({ name, pictureUrl }) => {
        try {
            if (brandModalMode === "create") {
                await createBrand(name, pictureUrl ?? undefined);
            } else {
                await updateBrand(editingBrand.id, name, pictureUrl ?? undefined);
            }
            await reloadAll();
            setBrandModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Failed to save brand.");
        }
    };

    const confirmArchiveBrand = async () => {
        try {
            await archiveBrand(archiveBrandModal.brand.id);
            await reloadAll();
        } catch (err) {
            console.error(err);
            alert("Failed to archive brand.");
        } finally {
            setArchiveBrandModal({ open: false, brand: null });
        }
    };

    const tabs = [
        { key: "types", label: "Types", count: types.filter((t) => !t.archived).length },
        { key: "categories", label: "Categories", count: categories.filter((c) => !c.archived).length },
        { key: "brands", label: "Brands", count: brands.filter((b) => !b.archived).length },
    ];

    const handleAddClick = () => {
        if (activeTab === "brands") openCreateBrand();
        else if (activeTab === "categories") openCreateCategory();
        else openCreateType();
    };

    const addLabel = activeTab === "brands" ? "Brand" : activeTab === "categories" ? "Category" : "Type";

    return (
        <AppLayout>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Header */}
                <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", gap: 16, flexWrap: "wrap",
                }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#1f2937", lineHeight: 1.15 }}>
                            Configuration
                        </h1>
                        <p style={{ margin: "8px 0 0", color: "#7f8792", fontSize: 16, lineHeight: 1.5 }}>
                            Manage types, categories and brands
                        </p>
                    </div>
                    <button onClick={handleAddClick} style={{
                        background: "#2e9d5b", color: "#fff", border: "none",
                        borderRadius: 12, padding: "14px 22px",
                        fontWeight: 700, fontSize: 16, cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(46,157,91,0.18)",
                    }}>
                        + Add {addLabel}
                    </button>
                </div>

                {/* Tabs */}
                <div style={{
                    display: "flex", gap: 4, background: "#f1f3f6",
                    borderRadius: 12, padding: 4, width: "fit-content",
                }}>
                    {tabs.map((tab) => (
                        <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSearch(""); }} style={{
                            padding: "10px 20px", borderRadius: 9, border: "none",
                            background: activeTab === tab.key ? "#fff" : "transparent",
                            fontSize: 15, fontWeight: 700,
                            color: activeTab === tab.key ? "#273142" : "#7b8494",
                            cursor: "pointer",
                            boxShadow: activeTab === tab.key ? "0 2px 8px rgba(15,23,42,0.08)" : "none",
                            display: "flex", alignItems: "center",
                        }}>
                            {tab.label}
                            <CountPill count={tab.count} />
                        </button>
                    ))}
                </div>

                {/* Search + filters */}
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{
                        display: "flex", alignItems: "center", height: 50,
                        borderRadius: 12, border: "1px solid #d9dee5",
                        padding: "0 16px", background: "#fff", maxWidth: 400, boxSizing: "border-box",
                    }}>
                        <input
                            placeholder={`Search ${activeTab}...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                border: "none", outline: "none", width: "100%",
                                fontSize: 15, background: "transparent",
                                color: "#2d3340", fontFamily: "inherit",
                            }}
                        />
                    </div>

                    {activeTab === "types" && (
                        <button onClick={() => setShowArchivedTypes((v) => !v)} style={{
                            height: 50, borderRadius: 12, padding: "0 18px",
                            border: showArchivedTypes ? "1px solid #2e9d5b" : "1px solid #d9dee5",
                            background: showArchivedTypes ? "#f0faf4" : "#fff",
                            color: showArchivedTypes ? "#2e9d5b" : "#273142",
                            fontWeight: 600, fontSize: 14, cursor: "pointer",
                        }}>
                            {showArchivedTypes ? "✓ Showing Archived" : "Show Archived"}
                        </button>
                    )}
                    {activeTab === "categories" && (
                        <button onClick={() => setShowArchivedCategories((v) => !v)} style={{
                            height: 50, borderRadius: 12, padding: "0 18px",
                            border: showArchivedCategories ? "1px solid #2e9d5b" : "1px solid #d9dee5",
                            background: showArchivedCategories ? "#f0faf4" : "#fff",
                            color: showArchivedCategories ? "#2e9d5b" : "#273142",
                            fontWeight: 600, fontSize: 14, cursor: "pointer",
                        }}>
                            {showArchivedCategories ? "✓ Showing Archived" : "Show Archived"}
                        </button>
                    )}
                    {activeTab === "brands" && (
                        <button onClick={() => setShowArchivedBrands((v) => !v)} style={{
                            height: 50, borderRadius: 12, padding: "0 18px",
                            border: showArchivedBrands ? "1px solid #2e9d5b" : "1px solid #d9dee5",
                            background: showArchivedBrands ? "#f0faf4" : "#fff",
                            color: showArchivedBrands ? "#2e9d5b" : "#273142",
                            fontWeight: 600, fontSize: 14, cursor: "pointer",
                        }}>
                            {showArchivedBrands ? "✓ Showing Archived" : "Show Archived"}
                        </button>
                    )}
                </div>

                {/* Content */}
                {activeTab === "types" && (
                    <TypesTable
                        items={filteredTypes}
                        onEdit={openEditType}
                        onArchive={(item) => setArchiveTypeModal({ open: true, item })}
                        loading={typesLoading}
                        error={typesError}
                    />
                )}
                {activeTab === "categories" && (
                    <CategoryTable
                        items={filteredCategories}
                        allCategories={categories}
                        onEdit={openEditCategory}
                        onArchive={(item) => setArchiveCategoryModal({ open: true, item })}
                        loading={categoriesLoading}
                        error={categoriesError}
                    />
                )}
                {activeTab === "brands" && (
                    brandsLoading ? (
                        <div style={{ padding: 24, color: "#7f8792", fontSize: 15 }}>Loading...</div>
                    ) : brandsError ? (
                        <div style={{ padding: 24, color: "#d14343", fontSize: 15 }}>{brandsError}</div>
                    ) : filteredBrands.length === 0 ? (
                        <div style={{ padding: 24, color: "#7f8792", fontSize: 15 }}>No brands found.</div>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: 16,
                        }}>
                            {filteredBrands.map((brand) => (
                                <BrandCard key={brand.id} brand={brand}
                                           onEdit={openEditBrand}
                                           onArchive={(b) => setArchiveBrandModal({ open: true, brand: b })}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>

            {/* Types modals */}
            <ItemModal open={modalOpen} mode={modalMode} entityLabel="Type"
                       value={modalValue} onChange={setModalValue}
                       onSubmit={handleTypeSubmit} onClose={() => setModalOpen(false)} />
            <ConfirmArchiveModal open={archiveTypeModal.open} item={archiveTypeModal.item}
                                 entityLabel="Type"
                                 onConfirm={confirmArchiveType}
                                 onClose={() => setArchiveTypeModal({ open: false, item: null })} />

            {/* Category modals */}
            <CategoryModal key={`${categoryModalOpen}-${editingCategory?.id}`}
                           open={categoryModalOpen} mode={categoryModalMode}
                           category={editingCategory} allCategories={categories}
                           onSubmit={handleCategorySubmit} onClose={() => setCategoryModalOpen(false)} />
            <ConfirmArchiveModal open={archiveCategoryModal.open} item={archiveCategoryModal.item}
                                 entityLabel="Category"
                                 onConfirm={confirmArchiveCategory}
                                 onClose={() => setArchiveCategoryModal({ open: false, item: null })} />

            {/* Brand modals */}
            <BrandModal open={brandModalOpen} mode={brandModalMode} brand={editingBrand}
                        onSubmit={handleBrandSubmit} onClose={() => setBrandModalOpen(false)} />
            <ConfirmArchiveModal open={archiveBrandModal.open} item={archiveBrandModal.brand}
                                 entityLabel="Brand"
                                 onConfirm={confirmArchiveBrand}
                                 onClose={() => setArchiveBrandModal({ open: false, brand: null })} />
        </AppLayout>
    );
}