import React, { useEffect, useMemo, useState } from "react";
import { createProduct } from "../lib/api/products";
import { getAllProductDepots, updateProduct } from "../lib/api/productDepots";
import { getAllBrands } from "../lib/api/brands";
import { getDepotOverview } from "../lib/api/depots";
import { getAllCategories } from "../lib/api/categories";
import { getAllTypes } from "../lib/api/types";
import { getAllSuppliers } from "../lib/api/suppliers";
import { getAllVehicleTypes } from "../lib/api/vehicleTypes";
import CreateProductModal, {
    type CreateProductFormData,
    type DepotFormRow,
} from "../components/ui/create_product_modal";
import ProductDetailsModal from "../components/ui/product-details-modal";
import AppLayout from "../components/AppLayout";

const ITEMS_PER_PAGE = 8;

type BackendProductWithDepots = {
    product: {
        id: number;
        sku: string;
        name: string;
        description: string;
        brand?: { id: number; name: string };
        status: string;
        type?: { id: number; name: string };
        category?: { id: number; name: string };
        vehicleType?: { id: number; name: string };
    };
    depots: {
        depot: { id: number; depotName: string; location?: string };
        stockQuantity: number;
        costPrice: number;
        salePrice: number;
        available: boolean;
        stockThreshold?: number;
        supplier?: { id: number; name: string; picture?: string; archived?: boolean };
    }[];
};

export type ProductRow = {
    id: string;
    productId: number;
    depotId: number;
    brandId: number;
    categoryId: number;
    typeId: number;
    vehicleTypeId: number;
    sku: string;
    name: string;
    brand: string;
    category: string;
    type: string;
    vehicleTypeName: string;
    depotName: string;
    price: number;
    costPrice: number;
    salePrice: number;
    stockQuantity: number;
    stockThreshold: number;
    supplierId: number;
    supplierName: string;
    status: string;
    available: boolean;
    description: string;
};

export type SelectOption = { id: number; name: string };

const emptyDepotRow: DepotFormRow = {
    depotId: "", stockQuantity: "", costPrice: "",
    salePrice: "", available: true, stockThreshold: "", supplierId: "",
};

function normalizeDepotOverview(data: any): SelectOption[] {
    const depots = Array.isArray(data) ? data : data?.depots ?? [];
    return depots.map((depot: any, index: number) => ({
        id: depot.id ?? index,
        name: depot.depotName ?? depot.name ?? "Unnamed depot",
    }));
}

function mapBackendProductToFrontend(item: BackendProductWithDepots): ProductRow[] {
    return (item.depots ?? []).map((depotItem) => ({
        id: `${item.product.id}-${depotItem.depot.id}`,
        productId: item.product.id,
        depotId: depotItem.depot.id,
        brandId: item.product.brand?.id ?? 0,
        categoryId: item.product.category?.id ?? 0,
        typeId: item.product.type?.id ?? 0,
        vehicleTypeId: item.product.vehicleType?.id ?? 0,
        sku: item.product.sku,
        name: item.product.name,
        brand: item.product.brand?.name ?? "Unknown",
        category: item.product.category?.name ?? "Unknown",
        type: item.product.type?.name ?? "Unknown",
        vehicleTypeName: item.product.vehicleType?.name ?? "Unknown",
        depotName: depotItem.depot.depotName,
        price: Number(depotItem.salePrice ?? 0),
        costPrice: Number(depotItem.costPrice ?? 0),
        salePrice: Number(depotItem.salePrice ?? 0),
        stockQuantity: Number(depotItem.stockQuantity ?? 0),
        stockThreshold: Number(depotItem.stockThreshold ?? 10),
        supplierId: depotItem.supplier?.id ?? 0,
        supplierName: depotItem.supplier?.name ?? "Unknown",
        status: item.product.status ?? "Unknown",
        available: Boolean(depotItem.available),
        description: item.product.description ?? "",
    }));
}

function flattenProducts(data: BackendProductWithDepots[]) {
    return data.flatMap(mapBackendProductToFrontend);
}

