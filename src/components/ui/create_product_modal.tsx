import { CSSProperties } from "react";

export type DepotFormRow = {
    depotId: number | "";
    stockQuantity: number | "";
    costPrice: number | "";
    salePrice: number | "";
    available: boolean;
    stockThreshold: number | "";
    supplierId: number | "";
};

export type CreateProductFormData = {
    sku: string;
    name: string;
    description: string;
    brandId: number | "";
    status: string;
    typeId: number | "";
    categoryId: number | "";
    vehicleTypeId: number | "";
    productDepots: DepotFormRow[];
};

type Option = { id: number; name?: string; depotName?: string };

interface CreateProductModalProps {
    open: boolean;
    formData: CreateProductFormData;
    brands: Option[];
    types: Option[];
    categories: Option[];
    vehicleTypes: Option[];
    depots: Option[];
    suppliers: Option[];
    onClose: () => void;
    onChange: (field: keyof Omit<CreateProductFormData, "productDepots">, value: string | number | boolean) => void;
    onDepotChange: (index: number, field: keyof DepotFormRow, value: string | number | boolean) => void;
    onAddDepot: () => void;
    onRemoveDepot: (index: number) => void;
    onSubmit: () => void;
}

const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";
const BRAND = "#17a84a";
const BORDER = "0.5px solid #e0ebe0";

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
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
    border: BORDER,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    fontFamily: FONT,
    color: "#1a1a1a",
};

const labelStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: "#888",
    marginBottom: 6,
    letterSpacing: "0.5px",
    fontFamily: FONT,
};

const inputStyle: CSSProperties = {
    width: "100%",
    height: 40,
    border: BORDER,
    borderRadius: 10,
    padding: "0 12px",
    fontSize: 14,
    color: "#1a1a1a",
    background: "#fff",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: FONT,
};

const textareaStyle: CSSProperties = {
    width: "100%",
    minHeight: 58,
    maxHeight: 84,
    border: BORDER,
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 14,
    color: "#1a1a1a",
    background: "#fff",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: FONT,
    resize: "vertical",
};

const primaryButtonStyle: CSSProperties = {
    padding: "9px 16px",
    borderRadius: 10,
    border: "none",
    background: BRAND,
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: FONT,
};

const secondaryButtonStyle: CSSProperties = {
    padding: "9px 14px",
    borderRadius: 10,
    border: BORDER,
    background: "#fff",
    color: "#1a1a1a",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: FONT,
};

const dangerButtonStyle: CSSProperties = {
    border: "0.5px solid #fecaca",
    background: "#fff5f5",
    color: "#b91c1c",
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 10,
    padding: "7px 12px",
    cursor: "pointer",
    fontFamily: FONT,
};

