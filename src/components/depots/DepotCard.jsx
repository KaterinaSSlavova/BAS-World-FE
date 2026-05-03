const availabilityColor = (ratio) => {
    if (ratio >= 0.75) return "#2e9d5b";
    if (ratio >= 0.4) return "#e67e22";
    return "#dc2626";
};

const formatStock = (n) => {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return String(n);
};

export default function DepotCard({ depot, productDepots = [], active, onClick }) {
    const total = productDepots.length;
    const available = productDepots.filter((pd) => pd.isAvailable).length;
    const totalStock = productDepots.reduce((sum, pd) => sum + pd.stockQuantity, 0);
    const ratio = total > 0 ? available / total : 0;
    const pct = Math.round(ratio * 100);
    const barColor = availabilityColor(ratio);

    return (
        <div
            onClick={onClick}
            style={{
                background: "#fff",
                border: active ? "1.5px solid #2e9d5b" : "0.5px solid #e6eaef",
                borderRadius: 18,
                overflow: "hidden",
                cursor: "pointer",
                transition: "border-color .15s",
            }}
        >
            {/* Country strip */}
            <div style={{ height: 4, background: depot.color }} />

            <div style={{ padding: 14 }}>
                <span style={{ fontSize: 18 }}>{depot.flag}</span>

                <div
                    style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#273142",
                        marginTop: 6,
                    }}
                >
                    {depot.depotName}
                </div>

                <div style={{ fontSize: 12, color: "#7b8494", marginTop: 2 }}>
                    {depot.location}
                </div>

                {/* Stats row */}
                <div
                    style={{
                        display: "flex",
                        gap: 10,
                        marginTop: 12,
                    }}
                >
                    <MiniStat label="Products" value={total} />
                    <MiniStat label="Available" value={available} />
                    <MiniStat label="Total stock" value={formatStock(totalStock)} />
                </div>

                {/* Availability bar */}
                <div style={{ marginTop: 10 }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 10,
                            color: "#9ca3af",
                            marginBottom: 4,
                        }}
                    >
                        <span>Availability</span>
                        <span>{pct}%</span>
                    </div>
                    <div
                        style={{
                            height: 4,
                            background: "#f3f4f6",
                            borderRadius: 2,
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: `${pct}%`,
                                height: "100%",
                                background: barColor,
                                borderRadius: 2,
                                transition: "width .3s ease",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MiniStat({ label, value }) {
    return (
        <div style={{ flex: 1 }}>
            <div
                style={{
                    fontSize: 10,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: ".4px",
                }}
            >
                {label}
            </div>
            <div
                style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#273142",
                    marginTop: 2,
                }}
            >
                {value}
            </div>
        </div>
    );
}