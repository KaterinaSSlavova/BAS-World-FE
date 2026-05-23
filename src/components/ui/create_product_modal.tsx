import { CSSProperties } from "react";

export type DepotFormRow = {
    depotId: number | "";
    stockQuantity: number | "";
    costPrice: number | "";
    salePrice: number | "";
    available: boolean;
    stockThreshold: number | "";
};

export type CreateProductFormData = {
    sku: string;
    name: string;
    description: string;
    brandId: number | "";
    status: string;
    typeId: number | "";
    categoryId: number | "";
    productDepots: DepotFormRow[];
};

type Option = {
    id: number;
    name?: string;
    depotName?: string;
};

interface CreateProductModalProps {
    open: boolean;
    formData: CreateProductFormData;
    brands: Option[];
    types: Option[];
    categories: Option[];
    depots: Option[];
    onClose: () => void;
    onChange: (
        field: keyof Omit<CreateProductFormData, "productDepots">,
        value: string | number | boolean
    ) => void;
    onDepotChange: (
        index: number,
        field: keyof DepotFormRow,
        value: string | number | boolean
    ) => void;
    onAddDepot: () => void;
    onRemoveDepot: (index: number) => void;
    onSubmit: () => void;
}

const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 16,
};

const modalStyle: CSSProperties = {
    width: "100%",
    maxWidth: 900,
    maxHeight: "90vh",
    background: "#ffffff",
    borderRadius: 18,
    boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
    border: "1px solid #d9e2d9",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    color: "#111827",
};

const sectionStyle: CSSProperties = { padding: 18 };

const labelStyle: CSSProperties = {
    fontSize: 13,
    fontWeight: 800,
    color: "#1f2937",
    marginBottom: 6,
};

const inputStyle: CSSProperties = {
    width: "100%",
    height: 40,
    border: "1px solid #cfd8cf",
    borderRadius: 10,
    padding: "0 12px",
    fontSize: 14,
    color: "#111827",
    background: "#ffffff",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
};

const textareaStyle: CSSProperties = {
    width: "100%",
    minHeight: 58,
    maxHeight: 84,
    border: "1px solid #cfd8cf",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 14,
    color: "#111827",
    background: "#ffffff",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
};

const secondaryButtonStyle: CSSProperties = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
};

const primaryButtonStyle: CSSProperties = {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    background: "#15803d",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
};

