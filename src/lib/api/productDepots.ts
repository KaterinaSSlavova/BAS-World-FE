import { api } from "./axios";

// GET all products (with depot info)
export const getAllProductDepots = async () => {
    const response = await api.get("/product-depots");
    return response.data;
};

// UPDATE product in a specific depot
export const updateProductDepot = async (
    productId: number,
    depotId: number,
    data: any
) => {
    const response = await api.put(
        `/product-depots/${productId}/depots/${depotId}`,
        data
    );
    return response.data;
};

// SEARCH products
export const searchProductDepots = async (query: string) => {
    const response = await api.get("/product-depots/search", {
        params: { query },
    });
    return response.data;
};