import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { InventoryValueByDepot } from "../../lib/api/analytics";

type Props = {
    data: InventoryValueByDepot[];
};

export default function InventoryValueByDepotChart({ data }: Props) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="depotName" />
                <YAxis />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="totalProducts"
                    stroke="#239b66"
                    fill="#dff3ea"
                    strokeWidth={2}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}