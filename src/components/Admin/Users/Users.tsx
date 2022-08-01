import {useEffect, useState} from 'react';
import {getUsersWithRestaurant} from '../../../databaseClient';
import {FullUser} from '../../../types';

import User from './User';
import AddUserModal from './AddUserModal';

const Users = () => {
  const [users, setUsers] = useState<Array<FullUser>>([]);

  useEffect(() => {
    (async () => {
      const usersData = await getUsersWithRestaurant();
      setUsers(usersData);
    })();
  });

  return (
    <>
      <AddUserModal />
      <div className="flex flex-col gap-4">
        <label
          htmlFor="my-modal-3"
          className="btn modal-button btn-primary md:w-1/2"
        >
          Ajouter un utilisateur
        </label>
        <table className="w-full table table-compact table-zebra md:table-normal">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Rôle</th>
              <th>Restaurant</th>
              <th>Supprimer</th>
              <th>Modifier</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <User user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Users;
