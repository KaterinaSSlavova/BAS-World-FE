import { api } from "./axios";

export const createProduct = async (data: any) => {
    const response = await api.post("/products", data);
    return response.data;
};