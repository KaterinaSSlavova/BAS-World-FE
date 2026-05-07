import { api } from "./axios";
import { getAllProductDepots } from "./productDepots";

export const getDepotOverview = async () => {
    const response = await api.get("/depots");
    return response.data;
};

export const getAllDepots = async () => {
    const response = await api.get("/depots/all");
    return response.data;
};

export const getDepotById = async (id: number) => {
    const response = await api.get(`/depots/${id}`);
    return response.data;
};

export const createDepot = async (data: any) => {
    const response = await api.post("/depots", data);
    return response.data;
};

export const updateDepot = async (id: number, data: any) => {
    const response = await api.put(`/depots/${id}`, data);
    return response.data;
};

export const archiveDepot = async (id: number) => {
    await api.put(`/depots/${id}/archive`);
};

export const getProductsForDepot = async (depotId: number) => {
    const data = await getAllProductDepots();
    return data.filter((pd: any) => pd.depotId === depotId);
};