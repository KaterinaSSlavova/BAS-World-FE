export default function DepotCard({ depot, active, onClick }) {
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
            <div style={{ padding: 18 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#273142" }}>
                    {depot.depotName}
                </div>

                <div style={{ fontSize: 13, color: "#7b8494", marginTop: 3 }}>
                    {depot.location}
                </div>

                <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 26, fontWeight: 700, color: "#273142" }}>
                        {depot.numberOfProducts}
                    </span>
                    <span style={{ fontSize: 13, color: "#9ca3af" }}>
                        product{depot.numberOfProducts !== 1 ? "s" : ""}
                    </span>
                </div>
            </div>
        </div>
    );
}