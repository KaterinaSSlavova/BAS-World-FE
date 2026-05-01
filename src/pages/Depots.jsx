import { useState } from "react";
import AppLayout from "../components/AppLayout";
import DepotCard from "../components/depots/DepotCard";

const DEPOTS = [
    {
        id: 1,
        name: "Eindhoven Central",
        city: "Eindhoven",
        country: "Netherlands",
        flag: "🇳🇱",
        color: "linear-gradient(90deg,#ae1c28,#fff,#21468b)",
    },
    {
        id: 2,
        name: "Berlin Hub",
        city: "Berlin",
        country: "Germany",
        flag: "🇩🇪",
        color: "linear-gradient(90deg,#000,#dd0000,#ffce00)",
    },
    {
        id: 3,
        name: "Paris South",
        city: "Paris",
        country: "France",
        flag: "🇫🇷",
        color: "linear-gradient(90deg,#0055a4,#fff,#ef4135)",
    },
    {
        id: 4,
        name: "Madrid Logistics",
        city: "Madrid",
        country: "Spain",
        flag: "🇪🇸",
        color: "linear-gradient(90deg,#aa151b,#f1bf00)",
    },
];

export default function Depots() {
    const [expandedDepot, setExpandedDepot] = useState(null);

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
                            boxShadow:
                                "0 4px 12px rgba(46,157,91,0.18)",
                        }}
                    >
                        + Add Depot
                    </button>
                </div>

                {/* Depot Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: 18,
                    }}
                >
                    {DEPOTS.map((depot) => (
                        <DepotCard
                            key={depot.id}
                            depot={depot}
                            expanded={expandedDepot === depot.id}
                            onToggle={() =>
                                setExpandedDepot(
                                    expandedDepot === depot.id
                                        ? null
                                        : depot.id
                                )
                            }
                            onEdit={handleEdit}
                            onArchive={handleArchive}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}