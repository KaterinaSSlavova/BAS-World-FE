import { useState } from "react";
import AppLayout from "../components/AppLayout";
import DepotCard from "../components/depots/DepotCard";
import DepotPanel from "../components/depots/DepotPanel";

// --- Mock data matching your real domain model ---
// Replace with your actual API calls / props

const DEPOTS = [
    {
        id: 1,
        depotName: "Eindhoven Central",
        location: "Eindhoven",
        archived: false,
        flag: "🇳🇱",
        color: "linear-gradient(90deg,#ae1c28,#fff,#21468b)",
    },
    {
        id: 2,
        depotName: "Berlin Hub",
        location: "Berlin",
        archived: false,
        flag: "🇩🇪",
        color: "linear-gradient(90deg,#000,#dd0000,#ffce00)",
    },
    {
        id: 3,
        depotName: "Paris South",
        location: "Paris",
        archived: false,
        flag: "🇫🇷",
        color: "linear-gradient(90deg,#0055a4,#fff,#ef4135)",
    },
    {
        id: 4,
        depotName: "Madrid Logistics",
        location: "Madrid",
        archived: false,
        flag: "🇪🇸",
        color: "linear-gradient(90deg,#aa151b,#f1bf00)",
    },
];

// ProductDepot entries keyed by depot id
// Each entry matches: { product, depot, isAvailable, stockQuantity }
const PRODUCT_DEPOTS = {
    1: [
        { product: { id: 1, name: "Hydraulic pump A4" },   isAvailable: true,  stockQuantity: 480 },
        { product: { id: 2, name: "Control valve V2" },     isAvailable: true,  stockQuantity: 360 },
        { product: { id: 3, name: "Filter housing FH7" },   isAvailable: true,  stockQuantity: 600 },
        { product: { id: 4, name: "Pressure sensor P9" },   isAvailable: false, stockQuantity: 0   },
        { product: { id: 5, name: "Mounting bracket MB3" }, isAvailable: true,  stockQuantity: 270 },
        { product: { id: 6, name: "Seal kit SK12" },        isAvailable: false, stockQuantity: 0   },
        { product: { id: 7, name: "Flow meter FM5" },       isAvailable: true,  stockQuantity: 210 },
    ],
    2: [
        { product: { id: 1, name: "Hydraulic pump A4" },   isAvailable: true, stockQuantity: 1200 },
        { product: { id: 3, name: "Filter housing FH7" },   isAvailable: true, stockQuantity: 840  },
    ],
    3: [
        { product: { id: 2, name: "Control valve V2" },     isAvailable: false, stockQuantity: 0  },
        { product: { id: 5, name: "Mounting bracket MB3" }, isAvailable: true,  stockQuantity: 95 },
    ],
    4: [
        { product: { id: 7, name: "Flow meter FM5" },       isAvailable: true,  stockQuantity: 40 },
        { product: { id: 4, name: "Pressure sensor P9" },   isAvailable: false, stockQuantity: 0  },
    ],
};

export default function Depots() {
    const [activeDepotId, setActiveDepotId] = useState(null);

    const activeDepot = DEPOTS.find((d) => d.id === activeDepotId) ?? null;
    const activeProductDepots = activeDepotId ? (PRODUCT_DEPOTS[activeDepotId] ?? []) : [];

    const handleCardClick = (depotId) => {
        setActiveDepotId((prev) => (prev === depotId ? null : depotId));
    };

    const handleEdit = (depot) => {
        console.log("edit depot", depot);
    };

    const handleArchive = (depot) => {
        console.log("archive depot", depot);
    };

    return (
        <AppLayout>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
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
                            Depots
                        </h1>
                        <p
                            style={{
                                margin: "8px 0 0",
                                color: "#7f8792",
                                fontSize: 16,
                            }}
                        >
                            Manage depot locations and storage hubs
                        </p>
                    </div>

                    <button
                        onClick={() => console.log("open create depot")}
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
                        + Add Depot
                    </button>
                </div>

                {/* Depot Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                        gap: 18,
                    }}
                >
                    {DEPOTS.map((depot) => (
                        <DepotCard
                            key={depot.id}
                            depot={depot}
                            productDepots={PRODUCT_DEPOTS[depot.id] ?? []}
                            active={activeDepotId === depot.id}
                            onClick={() => handleCardClick(depot.id)}
                        />
                    ))}
                </div>

                {/* Detail panel — slides in below grid when a depot is selected */}
                {activeDepot && (
                    <DepotPanel
                        depot={activeDepot}
                        productDepots={activeProductDepots}
                        onEdit={handleEdit}
                        onArchive={handleArchive}
                        onClose={() => setActiveDepotId(null)}
                    />
                )}

            </div>
        </AppLayout>
    );
}