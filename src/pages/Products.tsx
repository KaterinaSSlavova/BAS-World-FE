import { useEffect, useMemo, useState } from "react";
import { createProduct } from "../lib/api/products";
import {
    getAllProductDepots,
    updateProductDepot,
} from "../lib/api/productDepots";
import CreateProductModal, {
    type CreateProductFormData,
} from "../components/ui/create_product_modal";
import ProductDetailsModal from "../components/ui/product-details-modal";
import AppLayout from "../components/AppLayout";

type BackendProductDepot = {
    productId: number;
    sku: string;
    productName: string;
    description: string;
    brand: string;
    price: number;
    status: string;

    type: string;
    typeId: number;

    category: string;
    categoryId: number;

    depotName: string;
    depotId: number;

    stockQuantity: number;
    available: boolean;
};

export type ProductRow = {
    id: string;
    productId: number;
    depotId: number;
    categoryId: number;
    typeId: number;
    sku: string;
    name: string;
    brand: string;
    category: string;
    type: string;
    depotName: string;
    price: number;
    stockQuantity: number;
    status: string;
    available: boolean;
    description: string;
};

export type SelectOption = {
    id: number;
    name: string;
};

const TYPE_OPTIONS: SelectOption[] = [{ id: 1, name: "Physical Product" }];
const CATEGORY_OPTIONS: SelectOption[] = [{ id: 1, name: "Tyre" }];
const DEPOT_OPTIONS: SelectOption[] = [{ id: 1, name: "Eindhoven Depot" }];

function mapBackendProductToFrontend(item: BackendProductDepot): ProductRow {
    return {
        id: item.sku,
        productId: item.productId,
        depotId: item.depotId,
        categoryId: item.categoryId,
        typeId: item.typeId,
        sku: item.sku,
        name: item.productName,
        brand: item.brand,
        category: item.category,
        type: item.type,
        depotName: item.depotName,
        price: Number(item.price),
        stockQuantity: Number(item.stockQuantity),
        status: item.status,
        available: Boolean(item.available),
        description: item.description ?? "",
    };
}

function formatPrice(value: number) {
    return new Intl.NumberFormat("en-EU", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatStatusLabel(status: string) {
    const normalized = status.toUpperCase();

    if (normalized === "ACTIVE") return "Active";
    if (normalized === "INACTIVE") return "Inactive";
    if (normalized === "DRAFT") return "Draft";
    if (normalized === "ARCHIVED") return "Archived";

    return status;
}

function StatusPill({
                        status,
                        compact = false,
                    }: {
    status: string;
    compact?: boolean;
}) {
    const normalized = status.toLowerCase();

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
        <span
            style={{
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
            }}
        >
            {formatStatusLabel(status)}
        </span>
    );
}

function AvailabilityPill({
                              available,
                              compact = false,
                          }: {
    available: boolean;
    compact?: boolean;
}) {
    return (
        <span
            style={{
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
            }}
        >
            {available ? "Available" : "Unavailable"}
        </span>
    );
}

function MobileDetailRow({
                             label,
                             value,
                         }: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid #f1f3f6",
            }}
        >
            <span
                style={{
                    fontSize: 13,
                    color: "#7b8494",
                    fontWeight: 700,
                    flexShrink: 0,
                }}
            >
                {label}
            </span>

            <span
                style={{
                    fontSize: 14,
                    color: "#273142",
                    fontWeight: 600,
                    textAlign: "right",
                    wordBreak: "break-word",
                }}
            >
                {value}
            </span>
        </div>
    );
}

