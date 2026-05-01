import ProgressBar from "./ProgressBar";

export default function DepotStats({ depot }) {
    const usage = Math.round((depot.used / depot.capacity) * 100);

    return (
        <div
            style={{
                background: "#fff",
                border: "1px solid #e6eaef",
                borderRadius: 20,
                padding: 28,
            }}
        >
            <h2>
                {depot.flag} {depot.name}
            </h2>

            <p style={{ color: "#7b8494" }}>
                Operational insights
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 20,
                    marginTop: 24,
                }}
            >
                <Stat label="Capacity" value={depot.capacity} />
                <Stat label="Used" value={depot.used} />
                <Stat label="Status" value={depot.status} />
            </div>

            <div style={{ marginTop: 24 }}>
                <ProgressBar value={usage} />
            </div>
        </div>
    );
}

function Stat({ label, value }) {
    return (
        <div>
            <p style={{ color: "#7b8494" }}>{label}</p>
            <h3>{value}</h3>
        </div>
    );
}
