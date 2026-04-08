import { CSSProperties, useEffect, useState } from "react";
import type { ProductRow } from "../../pages/Products";

interface ProductDetailsModalProps {
    open: boolean;
    product: ProductRow | null;
    onClose: () => void;
    onSave: (updatedProduct: ProductRow) => Promise<void>;
}

const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1100,
    padding: 24,
};

const modalStyle: CSSProperties = {
    width: "100%",
    maxWidth: 860,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
    border: "1px solid #e5ebe5",
    overflow: "hidden",
};

const sectionStyle: CSSProperties = {
    padding: 28,
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
                        <input
                            value={formData.category}
                            readOnly
                            style={readOnlyStyle}
                        />
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
                        <input
                            value={formData.type}
                            readOnly
                            style={readOnlyStyle}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Depot</label>
                        <input
                            value={formData.depotName}
                            readOnly
                            style={readOnlyStyle}
                        />
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
                        padding: "20px 28px",
                        borderTop: "1px solid #edf1ed",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 12,
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