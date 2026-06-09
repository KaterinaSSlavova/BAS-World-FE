import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import type { ProductCountByDepot } from "../../lib/api/analytics";

type Props = {
    data: ProductCountByDepot[];
};

const COLORS = ["#239b66", "#6b7280", "#ef4444", "#10b981", "#9ca3af"];

export default function ProductCountByDepotChart({ data }: Props) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="totalValue"
                    nameKey="depotName"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={4}
                >
                    {data.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}