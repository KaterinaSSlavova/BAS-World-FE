import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";
import { getAllBrands, createBrand, updateBrand, archiveBrand } from "../lib/api/brands";
import { uploadBrandPicture } from "../lib/uploadBrandPicture";
// ─── Static Data ─────────────────────────────────────────────

const INITIAL_TYPES = [
    { id: 1, name: "Physical Product" },
    { id: 2, name: "Digital Product" },
    { id: 3, name: "Service" },
];

const INITIAL_CATEGORIES = [
    { id: 1, name: "Tyre" },
    { id: 2, name: "Rim" },
    { id: 3, name: "Accessory" },
];

// ─── Helpers ─────────────────────────────────────────────────

function getNextId(items) {
    return items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;
}

function CountPill({ count }) {
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 28,
                padding: "4px 10px",
                borderRadius: 999,
                background: "#e8f5ec",
                color: "#2e9d5b",
                border: "1px solid #b9dec6",
                fontSize: 13,
                fontWeight: 700,
                marginLeft: 8,
            }}
        >
            {count}
        </span>
    );
}

// ─── Confirm Archive Modal ────────────────────────────────────

function ConfirmArchiveModal({ open, brand, onConfirm, onClose }) {
    if (!open) return null;
    const isArchived = brand?.archived;

    return (
        <div
            style={{
                position: "fixed", inset: 0,
                background: "rgba(15,23,42,0.45)",
                zIndex: 1000,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 16,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "#fff", borderRadius: 18,
                    padding: "32px 28px", width: "100%", maxWidth: 420,
                    boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 800, color: "#1f2937" }}>
                    {isArchived ? "Unarchive" : "Archive"} "{brand?.name}"?
                </h2>
                <p style={{ margin: "0 0 28px", color: "#7f8792", fontSize: 15 }}>
                    {isArchived
                        ? "This brand will become active again."
                        : "This brand will be hidden from active use."}
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "11px 22px", borderRadius: 10,
                            border: "1px solid #d9dee5", background: "#fff",
                            fontSize: 15, fontWeight: 700, color: "#374151", cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: "11px 22px", borderRadius: 10, border: "none",
                            background: isArchived ? "#2e9d5b" : "#f59e0b",
                            fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer",
                        }}
                    >
                        {isArchived ? "Unarchive" : "Archive"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Item Modal (Types & Categories) ─────────────────────────

function ItemModal({ open, mode, entityLabel, value, onChange, onSubmit, onClose }) {
    if (!open) return null;

    return (
        <div
            style={{
                position: "fixed", inset: 0,
                background: "rgba(15,23,42,0.45)",
                zIndex: 1000,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 16,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "#fff", borderRadius: 18,
                    padding: "32px 28px", width: "100%", maxWidth: 460,
                    boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 800, color: "#1f2937" }}>
                    {mode === "edit" ? `Edit ${entityLabel}` : `Add ${entityLabel}`}
                </h2>

                <label style={{
                    display: "block", fontSize: 13, fontWeight: 700,
                    color: "#7b8494", textTransform: "uppercase",
                    letterSpacing: "0.07em", marginBottom: 8,
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
                        width: "100%", boxSizing: "border-box",
                        padding: "13px 16px", borderRadius: 12,
                        border: "1.5px solid #d9dee5", fontSize: 16,
                        color: "#273142", outline: "none",
                        marginBottom: 28, fontFamily: "inherit",
                    }}
                />

                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "12px 22px", borderRadius: 10,
                            border: "1px solid #d9dee5", background: "#fff",
                            fontSize: 15, fontWeight: 700, color: "#374151", cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        style={{
                            padding: "12px 22px", borderRadius: 10, border: "none",
                            background: "#2e9d5b", fontSize: 15, fontWeight: 700,
                            color: "#fff", cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(46,157,91,0.18)",
                        }}
                    >
                        {mode === "edit" ? "Save Changes" : `Add ${entityLabel}`}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Confirm Delete Modal (Types & Categories) ────────────────

function ConfirmDeleteModal({ open, name, onConfirm, onClose }) {
    if (!open) return null;

    return (
        <div
            style={{
                position: "fixed", inset: 0,
                background: "rgba(15,23,42,0.45)",
                zIndex: 1000,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 16,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "#fff", borderRadius: 18,
                    padding: "32px 28px", width: "100%", maxWidth: 420,
                    boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 800, color: "#1f2937" }}>
                    Delete "{name}"?
                </h2>
                <p style={{ margin: "0 0 28px", color: "#7f8792", fontSize: 15 }}>
                    This action cannot be undone.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "11px 22px", borderRadius: 10,
                            border: "1px solid #d9dee5", background: "#fff",
                            fontSize: 15, fontWeight: 700, color: "#374151", cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: "11px 22px", borderRadius: 10, border: "none",
                            background: "#d14343", fontSize: 15, fontWeight: 700,
                            color: "#fff", cursor: "pointer",
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Brand Edit Modal ─────────────────────────────────────────
function BrandModal({ open, mode, brand, onSubmit, onClose }) {
    const [name, setName] = useState("");
    const [pictureUrl, setPictureUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (open) {
            setName(brand?.name ?? "");
            setPictureUrl(brand?.pictureUrl ?? "");
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
                position: "fixed", inset: 0,
                background: "rgba(15,23,42,0.45)",
                zIndex: 1000,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 16,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "#fff", borderRadius: 18,
                    padding: "32px 28px", width: "100%", maxWidth: 480,
                    boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 800, color: "#1f2937" }}>
                    {mode === "edit" ? "Edit Brand" : "Add Brand"}
                </h2>

                {/* Picture preview */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                    <div style={{
                        width: 96, height: 96, borderRadius: 16,
                        border: "2px dashed #d9dee5", background: "#f8fafc",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        overflow: "hidden",
                    }}>
                        {pictureUrl ? (
                            <img
                                src={pictureUrl}
                                alt="preview"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => { e.target.style.display = "none"; }}
                            />
                        ) : (
                            <span style={{ fontSize: 32 }}>🏷️</span>
                        )}
                    </div>
                </div>

                {/* Name */}
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
                    placeholder="Enter brand name..."
                    style={{
                        width: "100%", boxSizing: "border-box",
                        padding: "13px 16px", borderRadius: 12,
                        border: "1.5px solid #d9dee5", fontSize: 16,
                        color: "#273142", outline: "none",
                        marginBottom: 20, fontFamily: "inherit",
                    }}
                />

                {/* Picture upload */}
                <label style={{
                    display: "block", fontSize: 13, fontWeight: 700, color: "#7b8494",
                    textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8,
                }}>
                    Picture
                </label>
                <label style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", borderRadius: 12,
                    border: "1.5px dashed #d9dee5", background: "#f8fafc",
                    cursor: "pointer", marginBottom: 28,
                }}>
                    <span style={{ fontSize: 20 }}>📁</span>
                    <span style={{ fontSize: 14, color: "#7b8494", fontWeight: 600 }}>
                        {uploading
                            ? "Uploading..."
                            : selectedFile
                                ? selectedFile.name
                                : "Choose image..."}
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
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

                {/* Actions */}
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "12px 22px", borderRadius: 10,
                            border: "1px solid #d9dee5", background: "#fff",
                            fontSize: 15, fontWeight: 700, color: "#374151", cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={uploading}
                        style={{
                            padding: "12px 22px", borderRadius: 10, border: "none",
                            background: uploading ? "#a3d9b8" : "#2e9d5b",
                            fontSize: 15, fontWeight: 700, color: "#fff",
                            cursor: uploading ? "not-allowed" : "pointer",
                            boxShadow: "0 4px 12px rgba(46,157,91,0.18)",
                        }}
                    >
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
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                border: `1px solid ${expanded ? "#b9dec6" : "#e6eaef"}`,
                overflow: "hidden",
                transition: "border-color 0.15s",
                opacity: brand.archived ? 0.6 : 1,
            }}
        >
            {/* Card top — always visible, click to expand */}
            <div
                onClick={() => setExpanded((v) => !v)}
                style={{
                    padding: "20px 18px 16px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                {/* Avatar */}
                <div
                    style={{
                        width: 72, height: 72, borderRadius: 14,
                        background: "#f1f3f6",
                        border: "1px solid #e6eaef",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        overflow: "hidden",
                        flexShrink: 0,
                    }}
                >
                    {brand.pictureUrl ? (
                        <img
                            src={brand.pictureUrl}
                            alt={brand.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <span style={{ fontSize: 28, color: "#b0b8c4" }}>🏷️</span>
                    )}
                </div>

                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#273142" }}>
                        {brand.name}
                    </div>
                    {brand.archived && (
                        <span
                            style={{
                                display: "inline-block",
                                marginTop: 6,
                                padding: "3px 10px",
                                borderRadius: 999,
                                background: "#fff7e8",
                                color: "#d97706",
                                border: "1px solid #f5d29c",
                                fontSize: 12,
                                fontWeight: 700,
                            }}
                        >
                            Archived
                        </span>
                    )}
                </div>

                {/* Chevron */}
                <div style={{
                    fontSize: 13, color: "#b0b8c4",
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                }}>
                    ▼
                </div>
            </div>

            {/* Expanded detail panel */}
            {expanded && (
                <div
                    style={{
                        borderTop: "1px solid #eef1f4",
                        padding: "14px 18px 18px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                    }}
                >
                    <div style={{ fontSize: 13, color: "#7b8494" }}>
                        <span style={{ fontWeight: 700 }}>ID:</span> #{brand.id}
                    </div>

                    {brand.pictureUrl && (
                        <div style={{ fontSize: 13, color: "#7b8494", wordBreak: "break-all" }}>
                            <span style={{ fontWeight: 700 }}>URL:</span> {brand.pictureUrl}
                        </div>
                    )}

                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(brand); }}
                            style={{
                                flex: 1,
                                padding: "9px 0", borderRadius: 9,
                                border: "1px solid #d9dee5", background: "#fff",
                                fontSize: 14, fontWeight: 700, color: "#374151", cursor: "pointer",
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onArchive(brand); }}
                            style={{
                                flex: 1,
                                padding: "9px 0", borderRadius: 9,
                                border: brand.archived ? "1px solid #b9dec6" : "1px solid #fde9b0",
                                background: brand.archived ? "#f0faf4" : "#fffbf0",
                                fontSize: 14, fontWeight: 700,
                                color: brand.archived ? "#2e9d5b" : "#d97706",
                                cursor: "pointer",
                            }}
                        >
                            {brand.archived ? "Unarchive" : "Archive"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── CRUD Table (Types & Categories) ─────────────────────────

function CrudTable({ items, entityLabel, onEdit, onDelete }) {
    return (
        <div
            style={{
                background: "#fff", borderRadius: 18,
                border: "1px solid #e6eaef", overflow: "hidden",
            }}
        >
            {items.length === 0 ? (
                <div style={{ padding: "32px 24px", color: "#7f8792", fontSize: 15 }}>
                    No {entityLabel.toLowerCase()}s found.
                </div>
            ) : (
                <>
                    <div
                        style={{
                            display: "grid", gridTemplateColumns: "80px 1fr auto",
                            gap: 16, padding: "18px 24px",
                            borderBottom: "1px solid #eef1f4", background: "#fbfcfd",
                            fontSize: 12, fontWeight: 800, color: "#7b8494",
                            textTransform: "uppercase", letterSpacing: "0.08em",
                            alignItems: "center",
                        }}
                    >
                        <div>ID</div>
                        <div>Name</div>
                        <div>Actions</div>
                    </div>

                    {items.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                display: "grid", gridTemplateColumns: "80px 1fr auto",
                                gap: 16, padding: "20px 24px",
                                borderBottom: "1px solid #eef1f4", alignItems: "center",
                            }}
                        >
                            <div style={{ fontSize: 14, color: "#7b8494", fontWeight: 600 }}>
                                #{item.id}
                            </div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#273142" }}>
                                {item.name}
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button
                                    onClick={() => onEdit(item)}
                                    style={{
                                        padding: "8px 16px", borderRadius: 9,
                                        border: "1px solid #d9dee5", background: "#fff",
                                        fontSize: 14, fontWeight: 700, color: "#374151", cursor: "pointer",
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(item)}
                                    style={{
                                        padding: "8px 16px", borderRadius: 9,
                                        border: "1px solid #fbc9c9", background: "#fff5f5",
                                        fontSize: 14, fontWeight: 700, color: "#d14343", cursor: "pointer",
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────

export default function Configuration() {
    const [activeTab, setActiveTab] = useState("types");

    // Types & Categories (static)
    const [types, setTypes] = useState(INITIAL_TYPES);
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);

    // Brands (live)
    const [brands, setBrands] = useState([]);
    const [brandsLoading, setBrandsLoading] = useState(false);
    const [brandsError, setBrandsError] = useState("");
    const [showArchived, setShowArchived] = useState(false);

    // Shared search
    const [search, setSearch] = useState("");

    // Types & Categories modal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [modalValue, setModalValue] = useState("");
    const [editingItem, setEditingItem] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ open: false, item: null });

    // Brand modal
    const [brandModalOpen, setBrandModalOpen] = useState(false);
    const [brandModalMode, setBrandModalMode] = useState("create");
    const [editingBrand, setEditingBrand] = useState(null);

    // Archive confirm modal
    const [archiveModal, setArchiveModal] = useState({ open: false, brand: null });

    // ── Load brands when tab opens ──
    useEffect(() => {
        if (activeTab !== "brands") return;

        const load = async () => {
            try {
                setBrandsLoading(true);
                setBrandsError("");
                const data = await getAllBrands();
                setBrands(data);
            } catch (err) {
                console.error(err);
                setBrandsError("Failed to load brands.");
            } finally {
                setBrandsLoading(false);
            }
        };

        void load();
    }, [activeTab]);

    // ── Types & Categories helpers ──
    const currentItems = activeTab === "types" ? types : categories;
    const setCurrentItems = activeTab === "types" ? setTypes : setCategories;
    const entityLabel = activeTab === "types" ? "Type" : "Category";

    const filteredItems = useMemo(
        () => currentItems.filter((i) =>
            i.name.toLowerCase().includes(search.toLowerCase())
        ),
        [currentItems, search]
    );

    const filteredBrands = useMemo(() => {
        return brands.filter((b) => {
            const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
            const matchesArchived = showArchived ? true : !b.archived;
            return matchesSearch && matchesArchived;
        });
    }, [brands, search, showArchived]);

    const openCreate = () => {
        setModalMode("create");
        setModalValue("");
        setEditingItem(null);
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setModalMode("edit");
        setModalValue(item.name);
        setEditingItem(item);
        setModalOpen(true);
    };

    const handleSubmit = () => {
        const trimmed = modalValue.trim();
        if (!trimmed) return;

        if (modalMode === "create") {
            setCurrentItems((prev) => [...prev, { id: getNextId(prev), name: trimmed }]);
        } else {
            setCurrentItems((prev) =>
                prev.map((i) => i.id === editingItem.id ? { ...i, name: trimmed } : i)
            );
        }
        setModalOpen(false);
    };

    const confirmDelete = () => {
        setCurrentItems((prev) => prev.filter((i) => i.id !== deleteModal.item.id));
        setDeleteModal({ open: false, item: null });
    };

    // ── Brand CRUD ──
    const openCreateBrand = () => {
        setBrandModalMode("create");
        setEditingBrand(null);
        setBrandModalOpen(true);
    };

    const openEditBrand = (brand) => {
        setBrandModalMode("edit");
        setEditingBrand(brand);
        setBrandModalOpen(true);
    };

    const handleBrandSubmit = async ({ name, pictureUrl }) => {
        try {
            if (brandModalMode === "create") {
                await createBrand(name, pictureUrl ?? undefined);
            } else {
                await updateBrand(editingBrand.id, name, pictureUrl ?? undefined);
            }
            const data = await getAllBrands();
            setBrands(data);
            setBrandModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Failed to save brand.");
        }
    };

    const confirmArchive = async () => {
        const brand = archiveModal.brand;
        try {
            await archiveBrand(brand.id);
            const data = await getAllBrands();
            setBrands(data);
        } catch (err) {
            console.error(err);
            alert("Failed to archive brand.");
        } finally {
            setArchiveModal({ open: false, brand: null });
        }
    };

    const tabs = [
        { key: "types", label: "Types", count: types.length },
        { key: "categories", label: "Categories", count: categories.length },
        { key: "brands", label: "Brands", count: brands.filter((b) => !b.archived).length },
    ];

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

                    <button
                        onClick={activeTab === "brands" ? openCreateBrand : openCreate}
                        style={{
                            background: "#2e9d5b", color: "#fff", border: "none",
                            borderRadius: 12, padding: "14px 22px",
                            fontWeight: 700, fontSize: 16, cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(46,157,91,0.18)",
                        }}
                    >
                        + Add {activeTab === "brands" ? "Brand" : entityLabel}
                    </button>
                </div>

                {/* Tabs */}
                <div style={{
                    display: "flex", gap: 4,
                    background: "#f1f3f6", borderRadius: 12,
                    padding: 4, width: "fit-content",
                }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => { setActiveTab(tab.key); setSearch(""); }}
                            style={{
                                padding: "10px 20px", borderRadius: 9, border: "none",
                                background: activeTab === tab.key ? "#fff" : "transparent",
                                fontSize: 15, fontWeight: 700,
                                color: activeTab === tab.key ? "#273142" : "#7b8494",
                                cursor: "pointer",
                                boxShadow: activeTab === tab.key ? "0 2px 8px rgba(15,23,42,0.08)" : "none",
                                display: "flex", alignItems: "center",
                            }}
                        >
                            {tab.label}
                            <CountPill count={tab.count} />
                        </button>
                    ))}
                </div>

                {/* Search row */}
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{
                        display: "flex", alignItems: "center", height: 50,
                        borderRadius: 12, border: "1px solid #d9dee5",
                        padding: "0 16px", background: "#fff", maxWidth: 400,
                        boxSizing: "border-box",
                    }}>
                        <input
                            placeholder={`Search ${activeTab === "brands" ? "brands" : entityLabel.toLowerCase() + "s"}...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                border: "none", outline: "none", width: "100%",
                                fontSize: 15, background: "transparent",
                                color: "#2d3340", fontFamily: "inherit",
                            }}
                        />
                    </div>

                    {/* Show archived toggle — only on brands tab */}
                    {activeTab === "brands" && (
                        <button
                            onClick={() => setShowArchived((v) => !v)}
                            style={{
                                height: 50, borderRadius: 12, padding: "0 18px",
                                border: showArchived ? "1px solid #2e9d5b" : "1px solid #d9dee5",
                                background: showArchived ? "#f0faf4" : "#fff",
                                color: showArchived ? "#2e9d5b" : "#273142",
                                fontWeight: 600, fontSize: 14, cursor: "pointer",
                            }}
                        >
                            {showArchived ? "✓ Showing Archived" : "Show Archived"}
                        </button>
                    )}
                </div>

                {/* Content */}
                {activeTab === "brands" ? (
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
                                <BrandCard
                                    key={brand.id}
                                    brand={brand}
                                    onEdit={openEditBrand}
                                    onArchive={(brand) => setArchiveModal({ open: true, brand })}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <CrudTable
                        items={filteredItems}
                        entityLabel={entityLabel}
                        onEdit={openEdit}
                        onDelete={(item) => setDeleteModal({ open: true, item })}
                    />
                )}
            </div>

            {/* Types & Categories modals */}
            <ItemModal
                open={modalOpen}
                mode={modalMode}
                entityLabel={entityLabel}
                value={modalValue}
                onChange={setModalValue}
                onSubmit={handleSubmit}
                onClose={() => setModalOpen(false)}
            />
            <ConfirmDeleteModal
                open={deleteModal.open}
                name={deleteModal.item?.name || ""}
                onConfirm={confirmDelete}
                onClose={() => setDeleteModal({ open: false, item: null })}
            />

            {/* Brand modals */}
            <BrandModal
                open={brandModalOpen}
                mode={brandModalMode}
                brand={editingBrand}
                onSubmit={handleBrandSubmit}
                onClose={() => setBrandModalOpen(false)}
            />
            <ConfirmArchiveModal
                open={archiveModal.open}
                brand={archiveModal.brand}
                onConfirm={confirmArchive}
                onClose={() => setArchiveModal({ open: false, brand: null })}
            />
        </AppLayout>
    );
}