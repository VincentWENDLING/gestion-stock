import {useState} from 'react';
import {createPortal} from 'react-dom';
import {addUser} from '../../../databaseClient';
import store from '../../../stores/store';
import {Restaurant} from '../../../types';

const AddUserModal = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Manager');
  const [restaurantID, setRestaurantID] = useState(
    store.restaurants[0] !== undefined ? store.restaurants[0].id : ''
  );

  const [usernameNotOK, setUsernameNotOK] = useState(false);
  const [passwordNotOK, setPasswordNotOK] = useState(false);

  const changeRoleHandler = (newRole: string) => {
    setRole(newRole);
  };

  const changeRestaurantHandler = (newRestaurantID: string) => {
    setRestaurantID(newRestaurantID);
  };

  const createUser = (event: any) => {
    event.preventDefault();
    if (username === '' || password === '') {
      setUsernameNotOK(username === '');
      setPasswordNotOK(password === '');
    } else {
      setUsernameNotOK(false);
      setPasswordNotOK(false);
      addUser(username.toLowerCase(), password, role, restaurantID);

      setUsername(''); // reseting the state
      setPassword('');
      setRole('Manager');
      setRestaurantID(store.restaurants[0].id);
    }
  };

  return createPortal(
    <>
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold text-center mb-4">
            Ajouter un utilisateur
          </h3>
          <form action="submit" className="flex flex-col gap-4">
            <label className="input-group w-full">
              <span className="w-1/3">Nom</span>
              <input
                className={`input input-bordered ${
                  usernameNotOK ? 'input-error' : ''
                }`}
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={evt => setUsername(evt.target.value)}
              />
            </label>
            <label className="input-group w-full">
              <span className="w-1/3">Mot de passe</span>
              <input
                className={`input input-bordered ${
                  passwordNotOK ? 'input-error' : ''
                }`}
                type="password"
                placeholder="M0tDepAsS3c0mpL1qué"
                value={password}
                onChange={evt => setPassword(evt.target.value)}
              />
            </label>
            <label className="input-group w-full">
              <span className="w-1/3">Rôle</span>
              <select
                className="select select-bordered"
                defaultValue={role}
                onChange={event => changeRoleHandler(event.target.value)}
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
                onChange={event => changeRestaurantHandler(event.target.value)}
              >
                {store.restaurants.map((restaurant: Restaurant) => (
                  <option value={restaurant.id}>{restaurant.name}</option>
                ))}
              </select>
            </label>
            <button className="btn btn-primary" onClick={e => createUser(e)}>
              Ajouter utilisateur
            </button>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
};

export default AddUserModal;
