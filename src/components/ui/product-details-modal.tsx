import { CSSProperties, useEffect, useMemo, useState } from "react";
import type { ProductRow, SelectOption } from "../../pages/Products";

interface ProductDetailsModalProps {
    open: boolean;
    product: ProductRow | null;
    allProducts: ProductRow[];
    onClose: () => void;
    onSave: (updatedProduct: ProductRow, updatedDepots: ProductRow[]) => Promise<void>;
    brandOptions: SelectOption[];
    typeOptions: SelectOption[];
    categoryOptions: SelectOption[];
    vehicleTypeOptions: SelectOption[];
    depotOptions: SelectOption[];
    supplierOptions: SelectOption[];
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
    zIndex: 1100,
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

const readOnlyStyle: CSSProperties = {
    ...inputStyle,
    background: "#f7f9f7",
    color: "#888",
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

const readOnlyTextareaStyle: CSSProperties = {
    ...textareaStyle,
    background: "#f7f9f7",
    color: "#888",
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

const disabledButtonStyle: CSSProperties = {
    ...secondaryButtonStyle,
    background: "#f3f4f6",
    color: "#9ca3af",
    cursor: "not-allowed",
};

export default function ProductDetailsModal({
                                                open, product, allProducts, onClose, onSave,
                                                brandOptions, typeOptions, categoryOptions,
                                                vehicleTypeOptions, supplierOptions,
                                            }: ProductDetailsModalProps) {
    const productDepotRows = useMemo(() => {
        if (!product) return [];
        return allProducts.filter((row) => row.productId === product.productId);
    }, [allProducts, product]);

    const [isProductEditing, setIsProductEditing] = useState(false);
    const [editingDepotId, setEditingDepotId] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [productForm, setProductForm] = useState<ProductRow | null>(product);
    const [depotForms, setDepotForms] = useState<ProductRow[]>(productDepotRows);

    useEffect(() => {
        setProductForm(product);
        setDepotForms(productDepotRows);
        setIsProductEditing(false);
        setEditingDepotId(null);
        setIsSaving(false);
    }, [product, open, productDepotRows]);

    if (!open || !product || !productForm) return null;

    const handleProductChange = <K extends keyof ProductRow>(field: K, value: ProductRow[K]) => {
        setProductForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleDepotChange = <K extends keyof ProductRow>(depotId: number, field: K, value: ProductRow[K]) => {
        setDepotForms((prev) => prev.map((row) => row.depotId === depotId ? { ...row, [field]: value } : row));
    };

    const handleSupplierChange = (depotId: number, supplierId: number) => {
        const selected = supplierOptions.find((o) => o.id === supplierId);
        setDepotForms((prev) => prev.map((row) => row.depotId === depotId ? { ...row, supplierId, supplierName: selected?.name ?? "Unknown" } : row));
    };

    const handleBrandChange = (newBrandId: number) => {
        const selected = brandOptions.find((o) => o.id === newBrandId);
        if (!selected) return;
        setProductForm((prev) => prev ? { ...prev, brandId: selected.id, brand: selected.name } : prev);
    };

    const handleTypeChange = (newTypeId: number) => {
        const selected = typeOptions.find((o) => o.id === newTypeId);
        if (!selected) return;
        setProductForm((prev) => prev ? { ...prev, typeId: selected.id, type: selected.name } : prev);
    };

    const handleCategoryChange = (newCategoryId: number) => {
        const selected = categoryOptions.find((o) => o.id === newCategoryId);
        if (!selected) return;
        setProductForm((prev) => prev ? { ...prev, categoryId: selected.id, category: selected.name } : prev);
    };

    const handleVehicleTypeChange = (newVehicleTypeId: number) => {
        const selected = vehicleTypeOptions.find((o) => o.id === newVehicleTypeId);
        if (!selected) return;
        setProductForm((prev) => prev ? { ...prev, vehicleTypeId: selected.id, vehicleTypeName: selected.name } : prev);
    };

    const handleCancelProductEdit = () => {
        setProductForm(product);
        setIsProductEditing(false);
    };

    const handleCancelDepotEdit = (depotId: number) => {
        const originalRow = productDepotRows.find((row) => row.depotId === depotId);
        if (!originalRow) return;
        setDepotForms((prev) => prev.map((row) => row.depotId === depotId ? originalRow : row));
        setEditingDepotId(null);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await onSave(productForm, depotForms);
            setIsProductEditing(false);
            setEditingDepotId(null);
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div onClick={onClose} style={overlayStyle}>
            <div onClick={(e) => e.stopPropagation()} style={modalStyle}>

                {/* Header */}
                <div style={{ padding: "18px 20px", borderBottom: BORDER, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
                            {productForm.name || "Product Details"}
                        </h2>
                        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888", fontWeight: 400 }}>
                            Edit product details and depot-specific availability.
                        </p>
                    </div>
                    <button type="button" onClick={onClose} style={{ ...secondaryButtonStyle, width: 34, height: 34, padding: 0, fontSize: 18 }}>×</button>
                </div>

                {/* Body */}
                <div style={{ padding: 18, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>

                    {/* Product Information */}
                    <div style={{ border: BORDER, borderRadius: 12, padding: 16, background: "#fff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 12 }}>
                            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>Product Information</h3>
                            {!isProductEditing ? (
                                <button type="button" onClick={() => setIsProductEditing(true)} disabled={isSaving} style={isSaving ? disabledButtonStyle : secondaryButtonStyle}>
                                    Edit Product
                                </button>
                            ) : (
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button type="button" onClick={handleCancelProductEdit} disabled={isSaving} style={isSaving ? disabledButtonStyle : secondaryButtonStyle}>Cancel</button>
                                    <button type="button" onClick={handleSave} disabled={isSaving} style={{ ...primaryButtonStyle, background: isSaving ? "#9ca3af" : BRAND, cursor: isSaving ? "not-allowed" : "pointer" }}>
                                        {isSaving ? "Saving..." : "Save Product"}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>SKU</label>
                                <input value={productForm.sku} readOnly style={readOnlyStyle} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Product Name</label>
                                <input value={productForm.name} readOnly={!isProductEditing} onChange={(e) => handleProductChange("name", e.target.value)} style={isProductEditing ? inputStyle : readOnlyStyle} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Brand</label>
                                {isProductEditing ? (
                                    <select value={productForm.brandId} onChange={(e) => handleBrandChange(Number(e.target.value))} style={inputStyle}>
                                        {brandOptions.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                                    </select>
                                ) : (
                                    <input value={productForm.brand} readOnly style={readOnlyStyle} />
                                )}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Category</label>
                                {isProductEditing ? (
                                    <select value={productForm.categoryId} onChange={(e) => handleCategoryChange(Number(e.target.value))} style={inputStyle}>
                                        {categoryOptions.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                                    </select>
                                ) : (
                                    <input value={productForm.category} readOnly style={readOnlyStyle} />
                                )}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Type</label>
                                {isProductEditing ? (
                                    <select value={productForm.typeId} onChange={(e) => handleTypeChange(Number(e.target.value))} style={inputStyle}>
                                        {typeOptions.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                                    </select>
                                ) : (
                                    <input value={productForm.type} readOnly style={readOnlyStyle} />
                                )}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Vehicle Type</label>
                                {isProductEditing ? (
                                    <select value={productForm.vehicleTypeId} onChange={(e) => handleVehicleTypeChange(Number(e.target.value))} style={inputStyle}>
                                        {vehicleTypeOptions.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                                    </select>
                                ) : (
                                    <input value={productForm.vehicleTypeName} readOnly style={readOnlyStyle} />
                                )}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Status</label>
                                <select value={productForm.status} disabled={!isProductEditing} onChange={(e) => handleProductChange("status", e.target.value)} style={isProductEditing ? inputStyle : readOnlyStyle}>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="DRAFT">Draft</option>
                                    <option value="ARCHIVED">Archived</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gridColumn: "1 / -1" }}>
                                <label style={labelStyle}>Description</label>
                                <textarea value={productForm.description} readOnly={!isProductEditing} onChange={(e) => handleProductChange("description", e.target.value)} style={isProductEditing ? textareaStyle : readOnlyTextareaStyle} />
                            </div>
                        </div>
                    </div>

                    {/* Depot Details */}
                    <div style={{ border: BORDER, borderRadius: 12, padding: 16, background: "#f7f9f7" }}>
                        <div style={{ marginBottom: 14 }}>
                            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>Depot Details</h3>
                            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#888" }}>
                                Manage stock, pricing, threshold, supplier and availability for each depot.
                            </p>
                        </div>

                        {depotForms.map((depotRow) => {
                            const isDepotEditing = editingDepotId === depotRow.depotId;
                            return (
                                <div key={depotRow.depotId} style={{ border: BORDER, borderRadius: 10, padding: 14, marginBottom: 10, background: "#fff" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{depotRow.depotName}</span>
                                        {!isDepotEditing ? (
                                            <button type="button" onClick={() => setEditingDepotId(depotRow.depotId)} disabled={isSaving || editingDepotId !== null} style={isSaving || editingDepotId !== null ? disabledButtonStyle : secondaryButtonStyle}>
                                                Edit Depot
                                            </button>
                                        ) : (
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button type="button" onClick={() => handleCancelDepotEdit(depotRow.depotId)} disabled={isSaving} style={isSaving ? disabledButtonStyle : secondaryButtonStyle}>Cancel</button>
                                                <button type="button" onClick={handleSave} disabled={isSaving} style={{ ...primaryButtonStyle, background: isSaving ? "#9ca3af" : BRAND, cursor: isSaving ? "not-allowed" : "pointer" }}>
                                                    {isSaving ? "Saving..." : "Save"}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr 1.3fr", gap: 12 }}>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <label style={labelStyle}>Depot</label>
                                            <input value={depotRow.depotName} readOnly style={readOnlyStyle} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <label style={labelStyle}>Stock</label>
                                            <input type="number" value={depotRow.stockQuantity} readOnly={!isDepotEditing} onChange={(e) => handleDepotChange(depotRow.depotId, "stockQuantity", Number(e.target.value))} style={isDepotEditing ? inputStyle : readOnlyStyle} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <label style={labelStyle}>Cost Price</label>
                                            <input type="number" value={depotRow.costPrice} readOnly={!isDepotEditing} onChange={(e) => handleDepotChange(depotRow.depotId, "costPrice", Number(e.target.value))} style={isDepotEditing ? inputStyle : readOnlyStyle} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <label style={labelStyle}>Sale Price</label>
                                            <input type="number" value={depotRow.salePrice} readOnly={!isDepotEditing} onChange={(e) => handleDepotChange(depotRow.depotId, "salePrice", Number(e.target.value))} style={isDepotEditing ? inputStyle : readOnlyStyle} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <label style={labelStyle}>Stock Threshold</label>
                                            <input type="number" value={depotRow.stockThreshold} readOnly={!isDepotEditing} onChange={(e) => handleDepotChange(depotRow.depotId, "stockThreshold", Number(e.target.value))} style={isDepotEditing ? inputStyle : readOnlyStyle} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <label style={labelStyle}>Supplier</label>
                                            {isDepotEditing ? (
                                                <select value={depotRow.supplierId} onChange={(e) => handleSupplierChange(depotRow.depotId, Number(e.target.value))} style={inputStyle}>
                                                    <option value={0}>Select supplier</option>
                                                    {supplierOptions.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                                                </select>
                                            ) : (
                                                <input value={depotRow.supplierName || "Unknown"} readOnly style={readOnlyStyle} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: "14px 20px", borderTop: BORDER, display: "flex", justifyContent: "flex-end", gap: 10, background: "#fff" }}>
                    <button type="button" onClick={onClose} disabled={isSaving} style={isSaving ? disabledButtonStyle : secondaryButtonStyle}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}