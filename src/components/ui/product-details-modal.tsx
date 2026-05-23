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
    depotOptions: SelectOption[];
}

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

const readOnlyStyle: CSSProperties = {
    ...inputStyle,
    background: "#f9fafb",
    color: "#374151",
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

const readOnlyTextareaStyle: CSSProperties = {
    ...textareaStyle,
    background: "#f9fafb",
    color: "#374151",
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

const disabledButtonStyle: CSSProperties = {
    ...secondaryButtonStyle,
    background: "#f3f4f6",
    color: "#9ca3af",
    cursor: "not-allowed",
};

export default function ProductDetailsModal({
                                                open,
                                                product,
                                                allProducts,
                                                onClose,
                                                onSave,
                                                brandOptions,
                                                typeOptions,
                                                categoryOptions,
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

    const handleProductChange = <K extends keyof ProductRow>(
        field: K,
        value: ProductRow[K]
    ) => {
        setProductForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleDepotChange = <K extends keyof ProductRow>(
        depotId: number,
        field: K,
        value: ProductRow[K]
    ) => {
        setDepotForms((prev) =>
            prev.map((row) =>
                row.depotId === depotId ? { ...row, [field]: value } : row
            )
        );
    };

    const handleBrandChange = (newBrandId: number) => {
        const selected = brandOptions.find((option) => option.id === newBrandId);
        if (!selected) return;
        setProductForm((prev) =>
            prev ? { ...prev, brandId: selected.id, brand: selected.name } : prev
        );
    };

    const handleTypeChange = (newTypeId: number) => {
        const selected = typeOptions.find((option) => option.id === newTypeId);
        if (!selected) return;
        setProductForm((prev) =>
            prev ? { ...prev, typeId: selected.id, type: selected.name } : prev
        );
    };

    const handleCategoryChange = (newCategoryId: number) => {
        const selected = categoryOptions.find((option) => option.id === newCategoryId);
        if (!selected) return;
        setProductForm((prev) =>
            prev ? { ...prev, categoryId: selected.id, category: selected.name } : prev
        );
    };

    const handleCancelProductEdit = () => {
        setProductForm(product);
        setIsProductEditing(false);
    };

    const handleCancelDepotEdit = (depotId: number) => {
        const originalRow = productDepotRows.find((row) => row.depotId === depotId);
        if (!originalRow) return;
        setDepotForms((prev) =>
            prev.map((row) => (row.depotId === depotId ? originalRow : row))
        );
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
                            {productForm.name || "Product Details"}
                        </h2>
                        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#4b5563", fontWeight: 500 }}>
                            Edit product details and depot-specific availability.
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

                <div style={{ ...sectionStyle, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ border: "1px solid #e5ebe5", borderRadius: 14, padding: 14, background: "#ffffff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12 }}>
                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "#111827" }}>
                                Product Information
                            </h3>

                            {!isProductEditing ? (
                                <button
                                    type="button"
                                    onClick={() => setIsProductEditing(true)}
                                    disabled={isSaving}
                                    style={isSaving ? disabledButtonStyle : secondaryButtonStyle}
                                >
                                    Edit Product
                                </button>
                            ) : (
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button
                                        type="button"
                                        onClick={handleCancelProductEdit}
                                        disabled={isSaving}
                                        style={isSaving ? disabledButtonStyle : secondaryButtonStyle}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        style={{
                                            ...primaryButtonStyle,
                                            background: isSaving ? "#9ca3af" : "#15803d",
                                            cursor: isSaving ? "not-allowed" : "pointer",
                                        }}
                                    >
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
                                <input
                                    value={productForm.name}
                                    readOnly={!isProductEditing}
                                    onChange={(e) => handleProductChange("name", e.target.value)}
                                    style={isProductEditing ? inputStyle : readOnlyStyle}
                                />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Brand</label>
                                {isProductEditing ? (
                                    <select
                                        value={productForm.brandId}
                                        onChange={(e) => handleBrandChange(Number(e.target.value))}
                                        style={inputStyle}
                                    >
                                        {brandOptions.map((option) => (
                                            <option key={option.id} value={option.id}>{option.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input value={productForm.brand} readOnly style={readOnlyStyle} />
                                )}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Category</label>
                                {isProductEditing ? (
                                    <select
                                        value={productForm.categoryId}
                                        onChange={(e) => handleCategoryChange(Number(e.target.value))}
                                        style={inputStyle}
                                    >
                                        {categoryOptions.map((option) => (
                                            <option key={option.id} value={option.id}>{option.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input value={productForm.category} readOnly style={readOnlyStyle} />
                                )}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Type</label>
                                {isProductEditing ? (
                                    <select
                                        value={productForm.typeId}
                                        onChange={(e) => handleTypeChange(Number(e.target.value))}
                                        style={inputStyle}
                                    >
                                        {typeOptions.map((option) => (
                                            <option key={option.id} value={option.id}>{option.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input value={productForm.type} readOnly style={readOnlyStyle} />
                                )}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={labelStyle}>Status</label>
                                <select
                                    value={productForm.status}
                                    disabled={!isProductEditing}
                                    onChange={(e) => handleProductChange("status", e.target.value)}
                                    style={isProductEditing ? inputStyle : readOnlyStyle}
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="DRAFT">Draft</option>
                                    <option value="ARCHIVED">Archived</option>
                                </select>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gridColumn: "1 / -1" }}>
                                <label style={labelStyle}>Description</label>
                                <textarea
                                    value={productForm.description}
                                    readOnly={!isProductEditing}
                                    onChange={(e) => handleProductChange("description", e.target.value)}
                                    style={isProductEditing ? textareaStyle : readOnlyTextareaStyle}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ border: "2px solid #b9dec6", borderRadius: 16, padding: 16, background: "#fbfffc" }}>
                        <div style={{ marginBottom: 14 }}>
                            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#111827" }}>
                                Depot Details
                            </h3>
                            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#4b5563", fontWeight: 500 }}>
                                Manage stock, pricing, threshold and availability for each depot.
                            </p>
                        </div>

                        {depotForms.map((depotRow) => {
                            const isDepotEditing = editingDepotId === depotRow.depotId;

                            return (
                                <div
                                    key={depotRow.depotId}
                                    style={{
                                        border: "1px solid #d9e2d9",
                                        borderRadius: 14,
                                        padding: 14,
                                        marginBottom: 12,
                                        background: "#ffffff",
                                        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
                                        <h4 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: "#111827" }}>
                                            {depotRow.depotName}
                                        </h4>

                                        {!isDepotEditing ? (
                                            <button
                                                type="button"
                                                onClick={() => setEditingDepotId(depotRow.depotId)}
                                                disabled={isSaving || editingDepotId !== null}
                                                style={isSaving || editingDepotId !== null ? disabledButtonStyle : secondaryButtonStyle}
                                            >
                                                Edit Depot
                                            </button>
                                        ) : (
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancelDepotEdit(depotRow.depotId)}
                                                    disabled={isSaving}
                                                    style={isSaving ? disabledButtonStyle : secondaryButtonStyle}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleSave}
                                                    disabled={isSaving}
                                                    style={{
                                                        ...primaryButtonStyle,
                                                        background: isSaving ? "#9ca3af" : "#15803d",
                                                        cursor: isSaving ? "not-allowed" : "pointer",
                                                    }}
                                                >
                                                    {isSaving ? "Saving..." : "Save"}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr", gap: 12 }}>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <label style={labelStyle}>Depot</label>
                                            <input value={depotRow.depotName} readOnly style={readOnlyStyle} />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <label style={labelStyle}>Stock</label>
                                            <input
                                                type="number"
                                                value={depotRow.stockQuantity}
                                                readOnly={!isDepotEditing}
                                                onChange={(e) =>
                                                    handleDepotChange(depotRow.depotId, "stockQuantity", Number(e.target.value))
                                                }
                                                style={isDepotEditing ? inputStyle : readOnlyStyle}
                                            />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <label style={labelStyle}>Cost Price</label>
                                            <input
                                                type="number"
                                                value={depotRow.costPrice}
                                                readOnly={!isDepotEditing}
                                                onChange={(e) =>
                                                    handleDepotChange(depotRow.depotId, "costPrice", Number(e.target.value))
                                                }
                                                style={isDepotEditing ? inputStyle : readOnlyStyle}
                                            />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <label style={labelStyle}>Sale Price</label>
                                            <input
                                                type="number"
                                                value={depotRow.salePrice}
                                                readOnly={!isDepotEditing}
                                                onChange={(e) =>
                                                    handleDepotChange(depotRow.depotId, "salePrice", Number(e.target.value))
                                                }
                                                style={isDepotEditing ? inputStyle : readOnlyStyle}
                                            />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <label style={labelStyle}>Stock Threshold</label>
                                            <input
                                                type="number"
                                                value={depotRow.stockThreshold}
                                                readOnly={!isDepotEditing}
                                                onChange={(e) =>
                                                    handleDepotChange(depotRow.depotId, "stockThreshold", Number(e.target.value))
                                                }
                                                style={isDepotEditing ? inputStyle : readOnlyStyle}
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
                                        }}
                                    >
                                        <label
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 10,
                                                fontSize: 14,
                                                fontWeight: 800,
                                                color: "#111827",
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={depotRow.available}
                                                disabled={!isDepotEditing}
                                                onChange={(e) =>
                                                    handleDepotChange(depotRow.depotId, "available", e.target.checked)
                                                }
                                            />
                                            Available in this depot
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={{ padding: "14px 18px", borderTop: "1px solid #edf1ed", display: "flex", justifyContent: "flex-end", gap: 12, background: "#ffffff" }}>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        style={isSaving ? disabledButtonStyle : secondaryButtonStyle}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}