import {deleteUserByID} from '../../../databaseClient';
import {FullUser} from '../../../types';
import DeleteButton from '../DeleteButton';

interface UserProp {
  user: FullUser;
}

const User = ({user}: UserProp) => {
  const deleteUser = (userID: string) => {
    deleteUserByID(userID);
  };

  return (
    <>
      <tr>
        <td>{user.username}</td>
        <td>{user.role}</td>
        <td>{user.restaurant === null ? 'Aucun' : user.restaurant.name}</td>
        <td>
          <DeleteButton deleteFunction={deleteUser} id={user.id} />
        </td>
      </tr>
    </>
  );
};

export default User;
