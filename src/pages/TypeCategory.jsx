import { useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Shared helpers ───────────────────────────────────────────────────────────

function getNextId(items) {
    return items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;
}

// ─── Pill ─────────────────────────────────────────────────────────────────────

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

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────

function ConfirmDeleteModal({ open, name, onConfirm, onClose }) {
    if (!open) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15,23,42,0.45)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 18,
                    padding: "32px 28px",
                    width: "100%",
                    maxWidth: 420,
                    boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2
                    style={{
                        margin: "0 0 10px",
                        fontSize: 20,
                        fontWeight: 800,
                        color: "#1f2937",
                    }}
                >
                    Delete "{name}"?
                </h2>
                <p style={{ margin: "0 0 28px", color: "#7f8792", fontSize: 15 }}>
                    This action cannot be undone.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "11px 22px",
                            borderRadius: 10,
                            border: "1px solid #d9dee5",
                            background: "#fff",
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#374151",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: "11px 22px",
                            borderRadius: 10,
                            border: "none",
                            background: "#d14343",
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Create / Edit Modal ──────────────────────────────────────────────────────

function ItemModal({ open, mode, entityLabel, value, onChange, onSubmit, onClose }) {
    if (!open) return null;

    const isEdit = mode === "edit";

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15,23,42,0.45)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 18,
                    padding: "32px 28px",
                    width: "100%",
                    maxWidth: 460,
                    boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2
                    style={{
                        margin: "0 0 24px",
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#1f2937",
                    }}
                >
                    {isEdit ? `Edit ${entityLabel}` : `Add ${entityLabel}`}
                </h2>

                <label
                    style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#7b8494",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        marginBottom: 8,
                    }}
                >
                    Name
                </label>
                <input
                    autoFocus
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`Enter ${entityLabel.toLowerCase()} name...`}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onSubmit();
                    }}
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "13px 16px",
                        borderRadius: 12,
                        border: "1.5px solid #d9dee5",
                        fontSize: 16,
                        color: "#273142",
                        outline: "none",
                        marginBottom: 28,
                        fontFamily: "inherit",
                    }}
                />

                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "12px 22px",
                            borderRadius: 10,
                            border: "1px solid #d9dee5",
                            background: "#fff",
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#374151",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        style={{
                            padding: "12px 22px",
                            borderRadius: 10,
                            border: "none",
                            background: "#2e9d5b",
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#fff",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(46,157,91,0.18)",
                        }}
                    >
                        {isEdit ? "Save Changes" : `Add ${entityLabel}`}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── CRUD Table ───────────────────────────────────────────────────────────────

