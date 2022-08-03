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
import {getWeekNumber, getMonthNumber} from '../../utils';

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

const sortDataByDays = (
  rawData: Array<any>,
  startDate: string,
  endDate: string
) => {
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
  return {
    labels: labels,
    datasets: [
      {
        label: 'Dataset',
        data: quantities,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
};

const sortDataByWeeks = (
  rawData: Array<any>,
  startDate: string,
  endDate: string
) => {
  const labels: Array<string> = [];
  const quantities: Array<number> = [];

  const [startYear, startWeek] = getWeekNumber(new Date(startDate));
  const [endYear, endWeek] = getWeekNumber(new Date(endDate));

  for (let year = startYear; year <= endYear; year++) {
    const startIter = year === startYear ? startWeek : 0;
    const endIter = year === endYear ? endWeek : 52;
    for (let week = startIter; week < endIter; week++) {
      let quantity = 0;
      labels.push(`${week} - ${year}`);
      for (const item of rawData) {
        const [itemYear, itemWeek] = getWeekNumber(
          new Date(item.order.created_at)
        );
        if (itemYear === year && itemWeek === week) {
          quantity += item.quantity;
        }
      }
      quantities.push(quantity);
    }
  }

  return {
    labels: labels,
    datasets: [
      {
        label: 'Dataset',
        data: quantities,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
};

const sortDataByMonths = (
  rawData: Array<any>,
  startDate: string,
  endDate: string
) => {
  const labels: Array<string> = [];
  const quantities: Array<number> = [];

  const [startYear, startMonth] = getMonthNumber(new Date(startDate));
  const [endYear, endMonth] = getMonthNumber(new Date(endDate));

  for (let year = startYear; year <= endYear; year++) {
    const startIter = year === startYear ? startMonth : 0;
    const endIter = year === endYear ? endMonth : 11;
    for (let month = startIter; month <= endIter; month++) {
      let quantity = 0;
      labels.push(`${month} - ${year}`);
      for (const item of rawData) {
        const [itemYear, itemWeek] = getMonthNumber(
          new Date(item.order.created_at)
        );
        if (itemYear === year && itemWeek === month) {
          quantity += item.quantity;
        }
      }
      quantities.push(quantity);
    }
  }

  return {
    labels: labels,
    datasets: [
      {
        label: 'Dataset',
        data: quantities,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
};

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

      switch (timeframe) {
        case 'day':
          setData(sortDataByDays(rawData, startDate, endDate));
          break;
        case 'week':
          setData(sortDataByWeeks(rawData, startDate, endDate));
          break;
        case 'month':
          setData(sortDataByMonths(rawData, startDate, endDate));
          break;
      }
    })();
  });

  return <Line options={options} data={data} />;
};

export default Chart;
