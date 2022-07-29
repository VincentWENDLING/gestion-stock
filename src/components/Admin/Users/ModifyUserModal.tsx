import {createPortal} from 'react-dom';
import {modifyUser} from '../../../databaseClient';
import {useState} from 'react';
import store from '../../../stores/store';
import {Restaurant} from '../../../types';

interface Props {
  id: string;
  previousUsername: string;
  previousRole: string;
  previousRestaurantID: string;
}

const ModifyProductModal = ({
  id,
  previousUsername,
  previousRole,
  previousRestaurantID,
}: Props) => {
  const [name, setName] = useState(previousUsername);
  const [role, setRole] = useState(previousRole);
  const [restaurantID, setRestaurantID] = useState(previousRestaurantID);

  const triggerModifyUser = (e: any) => {
    e.preventDefault();
    modifyUser(id, {
      name: name,
      role: role,
      restaurant_id: restaurantID,
    });
  };

  return createPortal(
    <>
      <input type="checkbox" id="modify-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="modify-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold text-center mb-4">
            Modifier l'utilisateur
          </h3>
          <form action="submit" className="flex flex-col gap-4">
            <label className="input-group w-full">
              <span className="w-1/3">Nom d'utilisateur</span>
              <input
                className="input input-bordered"
                type="text"
                placeholder="Nom"
                value={name}
                onChange={evt => setName(evt.target.value)}
              />
            </label>
            <label className="input-group w-full">
              <span className="w-1/3">Rôle</span>
              <select
                className="select select-bordered"
                defaultValue={role}
                onChange={event => setRole(event.target.value)}
              >
                <option value="Manager">Manager</option>
                <option value="Labo">Labo</option>
                <option value="Livreur">Livreur</option>
                <option value="Admin">Admin</option>
              </select>
            </label>
            <label className="input-group w-full">
              <span className="w-1/3">Restaurant</span>
              <select
                className="select select-bordered"
                defaultValue={restaurantID}
                onChange={event => setRestaurantID(event.target.value)}
              >
                {store.restaurants.map((restaurant: Restaurant) => (
                  <option value={restaurant.id}>{restaurant.name}</option>
                ))}
              </select>
            </label>
            <button
              className="btn btn-primary"
              onClick={e => triggerModifyUser(e)}
            >
              Modifier l'utilisateur
            </button>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ModifyProductModal;