function formatPrice(value: number) {
    return new Intl.NumberFormat("en-EU", {
        style: "currency", currency: "EUR", maximumFractionDigits: 0,
    }).format(Number(value ?? 0));
}

function formatStatusLabel(status: string) {
    const n = (status ?? "").toUpperCase();
    if (n === "ACTIVE") return "Active";
    if (n === "INACTIVE") return "Inactive";
    if (n === "DRAFT") return "Draft";
    if (n === "ARCHIVED") return "Archived";
    return status;
}

function toBackendStatus(status: string) {
    const n = (status ?? "").toUpperCase();
    if (n === "ACTIVE") return "Active";
    if (n === "INACTIVE") return "Inactive";
    if (n === "DRAFT") return "Draft";
    if (n === "ARCHIVED") return "Archived";
    return status;
}

function StatusPill({ status, compact = false }: { status: string; compact?: boolean }) {
    const n = (status ?? "").toLowerCase();
    const active = n === "active";
    const draft = n === "draft";
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            minWidth: compact ? 0 : 80,
            padding: compact ? "4px 10px" : "5px 12px",
            borderRadius: 999,
            background: active ? "#e6f7ed" : draft ? "#fffbeb" : "#f3f4f6",
            color: active ? "#17a84a" : draft ? "#d97706" : "#6b7280",
            border: `1px solid ${active ? "#b9dec6" : draft ? "#f5d29c" : "#d1d5db"}`,
            fontSize: compact ? 11 : 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
        }}>
            {formatStatusLabel(status)}
        </span>
    );
}

function AvailabilityPill({ available, compact = false }: { available: boolean; compact?: boolean }) {
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            minWidth: compact ? 0 : 90,
            padding: compact ? "4px 10px" : "5px 12px",
            borderRadius: 999,
            background: available ? "#e6f7ed" : "#f3f4f6",
            color: available ? "#17a84a" : "#6b7280",
            border: `1px solid ${available ? "#b9dec6" : "#d1d5db"}`,
            fontSize: compact ? 11 : 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
        }}>
            {available ? "Available" : "Unavailable"}
        </span>
    );
}

function MobileDetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            gap: 12, padding: "9px 0", borderBottom: "1px solid #f1f3f6",
        }}>
            <span style={{ fontSize: 13, color: "#7b8494", fontWeight: 600, flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 13, color: "#273142", fontWeight: 600, textAlign: "right", wordBreak: "break-word" }}>{value}</span>
        </div>
    );
}

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
    if (total <= 1) return null;
    return (
        <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 20px", borderTop: "0.5px solid #e0ebe0",
            background: "#f7f9f7",
        }}>
            <span style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>
                Page {current} of {total}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
                <button
                    onClick={() => onChange(current - 1)}
                    disabled={current === 1}
                    style={{
                        padding: "6px 14px", borderRadius: 8, border: "0.5px solid #e0ebe0",
                        background: current === 1 ? "#f7f9f7" : "#fff",
                        color: current === 1 ? "#bbb" : "#17a84a",
                        fontWeight: 600, fontSize: 13, cursor: current === 1 ? "default" : "pointer",
                        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    }}
                >← Prev</button>
                {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => onChange(p)}
                        style={{
                            width: 32, height: 32, borderRadius: 8,
                            border: p === current ? "none" : "0.5px solid #e0ebe0",
                            background: p === current ? "#17a84a" : "#fff",
                            color: p === current ? "#fff" : "#444",
                            fontWeight: 600, fontSize: 13, cursor: "pointer",
                            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                        }}
                    >{p}</button>
                ))}
                <button
                    onClick={() => onChange(current + 1)}
                    disabled={current === total}
                    style={{
                        padding: "6px 14px", borderRadius: 8, border: "0.5px solid #e0ebe0",
                        background: current === total ? "#f7f9f7" : "#fff",
                        color: current === total ? "#bbb" : "#17a84a",
                        fontWeight: 600, fontSize: 13, cursor: current === total ? "default" : "pointer",
                        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    }}
                >Next →</button>
            </div>
        </div>
    );
}