export default function CreateProductModal({
                                               open,
                                               formData,
                                               brands,
                                               types,
                                               categories,
                                               depots,
                                               onClose,
                                               onChange,
                                               onDepotChange,
                                               onAddDepot,
                                               onRemoveDepot,
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
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 16,
                    }}
                >
                    <div>
                        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#111827" }}>
                            Create Product
                        </h2>
                        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#4b5563", fontWeight: 500 }}>
                            Add product details and configure depot availability.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        style={{ ...secondaryButtonStyle, width: 36, height: 36, padding: 0, fontSize: 18 }}
                    >
                        ×
                    </button>
                </div>

                <div
                    style={{
                        ...sectionStyle,
                        overflowY: "auto",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                    }}
                >
                    <div style={{ border: "1px solid #e5ebe5", borderRadius: 14, padding: 14, background: "#ffffff" }}>
                        <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 900, color: "#111827" }}>
                            Product Information
                        </h3>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>SKU</label>
                                <input
                                    value={formData.sku}
                                    onChange={(e) => onChange("sku", e.target.value)}
                                    placeholder="PRD-011"
                                    style={inputStyle}
                                />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Product Name</label>
                                <input
                                    value={formData.name}
                                    onChange={(e) => onChange("name", e.target.value)}
                                    placeholder="Small Truck Tyres"
                                    style={inputStyle}
                                />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Brand</label>
                                <select
                                    value={formData.brandId}
                                    onChange={(e) => onChange("brandId", e.target.value === "" ? "" : Number(e.target.value))}
                                    style={inputStyle}
                                >
                                    <option value="">Select brand</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => onChange("status", e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="">Select status</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="DRAFT">Draft</option>
                                    <option value="ARCHIVED">Archived</option>
                                </select>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Type</label>
                                <select
                                    value={formData.typeId}
                                    onChange={(e) => onChange("typeId", e.target.value === "" ? "" : Number(e.target.value))}
                                    style={inputStyle}
                                >
                                    <option value="">Select type</option>
                                    {types.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Category</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => onChange("categoryId", e.target.value === "" ? "" : Number(e.target.value))}
                                    style={inputStyle}
                                >
                                    <option value="">Select category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => onChange("description", e.target.value)}
                                    placeholder="Short product description"
                                    style={textareaStyle}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ border: "2px solid #b9dec6", borderRadius: 16, padding: 16, background: "#fbfffc" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 12,
                                marginBottom: 14,
                            }}
                        >
                            <div>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#111827" }}>
                                    Depot Details
                                </h3>
                                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#4b5563", fontWeight: 500 }}>
                                    Configure stock, pricing and availability per depot.
                                </p>
                            </div>

                            <button type="button" onClick={onAddDepot} style={primaryButtonStyle}>
                                + Add Depot
                            </button>
                        </div>

                        {formData.productDepots.map((row, index) => (
                            <div
                                key={index}
                                style={{
                                    border: "1px solid #d9e2d9",
                                    borderRadius: 14,
                                    padding: 14,
                                    marginBottom: 12,
                                    background: "#ffffff",
                                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: 12,
                                        gap: 12,
                                    }}
                                >
                                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: "#111827" }}>
                                        Depot #{index + 1}
                                    </h4>

                                    {formData.productDepots.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => onRemoveDepot(index)}
                                            style={{
                                                border: "1px solid #fecaca",
                                                background: "#fff5f5",
                                                color: "#b91c1c",
                                                fontSize: 13,
                                                fontWeight: 800,
                                                borderRadius: 10,
                                                padding: "8px 12px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr 1fr", gap: 12 }}>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <label style={labelStyle}>Depot</label>
                                        <select
                                            value={row.depotId}
                                            onChange={(e) =>
                                                onDepotChange(index, "depotId", e.target.value === "" ? "" : Number(e.target.value))
                                            }
                                            style={inputStyle}
                                        >
                                            <option value="">Select depot</option>
                                            {depots.map((depot) => (
                                                <option key={depot.id} value={depot.id}>
                                                    {depot.depotName ?? depot.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <label style={labelStyle}>Stock</label>
                                        <input
                                            type="number"
                                            value={row.stockQuantity}
                                            onChange={(e) =>
                                                onDepotChange(index, "stockQuantity", e.target.value === "" ? "" : Number(e.target.value))
                                            }
                                            placeholder="90"
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <label style={labelStyle}>Cost Price</label>
                                        <input
                                            type="number"
                                            value={row.costPrice}
                                            onChange={(e) =>
                                                onDepotChange(index, "costPrice", e.target.value === "" ? "" : Number(e.target.value))
                                            }
                                            placeholder="80"
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <label style={labelStyle}>Sale Price</label>
                                        <input
                                            type="number"
                                            value={row.salePrice}
                                            onChange={(e) =>
                                                onDepotChange(index, "salePrice", e.target.value === "" ? "" : Number(e.target.value))
                                            }
                                            placeholder="120"
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <label style={labelStyle}>Stock Threshold</label>
                                        <input
                                            type="number"
                                            value={row.stockThreshold}
                                            onChange={(e) =>
                                                onDepotChange(index, "stockThreshold", e.target.value === "" ? "" : Number(e.target.value))
                                            }
                                            placeholder="10"
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                <div
                                    style={{
                                        marginTop: 12,
                                        paddingTop: 12,
                                        borderTop: "1px solid #edf1ed",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 12,
                                    }}
                                >
                                    <label
                                        style={{
                                            display: "flex",
                                            gap: 10,
                                            alignItems: "center",
                                            color: "#111827",
                                            fontSize: 14,
                                            fontWeight: 800,
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={row.available}
                                            onChange={(e) => onDepotChange(index, "available", e.target.checked)}
                                        />
                                        Available in this depot
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    style={{
                        padding: "14px 18px",
                        borderTop: "1px solid #edf1ed",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 12,
                        background: "#ffffff",
                    }}
                >
                    <button type="button" onClick={onClose} style={secondaryButtonStyle}>
                        Cancel
                    </button>

                    <button type="button" onClick={onSubmit} style={primaryButtonStyle}>
                        Create Product
                    </button>
                </div>
            </div>
        </div>
    );
}