import {useState, useEffect} from 'react';
import {getAllRestaurants} from '../../../databaseClient';
import {Restaurant as RestaurantType} from '../../../types';

import AddRestaurantModal from './AddRestaurantModal';
import Restaurant from './Restaurant';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Array<RestaurantType>>([]);

  useEffect(() => {
    (async () => {
      const usersData = await getAllRestaurants();
      setRestaurants(usersData);
    })();
  });

  return (
    <>
      <AddRestaurantModal />
      <div className="flex flex-col gap-4">
        <label
          htmlFor="my-modal-3"
          className="btn modal-button btn-primary md:w-1/2"
        >
          Ajouter un restaurant
        </label>
        <table className="w-full table table-compact md:table-normal">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Adresse</th>
              <th>Supprimer</th>
              <th>Modifier</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map(restaurant => (
              <Restaurant restaurant={restaurant} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Restaurants;
