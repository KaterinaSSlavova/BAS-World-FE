import { api } from "./axios";

export const getDepotOverview = async () => {
    const response = await api.get("/depots");
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

import { getAllProductDepots } from "./productDepots";

export const getProductsForDepot = async (depotId) => {
    const data = await getAllProductDepots();
    console.log("raw:", data);
    return data.filter((pd) => pd.depotId == depotId);
};