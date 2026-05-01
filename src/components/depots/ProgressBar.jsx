export default function ProgressBar({ value }) {
    return (
        <div
            style={{
                height: 10,
                background: "#edf2f7",
                borderRadius: 999,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    width: `${value}%`,
                    height: "100%",
                    background: "#2e9d5b",
                }}
            />
        </div>
    );
}