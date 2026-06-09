import type { HighestQuantityProduct } from "../../lib/api/analytics";

type Props = {
    product: HighestQuantityProduct | null;
};

export default function HighestQuantityProductCard({ product }: Props) {
    if (!product) {
        return <p>No product found.</p>;
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                textAlign: "left",
            }}
        >
            <div>
                <div
                    style={{
                        fontSize: 13,
                        color: "#7f8792",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        marginBottom: 4,
                    }}
                >
                    Product
                </div>

                <div
                    style={{
                        fontSize: 26,
                        fontWeight: 800,
                        color: "#1f2937",
                    }}
                >
                    {product.name}
                </div>

                <div
                    style={{
                        color: "#7f8792",
                        marginTop: 4,
                    }}
                >
                    {product.sku}
                </div>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                }}
            >
                <Info label="Category" value={product.category?.name} />
                <Info label="Brand" value={product.brand?.name} />
                <Info label="Type" value={product.type?.name} />
                <Info label="Vehicle" value={product.vehicleType?.name} />
            </div>

            <div
                style={{
                    padding: 16,
                    background: "#f8fafc",
                    borderRadius: 12,
                    color: "#4b5563",
                    lineHeight: 1.5,
                }}
            >
                {product.description}
            </div>
        </div>
    );
}

function Info({ label, value }: { label: string; value?: string }) {
    return (
        <div>
            <div
                style={{
                    fontSize: 12,
                    color: "#7f8792",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginBottom: 4,
                }}
            >
                {label}
            </div>

            <div
                style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#1f2937",
                }}
            >
                {value ?? "-"}
            </div>
        </div>
    );
}