function CrudTable({ items, entityLabel, onEdit, onDelete }) {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 18,
                border: "1px solid #e6eaef",
                overflow: "hidden",
            }}
        >
            {items.length === 0 ? (
                <div style={{ padding: "32px 24px", color: "#7f8792", fontSize: 15 }}>
                    No {entityLabel.toLowerCase()}s found.
                </div>
            ) : (
                <>
                    {/* Table header */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "80px 1fr auto",
                            gap: 16,
                            padding: "18px 24px",
                            borderBottom: "1px solid #eef1f4",
                            background: "#fbfcfd",
                            fontSize: 12,
                            fontWeight: 800,
                            color: "#7b8494",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            alignItems: "center",
                        }}
                    >
                        <div>ID</div>
                        <div>Name</div>
                        <div>Actions</div>
                    </div>

                    {/* Rows */}
                    {items.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "80px 1fr auto",
                                gap: 16,
                                padding: "20px 24px",
                                borderBottom: "1px solid #eef1f4",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 14,
                                    color: "#7b8494",
                                    fontWeight: 600,
                                }}
                            >
                                #{item.id}
                            </div>

                            <div
                                style={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: "#273142",
                                }}
                            >
                                {item.name}
                            </div>

                            <div style={{ display: "flex", gap: 8 }}>
                                <button
                                    onClick={() => onEdit(item)}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: 9,
                                        border: "1px solid #d9dee5",
                                        background: "#fff",
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: "#374151",
                                        cursor: "pointer",
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(item)}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: 9,
                                        border: "1px solid #fbc9c9",
                                        background: "#fff5f5",
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: "#d14343",
                                        cursor: "pointer",
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TypesAndCategories() {
    const [activeTab, setActiveTab] = useState("types"); // "types" | "categories"

    // ── Types state ──
    const [types, setTypes] = useState(INITIAL_TYPES);
    const [typeSearch, setTypeSearch] = useState("");

    const [typeModalOpen, setTypeModalOpen] = useState(false);
    const [typeModalMode, setTypeModalMode] = useState("create"); // "create" | "edit"
    const [typeModalValue, setTypeModalValue] = useState("");
    const [editingType, setEditingType] = useState(null);

    const [deleteTypeModal, setDeleteTypeModal] = useState({ open: false, item: null });

    // ── Categories state ──
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);
    const [categorySearch, setCategorySearch] = useState("");

    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [categoryModalMode, setCategoryModalMode] = useState("create");
    const [categoryModalValue, setCategoryModalValue] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);

    const [deleteCategoryModal, setDeleteCategoryModal] = useState({ open: false, item: null });

    // ── Filtered lists ──
    const filteredTypes = useMemo(
        () =>
            types.filter((t) =>
                t.name.toLowerCase().includes(typeSearch.toLowerCase())
            ),
        [types, typeSearch]
    );

    const filteredCategories = useMemo(
        () =>
            categories.filter((c) =>
                c.name.toLowerCase().includes(categorySearch.toLowerCase())
            ),
        [categories, categorySearch]
    );

    // ── Type CRUD ──
    const openCreateType = () => {
        setTypeModalMode("create");
        setTypeModalValue("");
        setEditingType(null);
        setTypeModalOpen(true);
    };

    const openEditType = (item) => {
        setTypeModalMode("edit");
        setTypeModalValue(item.name);
        setEditingType(item);
        setTypeModalOpen(true);
    };

    const handleSubmitType = () => {
        const trimmed = typeModalValue.trim();
        if (!trimmed) {
            alert("Name is required.");
            return;
        }
        if (typeModalMode === "create") {
            setTypes((prev) => [...prev, { id: getNextId(prev), name: trimmed }]);
        } else {
            setTypes((prev) =>
                prev.map((t) => (t.id === editingType.id ? { ...t, name: trimmed } : t))
            );
        }
        setTypeModalOpen(false);
        setTypeModalValue("");
        setEditingType(null);
    };

    const confirmDeleteType = () => {
        setTypes((prev) => prev.filter((t) => t.id !== deleteTypeModal.item.id));
        setDeleteTypeModal({ open: false, item: null });
    };

    // ── Category CRUD ──
    const openCreateCategory = () => {
        setCategoryModalMode("create");
        setCategoryModalValue("");
        setEditingCategory(null);
        setCategoryModalOpen(true);
    };

    const openEditCategory = (item) => {
        setCategoryModalMode("edit");
        setCategoryModalValue(item.name);
        setEditingCategory(item);
        setCategoryModalOpen(true);
    };

    const handleSubmitCategory = () => {
        const trimmed = categoryModalValue.trim();
        if (!trimmed) {
            alert("Name is required.");
            return;
        }
        if (categoryModalMode === "create") {
            setCategories((prev) => [...prev, { id: getNextId(prev), name: trimmed }]);
        } else {
            setCategories((prev) =>
                prev.map((c) =>
                    c.id === editingCategory.id ? { ...c, name: trimmed } : c
                )
            );
        }
        setCategoryModalOpen(false);
        setCategoryModalValue("");
        setEditingCategory(null);
    };

    const confirmDeleteCategory = () => {
        setCategories((prev) =>
            prev.filter((c) => c.id !== deleteCategoryModal.item.id)
        );
        setDeleteCategoryModal({ open: false, item: null });
    };

    // ── Shared tab config ──
    const tabs = [
        { key: "types", label: "Types", count: types.length },
        { key: "categories", label: "Categories", count: categories.length },
    ];

    const isTypes = activeTab === "types";

    return (
        <AppLayout>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* ── Header ── */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 16,
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: 28,
                                fontWeight: 800,
                                color: "#1f2937",
                                lineHeight: 1.15,
                            }}
                        >
                            Types & Categories
                        </h1>
                        <p
                            style={{
                                margin: "8px 0 0",
                                color: "#7f8792",
                                fontSize: 16,
                                lineHeight: 1.5,
                            }}
                        >
                            Manage product types and categories
                        </p>
                    </div>

                    <button
                        onClick={isTypes ? openCreateType : openCreateCategory}
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
                        + Add {isTypes ? "Type" : "Category"}
                    </button>
                </div>

                {/* ── Tabs ── */}
                <div
                    style={{
                        display: "flex",
                        gap: 4,
                        background: "#f1f3f6",
                        borderRadius: 12,
                        padding: 4,
                        width: "fit-content",
                    }}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: "10px 20px",
                                borderRadius: 9,
                                border: "none",
                                background: activeTab === tab.key ? "#fff" : "transparent",
                                fontSize: 15,
                                fontWeight: 700,
                                color: activeTab === tab.key ? "#273142" : "#7b8494",
                                cursor: "pointer",
                                boxShadow:
                                    activeTab === tab.key
                                        ? "0 2px 8px rgba(15,23,42,0.08)"
                                        : "none",
                                display: "flex",
                                alignItems: "center",
                                transition: "background 0.15s",
                            }}
                        >
                            {tab.label}
                            <CountPill count={tab.count} />
                        </button>
                    ))}
                </div>

                {/* ── Search ── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        height: 50,
                        borderRadius: 12,
                        border: "1px solid #d9dee5",
                        padding: "0 16px",
                        background: "#fff",
                        maxWidth: 400,
                    }}
                >
                    <input
                        placeholder={`Search ${isTypes ? "types" : "categories"}...`}
                        value={isTypes ? typeSearch : categorySearch}
                        onChange={(e) =>
                            isTypes
                                ? setTypeSearch(e.target.value)
                                : setCategorySearch(e.target.value)
                        }
                        style={{
                            border: "none",
                            outline: "none",
                            width: "100%",
                            fontSize: 15,
                            background: "transparent",
                            color: "#2d3340",
                            fontFamily: "inherit",
                        }}
                    />
                </div>

                {/* ── Table ── */}
                {isTypes ? (
                    <CrudTable
                        items={filteredTypes}
                        entityLabel="Type"
                        onEdit={openEditType}
                        onDelete={(item) => setDeleteTypeModal({ open: true, item })}
                    />
                ) : (
                    <CrudTable
                        items={filteredCategories}
                        entityLabel="Category"
                        onEdit={openEditCategory}
                        onDelete={(item) => setDeleteCategoryModal({ open: true, item })}
                    />
                )}
            </div>

            {/* ── Type modals ── */}
            <ItemModal
                open={typeModalOpen}
                mode={typeModalMode}
                entityLabel="Type"
                value={typeModalValue}
                onChange={setTypeModalValue}
                onSubmit={handleSubmitType}
                onClose={() => setTypeModalOpen(false)}
            />
            <ConfirmDeleteModal
                open={deleteTypeModal.open}
                name={deleteTypeModal.item?.name ?? ""}
                onConfirm={confirmDeleteType}
                onClose={() => setDeleteTypeModal({ open: false, item: null })}
            />

            {/* ── Category modals ── */}
            <ItemModal
                open={categoryModalOpen}
                mode={categoryModalMode}
                entityLabel="Category"
                value={categoryModalValue}
                onChange={setCategoryModalValue}
                onSubmit={handleSubmitCategory}
                onClose={() => setCategoryModalOpen(false)}
            />
            <ConfirmDeleteModal
                open={deleteCategoryModal.open}
                name={deleteCategoryModal.item?.name ?? ""}
                onConfirm={confirmDeleteCategory}
                onClose={() => setDeleteCategoryModal({ open: false, item: null })}
            />
        </AppLayout>
    );
}