import { CSSProperties, useEffect, useState } from "react";
import type { ProductRow, SelectOption } from "../../pages/Products";

interface ProductDetailsModalProps {
    open: boolean;
    product: ProductRow | null;
    onClose: () => void;
    onSave: (updatedProduct: ProductRow) => Promise<void>;
    typeOptions: SelectOption[];
    categoryOptions: SelectOption[];
    depotOptions: SelectOption[];
}

const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1100,
    padding: 16,
};

const modalStyle: CSSProperties = {
    width: "100%",
    maxWidth: 720,
    maxHeight: "90vh",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
    border: "1px solid #e5ebe5",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
};

const sectionStyle: CSSProperties = {
    padding: 20,
};

const inputStyle: CSSProperties = {
    width: "100%",
    height: 46,
    border: "1px solid #dfe5df",
    borderRadius: 10,
    padding: "0 14px",
    fontSize: 14,
    color: "#2d3340",
    background: "#fff",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
};

const readOnlyStyle: CSSProperties = {
    ...inputStyle,
    background: "#f8faf8",
    color: "#667085",
    cursor: "default",
};

const textareaStyle: CSSProperties = {
    width: "100%",
    minHeight: 96,
    border: "1px solid #dfe5df",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 14,
    color: "#2d3340",
    background: "#fff",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
};

const readOnlyTextareaStyle: CSSProperties = {
    ...textareaStyle,
    background: "#f8faf8",
    color: "#667085",
    cursor: "default",
};

const labelStyle: CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: "#2d3340",
    marginBottom: 8,
};

export default function ProductDetailsModal({
                                                open,
                                                product,
                                                onClose,
                                                onSave,
                                                typeOptions,
                                                categoryOptions,
                                                depotOptions,
                                            }: ProductDetailsModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<ProductRow | null>(product);

    useEffect(() => {
        setFormData(product);
        setIsEditing(false);
        setIsSaving(false);
    }, [product, open]);

    if (!open || !product || !formData) return null;

    const handleChange = <K extends keyof ProductRow>(
        field: K,
        value: ProductRow[K]
    ) => {
        setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleTypeChange = (newTypeId: number) => {
        const selected = typeOptions.find((option) => option.id === newTypeId);
        if (!selected) return;

        setFormData((prev) =>
            prev
                ? {
                    ...prev,
                    typeId: selected.id,
                    type: selected.name,
                }
                : prev
        );
    };

    const handleCategoryChange = (newCategoryId: number) => {
        const selected = categoryOptions.find((option) => option.id === newCategoryId);
        if (!selected) return;

        setFormData((prev) =>
            prev
                ? {
                    ...prev,
                    categoryId: selected.id,
                    category: selected.name,
                }
                : prev
        );
    };

    const handleDepotChange = (newDepotId: number) => {
        const selected = depotOptions.find((option) => option.id === newDepotId);
        if (!selected) return;

        setFormData((prev) =>
            prev
                ? {
                    ...prev,
                    depotId: selected.id,
                    depotName: selected.name,
                }
                : prev
        );
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await onSave(formData);
            setIsEditing(false);
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div onClick={onClose} style={overlayStyle}>
            <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
                <div
                    style={{
                        ...sectionStyle,
                        borderBottom: "1px solid #edf1ed",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 16,
                        flexShrink: 0,
                    }}
                >
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: 24,
                                fontWeight: 700,
                                color: "#1a1a1a",
                            }}
                        >
                            Product Details
                        </h2>
                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: 14,
                                color: "#7f8792",
                            }}
                        >
                            View and edit product information
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            border: "1px solid #d8dfd8",
                            background: "#fff",
                            color: "#667085",
                            fontSize: 18,
                            lineHeight: 1,
                            cursor: "pointer",
                            flexShrink: 0,
                        }}
                    >
                        ×
                    </button>
                </div>

                <div
                    style={{
                        ...sectionStyle,
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 18,
                        overflowY: "auto",
                        flex: 1,
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>SKU</label>
                        <input value={formData.sku} readOnly style={readOnlyStyle} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Product Name</label>
                        <input
                            value={formData.name}
                            readOnly={!isEditing}
                            onChange={(e) => handleChange("name", e.target.value)}
                            style={isEditing ? inputStyle : readOnlyStyle}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Brand</label>
                        <input
                            value={formData.brand}
                            readOnly={!isEditing}
                            onChange={(e) => handleChange("brand", e.target.value)}
                            style={isEditing ? inputStyle : readOnlyStyle}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Category</label>
                        {isEditing ? (
                            <select
                                value={formData.categoryId}
                                onChange={(e) => handleCategoryChange(Number(e.target.value))}
                                style={inputStyle}
                            >
                                {categoryOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input value={formData.category} readOnly style={readOnlyStyle} />
                        )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Price</label>
                        <input
                            type="number"
                            value={formData.price}
                            readOnly={!isEditing}
                            onChange={(e) => handleChange("price", Number(e.target.value))}
                            style={isEditing ? inputStyle : readOnlyStyle}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Stock Quantity</label>
                        <input
                            type="number"
                            value={formData.stockQuantity}
                            readOnly={!isEditing}
                            onChange={(e) =>
                                handleChange("stockQuantity", Number(e.target.value))
                            }
                            style={isEditing ? inputStyle : readOnlyStyle}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Status</label>
                        <select
                            value={formData.status}
                            disabled={!isEditing}
                            onChange={(e) => handleChange("status", e.target.value)}
                            style={isEditing ? inputStyle : readOnlyStyle}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="DRAFT">Draft</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Type</label>
                        {isEditing ? (
                            <select
                                value={formData.typeId}
                                onChange={(e) => handleTypeChange(Number(e.target.value))}
                                style={inputStyle}
                            >
                                {typeOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input value={formData.type} readOnly style={readOnlyStyle} />
                        )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Depot</label>
                        {isEditing ? (
                            <select
                                value={formData.depotId}
                                onChange={(e) => handleDepotChange(Number(e.target.value))}
                                style={inputStyle}
                            >
                                {depotOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input value={formData.depotName} readOnly style={readOnlyStyle} />
                        )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Availability</label>
                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                fontSize: 14,
                                color: "#2d3340",
                                height: 46,
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={formData.available}
                                disabled={!isEditing}
                                onChange={(e) =>
                                    handleChange("available", e.target.checked)
                                }
                            />
                            Available
                        </label>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gridColumn: "1 / -1",
                        }}
                    >
                        <label style={labelStyle}>Description</label>
                        <textarea
                            value={formData.description}
                            readOnly={!isEditing}
                            onChange={(e) => handleChange("description", e.target.value)}
                            style={isEditing ? textareaStyle : readOnlyTextareaStyle}
                        />
                    </div>
                </div>

                <div
                    style={{
                        padding: "16px 20px",
                        borderTop: "1px solid #edf1ed",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 12,
                        flexShrink: 0,
                    }}
                >
                    <button
                        onClick={() => setIsEditing(true)}
                        disabled={isEditing || isSaving}
                        style={{
                            padding: "12px 18px",
                            borderRadius: 10,
                            border: "1px solid #d8dfd8",
                            background: isEditing ? "#f4f6f4" : "#fff",
                            color: isEditing ? "#98a2b3" : "#2d3340",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: isEditing || isSaving ? "not-allowed" : "pointer",
                        }}
                    >
                        Edit
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!isEditing || isSaving}
                        style={{
                            padding: "12px 18px",
                            borderRadius: 10,
                            border: "none",
                            background: !isEditing || isSaving ? "#b8c2b8" : "#2e9d5b",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: !isEditing || isSaving ? "not-allowed" : "pointer",
                        }}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}