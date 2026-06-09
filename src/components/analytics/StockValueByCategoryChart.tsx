import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { StockValueByCategory } from "../../lib/api/analytics";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

type Props = {
    data: StockValueByCategory[];
};

export default function StockValueByCategoryChart({ data }: Props) {
    const chartData = {
        labels: data.map((item) => item.categoryName),
        datasets: [
            {
                label: "Stock Value",
                data: data.map((item) => item.totalValue),
                backgroundColor: "#239b66",
                borderRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return <Bar data={chartData} options={options} />;
}