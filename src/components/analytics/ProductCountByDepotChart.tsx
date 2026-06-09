import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import type { ProductCountByDepot } from "../../lib/api/analytics";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

type Props = {
    data: ProductCountByDepot[];
};

export default function ProductCountByDepotChart({ data }: Props) {
    const chartData = {
        labels: data.map((item) => item.depotName),
        datasets: [
            {
                data: data.map((item) => item.totalValue),
                backgroundColor: [
                    "#239b66",
                    "#6b7280",
                    "#ef4444",
                    "#10b981",
                    "#9ca3af",
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom" as const,
            },
        },
    };

    return <Doughnut data={chartData} options={options} />;
}