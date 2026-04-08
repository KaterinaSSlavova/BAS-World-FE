import { CSSProperties, useEffect, useState } from "react";
import type { Product } from "../../data/mock_data_products";

interface ProductDetailsModalProps {
    open: boolean;
    product: Product | null;
    onClose: () => void;
    onSave: (updatedProduct: Product) => void;
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
    const [formData, setFormData] = useState<Product | null>(product);

    useEffect(() => {
        setFormData(product);
        setIsEditing(false);
    }, [product, open]);

    if (!open || !product || !formData) return null;

    const handleChange = <K extends keyof Product>(field: K, value: Product[K]) => {
        setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleDepotChange = (value: string) => {
        const depots = value
            .split(",")
            .map((d) => d.trim())
            .filter(Boolean);
        handleChange("depots", depots);
    };

    const handleSave = () => {
        onSave(formData);
        setIsEditing(false);
        onClose();
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
                        <label style={labelStyle}>ID</label>
                        <input value={formData.id} readOnly style={readOnlyStyle} />
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
                        <label style={labelStyle}>Category</label>
                        <input
                            value={formData.category}
                            readOnly={!isEditing}
                            onChange={(e) => handleChange("category", e.target.value)}
                            style={isEditing ? inputStyle : readOnlyStyle}
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
                        <label style={labelStyle}>Stock</label>
                        <input
                            type="number"
                            value={formData.stock}
                            readOnly={!isEditing}
                            onChange={(e) => handleChange("stock", Number(e.target.value))}
                            style={isEditing ? inputStyle : readOnlyStyle}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Rule Type</label>
                        <select
                            value={formData.ruleType}
                            disabled={!isEditing}
                            onChange={(e) =>
                                handleChange("ruleType", e.target.value as Product["ruleType"])
                            }
                            style={isEditing ? inputStyle : readOnlyStyle}
                        >
                            <option value="opt-in">Opt-in</option>
                            <option value="mandatory">Mandatory</option>
                            <option value="opt-out">Opt-out</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Status</label>
                        <select
                            value={formData.status}
                            disabled={!isEditing}
                            onChange={(e) =>
                                handleChange("status", e.target.value as Product["status"])
                            }
                            style={isEditing ? inputStyle : readOnlyStyle}
                        >
                            <option value="active">Active</option>
                            <option value="low_stock">Low Stock</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Depots</label>
                        <input
                            value={formData.depots.join(", ")}
                            readOnly={!isEditing}
                            onChange={(e) => handleDepotChange(e.target.value)}
                            style={isEditing ? inputStyle : readOnlyStyle}
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
                        disabled={isEditing}
                        style={{
                            padding: "12px 18px",
                            borderRadius: 10,
                            border: "1px solid #d8dfd8",
                            background: isEditing ? "#f4f6f4" : "#fff",
                            color: isEditing ? "#98a2b3" : "#2d3340",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: isEditing ? "not-allowed" : "pointer",
                        }}
                    >
                        Edit
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!isEditing}
                        style={{
                            padding: "12px 18px",
                            borderRadius: 10,
                            border: "none",
                            background: !isEditing ? "#b8c2b8" : "#2e9d5b",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: !isEditing ? "not-allowed" : "pointer",
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}