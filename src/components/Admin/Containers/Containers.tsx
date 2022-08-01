import {useEffect, useState} from 'react';
import {getContainers} from '../../../databaseClient';
import {Container as ContainerType} from '../../../types';

import Container from './Container';
import AddContainerModal from './AddContainerModal';

const Containers = () => {
  const [containers, setContainers] = useState<Array<ContainerType>>([]);

  useEffect(() => {
    (async () => {
      setContainers(await getContainers());
    })();
  });

  return (
    <>
      <>
        <AddContainerModal />
        <div className="flex flex-col gap-4">
          <label
            htmlFor="my-modal-3"
            className="btn modal-button btn-primary md:w-1/2"
          >
            Ajouter un récipient
          </label>
          <table className="w-full table table-compact table-zebra md:table-normal">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Supprimer</th>
                <th>Modifier</th>
              </tr>
            </thead>
            <tbody>
              {containers.map(container => (
                <Container
                  id={container.id}
                  name={container.name}
                  category={container.category}
                />
              ))}
            </tbody>
          </table>
        </div>
      </>
    </>
  );
};

export default Containers;
