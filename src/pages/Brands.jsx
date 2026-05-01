import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";
import BrandCard from "../components/BrandCard";
import { getAllBrands } from "../lib/api/brands";

export default function Brands() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [showArchived, setShowArchived] = useState(false);

    useEffect(() => {
        const loadBrands = async () => {
            try {
                setLoading(true);
                const data = await getAllBrands();
                setBrands(data);

                // placeholder until API is wired up:
                setBrands([
                    { id: 1, name: "Michelin",    picture: null, archived: false },
                    { id: 2, name: "Bridgestone", picture: null, archived: false },
                    { id: 3, name: "Pirelli",     picture: null, archived: true  },
                ]);
            } catch (err) {
                console.error(err);
                setError("Failed to load brands.");
            } finally {
                setLoading(false);
            }
        };
        void loadBrands();
    }, []);

    const handleEdit = (brand) => {
        // TODO: open edit modal
        console.log("edit", brand);
    };

    const handleArchive = async (id, currentlyArchived) => {
        try {
            // await archiveBrand(id);
            setBrands((prev) =>
                prev.map((b) => b.id === id ? { ...b, archived: !currentlyArchived } : b)
            );
        } catch (err) {
            console.error(err);
            alert("Failed to update brand.");
        }
    };

    const filtered = useMemo(() => {
        return brands.filter((b) => {
            const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
            const matchesArchived = showArchived ? true : !b.archived;
            return matchesSearch && matchesArchived;
        });
    }, [brands, search, showArchived]);

    return (
        <AppLayout>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#1f2937" }}>Brands</h1>
                        <p style={{ margin: "8px 0 0", color: "#7f8792", fontSize: 16 }}>
                            Manage brands and their visuals
                        </p>
                    </div>
                    <button style={{
                        background: "#2e9d5b", color: "#fff", border: "none",
                        borderRadius: 12, padding: "14px 22px", fontWeight: 700,
                        fontSize: 16, cursor: "pointer", boxShadow: "0 4px 12px rgba(46,157,91,0.18)",
                    }}>
                        + Add Brand
                    </button>
                </div>

                {/* Filters */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div style={{
                        display: "flex", alignItems: "center", height: 50,
                        borderRadius: 12, border: "1px solid #d9dee5",
                        padding: "0 16px", background: "#fff",
                    }}>
                        <input
                            placeholder="Search brands..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ border: "none", outline: "none", fontSize: 15, background: "transparent", color: "#2d3340" }}
                        />
                    </div>

                    <button
                        onClick={() => setShowArchived((v) => !v)}
                        style={{
                            height: 50, borderRadius: 12, padding: "0 18px",
                            border: showArchived ? "1px solid #2e9d5b" : "1px solid #d9dee5",
                            background: showArchived ? "#f0faf4" : "#fff",
                            color: showArchived ? "#2e9d5b" : "#273142",
                            fontWeight: 600, fontSize: 14, cursor: "pointer",
                        }}
                    >
                        {showArchived ? "✓ Showing Archived" : "Show Archived"}
                    </button>
                </div>

                {/* Grid */}
                {loading ? (
                    <div style={{ color: "#7f8792" }}>Loading...</div>
                ) : error ? (
                    <div style={{ color: "#d14343" }}>{error}</div>
                ) : filtered.length === 0 ? (
                    <div style={{ color: "#7f8792" }}>No brands found.</div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: 16,
                    }}>
                        {filtered.map((brand) => (
                            <BrandCard
                                key={brand.id}
                                brand={brand}
                                onEdit={handleEdit}
                                onArchive={handleArchive}
                            />
                        ))}
                    </div>
                )}

            </div>
        </AppLayout>
    );
}