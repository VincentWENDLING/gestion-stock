import {deleteRestaurantByID} from '../../../databaseClient';
import {Restaurant as RestaurantType} from '../../../types';

import DeleteButton from '../DeleteButton';
import ModifyRestaurantModal from './ModifyRestaurantModal';

interface RestaurantProp {
  restaurant: RestaurantType;
}

const Restaurant = ({restaurant}: RestaurantProp) => {
  const deleteRestaurant = (userID: string) => {
    deleteRestaurantByID(userID);
  };

  return (
    <>
      <ModifyRestaurantModal
        id={restaurant.id}
        previousName={restaurant.name}
        previousAddress={restaurant.address}
      />
      <tr>
        <td>{restaurant.name}</td>
        <td>{restaurant.address}</td>
        <td>
          <DeleteButton deleteFunction={deleteRestaurant} id={restaurant.id} />
        </td>
        <label
          htmlFor="modify-modal"
          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg modal-button btn-primary md:mt-4 mt-2"
        >
          Modifier
        </label>
      </tr>
    </>
  );
};

export default Restaurant;