export default function Products() {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [brandFilter, setBrandFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [depotFilter, setDepotFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null);

    const [products, setProducts] = useState<ProductRow[]>([]);
    const [brandOptions, setBrandOptions] = useState<SelectOption[]>([]);
    const [typeOptions, setTypeOptions] = useState<SelectOption[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
    const [vehicleTypeOptions, setVehicleTypeOptions] = useState<SelectOption[]>([]);
    const [depotOptions, setDepotOptions] = useState<SelectOption[]>([]);
    const [supplierOptions, setSupplierOptions] = useState<SelectOption[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth <= 768;
    });

    const [newProduct, setNewProduct] = useState<CreateProductFormData>({
        sku: "", name: "", description: "", brandId: "", status: "Active",
        typeId: "", categoryId: "", vehicleTypeId: "", productDepots: [{ ...emptyDepotRow }],
    });

    const activeDepotNames = useMemo(() => new Set(depotOptions.map((d) => d.name)), [depotOptions]);
    const activeProducts = useMemo(
        () => products.filter((p) => activeDepotNames.has(p.depotName)),
        [products, activeDepotNames]
    );

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError("");
            const data: BackendProductWithDepots[] = await getAllProductDepots();
            setProducts(flattenProducts(data ?? []));
        } catch (err) {
            console.error(err);
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    const loadOptions = async () => {
        try {
            const [brands, types, categories, depots, suppliers, vehicleTypes] = await Promise.all([
                getAllBrands(), getAllTypes(), getAllCategories(),
                getDepotOverview(), getAllSuppliers(), getAllVehicleTypes(),
            ]);
            setBrandOptions((brands ?? []).map((b: any) => ({ id: b.id, name: b.name })));
            setTypeOptions((types ?? []).map((t: any) => ({ id: t.id, name: t.name })));
            setCategoryOptions((categories ?? []).map((c: any) => ({ id: c.id, name: c.name })));
            setDepotOptions(normalizeDepotOverview(depots));
            setSupplierOptions((suppliers ?? []).filter((s: any) => !s.archived).map((s: any) => ({ id: s.id, name: s.name })));
            setVehicleTypeOptions((vehicleTypes ?? []).filter((v: any) => !v.archived).map((v: any) => ({ id: v.id, name: v.name })));
        } catch (err) {
            console.error("Failed to load select options", err);
        }
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        void loadProducts();
        void loadOptions();
    }, []);

    const handleProductFormChange = (
        field: keyof Omit<CreateProductFormData, "productDepots">,
        value: string | number | boolean
    ) => setNewProduct((prev) => ({ ...prev, [field]: value }));

    const handleDepotChange = (index: number, field: keyof DepotFormRow, value: string | number | boolean) => {
        setNewProduct((prev) => ({
            ...prev,
            productDepots: prev.productDepots.map((row, i) => i === index ? { ...row, [field]: value } : row),
        }));
    };

    const handleAddDepot = () => setNewProduct((prev) => ({ ...prev, productDepots: [...prev.productDepots, { ...emptyDepotRow }] }));
    const handleRemoveDepot = (index: number) => setNewProduct((prev) => ({ ...prev, productDepots: prev.productDepots.filter((_, i) => i !== index) }));

    const resetForm = () => setNewProduct({
        sku: "", name: "", description: "", brandId: "", status: "Active",
        typeId: "", categoryId: "", vehicleTypeId: "", productDepots: [{ ...emptyDepotRow }],
    });

    const handleCreateProduct = async () => {
        const { sku, name, description, brandId, status, typeId, categoryId, vehicleTypeId, productDepots } = newProduct;
        const hasInvalidDepot = productDepots.some(
            (d) => d.depotId === "" || d.stockQuantity === "" || d.costPrice === "" ||
                d.salePrice === "" || d.stockThreshold === "" || d.supplierId === ""
        );
        if (!sku.trim() || !name.trim() || !description.trim() || brandId === "" || !status ||
            typeId === "" || categoryId === "" || vehicleTypeId === "" || productDepots.length === 0 || hasInvalidDepot) {
            alert("Please fill all required fields including vehicle type, stock threshold and supplier.");
            return;
        }
        try {
            await createProduct({
                sku, name, description,
                brandId: Number(brandId),
                status: toBackendStatus(status),
                typeId: Number(typeId),
                categoryId: Number(categoryId),
                vehicleTypeId: Number(vehicleTypeId),
                supplierId: Number(productDepots[0].supplierId),
                productDepots: productDepots.map((depot) => ({
                    depotId: Number(depot.depotId),
                    stockQuantity: Number(depot.stockQuantity),
                    costPrice: Number(depot.costPrice),
                    salePrice: Number(depot.salePrice),
                    stockThreshold: Number(depot.stockThreshold),
                    supplierId: Number(depot.supplierId),
                })),
            });
            await loadProducts();
            setShowCreateModal(false);
            resetForm();
        } catch (err) {
            console.error(err);
            alert("Failed to create product.");
        }
    };

    const handleOpenDetails = (product: ProductRow) => {
        setSelectedProduct(product);
        setShowDetailsModal(true);
    };

    const handleSaveEditedProduct = async (updatedProduct: ProductRow, updatedDepots: ProductRow[]) => {
        try {
            await updateProduct(updatedProduct.productId, {
                name: updatedProduct.name,
                description: updatedProduct.description,
                brandId: Number(updatedProduct.brandId),
                status: toBackendStatus(updatedProduct.status),
                typeId: Number(updatedProduct.typeId),
                categoryId: Number(updatedProduct.categoryId),
                vehicleTypeId: Number(updatedProduct.vehicleTypeId),
                supplierId: Number(updatedDepots[0]?.supplierId ?? updatedProduct.supplierId),
                productDepots: updatedDepots.map((depot) => ({
                    depotId: Number(depot.depotId),
                    stockQuantity: Number(depot.stockQuantity),
                    costPrice: Number(depot.costPrice),
                    salePrice: Number(depot.salePrice),
                    stockThreshold: Number(depot.stockThreshold ?? 10),
                    supplierId: Number(depot.supplierId),
                })),
            });
            await loadProducts();
            setShowDetailsModal(false);
            setSelectedProduct(null);
        } catch (err) {
            console.error(err);
            alert("Failed to update product.");
            throw err;
        }
    };

    const filtered = useMemo(() => {
        return activeProducts.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.sku.toLowerCase().includes(search.toLowerCase()) ||
                p.brand.toLowerCase().includes(search.toLowerCase()) ||
                p.supplierName.toLowerCase().includes(search.toLowerCase()) ||
                p.vehicleTypeName.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = categoryFilter === "all" || String(p.categoryId) === categoryFilter;
            const matchesBrand = brandFilter === "all" || String(p.brandId) === brandFilter;
            const matchesType = typeFilter === "all" || String(p.typeId) === typeFilter;
            const matchesDepot = depotFilter === "all" || p.depotName === depotFilter;
            return matchesSearch && matchesCategory && matchesBrand && matchesType && matchesDepot;
        });
    }, [activeProducts, search, categoryFilter, brandFilter, typeFilter, depotFilter]);

    const visibleProducts = useMemo(() => {
        const grouped = new Map<number, ProductRow>();
        filtered.forEach((product) => {
            if (!grouped.has(product.productId)) grouped.set(product.productId, product);
        });
        return Array.from(grouped.values());
    }, [filtered]);

    // Reset to page 1 when filters change
    useEffect(() => { setCurrentPage(1); }, [search, categoryFilter, brandFilter, typeFilter, depotFilter]);

    const totalPages = Math.ceil(visibleProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = visibleProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const getProductDepotRows = (productId: number) => activeProducts.filter((p) => p.productId === productId);
    const getDepotDisplay = (productId: number) => {
        const depots = getProductDepotRows(productId);
        if (depots.length === 0) return "No depots";
        if (depots.length === 1) return depots[0].depotName;
        return `${depots.length} depots`;
    };
    const getTotalStock = (productId: number) => getProductDepotRows(productId).reduce((sum, d) => sum + d.stockQuantity, 0);
    const isAvailableInAnyDepot = (productId: number) => getProductDepotRows(productId).some((d) => d.available);

    return (
        <AppLayout>
            <div style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? 16 : 20,
                height: "100%",
                textAlign: "left",
            }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "stretch" : "flex-start",
                    gap: 16,
                }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: isMobile ? 22 : 26, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.5px" }}>
                            Products
                        </h1>
                        <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14, fontWeight: 400 }}>
                            Manage cross-sell products and services
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        style={{
                            background: "#17a84a",
                            color: "#fff",
                            border: "none",
                            borderRadius: 10,
                            padding: isMobile ? "12px 18px" : "10px 20px",
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: "pointer",
                            width: isMobile ? "100%" : "auto",
                            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                            boxShadow: "0 2px 8px rgba(23,168,74,0.2)",
                        }}
                    >
                        + Add Product
                    </button>
                </div>

                {/* Filters */}
                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 10, flexWrap: "wrap" }}>
                    <div style={{
                        display: "flex", alignItems: "center",
                        height: 42, borderRadius: 10,
                        border: "0.5px solid #e0ebe0",
                        padding: "0 14px", background: "#fff",
                        minWidth: isMobile ? "100%" : 240,
                    }}>
                        <i className="ti ti-search" style={{ fontSize: 16, color: "#aaa", marginRight: 8 }} aria-hidden="true" />
                        <input
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                border: "none", outline: "none", width: "100%",
                                fontSize: 14, background: "transparent", color: "#2d3340",
                                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                            }}
                        />
                    </div>
                    {[
                        { value: brandFilter, onChange: setBrandFilter, label: "All Brands", options: brandOptions },
                        { value: categoryFilter, onChange: setCategoryFilter, label: "All Categories", options: categoryOptions },
                        { value: typeFilter, onChange: setTypeFilter, label: "All Types", options: typeOptions },
                        { value: depotFilter, onChange: setDepotFilter, label: "All Depots", options: depotOptions },
                    ].map(({ value, onChange, label, options }) => (
                        <select
                            key={label}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            style={filterStyle(isMobile)}
                        >
                            <option value="all">{label}</option>
                            {options.map((o) => <option key={o.id} value={label === "All Depots" ? o.name : o.id}>{o.name}</option>)}
                        </select>
                    ))}
                </div>

                {/* Table */}
                <div style={{
                    background: "#fff", borderRadius: 12,
                    border: "0.5px solid #e0ebe0", overflow: "hidden",
                    display: "flex", flexDirection: "column",
                    alignSelf: "start",
                }}>
                    {loading ? (
                        <div style={{ padding: 24, color: "#888" }}>Loading...</div>
                    ) : error ? (
                        <div style={{ padding: 24, color: "#d14343" }}>{error}</div>
                    ) : visibleProducts.length === 0 ? (
                        <div style={{ padding: 24, color: "#888" }}>No products found.</div>
                    ) : isMobile ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 12, overflowY: "auto" }}>
                            {paginatedProducts.map((product) => (
                                <div
                                    key={product.productId}
                                    onClick={() => handleOpenDetails(product)}
                                    style={{
                                        border: "0.5px solid #e0ebe0", borderRadius: 12,
                                        padding: 14, cursor: "pointer",
                                        display: "flex", flexDirection: "column", gap: 10,
                                        background: "#fff",
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{product.name}</div>
                                        <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600, marginTop: 3 }}>SKU: {product.sku}</div>
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                        <StatusPill status={product.status} compact />
                                        <AvailabilityPill available={isAvailableInAnyDepot(product.productId)} compact />
                                    </div>
                                    <div style={{ borderTop: "0.5px solid #f0f4f0", paddingTop: 2 }}>
                                        <MobileDetailRow label="Brand" value={product.brand} />
                                        <MobileDetailRow label="Category" value={product.category} />
                                        <MobileDetailRow label="Vehicle Type" value={product.vehicleTypeName} />
                                        <MobileDetailRow label="Depots" value={getDepotDisplay(product.productId)} />
                                        <MobileDetailRow label="Sale Price" value={formatPrice(product.salePrice)} />
                                        <MobileDetailRow label="Total Stock" value={getTotalStock(product.productId)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Table header */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 2fr 1.2fr 1.2fr 0.8fr 0.8fr 1fr 1fr 1.2fr 1.2fr",
                                gap: 12, padding: "10px 20px",
                                borderBottom: "0.5px solid #e0ebe0",
                                background: "#f7f9f7",
                                fontSize: 11, fontWeight: 600, color: "#aaa",
                                textTransform: "uppercase", letterSpacing: "1px",
                                alignItems: "center",
                            }}>
                                {["SKU","Product","Brand","Category","Sale","Stock","Status","Vehicle Type","Depots","Availability"].map(h => (
                                    <div key={h}>{h}</div>
                                ))}
                            </div>

                            {/* Table rows */}
                            <div style={{ overflowY: "auto", flex: 1 }}>
                                {paginatedProducts.map((product, i) => (
                                    <TableRow
                                        key={product.productId}
                                        product={product}
                                        isLast={i === paginatedProducts.length - 1}
                                        depotDisplay={getDepotDisplay(product.productId)}
                                        totalStock={getTotalStock(product.productId)}
                                        available={isAvailableInAnyDepot(product.productId)}
                                        onClick={() => handleOpenDetails(product)}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
                        </>
                    )}
                </div>
            </div>

            <CreateProductModal
                open={showCreateModal}
                formData={newProduct}
                brands={brandOptions}
                types={typeOptions}
                categories={categoryOptions}
                vehicleTypes={vehicleTypeOptions}
                depots={depotOptions}
                suppliers={supplierOptions}
                onClose={() => { setShowCreateModal(false); resetForm(); }}
                onChange={handleProductFormChange}
                onDepotChange={handleDepotChange}
                onAddDepot={handleAddDepot}
                onRemoveDepot={handleRemoveDepot}
                onSubmit={handleCreateProduct}
            />

            <ProductDetailsModal
                open={showDetailsModal}
                product={selectedProduct}
                allProducts={activeProducts}
                onClose={() => setShowDetailsModal(false)}
                onSave={handleSaveEditedProduct}
                brandOptions={brandOptions}
                typeOptions={typeOptions}
                categoryOptions={categoryOptions}
                vehicleTypeOptions={vehicleTypeOptions}
                depotOptions={depotOptions}
                supplierOptions={supplierOptions}
            />
        </AppLayout>
    );
}

function TableRow({ product, isLast, depotDisplay, totalStock, available, onClick }: {
    product: ProductRow;
    isLast: boolean;
    depotDisplay: string;
    totalStock: number;
    available: boolean;
    onClick: () => void;
}) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1.2fr 1.2fr 0.8fr 0.8fr 1fr 1fr 1.2fr 1.2fr",
                gap: 12, padding: "20px 20px",
                borderBottom: isLast ? "none" : "0.5px solid #f0f4f0",
                alignItems: "center",
                background: hovered ? "#f8faf8" : "#fff",
                cursor: "pointer",
                transition: "background 0.15s",
            }}
        >
            <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>{product.sku}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{product.name}</div>
            <div style={cellStyle}>{product.brand}</div>
            <div style={cellStyle}>{product.category}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{new Intl.NumberFormat("en-EU", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(product.salePrice)}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{totalStock}</div>
            <div><StatusPill status={product.status} /></div>
            <div style={cellStyle}>{product.vehicleTypeName}</div>
            <div style={cellStyle}>{depotDisplay}</div>
            <div><AvailabilityPill available={available} /></div>
        </div>
    );
}

function filterStyle(isMobile: boolean): React.CSSProperties {
    return {
        width: isMobile ? "100%" : 180,
        height: 42,
        borderRadius: 10,
        border: "0.5px solid #e0ebe0",
        padding: "0 14px",
        fontSize: 13,
        background: "#fff",
        color: "#2d3340",
        outline: "none",
        boxSizing: "border-box",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    };
}

const cellStyle: React.CSSProperties = {
    fontSize: 13,
    color: "#888",
    fontWeight: 500,
};