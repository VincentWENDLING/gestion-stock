import {deleteContainer} from '../../../databaseClient';
import DeleteButton from '../DeleteButton';

import ModifyContainerModal from './ModifyContainerModal';

interface ContainerProp {
  id: string;
  name: string;
  category: string | undefined;
}

const Container = ({id, name, category}: ContainerProp) => {
  return (
    <>
      <ModifyContainerModal
        id={id}
        previousName={name}
        previousCategory={category}
      />
      <tr>
        <td>{name}</td>
        <td>{category}</td>
        <td>
          <DeleteButton deleteFunction={deleteContainer} id={id} />
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

export default Container;
