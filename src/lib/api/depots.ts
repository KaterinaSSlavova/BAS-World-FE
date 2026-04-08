import { api } from "./axios";

// CREATE depot
export const createDepot = async (data: any) => {
    const response = await api.post("/depots", data);
    return response.data;
};

// GET depot by ID
export const getDepotById = async (id: number) => {
    const response = await api.get(`/depots/${id}`);
    return response.data;
};