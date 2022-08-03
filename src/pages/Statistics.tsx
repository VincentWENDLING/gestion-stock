import store from '../stores/store';

import Chart from '../components/Statistics/chart';
import {useState} from 'react';

const Statistiques = () => {
  const [showChart, setShowChart] = useState(false);
  const [productID, setProductID] = useState(
    store.itemCategories[0].items[0].id
  );
  const [timeframe, setTimeframe] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const displayData = (e: any) => {
    e.preventDefault();
    if (
      startDate === '' ||
      endDate === '' ||
      !(new Date(startDate) < new Date(endDate)) // check if start date is before end date
    ) {
      return;
    } else {
      setShowChart(true);
    }
  };

  return (
    <div className="w-3/4 flex flex-col gap-4 m-auto">
      <h1 className="text-2xl font-bold mt-8 w-full text-center">
        Statistiques
      </h1>
      <form className="flex flex-col justify-center items-center gap-2">
        <div className="flex gap-2">
          <label htmlFor="" className="input-group w-fit">
            <span>Produit</span>
            <select
              className="select select-bordered"
              defaultValue={store.itemCategories[0].items[0].id}
              value={productID}
              onChange={e => setProductID(e.target.value)}
            >
              {store.itemCategories.map(category => (
                <optgroup label={category.name}>
                  {category.items.map(item => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label htmlFor="" className="input-group w-fit break-after-all">
            <span>Timeframe</span>
            <select
              className="select select-bordered"
              defaultValue="day"
              value={timeframe}
              onChange={e => setTimeframe(e.target.value)}
            >
              <option value="day">Jour</option>
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
              <option value="custom" disabled>Personalisée</option>
            </select>
          </label>
        </div>
        <div className="divider flex-1"></div>
        <div className="flex gap-2">
          <label className="input-group w-fit">
            <span>Date de début</span>
            <input
              type="date"
              className="input input-bordered"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </label>
          <label className="input-group w-fit">
            <span>Date de fin</span>
            <input
              type="date"
              className="input input-bordered"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </label>
          <button
            className="btn btn-primary btn-outline"
            onClick={e => displayData(e)}
          >
            Afficher
          </button>
        </div>
        {showChart ? (
          <Chart
            productID={productID}
            timeframe={timeframe}
            startDate={startDate}
            endDate={endDate}
          />
        ) : null}
      </form>
    </div>
  );
};

export default Statistiques;
