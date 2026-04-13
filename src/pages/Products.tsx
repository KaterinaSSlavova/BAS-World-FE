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

function StatusPill({ status }: { status: string }) {
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
                minWidth: 88,
                padding: "8px 14px",
                borderRadius: 999,
                background,
                color,
                border,
                fontSize: 14,
                fontWeight: 700,
            }}
        >
            {formatStatusLabel(status)}
        </span>
    );
}

function AvailabilityPill({ available }: { available: boolean }) {
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 96,
                padding: "8px 14px",
                borderRadius: 999,
                background: available ? "#e8f5ec" : "#f3f4f6",
                color: available ? "#2e9d5b" : "#6b7280",
                border: available ? "1px solid #b9dec6" : "1px solid #d1d5db",
                fontSize: 14,
                fontWeight: 700,
            }}
        >
            {available ? "Available" : "Unavailable"}
        </span>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 16,
                    }}
                >
                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: 28,
                                fontWeight: 800,
                                color: "#1f2937",
                            }}
                        >
                            Products
                        </h1>
                        <p
                            style={{
                                margin: "8px 0 0",
                                color: "#7f8792",
                                fontSize: 16,
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
                            padding: "14px 22px",
                            fontWeight: 700,
                            fontSize: 16,
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(46,157,91,0.18)",
                        }}
                    >
                        + Add Product
                    </button>
                </div>

                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            flex: 1,
                            minWidth: 280,
                            height: 52,
                            borderRadius: 12,
                            border: "1px solid #d9dee5",
                            padding: "0 16px",
                            fontSize: 16,
                            background: "#fff",
                            color: "#2d3340",
                            outline: "none",
                            boxSizing: "border-box",
                        }}
                    />

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{
                            width: 260,
                            height: 52,
                            borderRadius: 12,
                            border: "1px solid #d9dee5",
                            padding: "0 16px",
                            fontSize: 16,
                            background: "#fff",
                            color: "#2d3340",
                            outline: "none",
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
                        borderRadius: 18,
                        border: "1px solid #e6eaef",
                        overflow: "hidden",
                    }}
                >
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

                    {loading ? (
                        <div style={{ padding: 24, color: "#7f8792" }}>Loading...</div>
                    ) : error ? (
                        <div style={{ padding: 24, color: "#d14343" }}>{error}</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: 24, color: "#7f8792" }}>
                            No products found.
                        </div>
                    ) : (
                        filtered.map((product) => (
                            <div
                                key={product.id}
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
                        ))
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