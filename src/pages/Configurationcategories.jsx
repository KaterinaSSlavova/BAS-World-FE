import { useState, useMemo } from "react";
import { createCategory, updateCategory, archiveCategory } from "../lib/api/categories";
import { ConfirmArchiveModal } from "./ConfigurationShared";

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
                }}>Name</label>
                <input
                    autoFocus value={name} onChange={(e) => setName(e.target.value)}
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
                    Parent Category{" "}
                    <span style={{ fontWeight: 400, textTransform: "none", color: "#b0b8c4" }}>(optional)</span>
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
                    }}>Cancel</button>
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

// ─── Configuration Categories Tab ─────────────────────────────

export default function ConfigurationCategories({ categories, loading, error, search, onSearchChange, showArchived, onToggleArchived, onReload }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [editingCategory, setEditingCategory] = useState(null);
    const [archiveModal, setArchiveModal] = useState({ open: false, item: null });

    const filtered = useMemo(() => categories
            .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) && (showArchived || !c.archived))
            .sort((a, b) => b.id - a.id),
        [categories, search, showArchived]);

    const openCreate = () => { setModalMode("create"); setEditingCategory(null); setModalOpen(true); };
    const openEdit = (cat) => { setModalMode("edit"); setEditingCategory(cat); setModalOpen(true); };

    const handleSubmit = async ({ name, parentId }) => {
        try {
            if (modalMode === "create") await createCategory(name, parentId);
            else await updateCategory(editingCategory.id, name, parentId);
            await onReload();
            setModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Failed to save category.");
        }
    };

    const confirmArchive = async () => {
        try {
            await archiveCategory(archiveModal.item.id);
            await onReload();
        } catch (err) {
            console.error(err);
            alert("Failed to archive category.");
        } finally {
            setArchiveModal({ open: false, item: null });
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
                        placeholder="Search categories..."
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
                    }}>+ Add Category</button>
                </div>
            </div>

            <CategoryTable items={filtered} allCategories={categories}
                           onEdit={openEdit}
                           onArchive={(item) => setArchiveModal({ open: true, item })}
                           loading={loading} error={error} />

            <CategoryModal
                key={`${modalOpen}-${editingCategory?.id}`}
                open={modalOpen} mode={modalMode}
                category={editingCategory} allCategories={categories}
                onSubmit={handleSubmit} onClose={() => setModalOpen(false)} />
            <ConfirmArchiveModal open={archiveModal.open} item={archiveModal.item}
                                 entityLabel="Category" onConfirm={confirmArchive}
                                 onClose={() => setArchiveModal({ open: false, item: null })} />
        </>
    );
}