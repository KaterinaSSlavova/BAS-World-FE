import { useEffect, useMemo, useState } from "react";
import { createProduct } from "../lib/api/products";
import { getAllProductDepots } from "../lib/api/productDepots";
import CreateProductModal, {
    type CreateProductFormData,
} from "../components/ui/create_product_modal";
import ProductDetailsModal from "../components/ui/product-details-modal";
import AppLayout from "../components/AppLayout";
import {
    StatusBadge,
    RuleTypeBadge,
    type Product,
} from "../data/mock_data_products";

type BackendProductDepot = {
    available: boolean;
    brand: string;
    category: string;
    depotName: string;
    description: string;
    price: number;
    productId: number;
    productName: string;
    sku: string;
    status: string;
    stockQuantity: number;
    type: string;
};

function mapBackendProductToFrontend(item: BackendProductDepot): Product {
    return {
        id: item.sku,
        name: item.productName,
        category: item.category,
        price: Number(item.price),
        stock: Number(item.stockQuantity),
        ruleType: "" as Product["ruleType"],
        status: item.status === "Active" ? "active" : "inactive",
        depots: [item.depotName],
    };
}

export default function Products() {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [products, setProducts] = useState<Product[]>([]);
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
        isAvailable: true,
    });

    // 🔹 LOAD PRODUCTS
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getAllProductDepots();
                const mapped = data.map(mapBackendProductToFrontend);

                setProducts(mapped);
            } catch (err) {
                console.error(err);
                setError("Failed to load products.");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    // 🔹 FORM CHANGE
    const handleProductFormChange = (
        field: keyof CreateProductFormData,
        value: string | number | boolean
    ) => {
        setNewProduct((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // 🔹 RESET FORM
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
            isAvailable: true,
        });
    };

    // 🔥 CREATE PRODUCT (CONNECTED TO BACKEND)
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
            isAvailable,
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
                isAvailable,
            };

            await createProduct(payload);

            // reload products
            const data = await getAllProductDepots();
            setProducts(data.map(mapBackendProductToFrontend));

            setShowCreateModal(false);
            resetForm();
        } catch (err) {
            console.error(err);
            alert("Failed to create product.");
        }
    };

    // 🔹 DETAILS
    const handleOpenDetails = (product: Product) => {
        setSelectedProduct(product);
        setShowDetailsModal(true);
    };

    const handleSaveEditedProduct = (updatedProduct: Product) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
    };

    // 🔹 FILTERS
    const categories = useMemo(
        () => [...new Set(products.map((p) => p.category))],
        [products]
    );

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.id.toLowerCase().includes(search.toLowerCase());

            const matchesCategory =
                categoryFilter === "all" || p.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, categoryFilter]);

    return (
        <AppLayout>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* HEADER */}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 700 }}>
                            Products
                        </h1>
                        <p style={{ color: "#7f8792" }}>
                            Manage cross-sell products
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        style={{
                            background: "#2e9d5b",
                            color: "#fff",
                            border: "none",
                            borderRadius: 10,
                            padding: "14px 22px",
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        + Add Product
                    </button>
                </div>

                {/* SEARCH + FILTER */}
                <div style={{ display: "flex", gap: 16 }}>
                    <input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ padding: 12, borderRadius: 8 }}
                    />

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        {categories.map((c) => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* TABLE */}
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : (
                    filtered.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleOpenDetails(product)}
                            style={{
                                padding: 16,
                                borderBottom: "1px solid #eee",
                                cursor: "pointer",
                            }}
                        >
                            {product.name} — €{product.price}
                        </div>
                    ))
                )}
            </div>

            {/* MODALS */}
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
            />
        </AppLayout>
    );
}