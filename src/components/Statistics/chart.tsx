import React, {useEffect} from 'react';
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

  console.log(new Date(startDate) < new Date(endDate));

  const data = {};

  useEffect(() => {
    (async () => {
      getItemOrdersByID(productID, new Date(startDate), new Date(endDate));
    })();
  });

  return <Line options={options} data={data} />;
};

export default Chart;
