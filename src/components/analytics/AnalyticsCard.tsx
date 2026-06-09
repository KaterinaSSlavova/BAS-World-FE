const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";
const BORDER = "0.5px solid #e0ebe0";

type AnalyticsCardProps = {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
};

export default function AnalyticsCard({ title, subtitle, children }: AnalyticsCardProps) {
    return (
        <div style={{
            background: "#fff",
            borderRadius: 12,
            border: BORDER,
            padding: 20,
            minHeight: 340,
            boxSizing: "border-box",
            fontFamily: FONT,
        }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#1a1a1a", textAlign: "left" }}>
                {title}
            </h2>
            {subtitle && (
                <p style={{ margin: "4px 0 16px", fontSize: 13, color: "#888", textAlign: "left" }}>
                    {subtitle}
                </p>
            )}
            {children}
        </div>
    );
}