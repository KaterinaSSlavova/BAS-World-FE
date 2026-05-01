import React from "react";

const cardStyle = (archived) => ({
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e6eaef",
    overflow: "hidden",
    cursor: "pointer",
    opacity: archived ? 0.55 : 1,
    filter: archived ? "grayscale(0.4)" : "none",
    transition: "box-shadow 0.18s, transform 0.18s",
});

const imgWrapStyle = {
    width: "100%", height: 130,
    background: "#f1f3f6",
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden",
};

const imgStyle = { width: "100%", height: "100%", objectFit: "cover" };
const placeholderStyle = { fontSize: 40, color: "#c5cdd8" };
const bodyStyle = { padding: "14px 14px 10px" };

const nameStyle = {
    fontSize: 15, fontWeight: 800, color: "#273142",
    marginBottom: 6, whiteSpace: "nowrap",
    overflow: "hidden", textOverflow: "ellipsis",
};

const activePill = {
    display: "inline-flex", alignItems: "center",
    padding: "4px 10px", borderRadius: 999,
    background: "#e8f5ec", color: "#2e9d5b",
    border: "1px solid #b9dec6", fontSize: 11, fontWeight: 700,
};

const archivedPill = {
    display: "inline-flex", alignItems: "center",
    padding: "4px 10px", borderRadius: 999,
    background: "#f3f4f6", color: "#6b7280",
    border: "1px solid #d1d5db", fontSize: 11, fontWeight: 700,
};

const actionsStyle = { display: "flex", gap: 8, padding: "0 14px 14px" };

const editBtn = {
    flex: 1, height: 34, borderRadius: 9,
    border: "1px solid #d9dee5", background: "#fff",
    color: "#273142", fontSize: 13, fontWeight: 700, cursor: "pointer",
};

const archiveBtnStyle = {
    flex: 1, height: 34, borderRadius: 9,
    border: "1px solid #fee2e2", background: "#fff",
    color: "#ef4444", fontSize: 13, fontWeight: 700, cursor: "pointer",
};

export default function BrandCard({ brand, onEdit, onArchive }) {
    const { id, name, picture, archived } = brand;

    return (
        <div style={cardStyle(archived)}>
            <div style={imgWrapStyle}>
                {picture
                    ? <img src={picture} alt={name} style={imgStyle} />
                    : <span style={placeholderStyle}>🏷</span>
                }
            </div>

            <div style={bodyStyle}>
                <div style={nameStyle}>{name}</div>
                <span style={archived ? archivedPill : activePill}>
          {archived ? "Archived" : "Active"}
        </span>
            </div>

            <div style={actionsStyle}>
                <button style={editBtn} onClick={(e) => { e.stopPropagation(); onEdit(brand); }}>
                    Edit
                </button>
                <button style={archiveBtnStyle} onClick={(e) => { e.stopPropagation(); onArchive(id, archived); }}>
                    {archived ? "Unarchive" : "Archive"}
                </button>
            </div>
        </div>
    );
}