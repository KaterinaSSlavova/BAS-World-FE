import React, { useEffect, useMemo, useState } from "react";
import { createProduct } from "../lib/api/products";
import { getAllProductDepots, updateProduct } from "../lib/api/productDepots";
import { getAllBrands } from "../lib/api/brands";
import { getDepotOverview } from "../lib/api/depots";
import { getAllCategories } from "../lib/api/categories";
import { getAllTypes } from "../lib/api/types";
import { getAllSuppliers } from "../lib/api/suppliers";
import CreateProductModal, {
    type CreateProductFormData,
    type DepotFormRow,
} from "../components/ui/create_product_modal";
import ProductDetailsModal from "../components/ui/product-details-modal";
import AppLayout from "../components/AppLayout";

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
    };
    depots: {
        depot: {
            id: number;
            depotName: string;
            location?: string;
        };
        stockQuantity: number;
        costPrice: number;
        salePrice: number;
        available: boolean;
        stockThreshold?: number;
        supplier?: {
            id: number;
            name: string;
            picture?: string;
            archived?: boolean;
        };
    }[];
};

export type ProductRow = {
    id: string;
    productId: number;
    depotId: number;
    brandId: number;
    categoryId: number;
    typeId: number;
    sku: string;
    name: string;
    brand: string;
    category: string;
    type: string;
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

export type SelectOption = {
    id: number;
    name: string;
};

const emptyDepotRow: DepotFormRow = {
    depotId: "",
    stockQuantity: "",
    costPrice: "",
    salePrice: "",
    available: true,
    stockThreshold: "",
    supplierId: "",
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
        sku: item.product.sku,
        name: item.product.name,
        brand: item.product.brand?.name ?? "Unknown",
        category: item.product.category?.name ?? "Unknown",
        type: item.product.type?.name ?? "Unknown",
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
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));
}

function formatStatusLabel(status: string) {
    const normalized = (status ?? "").toUpperCase();
    if (normalized === "ACTIVE") return "Active";
    if (normalized === "INACTIVE") return "Inactive";
    if (normalized === "DRAFT") return "Draft";
    if (normalized === "ARCHIVED") return "Archived";
    return status;
}

function toBackendStatus(status: string) {
    const normalized = (status ?? "").toUpperCase();
    if (normalized === "ACTIVE") return "Active";
    if (normalized === "INACTIVE") return "Inactive";
    if (normalized === "DRAFT") return "Draft";
    if (normalized === "ARCHIVED") return "Archived";
    return status;
}

function StatusPill({ status, compact = false }: { status: string; compact?: boolean }) {
    const normalized = (status ?? "").toLowerCase();
    let background = "#e8f5ec";
    let color = "#2e9d5b";
    let border = "1px solid #b9dec6";

    if (normalized === "inactive" || normalized === "archived") {
        background = "#f3f4f6";
        color = "#6b7280";
        border = "1px solid #d1d5db";
    }

    if (normalized === "draft") {
        background = "#fff7e8";
        color = "#d97706";
        border = "1px solid #f5d29c";
    }

    return (
        <span style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: compact ? 0 : 88,
            padding: compact ? "6px 10px" : "8px 14px",
            borderRadius: 999,
            background,
            color,
            border,
            fontSize: compact ? 12 : 14,
            fontWeight: 700,
            whiteSpace: "nowrap",
        }}>
            {formatStatusLabel(status)}
        </span>
    );
}

function AvailabilityPill({ available, compact = false }: { available: boolean; compact?: boolean }) {
    return (
        <span style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: compact ? 0 : 96,
            padding: compact ? "6px 10px" : "8px 14px",
            borderRadius: 999,
            background: available ? "#e8f5ec" : "#f3f4f6",
            color: available ? "#2e9d5b" : "#6b7280",
            border: available ? "1px solid #b9dec6" : "1px solid #d1d5db",
            fontSize: compact ? 12 : 14,
            fontWeight: 700,
            whiteSpace: "nowrap",
        }}>
            {available ? "Available" : "Unavailable"}
        </span>
    );
}

function MobileDetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            padding: "10px 0",
            borderBottom: "1px solid #f1f3f6",
        }}>
            <span style={{ fontSize: 13, color: "#7b8494", fontWeight: 700, flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 14, color: "#273142", fontWeight: 600, textAlign: "right", wordBreak: "break-word" }}>{value}</span>
        </div>
    );
}

export default function Products() {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [brandFilter, setBrandFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [depotFilter, setDepotFilter] = useState("all");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null);

    const [products, setProducts] = useState<ProductRow[]>([]);
    const [brandOptions, setBrandOptions] = useState<SelectOption[]>([]);
    const [typeOptions, setTypeOptions] = useState<SelectOption[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
    const [depotOptions, setDepotOptions] = useState<SelectOption[]>([]);
    const [supplierOptions, setSupplierOptions] = useState<SelectOption[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth <= 768;
    });

    const [newProduct, setNewProduct] = useState<CreateProductFormData>({
        sku: "",
        name: "",
        description: "",
        brandId: "",
        status: "Active",
        typeId: "",
        categoryId: "",
        productDepots: [{ ...emptyDepotRow }],
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
            const [brands, types, categories, depots, suppliers] = await Promise.all([
                getAllBrands(),
                getAllTypes(),
                getAllCategories(),
                getDepotOverview(),
                getAllSuppliers(),
            ]);

            setBrandOptions((brands ?? []).map((b: any) => ({ id: b.id, name: b.name })));
            setTypeOptions((types ?? []).map((t: any) => ({ id: t.id, name: t.name })));
            setCategoryOptions((categories ?? []).map((c: any) => ({ id: c.id, name: c.name })));
            setDepotOptions(normalizeDepotOverview(depots));
            setSupplierOptions(
                (suppliers ?? [])
                    .filter((s: any) => !s.archived)
                    .map((s: any) => ({ id: s.id, name: s.name }))
            );
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

    const handleAddDepot = () => {
        setNewProduct((prev) => ({
            ...prev,
            productDepots: [...prev.productDepots, { ...emptyDepotRow }],
        }));
    };

    const handleRemoveDepot = (index: number) => {
        setNewProduct((prev) => ({
            ...prev,
            productDepots: prev.productDepots.filter((_, i) => i !== index),
        }));
    };

    const resetForm = () => {
        setNewProduct({
            sku: "",
            name: "",
            description: "",
            brandId: "",
            status: "Active",
            typeId: "",
            categoryId: "",
            productDepots: [{ ...emptyDepotRow }],
        });
    };

    const handleCreateProduct = async () => {
        const { sku, name, description, brandId, status, typeId, categoryId, productDepots } = newProduct;

        const hasInvalidDepot = productDepots.some(
            (d) =>
                d.depotId === "" ||
                d.stockQuantity === "" ||
                d.costPrice === "" ||
                d.salePrice === "" ||
                d.stockThreshold === "" ||
                d.supplierId === ""
        );

        if (!sku.trim() || !name.trim() || !description.trim() || brandId === "" || !status ||
            typeId === "" || categoryId === "" || productDepots.length === 0 || hasInvalidDepot) {
            alert("Please fill all required fields including stock threshold and supplier.");
            return;
        }

        try {
            const payload = {
                sku,
                name,
                description,
                brandId: Number(brandId),
                status: toBackendStatus(status),
                typeId: Number(typeId),
                categoryId: Number(categoryId),
                vehicleTypeId: 1,
                supplierId: Number(productDepots[0].supplierId),
                productDepots: productDepots.map((depot) => ({
                    depotId: Number(depot.depotId),
                    stockQuantity: Number(depot.stockQuantity),
                    costPrice: Number(depot.costPrice),
                    salePrice: Number(depot.salePrice),
                    stockThreshold: Number(depot.stockThreshold),
                    supplierId: Number(depot.supplierId),
                })),
            };

            await createProduct(payload);
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
            const payload = {
                name: updatedProduct.name,
                description: updatedProduct.description,
                brandId: Number(updatedProduct.brandId),
                status: toBackendStatus(updatedProduct.status),
                typeId: Number(updatedProduct.typeId),
                categoryId: Number(updatedProduct.categoryId),
                vehicleTypeId: 1,
                supplierId: Number(updatedDepots[0]?.supplierId ?? updatedProduct.supplierId),
                productDepots: updatedDepots.map((depot) => ({
                    depotId: Number(depot.depotId),
                    stockQuantity: Number(depot.stockQuantity),
                    costPrice: Number(depot.costPrice),
                    salePrice: Number(depot.salePrice),
                    stockThreshold: Number(depot.stockThreshold ?? 10),
                    supplierId: Number(depot.supplierId),
                })),
            };

            await updateProduct(updatedProduct.productId, payload);
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
                p.supplierName.toLowerCase().includes(search.toLowerCase());

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
            if (!grouped.has(product.productId)) {
                grouped.set(product.productId, product);
            }
        });

        return Array.from(grouped.values());
    }, [filtered]);

    const getProductDepotRows = (productId: number) =>
        activeProducts.filter((product) => product.productId === productId);

    const getDepotDisplay = (productId: number) => {
        const depots = getProductDepotRows(productId);

        if (depots.length === 0) return "No depots";
        if (depots.length === 1) return depots[0].depotName;

        return `${depots.length} depots`;
    };

    const getTotalStock = (productId: number) =>
        getProductDepotRows(productId).reduce((sum, depot) => sum + depot.stockQuantity, 0);

    const isAvailableInAnyDepot = (productId: number) =>
        getProductDepotRows(productId).some((depot) => depot.available);

    return (
        <AppLayout>
            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 18 : 24 }}>
                <div style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "stretch" : "flex-start",
                    gap: 16,
                }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: isMobile ? 24 : 28, fontWeight: 800, color: "#1f2937", lineHeight: 1.15 }}>
                            Products
                        </h1>
                        <p style={{ margin: "8px 0 0", color: "#7f8792", fontSize: isMobile ? 14 : 16, lineHeight: 1.5 }}>
                            Manage cross-sell products and services
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        style={{
                            background: "#2e9d5b",
                            color: "#fff",
                            border: "none",
                            borderRadius: 12,
                            padding: isMobile ? "13px 18px" : "14px 22px",
                            fontWeight: 700,
                            fontSize: 16,
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(46,157,91,0.18)",
                            width: isMobile ? "100%" : "auto",
                        }}
                    >
                        + Add Product
                    </button>
                </div>

                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12, flexWrap: "wrap" }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        height: isMobile ? 62 : 50,
                        borderRadius: 12,
                        border: "1px solid #d9dee5",
                        padding: "0 16px",
                        background: "#fff",
                        minWidth: isMobile ? "100%" : 260,
                    }}>
                        <input
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                border: "none",
                                outline: "none",
                                width: "100%",
                                fontSize: isMobile ? 17 : 15,
                                background: "transparent",
                                color: "#2d3340",
                            }}
                        />
                    </div>

                    <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} style={filterStyle(isMobile)}>
                        <option value="all">All Brands</option>
                        {brandOptions.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>

                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={filterStyle(isMobile)}>
                        <option value="all">All Categories</option>
                        {categoryOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={filterStyle(isMobile)}>
                        <option value="all">All Types</option>
                        {typeOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>

                    <select value={depotFilter} onChange={(e) => setDepotFilter(e.target.value)} style={filterStyle(isMobile)}>
                        <option value="all">All Depots</option>
                        {depotOptions.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
                    </select>
                </div>

                <div style={{ background: "#fff", borderRadius: isMobile ? 16 : 18, border: "1px solid #e6eaef", overflow: "hidden" }}>
                    {loading ? (
                        <div style={{ padding: 24, color: "#7f8792" }}>Loading...</div>
                    ) : error ? (
                        <div style={{ padding: 24, color: "#d14343" }}>{error}</div>
                    ) : visibleProducts.length === 0 ? (
                        <div style={{ padding: 24, color: "#7f8792" }}>No products found.</div>
                    ) : isMobile ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 12, background: "#f8fafc" }}>
                            {visibleProducts.map((product) => (
                                <div
                                    key={product.productId}
                                    onClick={() => handleOpenDetails(product)}
                                    style={{
                                        border: "1px solid #e9edf2",
                                        borderRadius: 16,
                                        padding: 14,
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 12,
                                        background: "#ffffff",
                                        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: 17, fontWeight: 800, color: "#273142", lineHeight: 1.3 }}>{product.name}</div>
                                        <div style={{ fontSize: 13, color: "#7b8494", fontWeight: 600, marginTop: 4 }}>SKU: {product.sku}</div>
                                    </div>

                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                        <StatusPill status={product.status} compact />
                                        <AvailabilityPill available={isAvailableInAnyDepot(product.productId)} compact />
                                    </div>

                                    <div style={{ borderTop: "1px solid #f1f3f6", paddingTop: 2 }}>
                                        <MobileDetailRow label="Brand" value={product.brand} />
                                        <MobileDetailRow label="Category" value={product.category} />
                                        <MobileDetailRow label="Type" value={product.type} />
                                        <MobileDetailRow label="Depots" value={getDepotDisplay(product.productId)} />
                                        <MobileDetailRow label="Sale Price" value={formatPrice(product.salePrice)} />
                                        <MobileDetailRow label="Cost Price" value={formatPrice(product.costPrice)} />
                                        <MobileDetailRow label="Total Stock" value={getTotalStock(product.productId)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1.1fr 2fr 1.4fr 1.3fr 1fr 1fr 1.2fr 1.2fr 1.4fr 1.3fr",
                                gap: 16,
                                padding: "20px 22px",
                                borderBottom: "1px solid #eef1f4",
                                background: "#fbfcfd",
                                fontSize: 12,
                                fontWeight: 800,
                                color: "#7b8494",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                alignItems: "center",
                                justifyItems: "center",
                            }}>
                                <div>SKU</div>
                                <div>Product</div>
                                <div>Brand</div>
                                <div>Category</div>
                                <div>Sale</div>
                                <div>Total Stock</div>
                                <div>Status</div>
                                <div>Type</div>
                                <div>Depots</div>
                                <div>Availability</div>
                            </div>

                            {visibleProducts.map((product) => (
                                <div
                                    key={product.productId}
                                    onClick={() => handleOpenDetails(product)}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1.1fr 2fr 1.4fr 1.3fr 1fr 1fr 1.2fr 1.2fr 1.4fr 1.3fr",
                                        gap: 16,
                                        padding: "22px",
                                        borderBottom: "1px solid #eef1f4",
                                        cursor: "pointer",
                                        alignItems: "center",
                                        justifyItems: "center",
                                    }}
                                >
                                    <div style={{ fontSize: 16, color: "#7b8494", fontWeight: 600 }}>{product.sku}</div>

                                    <div style={{ justifySelf: "start", width: "100%" }}>
                                        <div style={{ fontSize: 18, fontWeight: 700, color: "#273142", lineHeight: 1.35 }}>{product.name}</div>
                                    </div>

                                    <div style={cellStyle}>{product.brand}</div>
                                    <div style={cellStyle}>{product.category}</div>
                                    <div style={{ fontSize: 16, color: "#273142", fontWeight: 600 }}>{formatPrice(product.salePrice)}</div>
                                    <div style={{ fontSize: 16, color: "#273142", fontWeight: 600 }}>{getTotalStock(product.productId)}</div>
                                    <div><StatusPill status={product.status} /></div>
                                    <div style={cellStyle}>{product.type}</div>
                                    <div style={cellStyle}>{getDepotDisplay(product.productId)}</div>
                                    <div><AvailabilityPill available={isAvailableInAnyDepot(product.productId)} /></div>
                                </div>
                            ))}
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
                depots={depotOptions}
                suppliers={supplierOptions}
                onClose={() => {
                    setShowCreateModal(false);
                    resetForm();
                }}
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
                depotOptions={depotOptions}
                supplierOptions={supplierOptions}
            />
        </AppLayout>
    );
}

function filterStyle(isMobile: boolean): React.CSSProperties {
    return {
        width: isMobile ? "100%" : 210,
        height: 50,
        borderRadius: 12,
        border: "1px solid #d9dee5",
        padding: "0 16px",
        fontSize: 15,
        background: "#fff",
        color: "#2d3340",
        outline: "none",
        boxSizing: "border-box",
    };
}

const cellStyle: React.CSSProperties = {
    fontSize: 15,
    color: "#6b7280",
    fontWeight: 500,
};