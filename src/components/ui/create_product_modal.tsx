import { CSSProperties } from "react";

export type CreateProductFormData = {
    sku: string;
    name: string;
    description: string;
    brand: string;
    price: number | "";
    status: string;
    typeId: number | "";
    categoryId: number | "";
    depotId: number | "";
    stockQuantity: number | "";
    isAvailable: boolean;
};

interface CreateProductModalProps {
    open: boolean;
    formData: CreateProductFormData;
    onClose: () => void;
    onChange: (
        field: keyof CreateProductFormData,
        value: string | number | boolean
    ) => void;
    onSubmit: () => void;
}

const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 24,
};

const modalStyle: CSSProperties = {
    width: "100%",
    maxWidth: 820,
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

const labelStyle: CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: "#2d3340",
    marginBottom: 8,
};

export default function CreateProductModal({
                                               open,
                                               formData,
                                               onClose,
                                               onChange,
                                               onSubmit,
                                           }: CreateProductModalProps) {
    if (!open) return null;

    return (
        <div onClick={onClose} style={overlayStyle}>
            <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
                <div
                    style={{
                        ...sectionStyle,
                        borderBottom: "1px solid #edf1ed",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: 24,
                            fontWeight: 700,
                            color: "#1a1a1a",
                        }}
                    >
                        Create Product
                    </h2>
                    <p
                        style={{
                            margin: "6px 0 0",
                            fontSize: 14,
                            color: "#7f8792",
                        }}
                    >
                        Add a new product to the system
                    </p>
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
                        <input
                            type="text"
                            value={formData.sku}
                            onChange={(e) => onChange("sku", e.target.value)}
                            placeholder="PRD-011"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Product Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => onChange("name", e.target.value)}
                            placeholder="Small Truck Tyres"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Brand</label>
                        <input
                            type="text"
                            value={formData.brand}
                            onChange={(e) => onChange("brand", e.target.value)}
                            placeholder="Bosch"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Price</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) =>
                                onChange(
                                    "price",
                                    e.target.value === "" ? "" : Number(e.target.value)
                                )
                            }
                            placeholder="100"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Stock Quantity</label>
                        <input
                            type="number"
                            value={formData.stockQuantity}
                            onChange={(e) =>
                                onChange(
                                    "stockQuantity",
                                    e.target.value === "" ? "" : Number(e.target.value)
                                )
                            }
                            placeholder="90"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => onChange("status", e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">Select status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Draft">Draft</option>
                            <option value="Archived">Archived</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Type</label>
                        <select
                            value={formData.typeId}
                            onChange={(e) =>
                                onChange(
                                    "typeId",
                                    e.target.value === "" ? "" : Number(e.target.value)
                                )
                            }
                            style={inputStyle}
                        >
                            <option value="">Select type</option>
                            <option value={1}>Physical Product</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Category</label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) =>
                                onChange(
                                    "categoryId",
                                    e.target.value === "" ? "" : Number(e.target.value)
                                )
                            }
                            style={inputStyle}
                        >
                            <option value="">Select category</option>
                            <option value={1}>Tyre</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Depot</label>
                        <select
                            value={formData.depotId}
                            onChange={(e) =>
                                onChange(
                                    "depotId",
                                    e.target.value === "" ? "" : Number(e.target.value)
                                )
                            }
                            style={inputStyle}
                        >
                            <option value="">Select depot</option>
                            <option value={1}>Eindhoven Depot</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <label style={labelStyle}>Availability</label>
                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                fontSize: 14,
                                color: "#2d3340",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={formData.isAvailable}
                                onChange={(e) => onChange("isAvailable", e.target.checked)}
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
                            onChange={(e) => onChange("description", e.target.value)}
                            placeholder="Big truck tyres"
                            style={textareaStyle}
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
                        onClick={onClose}
                        style={{
                            padding: "12px 18px",
                            borderRadius: 10,
                            border: "1px solid #d8dfd8",
                            background: "#fff",
                            color: "#2d3340",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onSubmit}
                        style={{
                            padding: "12px 18px",
                            borderRadius: 10,
                            border: "none",
                            background: "#2e9d5b",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        Create Product
                    </button>
                </div>
            </div>
        </div>
    );
}