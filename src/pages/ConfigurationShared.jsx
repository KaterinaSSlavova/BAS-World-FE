// ─── Shared Components ────────────────────────────────────────

export function CountPill({ count }) {
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            minWidth: 28, padding: "4px 10px", borderRadius: 999,
            background: "#e8f5ec", color: "#2e9d5b", border: "1px solid #b9dec6",
            fontSize: 13, fontWeight: 700, marginLeft: 8,
        }}>
            {count}
        </span>
    );
}

export function ConfirmArchiveModal({ open, item, entityLabel, onConfirm, onClose }) {
    if (!open) return null;
    const isArchived = item?.archived;

    return (
        <div
            style={{
                position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)",
                zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "#fff", borderRadius: 18, padding: "32px 28px",
                    width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 800, color: "#1f2937" }}>
                    {isArchived ? "Unarchive" : "Archive"} "{item?.name}"?
                </h2>
                <p style={{ margin: "0 0 28px", color: "#7f8792", fontSize: 15 }}>
                    {isArchived
                        ? `This ${entityLabel.toLowerCase()} will become active again.`
                        : `This ${entityLabel.toLowerCase()} will be hidden from active use.`}
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <button onClick={onClose} style={{
                        padding: "11px 22px", borderRadius: 10, border: "1px solid #d9dee5",
                        background: "#fff", fontSize: 15, fontWeight: 700, color: "#374151", cursor: "pointer",
                    }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} style={{
                        padding: "11px 22px", borderRadius: 10, border: "none",
                        background: isArchived ? "#2e9d5b" : "#f59e0b",
                        fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer",
                    }}>
                        {isArchived ? "Unarchive" : "Archive"}
                    </button>
                </div>
            </div>
        </div>
    );
}