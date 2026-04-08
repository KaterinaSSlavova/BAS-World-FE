import { useState } from "react";
import CreateProductModal from "../components/ui/create_product_modal";
import AppLayout from "../components/AppLayout";
import {
    mockProducts,
    StatusBadge,
    RuleTypeBadge,
    type Product,
} from "../data/mock_data_products";

export default function Products() {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const categories: string[] = [...new Set(mockProducts.map((p: Product) => p.category))];

    const filtered: Product[] = mockProducts.filter((p: Product) => {
        const matchesSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.id.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
            categoryFilter === "all" || p.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    return (
        <AppLayout>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 16,
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        <h1
                            style={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: "#1a1a1a",
                                margin: 0,
                            }}
                        >
                            Products
                        </h1>
                        <p
                            style={{
                                color: "#7f8792",
                                margin: "6px 0 0",
                                fontSize: 14,
                            }}
                        >
                            Manage cross-sell products and services
                        </p>
                    </div>

                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            background: "#2e9d5b",
                            color: "#fff",
                            border: "none",
                            borderRadius: 10,
                            padding: "14px 22px",
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: "pointer",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                        }}
                    >
                        <span style={{ fontSize: 20, lineHeight: 1 }}>+</span>
                        Add Product
                    </button>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: 16,
                        flexWrap: "wrap",
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            minWidth: 320,
                            maxWidth: 560,
                            height: 56,
                            background: "#fff",
                            border: "1px solid #dfe5df",
                            borderRadius: 12,
                            display: "flex",
                            alignItems: "center",
                            padding: "0 16px",
                            boxSizing: "border-box",
                        }}
                    >
                        <span
                            style={{
                                color: "#7d8590",
                                fontSize: 18,
                                marginRight: 12,
                            }}
                        >
                            🔍
                        </span>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: "100%",
                                border: "none",
                                outline: "none",
                                background: "transparent",
                                fontSize: 15,
                                color: "#2d3340",
                                fontFamily: "inherit",
                            }}
                        />
                    </div>

                    <div
                        style={{
                            width: 260,
                            height: 56,
                            background: "#fff",
                            border: "1px solid #dfe5df",
                            borderRadius: 12,
                            display: "flex",
                            alignItems: "center",
                            padding: "0 16px",
                            boxSizing: "border-box",
                            gap: 12,
                        }}
                    >
                        <span
                            style={{
                                color: "#7d8590",
                                fontSize: 18,
                            }}
                        >
                            ▽
                        </span>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={{
                                width: "100%",
                                border: "none",
                                outline: "none",
                                background: "transparent",
                                fontSize: 15,
                                color: "#2d3340",
                                fontFamily: "inherit",
                                cursor: "pointer",
                            }}
                        >
                            <option value="all">All Categories</option>
                            {categories.map((category: string) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #e5ebe5",
                        borderRadius: 14,
                        overflow: "hidden",
                        boxShadow: "0 1px 2px rgba(16,24,40,0.02)",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 2.6fr 1.5fr 1fr 0.8fr 1.3fr 1.2fr 1.6fr",
                            padding: "22px 22px 20px",
                            borderBottom: "1px solid #edf1ed",
                            color: "#7e8794",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "1.2px",
                            textTransform: "uppercase",
                        }}
                    >
                        <div>ID</div>
                        <div>Product</div>
                        <div>Category</div>
                        <div>Price</div>
                        <div>Stock</div>
                        <div>Rule Type</div>
                        <div>Status</div>
                        <div>Depots</div>
                    </div>

                    {filtered.length === 0 ? (
                        <div
                            style={{
                                padding: "40px 24px",
                                textAlign: "center",
                                color: "#7f8792",
                                fontSize: 15,
                            }}
                        >
                            No products match your filters.
                        </div>
                    ) : (
                        filtered.map((product: Product) => (
                            <div
                                key={product.id}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 2.6fr 1.5fr 1fr 0.8fr 1.3fr 1.2fr 1.6fr",
                                    padding: "24px 22px",
                                    borderBottom: "1px solid #edf1ed",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        color: "#8b93a1",
                                        fontSize: 13,
                                        lineHeight: 1.5,
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {product.id}
                                </div>

                                <div
                                    style={{
                                        color: "#202632",
                                        fontSize: 17,
                                        fontWeight: 700,
                                        lineHeight: 1.45,
                                        paddingRight: 16,
                                    }}
                                >
                                    {product.name}
                                </div>

                                <div
                                    style={{
                                        color: "#7d8590",
                                        fontSize: 16,
                                        paddingRight: 10,
                                    }}
                                >
                                    {product.category}
                                </div>

                                <div
                                    style={{
                                        color: "#2d3340",
                                        fontSize: 16,
                                        fontWeight: 500,
                                    }}
                                >
                                    €{product.price.toLocaleString()}
                                </div>

                                <div
                                    style={{
                                        color: "#2d3340",
                                        fontSize: 16,
                                    }}
                                >
                                    {product.stock === 999 ? "∞" : product.stock}
                                </div>

                                <div>
                                    <RuleTypeBadge type={product.ruleType} />
                                </div>

                                <div>
                                    <StatusBadge status={product.status} />
                                </div>

                                <div
                                    style={{
                                        color: "#7d8590",
                                        fontSize: 15,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {product.depots.join(", ")}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}