import { useState } from "react";

export default function DepotCard({ depot, onEdit, onArchive }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            style={{
                background: "#fff",
                border: "1px solid #e6eaef",
                borderRadius: 18,
                overflow: "hidden",
                transition: "all .2s ease",
                boxShadow: expanded
                    ? "0 8px 24px rgba(15,23,42,.06)"
                    : "0 2px 8px rgba(15,23,42,.03)",
            }}
        >
            {/* Country strip */}
            <div
                style={{
                    height: 6,
                    background: depot.color,
                }}
            />

            <div
                onClick={() => setExpanded(!expanded)}
                style={{
                    padding: 20,
                    cursor: "pointer",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >
                            <span style={{ fontSize: 22 }}>
                                {depot.flag}
                            </span>

                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: 17,
                                    fontWeight: 700,
                                    color: "#273142",
                                }}
                            >
                                {depot.name}
                            </h3>
                        </div>

                        <p
                            style={{
                                margin: "6px 0 0",
                                color: "#7b8494",
                                fontSize: 14,
                            }}
                        >
                            {depot.city}, {depot.country}
                        </p>
                    </div>

                    <span
                        style={{
                            fontSize: 18,
                            color: "#9ca3af",
                        }}
                    >
                        {expanded ? "−" : "+"}
                    </span>
                </div>
            </div>

            {expanded && (
                <div
                    style={{
                        borderTop: "1px solid #f3f4f6",
                        padding: 20,
                        background: "#fafbfc",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3,1fr)",
                            gap: 16,
                            marginBottom: 18,
                        }}
                    >
                        <MiniStat label="Items" value="12,480" />
                        <MiniStat label="Active" value="8,203" />
                        <MiniStat label="Archived" value="4,277" />
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                        <button
                            onClick={() => onEdit(depot)}
                            style={actionButton}
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => onArchive(depot)}
                            style={{
                                ...actionButton,
                                background: "#fff5f5",
                                color: "#dc2626",
                            }}
                        >
                            Archive
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function MiniStat({ label, value }) {
    return (
        <div>
            <div
                style={{
                    fontSize: 12,
                    color: "#7b8494",
                    marginBottom: 4,
                }}
            >
                {label}
            </div>

            <div
                style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#273142",
                }}
            >
                {value}
            </div>
        </div>
    );
}

const actionButton = {
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    background: "#eefaf2",
    color: "#2e9d5b",
    fontWeight: 600,
    cursor: "pointer",
};