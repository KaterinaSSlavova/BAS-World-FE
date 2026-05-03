import { api } from "./axios";

export const getAllBrands = async () => {
    const response = await api.get("/brands");
    return response.data;
};

export const createBrand = async (name: string, pictureUrl?: string) => {
    const response = await api.post("/brands", {
        name,
        picture: pictureUrl || undefined
    });
    return response.data;
};

export const updateBrand = async (id: number, name: string, pictureUrl?: string) => {
    const response = await api.put(`/brands/${id}`, {
        name,
        picture: pictureUrl || undefined
    });
    return response.data;
};

export const archiveBrand = async (id: number) => {
    const response = await api.put(`/brands/${id}/archive`);
    return response.data;
};