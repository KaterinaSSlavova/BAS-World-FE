import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { StockValueByCategory } from "../../lib/api/analytics"

type Props = {
    data: StockValueByCategory[];
};

export default function StockValueByCategoryChart({ data }: Props) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoryName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalValue" fill="#239b66" radius={[6, 6, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}