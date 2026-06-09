import type { HighestQuantityProduct } from "../../lib/api/analytics";

type Props = {
    product: HighestQuantityProduct | null;
};

export default function HighestQuantityProductCard({ product }: Props) {
    if (!product) {
        return (
            <p className="text-sm text-gray-500">
                No product data available.
            </p>
        );
    }

    return (
        <div className="space-y-3">
            <div>
                <p className="text-sm text-gray-500">Product name</p>
                <p className="text-3xl font-bold text-gray-900">{product.name}</p>
            </div>

            <div>
                <p className="text-sm text-gray-500">SKU</p>
                <p className="font-medium text-gray-800">{product.sku}</p>
            </div>

            {product.description && (
                <p className="text-sm text-gray-600">{product.description}</p>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
                <div>
                    <p className="text-gray-500">Category</p>
                    <p className="font-medium">{product.category?.name ?? "N/A"}</p>
                </div>

                <div>
                    <p className="text-gray-500">Brand</p>
                    <p className="font-medium">{product.brand?.name ?? "N/A"}</p>
                </div>

                <div>
                    <p className="text-gray-500">Type</p>
                    <p className="font-medium">{product.type?.name ?? "N/A"}</p>
                </div>

                <div>
                    <p className="text-gray-500">Vehicle type</p>
                    <p className="font-medium">{product.vehicleType?.name ?? "N/A"}</p>
                </div>
            </div>
        </div>
    );
}