export default function StatCard({ label, value, sub, subColor }) {
    return (
        <div style={{
            background: "#fff",
            border: "1px solid #e8ede8",
            borderRadius: 12,
            padding: "20px 24px",
            flex: 1,
            minWidth: 180,
        }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: "#888", marginBottom: 12 }}>{label}</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "#1a1a1a", lineHeight: 1 }}>{value}</div>
            {sub && <div style={{ fontSize: 13, color: subColor || "#4caf50", marginTop: 6, fontWeight: 500 }}>{sub}</div>}
        </div>
    );
}