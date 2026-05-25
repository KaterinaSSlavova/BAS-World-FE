import { api } from "./axios";

export type VehicleType = {
    id: number;
    name: string;
    archived: boolean;
};

export type VehicleTypeRequest = {
    name: string;
    archived: boolean;
};

export const getAllVehicleTypes = async (): Promise<VehicleType[]> => {
    const response = await api.get("/vehicle-types");
    return response.data;
};

export const getVehicleTypeById = async (
    id: number
): Promise<VehicleType> => {
    const response = await api.get(`/vehicle-types/${id}`);
    return response.data;
};

export const createVehicleType = async (
    data: VehicleTypeRequest
): Promise<VehicleType> => {
    const response = await api.post("/vehicle-types", data);
    return response.data;
};

export const updateVehicleType = async (
    id: number,
    data: VehicleTypeRequest
): Promise<VehicleType> => {
    const response = await api.put(`/vehicle-types/${id}`, data);
    return response.data;
};

export const archiveVehicleType = async (
    id: number
): Promise<void> => {
    await api.put(`/vehicle-types/${id}/archive`);
};