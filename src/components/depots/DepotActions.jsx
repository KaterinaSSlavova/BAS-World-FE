import { Button } from "../ui/button";

export default function DepotActions() {
    return (
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
                display: "flex",
                alignItems: "center",
                gap: 8,
            }}
        >
            + Add Depot
        </button>
    );
}