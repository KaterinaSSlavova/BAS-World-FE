import { api } from "./axios";

export type Supplier = {
    id: number;
    name: string;
    picture: string;
    archived: boolean;
};

export type SupplierRequest = {
    name: string;
    picture: string;
    archived: boolean;
};

export const getAllSuppliers = async (): Promise<Supplier[]> => {
    const response = await api.get("/suppliers");
    return response.data;
};

export const getSupplierById = async (id: number): Promise<Supplier> => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
};

export const createSupplier = async (data: SupplierRequest): Promise<Supplier> => {
    const response = await api.post("/suppliers", data);
    return response.data;
};

export const updateSupplier = async (
    id: number,
    data: SupplierRequest
): Promise<Supplier> => {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
};

export const archiveSupplier = async (id: number): Promise<void> => {
    await api.put(`/suppliers/${id}/archive`);
};