export default function Products() {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null);

    const [products, setProducts] = useState<ProductRow[]>([]);
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
        brand: "",
        price: "",
        status: "ACTIVE",
        typeId: 1,
        categoryId: 1,
        depotId: 1,
        stockQuantity: "",
        available: true,
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const data: BackendProductDepot[] = await getAllProductDepots();
                const mapped: ProductRow[] = data.map(mapBackendProductToFrontend);

                setProducts(mapped);
            } catch (err) {
                console.error(err);
                setError("Failed to load products.");
            } finally {
                setLoading(false);
            }
        };

        void loadProducts();
    }, []);

    const handleProductFormChange = (
        field: keyof CreateProductFormData,
        value: string | number | boolean
    ) => {
        setNewProduct((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const resetForm = () => {
        setNewProduct({
            sku: "",
            name: "",
            description: "",
            brand: "",
            price: "",
            status: "ACTIVE",
            typeId: 1,
            categoryId: 1,
            depotId: 1,
            stockQuantity: "",
            available: true,
        });
    };

    const handleCreateProduct = async () => {
        const {
            sku,
            name,
            description,
            brand,
            price,
            status,
            typeId,
            categoryId,
            depotId,
            stockQuantity,
            available,
        } = newProduct;

        if (
            !sku.trim() ||
            !name.trim() ||
            !description.trim() ||
            !brand.trim() ||
            price === "" ||
            stockQuantity === "" ||
            !status ||
            typeId === "" ||
            categoryId === "" ||
            depotId === ""
        ) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            const payload = {
                sku,
                name,
                description,
                brand,
                price: Number(price),
                status,
                typeId: Number(typeId),
                categoryId: Number(categoryId),
                depotId: Number(depotId),
                stockQuantity: Number(stockQuantity),
                available,
            };

            await createProduct(payload);

            const data: BackendProductDepot[] = await getAllProductDepots();
            setProducts(data.map(mapBackendProductToFrontend));

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

    const handleSaveEditedProduct = async (updatedProduct: ProductRow) => {
        try {
            const payload = {
                name: updatedProduct.name,
                description: updatedProduct.description,
                brand: updatedProduct.brand,
                price: Number(updatedProduct.price),
                status: updatedProduct.status,
                typeId: Number(updatedProduct.typeId),
                categoryId: Number(updatedProduct.categoryId),
                depotId: Number(updatedProduct.depotId),
                available: updatedProduct.available,
                stockQuantity: Number(updatedProduct.stockQuantity),
            };

            await updateProductDepot(
                updatedProduct.productId,
                updatedProduct.depotId,
                payload
            );

            const refreshed: BackendProductDepot[] = await getAllProductDepots();
            const mapped: ProductRow[] = refreshed.map(mapBackendProductToFrontend);
            setProducts(mapped);

            const refreshedSelected = mapped.find(
                (product) =>
                    product.productId === updatedProduct.productId &&
                    product.depotId === updatedProduct.depotId
            );

            if (refreshedSelected) {
                setSelectedProduct(refreshedSelected);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update product.");
            throw err;
        }
    };

    const categories = useMemo(
        () => [...new Set(products.map((p) => p.category))],
        [products]
    );

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.sku.toLowerCase().includes(search.toLowerCase()) ||
                p.brand.toLowerCase().includes(search.toLowerCase());

            const matchesCategory =
                categoryFilter === "all" || p.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, categoryFilter]);

    return (
        <AppLayout>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: isMobile ? 18 : 24,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        justifyContent: "space-between",
                        alignItems: isMobile ? "stretch" : "flex-start",
                        gap: 16,
                    }}
                >
                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: isMobile ? 24 : 28,
                                fontWeight: 800,
                                color: "#1f2937",
                                lineHeight: 1.15,
                            }}
                        >
                            Products
                        </h1>
                        <p
                            style={{
                                margin: "8px 0 0",
                                color: "#7f8792",
                                fontSize: isMobile ? 14 : 16,
                                lineHeight: 1.5,
                            }}
                        >
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

                <div
                    style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        gap: 12,
                        flexWrap: "wrap",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: isMobile ? 62 : 50,
                            borderRadius: 12,
                            border: "1px solid #d9dee5",
                            padding: "0 16px",
                            background: "#fff",
                        }}
                    >
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

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{
                            width: isMobile ? "100%" : 260,
                            height: 50,
                            borderRadius: 12,
                            border: "1px solid #d9dee5",
                            padding: "0 16px",
                            fontSize: 15,
                            background: "#fff",
                            color: "#2d3340",
                            outline: "none",
                            boxSizing: "border-box",
                        }}
                    >
                        <option value="all">All Categories</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                <div
                    style={{
                        background: "#fff",
                        borderRadius: isMobile ? 16 : 18,
                        border: "1px solid #e6eaef",
                        overflow: "hidden",
                    }}
                >
                    {loading ? (
                        <div style={{ padding: 24, color: "#7f8792" }}>Loading...</div>
                    ) : error ? (
                        <div style={{ padding: 24, color: "#d14343" }}>{error}</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: 24, color: "#7f8792" }}>
                            No products found.
                        </div>
                    ) : isMobile ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                                padding: 12,
                                background: "#f8fafc",
                            }}
                        >
                            {filtered.map((product) => (
                                <div
                                    key={`${product.productId}-${product.depotId}`}
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
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 10,
                                        }}
                                    >
                                        <div style={{ minWidth: 0 }}>
                                            <div
                                                style={{
                                                    fontSize: 17,
                                                    fontWeight: 800,
                                                    color: "#273142",
                                                    lineHeight: 1.3,
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {product.name}
                                            </div>

                                            <div
                                                style={{
                                                    fontSize: 13,
                                                    color: "#7b8494",
                                                    fontWeight: 600,
                                                    marginTop: 4,
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                SKU: {product.sku}
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: 8,
                                            }}
                                        >
                                            <StatusPill status={product.status} compact />
                                            <AvailabilityPill
                                                available={product.available}
                                                compact
                                            />
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            borderTop: "1px solid #f1f3f6",
                                            paddingTop: 2,
                                        }}
                                    >
                                        <MobileDetailRow
                                            label="Brand"
                                            value={product.brand}
                                        />
                                        <MobileDetailRow
                                            label="Category"
                                            value={product.category}
                                        />
                                        <MobileDetailRow
                                            label="Type"
                                            value={product.type}
                                        />
                                        <MobileDetailRow
                                            label="Depot"
                                            value={product.depotName}
                                        />
                                        <MobileDetailRow
                                            label="Price"
                                            value={formatPrice(product.price)}
                                        />
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                gap: 12,
                                                padding: "10px 0 0",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: 13,
                                                    color: "#7b8494",
                                                    fontWeight: 700,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                Stock
                                            </span>

                                            <span
                                                style={{
                                                    fontSize: 14,
                                                    color: "#273142",
                                                    fontWeight: 700,
                                                    textAlign: "right",
                                                }}
                                            >
                                                {product.stockQuantity}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1.1fr 2fr 1.5fr 1.3fr 1fr 1.3fr 1.2fr 1.2fr 1.5fr 1.3fr",
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
                                }}
                            >
                                <div>SKU</div>
                                <div>Product</div>
                                <div>Brand</div>
                                <div>Category</div>
                                <div>Price</div>
                                <div>Stock</div>
                                <div>Status</div>
                                <div>Type</div>
                                <div>Depot</div>
                                <div>Availability</div>
                            </div>

                            {filtered.map((product) => (
                                <div
                                    key={`${product.productId}-${product.depotId}`}
                                    onClick={() => handleOpenDetails(product)}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "1.1fr 2fr 1.5fr 1.3fr 1fr 1.3fr 1.2fr 1.2fr 1.5fr 1.3fr",
                                        gap: 16,
                                        padding: "22px",
                                        borderBottom: "1px solid #eef1f4",
                                        cursor: "pointer",
                                        alignItems: "center",
                                        justifyItems: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 16,
                                            color: "#7b8494",
                                            lineHeight: 1.4,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {product.sku}
                                    </div>

                                    <div style={{ justifySelf: "start", width: "100%" }}>
                                        <div
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 700,
                                                color: "#273142",
                                                lineHeight: 1.35,
                                            }}
                                        >
                                            {product.name}
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 16,
                                            color: "#6b7280",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {product.brand}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 16,
                                            color: "#6b7280",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {product.category}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 16,
                                            color: "#273142",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {formatPrice(product.price)}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 16,
                                            color: "#273142",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {product.stockQuantity}
                                    </div>

                                    <div>
                                        <StatusPill status={product.status} />
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 15,
                                            color: "#6b7280",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {product.type}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 15,
                                            color: "#6b7280",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {product.depotName}
                                    </div>

                                    <div>
                                        <AvailabilityPill available={product.available} />
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            <CreateProductModal
                open={showCreateModal}
                formData={newProduct}
                onClose={() => {
                    setShowCreateModal(false);
                    resetForm();
                }}
                onChange={handleProductFormChange}
                onSubmit={handleCreateProduct}
            />

            <ProductDetailsModal
                open={showDetailsModal}
                product={selectedProduct}
                onClose={() => setShowDetailsModal(false)}
                onSave={handleSaveEditedProduct}
                typeOptions={TYPE_OPTIONS}
                categoryOptions={CATEGORY_OPTIONS}
                depotOptions={DEPOT_OPTIONS}
            />
        </AppLayout>
    );
}