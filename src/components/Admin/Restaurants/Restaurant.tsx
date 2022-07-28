import {deleteRestaurantByID} from '../../../databaseClient';
import {Restaurant as RestaurantType} from '../../../types';

import DeleteButton from '../DeleteButton';

interface RestaurantProp {
  restaurant: RestaurantType;
}

const Restaurant = ({restaurant}: RestaurantProp) => {
  const deleteRestaurant = (userID: string) => {
    deleteRestaurantByID(userID);
  };

  return (
    <>
      <tr>
        <td>{restaurant.name}</td>
        <td>{restaurant.address}</td>
        <td>
          <DeleteButton deleteFunction={deleteRestaurant} id={restaurant.id} />
        </td>
      </tr>
    </>
  );
};

export default Restaurant;
