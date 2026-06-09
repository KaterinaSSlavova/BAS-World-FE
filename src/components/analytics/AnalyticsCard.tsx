type AnalyticsCardProps = {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
};

export default function AnalyticsCard({ title, subtitle, children }: AnalyticsCardProps) {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 18,
                border: "1px solid #e6eaef",
                padding: 24,
                minHeight: 360,
                boxSizing: "border-box",
            }}
        >
            <h2
                style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#1f2937",
                    textAlign: "left",
                }}
            >
                {title}
            </h2>

            {subtitle && (
                <p
                    style={{
                        margin: "6px 0 20px",
                        fontSize: 14,
                        color: "#7f8792",
                        textAlign: "left",
                    }}
                >
                    {subtitle}
                </p>
            )}

            {children}
        </div>
    );
}