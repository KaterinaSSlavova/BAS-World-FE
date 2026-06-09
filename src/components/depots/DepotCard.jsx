const BRAND = "#17a84a";
const BRAND_LIGHT = "#e6f7ed";
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

export default function DepotCard({ depot, active, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                background: active ? BRAND_LIGHT : "#fff",
                border: active ? `1.5px solid ${BRAND}` : "0.5px solid #e0ebe0",
                borderRadius: 12,
                padding: "18px 20px",
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: FONT,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: active ? "#fff" : BRAND_LIGHT,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                    <i className="ti ti-building-warehouse" style={{ fontSize: 18, color: BRAND }} aria-hidden="true" />
                </div>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{depot.depotName}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>{depot.location}</div>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: active ? BRAND : "#1a1a1a" }}>
                    {depot.numberOfProducts}
                </span>
                <span style={{ fontSize: 12, color: "#aaa" }}>
                    product{depot.numberOfProducts !== 1 ? "s" : ""}
                </span>
            </div>
        </div>
    );
}