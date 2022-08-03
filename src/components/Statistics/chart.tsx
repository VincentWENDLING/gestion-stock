import React, {useEffect, useState} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ScatterDataPoint,
  BubbleDataPoint,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {getItemOrdersByID} from '../../databaseClient';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
interface Props {
  productID: string;
  timeframe: string;
  startDate: string;
  endDate: string;
}

const Chart = ({productID, timeframe, startDate, endDate}: Props) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolution du nombre de produit commandé(e)s',
      },
    },
  };

  const [data, setData] = useState<
    ChartData<
      'line',
      (number | ScatterDataPoint | BubbleDataPoint | null)[],
      unknown
    >
  >({
    labels: [],
    datasets: [
      {
        label: 'Dataset',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  });

  useEffect(() => {
    (async () => {
      const rawData = await getItemOrdersByID(
        productID,
        new Date(startDate),
        new Date(endDate)
      );
      const labels: Array<string> = [];
      const quantities: Array<number> = [];

      for (
        let d = new Date(startDate);
        d <= new Date(endDate);
        d.setDate(d.getDate() + 1)
      ) {
        let quantity = 0;
        labels.push(d.toDateString());
        for (const item of rawData) {
          if (new Date(item.order.created_at).getTime() === d.getTime()) {
            quantity += item.quantity;
          }
        }
        quantities.push(quantity);
      }

      setData({
        labels: labels,
        datasets: [
          {
            label: 'Dataset',
            data: quantities,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      });
    })();
  });

  return <Line options={options} data={data} />;
};

export default Chart;
