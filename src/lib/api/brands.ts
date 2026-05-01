import { api } from "./axios";

export const getAllBrands = async () => {
    const response = await api.get("/brands");
    return response.data;
};

export const createBrand = async (data: any) => {
    const response = await api.post("/brands", data);
    return response.data;
};

export const updateBrand = async (id: number, data: any) => {
    const response = await api.put(`/brands/${id}`, data);
    return response.data;
};

export const archiveBrand = async (id: number) => {
    const response = await api.put(`/brands/${id}/archive`);
    return response.data;
};