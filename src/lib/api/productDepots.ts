import { api } from "./axios";

// GET all products (with depot info)
export const getAllProductDepots = async () => {
    const response = await api.get("/products/with-depots");
    return response.data;
};

// UPDATE product in a specific depot
export const updateProduct = async (
    productId: number,
    data: any
) => {
    const response = await api.put(`/products/${productId}`, data);
    return response.data;
};

// SEARCH products
export const searchProductDepots = async (query: string) => {
    const response = await api.get("/product-depots/search", {
        params: { query },
    });
    return response.data;
};

export async function getStockAlerts() {
    const response = await api.get("/product-depots/stock-alerts");
    return response.data;
}