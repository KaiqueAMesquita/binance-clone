'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { History } from '@/services/CurrencyService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  historyData: History[];
}

export default function PriceChart({ historyData }: PriceChartProps) {
  if (!historyData || historyData.length === 0) {
    return <div>Não há dados históricos para exibir o gráfico.</div>;
  }

  const sortedHistory = [...historyData].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );

  const chartData = {
    labels: sortedHistory.map((h) =>
      new Date(h.datetime).toLocaleDateString('pt-BR')
    ),
    datasets: [
      {
        label: 'Preço (USD)',
        data: sortedHistory.map((h) => h.price),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Histórico de Preços',
      },
    },
  };

  return <Line options={options} data={chartData} />;
}
