import { api } from "./axios";

export type StockValueByCategory = {
    categoryId: number;
    categoryName: string;
    totalValue: number;
};

export type ProductCountByDepot = {
    depotId: number;
    depotName: string;
    totalProducts: number;
};

export type InventoryValueByDepot = {
    depotId: number;
    depotName: string;
    totalValue: number;
};

export type HighestQuantityProduct = {
    id: number;
    sku: string;
    name: string;
    description?: string;
    status?: string;
    brand?: {
        id: number;
        name: string;
    };
    type?: {
        id: number;
        name: string;
    };
    category?: {
        id: number;
        name: string;
    };
    vehicleType?: {
        id: number;
        name: string;
    };
};

export type AnalyticsDTO = {
    stockValueByCategory: StockValueByCategory[];
    inventoryValueByDepot: InventoryValueByDepot[];
    productCountByDepot: ProductCountByDepot[];
    highestQuantityProduct: HighestQuantityProduct | null;
};

export async function getAnalytics(): Promise<AnalyticsDTO> {
    const response = await api.get<AnalyticsDTO>("/analytics");
    return response.data;
}