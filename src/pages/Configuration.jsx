import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { getAllBrands } from "../lib/api/brands";
import { getAllCategories } from "../lib/api/categories";
import { getAllTypes } from "../lib/api/types";
import { CountPill } from "./ConfigurationShared.jsx";
import ConfigurationTypes from "./ConfigurationTypes.jsx";
import ConfigurationCategories from "./ConfigurationCategories.jsx";
import ConfigurationBrands from "./ConfigurationBrands.jsx";
import ConfigurationSuppliers from "./ConfigurationSuppliers.jsx";
import ConfigurationVehicleTypes from "./ConfigurationVehicleTypes.jsx";
import { getAllSuppliers } from "../lib/api/suppliers.ts";
import { getAllVehicleTypes } from "../lib/api/vehicleTypes.ts";

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

    const [suppliers, setSuppliers] = useState([]);
    const [suppliersLoading, setSuppliersLoading] = useState(false);
    const [suppliersError, setSuppliersError] = useState("");
    const [showArchivedSuppliers, setShowArchivedSuppliers] = useState(false);

    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [vehicleTypesLoading, setVehicleTypesLoading] = useState(false);
    const [vehicleTypesError, setVehicleTypesError] = useState("");
    const [showArchivedVehicleTypes, setShowArchivedVehicleTypes] = useState(false);

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

            setSuppliersLoading(true);
            try { setSuppliers(await getAllSuppliers()); }
            catch { setSuppliersError("Failed to load suppliers."); }
            finally { setSuppliersLoading(false); }

            setVehicleTypesLoading(true);
            try { setVehicleTypes(await getAllVehicleTypes()); }
            catch { setVehicleTypesError("Failed to load vehicle types."); }
            finally { setVehicleTypesLoading(false); }
        };
        void loadAll();
    }, []);

    const reloadAll = async () => {
        const [t, c, b, s, v] = await Promise.all([getAllTypes(), getAllCategories(), getAllBrands(), getAllSuppliers(), getAllVehicleTypes()]);
        setTypes(t);
        setCategories(c);
        setBrands(b);
        setSuppliers(s);
        setVehicleTypes(v);
    };

    const tabs = [
        { key: "types", label: "Types", count: types.filter((t) => !t.archived).length },
        { key: "categories", label: "Categories", count: categories.filter((c) => !c.archived).length },
        { key: "brands", label: "Brands", count: brands.filter((b) => !b.archived).length },
        { key: "suppliers", label: "Suppliers", count: suppliers.filter((s) => !s.archived).length },
        { key: "vehicleTypes", label: "Vehicle Types", count: vehicleTypes.filter((v) => !v.archived).length },
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
                {activeTab === "suppliers" && (
                    <ConfigurationSuppliers
                        suppliers={suppliers} loading={suppliersLoading} error={suppliersError}
                        search={search} onSearchChange={setSearch}
                        showArchived={showArchivedSuppliers}
                        onToggleArchived={() => setShowArchivedSuppliers((v) => !v)}
                        onReload={reloadAll}
                    />
                )}
                {activeTab === "vehicleTypes" && (
                    <ConfigurationVehicleTypes
                        vehicleTypes={vehicleTypes} loading={vehicleTypesLoading} error={vehicleTypesError}
                        search={search} onSearchChange={setSearch}
                        showArchived={showArchivedVehicleTypes}
                        onToggleArchived={() => setShowArchivedVehicleTypes((v) => !v)}
                        onReload={reloadAll}
                    />
                )}
            </div>
        </AppLayout>
    );
}