import { api } from "./axios";

export const getAllTypes = async () => {
    const response = await api.get("/types");
    return response.data;
};

export const createType = async (name: string) => {
    const response = await api.post("/types", { name });
    return response.data;
};

export const updateType = async (id: number, name: string) => {
    const response = await api.put(`/types/${id}`, { name });
    return response.data;
};

export const archiveType = async (id: number) => {
    const response = await api.put(`/types/${id}/archive`);
    return response.data;
};