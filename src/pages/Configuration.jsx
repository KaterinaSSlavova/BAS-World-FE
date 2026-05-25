import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { getAllBrands } from "../lib/api/brands";
import { getAllCategories } from "../lib/api/categories";
import { getAllTypes } from "../lib/api/types";
import { CountPill } from "./Configurationshared.jsx";
import ConfigurationTypes from "./Configurationtypes.jsx";
import ConfigurationCategories from "./Configurationcategories.jsx";
import ConfigurationBrands from "./Configurationbrands.jsx";

export default function Configuration() {
    const [activeTab, setActiveTab] = useState("types");
    const [search, setSearch] = useState("");

    const [types, setTypes] = useState([]);
    const [typesLoading, setTypesLoading] = useState(false);
    const [typesError, setTypesError] = useState("");
    const [showArchivedTypes, setShowArchivedTypes] = useState(false);

    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categoriesError, setCategoriesError] = useState("");
    const [showArchivedCategories, setShowArchivedCategories] = useState(false);

    const [brands, setBrands] = useState([]);
    const [brandsLoading, setBrandsLoading] = useState(false);
    const [brandsError, setBrandsError] = useState("");
    const [showArchivedBrands, setShowArchivedBrands] = useState(false);

    useEffect(() => {
        const loadAll = async () => {
            setTypesLoading(true);
            try { setTypes(await getAllTypes()); }
            catch { setTypesError("Failed to load types."); }
            finally { setTypesLoading(false); }

            setCategoriesLoading(true);
            try { setCategories(await getAllCategories()); }
            catch { setCategoriesError("Failed to load categories."); }
            finally { setCategoriesLoading(false); }

            setBrandsLoading(true);
            try { setBrands(await getAllBrands()); }
            catch { setBrandsError("Failed to load brands."); }
            finally { setBrandsLoading(false); }
        };
        void loadAll();
    }, []);

    const reloadAll = async () => {
        const [t, c, b] = await Promise.all([getAllTypes(), getAllCategories(), getAllBrands()]);
        setTypes(t);
        setCategories(c);
        setBrands(b);
    };

    const tabs = [
        { key: "types", label: "Types", count: types.filter((t) => !t.is_archived).length },
        { key: "categories", label: "Categories", count: categories.filter((c) => !c.is_archived).length },
        { key: "brands", label: "Brands", count: brands.filter((b) => !b.is_archived).length },
    ];

    return (
        <AppLayout>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Header */}
                <div>
                    <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#1f2937", lineHeight: 1.15 }}>
                        Configuration
                    </h1>
                    <p style={{ margin: "8px 0 0", color: "#7f8792", fontSize: 16, lineHeight: 1.5 }}>
                        Manage types, categories and brands
                    </p>
                </div>

                {/* Tabs */}
                <div style={{
                    display: "flex", gap: 4, background: "#f1f3f6",
                    borderRadius: 12, padding: 4, width: "fit-content",
                }}>
                    {tabs.map((tab) => (
                        <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSearch(""); }} style={{
                            padding: "10px 20px", borderRadius: 9, border: "none",
                            background: activeTab === tab.key ? "#fff" : "transparent",
                            fontSize: 15, fontWeight: 700,
                            color: activeTab === tab.key ? "#273142" : "#7b8494",
                            cursor: "pointer",
                            boxShadow: activeTab === tab.key ? "0 2px 8px rgba(15,23,42,0.08)" : "none",
                            display: "flex", alignItems: "center",
                        }}>
                            {tab.label}
                            <CountPill count={tab.count} />
                        </button>
                    ))}
                </div>

                {/* Search + filters row — tab components render their buttons here via props */}
                {activeTab === "types" && (
                    <ConfigurationTypes
                        types={types} loading={typesLoading} error={typesError}
                        search={search} onSearchChange={setSearch}
                        showArchived={showArchivedTypes}
                        onToggleArchived={() => setShowArchivedTypes((v) => !v)}
                        onReload={reloadAll}
                    />
                )}
                {activeTab === "categories" && (
                    <ConfigurationCategories
                        categories={categories} loading={categoriesLoading} error={categoriesError}
                        search={search} onSearchChange={setSearch}
                        showArchived={showArchivedCategories}
                        onToggleArchived={() => setShowArchivedCategories((v) => !v)}
                        onReload={reloadAll}
                    />
                )}
                {activeTab === "brands" && (
                    <ConfigurationBrands
                        brands={brands} loading={brandsLoading} error={brandsError}
                        search={search} onSearchChange={setSearch}
                        showArchived={showArchivedBrands}
                        onToggleArchived={() => setShowArchivedBrands((v) => !v)}
                        onReload={reloadAll}
                    />
                )}
            </div>
        </AppLayout>
    );
}