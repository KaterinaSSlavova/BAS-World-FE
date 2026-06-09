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

const BRAND = "#17a84a";
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";
const BORDER = "0.5px solid #e0ebe0";

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
            try { setTypes(await getAllTypes()); } catch { setTypesError("Failed to load types."); } finally { setTypesLoading(false); }
            setCategoriesLoading(true);
            try { setCategories(await getAllCategories()); } catch { setCategoriesError("Failed to load categories."); } finally { setCategoriesLoading(false); }
            setBrandsLoading(true);
            try { setBrands(await getAllBrands()); } catch { setBrandsError("Failed to load brands."); } finally { setBrandsLoading(false); }
            setSuppliersLoading(true);
            try { setSuppliers(await getAllSuppliers()); } catch { setSuppliersError("Failed to load suppliers."); } finally { setSuppliersLoading(false); }
            setVehicleTypesLoading(true);
            try { setVehicleTypes(await getAllVehicleTypes()); } catch { setVehicleTypesError("Failed to load vehicle types."); } finally { setVehicleTypesLoading(false); }
        };
        void loadAll();
    }, []);

    const reloadAll = async () => {
        const [t, c, b, s, v] = await Promise.all([getAllTypes(), getAllCategories(), getAllBrands(), getAllSuppliers(), getAllVehicleTypes()]);
        setTypes(t); setCategories(c); setBrands(b); setSuppliers(s); setVehicleTypes(v);
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
            <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: FONT, textAlign: "left" }}>

                {/* Header */}
                <div>
                    <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.5px" }}>Configuration</h1>
                    <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>Manage types, categories and brands</p>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 2, background: "#f0f4f0", borderRadius: 10, padding: 4, width: "fit-content" }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => { setActiveTab(tab.key); setSearch(""); }}
                            style={{
                                padding: "8px 16px", borderRadius: 8, border: "none",
                                background: activeTab === tab.key ? "#fff" : "transparent",
                                fontSize: 13, fontWeight: 600,
                                color: activeTab === tab.key ? "#1a1a1a" : "#888",
                                cursor: "pointer",
                                boxShadow: activeTab === tab.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                                display: "flex", alignItems: "center",
                                fontFamily: FONT,
                                transition: "all 0.15s",
                            }}
                        >
                            {tab.label}
                            <CountPill count={tab.count} />
                        </button>
                    ))}
                </div>

                {activeTab === "types" && <ConfigurationTypes types={types} loading={typesLoading} error={typesError} search={search} onSearchChange={setSearch} showArchived={showArchivedTypes} onToggleArchived={() => setShowArchivedTypes((v) => !v)} onReload={reloadAll} />}
                {activeTab === "categories" && <ConfigurationCategories categories={categories} loading={categoriesLoading} error={categoriesError} search={search} onSearchChange={setSearch} showArchived={showArchivedCategories} onToggleArchived={() => setShowArchivedCategories((v) => !v)} onReload={reloadAll} />}
                {activeTab === "brands" && <ConfigurationBrands brands={brands} loading={brandsLoading} error={brandsError} search={search} onSearchChange={setSearch} showArchived={showArchivedBrands} onToggleArchived={() => setShowArchivedBrands((v) => !v)} onReload={reloadAll} />}
                {activeTab === "suppliers" && <ConfigurationSuppliers suppliers={suppliers} loading={suppliersLoading} error={suppliersError} search={search} onSearchChange={setSearch} showArchived={showArchivedSuppliers} onToggleArchived={() => setShowArchivedSuppliers((v) => !v)} onReload={reloadAll} />}
                {activeTab === "vehicleTypes" && <ConfigurationVehicleTypes vehicleTypes={vehicleTypes} loading={vehicleTypesLoading} error={vehicleTypesError} search={search} onSearchChange={setSearch} showArchived={showArchivedVehicleTypes} onToggleArchived={() => setShowArchivedVehicleTypes((v) => !v)} onReload={reloadAll} />}
            </div>
        </AppLayout>
    );
}