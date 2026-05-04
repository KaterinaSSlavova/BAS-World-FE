import { api } from "./axios";

export const getAllCategories = async () => {
    const response = await api.get("/categories");
    return response.data;
};

export const getCategoryById = async (id: number) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
};

export const createCategory = async (name: string, parentId?: number) => {
    const response = await api.post("/categories", { name, parentId });
    return response.data;
};

export const updateCategory = async (id: number, name: string, parentId?: number) => {
    const response = await api.put(`/categories/${id}`, {
        name,
        parentId: parentId ?? null
    });
    return response.data;
};

export const archiveCategory = async (id: number) => {
    const response = await api.put(`/categories/${id}/archive`);
    return response.data;
};