import { api } from "./axios";

export const getProductInsights = async (depotId: number) => {
    const response = await api.get("/product-insights/overall", {
        params: { depotId },
    });
    return response.data;
};