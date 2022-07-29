import {deleteUserByID} from '../../../databaseClient';
import {FullUser} from '../../../types';
import DeleteButton from '../DeleteButton';
import ModifyProductModal from './ModifyUserModal';

interface UserProp {
  user: FullUser;
}

const User = ({user}: UserProp) => {
  const deleteUser = (userID: string) => {
    deleteUserByID(userID);
  };

  return (
    <>
      <ModifyProductModal
        id={user.id}
        previousUsername={user.username}
        previousRole={user.role}
        previousRestaurantID={
          user.restaurant === null ? '' : user.restaurant.id
        }
      />
      <tr>
        <td>{user.username}</td>
        <td>{user.role}</td>
        <td>{user.restaurant === null ? 'Aucun' : user.restaurant.name}</td>
        <td>
          <DeleteButton deleteFunction={deleteUser} id={user.id} />
        </td>
        <td>
          <label
            htmlFor="modify-modal"
            className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg modal-button btn-primary md:mt-4 mt-2"
          >
            Modifier
          </label>
        </td>
      </tr>
    </>
  );
};

export default User;
