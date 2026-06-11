import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { InventoryValueByDepot } from "../../lib/api/analytics";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

type Props = {
    data: InventoryValueByDepot[];
};

export default function InventoryValueByDepotChart({ data }: Props) {
    const chartData = {
        labels: data.map((item) => item.depotName),
        datasets: [
            {
                label: "Inventory Value",
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