export default function CreateProductModal({
                                               open, formData, brands, types, categories, vehicleTypes,
                                               depots, suppliers, onClose, onChange, onDepotChange,
                                               onAddDepot, onRemoveDepot, onSubmit,
                                           }: CreateProductModalProps) {
    if (!open) return null;

    return (
        <div onClick={onClose} style={overlayStyle}>
            <div onClick={(e) => e.stopPropagation()} style={modalStyle}>

                {/* Header */}
                <div style={{
                    padding: "18px 20px",
                    borderBottom: BORDER,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
                            Create Product
                        </h2>
                        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888", fontWeight: 400 }}>
                            Add product details and configure depot availability.
                        </p>
                    </div>
                    <button type="button" onClick={onClose} style={{ ...secondaryButtonStyle, width: 34, height: 34, padding: 0, fontSize: 18 }}>
                        ×
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: 18, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>

                    {/* Product Information */}
                    <div style={{ border: BORDER, borderRadius: 12, padding: 16, background: "#fff" }}>
                        <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                            Product Information
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>SKU</label>
                                <input value={formData.sku} onChange={(e) => onChange("sku", e.target.value)} placeholder="PRD-011" style={inputStyle} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Product Name</label>
                                <input value={formData.name} onChange={(e) => onChange("name", e.target.value)} placeholder="Small Truck Tyres" style={inputStyle} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Brand</label>
                                <select value={formData.brandId} onChange={(e) => onChange("brandId", e.target.value === "" ? "" : Number(e.target.value))} style={inputStyle}>
                                    <option value="">Select brand</option>
                                    {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Status</label>
                                <select value={formData.status} onChange={(e) => onChange("status", e.target.value)} style={inputStyle}>
                                    <option value="">Select status</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="DRAFT">Draft</option>
                                    <option value="ARCHIVED">Archived</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Type</label>
                                <select value={formData.typeId} onChange={(e) => onChange("typeId", e.target.value === "" ? "" : Number(e.target.value))} style={inputStyle}>
                                    <option value="">Select type</option>
                                    {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Category</label>
                                <select value={formData.categoryId} onChange={(e) => onChange("categoryId", e.target.value === "" ? "" : Number(e.target.value))} style={inputStyle}>
                                    <option value="">Select category</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Vehicle Type</label>
                                <select value={formData.vehicleTypeId} onChange={(e) => onChange("vehicleTypeId", e.target.value === "" ? "" : Number(e.target.value))} style={inputStyle}>
                                    <option value="">Select vehicle type</option>
                                    {vehicleTypes.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                            </div>
                            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Description</label>
                                <textarea value={formData.description} onChange={(e) => onChange("description", e.target.value)} placeholder="Short product description" style={textareaStyle} />
                            </div>
                        </div>
                    </div>

                    {/* Depot Details */}
                    <div style={{ border: BORDER, borderRadius: 12, padding: 16, background: "#f7f9f7" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>Depot Details</h3>
                                <p style={{ margin: "3px 0 0", fontSize: 12, color: "#888" }}>
                                    Configure stock, pricing, threshold, supplier and availability per depot.
                                </p>
                            </div>
                            <button type="button" onClick={onAddDepot} style={primaryButtonStyle}>+ Add Depot</button>
                        </div>

                        {formData.productDepots.map((row, index) => (
                            <div key={index} style={{
                                border: BORDER, borderRadius: 10, padding: 14,
                                marginBottom: index < formData.productDepots.length - 1 ? 10 : 0,
                                background: "#fff",
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>Depot #{index + 1}</span>
                                    {formData.productDepots.length > 1 && (
                                        <button type="button" onClick={() => onRemoveDepot(index)} style={dangerButtonStyle}>Remove</button>
                                    )}
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr 1fr 1.3fr", gap: 12 }}>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <label style={labelStyle}>Depot</label>
                                        <select value={row.depotId} onChange={(e) => onDepotChange(index, "depotId", e.target.value === "" ? "" : Number(e.target.value))} style={inputStyle}>
                                            <option value="">Select depot</option>
                                            {depots.map((d) => <option key={d.id} value={d.id}>{d.depotName ?? d.name}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <label style={labelStyle}>Stock</label>
                                        <input type="number" value={row.stockQuantity} onChange={(e) => onDepotChange(index, "stockQuantity", e.target.value === "" ? "" : Number(e.target.value))} placeholder="90" style={inputStyle} />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <label style={labelStyle}>Cost Price</label>
                                        <input type="number" value={row.costPrice} onChange={(e) => onDepotChange(index, "costPrice", e.target.value === "" ? "" : Number(e.target.value))} placeholder="80" style={inputStyle} />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <label style={labelStyle}>Sale Price</label>
                                        <input type="number" value={row.salePrice} onChange={(e) => onDepotChange(index, "salePrice", e.target.value === "" ? "" : Number(e.target.value))} placeholder="120" style={inputStyle} />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <label style={labelStyle}>Stock Threshold</label>
                                        <input type="number" value={row.stockThreshold} onChange={(e) => onDepotChange(index, "stockThreshold", e.target.value === "" ? "" : Number(e.target.value))} placeholder="10" style={inputStyle} />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <label style={labelStyle}>Supplier</label>
                                        <select value={row.supplierId} onChange={(e) => onDepotChange(index, "supplierId", e.target.value === "" ? "" : Number(e.target.value))} style={inputStyle}>
                                            <option value="">Select supplier</option>
                                            {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: "14px 20px",
                    borderTop: BORDER,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                    background: "#fff",
                }}>
                    <button type="button" onClick={onClose} style={secondaryButtonStyle}>Cancel</button>
                    <button type="button" onClick={onSubmit} style={primaryButtonStyle}>Create Product</button>
                </div>
            </div>
        </div>
    );
}