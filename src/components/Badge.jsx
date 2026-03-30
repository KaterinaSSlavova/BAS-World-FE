const typeColors = {
    "Opt-in": { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
    "Opt-out": { bg: "#fff8e1", color: "#e65100", border: "#ffcc80" },
    "Mandatory": { bg: "#fce4ec", color: "#c62828", border: "#f48fb1" },
};

const statusColors = {
    "Active": { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
    "Low Stock": { bg: "#fff3e0", color: "#e65100", border: "#ffcc80" },
    "Operational": { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
    "Setting Up": { bg: "#e3f2fd", color: "#1565c0", border: "#90caf9" },
};

export default function Badge({ label, type = "status" }) {
    const map = type === "type" ? typeColors : statusColors;
    const style = map[label] || { bg: "#f5f5f5", color: "#555", border: "#ddd" };
    return (
        <span style={{
            background: style.bg,
            color: style.color,
            border: `1px solid ${style.border}`,
            borderRadius: 20,
            padding: "3px 12px",
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
        }}>{label}</span>
    );
}