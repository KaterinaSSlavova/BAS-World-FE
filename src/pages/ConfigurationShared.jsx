const BRAND = "#17a84a";
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";
const BORDER = "0.5px solid #e0ebe0";

export function CountPill({ count }) {
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            minWidth: 24, padding: "3px 8px", borderRadius: 999,
            background: "#e6f7ed", color: BRAND,
            fontSize: 12, fontWeight: 600, marginLeft: 8,
            fontFamily: FONT,
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
            style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
            onClick={onClose}
        >
            <div
                style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", width: "100%", maxWidth: 420, boxShadow: "0 24px 60px rgba(0,0,0,0.15)", border: BORDER, fontFamily: FONT }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>
                    {isArchived ? "Unarchive" : "Archive"} "{item?.name}"?
                </h2>
                <p style={{ margin: "0 0 24px", color: "#888", fontSize: 14 }}>
                    {isArchived
                        ? `This ${entityLabel.toLowerCase()} will become active again.`
                        : `This ${entityLabel.toLowerCase()} will be hidden from active use.`}
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 10, border: BORDER, background: "#fff", fontSize: 14, fontWeight: 600, color: "#1a1a1a", cursor: "pointer", fontFamily: FONT }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} style={{ padding: "9px 20px", borderRadius: 10, border: "none", background: isArchived ? BRAND : "#f59e0b", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: FONT }}>
                        {isArchived ? "Unarchive" : "Archive"}
                    </button>
                </div>
            </div>
        </div>
    );
}