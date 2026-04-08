import { CSSProperties } from "react";

type CreateProductFormData = {
    productName: string;
    price: number | "";
    stock: number | "";
    ruleType: string;
    status: string;
    depot: string;
};

interface CreateProductModalProps {
    open: boolean;
    formData: CreateProductFormData;
    onClose: () => void;
    onChange: (field: keyof CreateProductFormData, value: string | number) => void;
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
    maxWidth: 720,
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
                        <label style={labelStyle}>Product Name</label>
                        <input
                            type="text"
                            value={formData.productName}
                            onChange={(e) => onChange("productName", e.target.value)}
                            placeholder="Small Truck Tyres"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Price</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => onChange("price", Number(e.target.value))}
                            placeholder="100"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Stock</label>
                        <input
                            type="number"
                            value={formData.stock}
                            onChange={(e) => onChange("stock", Number(e.target.value))}
                            placeholder="90"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Depot</label>
                        <input
                            type="text"
                            value={formData.depot}
                            onChange={(e) => onChange("depot", e.target.value)}
                            placeholder="Veghel NL"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Rule Type</label>
                        <select
                            value={formData.ruleType}
                            onChange={(e) => onChange("ruleType", e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">None</option>
                            <option value="opt-in">Opt-in</option>
                            <option value="mandatory">Mandatory</option>
                            <option value="opt-out">Opt-out</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={labelStyle}>Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => onChange("status", e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">None</option>
                            <option value="active">Active</option>
                            <option value="low_stock">Low Stock</option>
                            <option value="inactive">Inactive</option>
                        </select>
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