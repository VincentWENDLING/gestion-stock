import {useEffect, useState} from 'react';
import {
  deleteContainersByCategoryName,
  getContainersByCategoryName,
  insertContainersForCategory,
} from '../../../databaseClient';
import store from '../../../stores/store';

interface Props {
  category: string;
}

const ContainerCategories = ({category}: Props) => {
  const [containers, setContainers] = useState<Array<string>>([]);
  const [currentContainer, setCurrentContainer] = useState('');

  const addContainer = (container: string) => {
    if (!containers.includes(container) && container !== '') {
      setContainers([...containers, container]);
    }
  };

  const removeContainer = (container: string) => {
    setContainers(containers.filter(cont => cont !== container));
  };

  const updateContainers = async () => {
    await deleteContainersByCategoryName(category);
    await insertContainersForCategory(category, containers);
  };

  useEffect(() => {
    (async () => {
      const containersData = await getContainersByCategoryName(category);
      setContainers(containersData.map(cont => cont.container_id));
    })();
  }, [category]);

  return (
    <div className="mt-4 flex flex-col justify-center items-start">
      <h1 className="w-full font-bold text-xl text-center">{category}</h1>
      <label className="input-group">
        <span>Ajouter un récipient</span>
        <select
          className="select"
          value={currentContainer}
          onChange={e => setCurrentContainer(e.target.value)}
        >
          <option value="">----------</option>
          {store.containerCategories.map(containerCategory => (
            <optgroup
              label={containerCategory.name}
              key={containerCategory.name}
            >
              {containerCategory.containers.map(container => (
                <option value={container.id} key={container.id}>
                  {container.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <button
          className="btn btn-accent"
          onClick={() => addContainer(currentContainer)}
        >
          Ajouter
        </button>
      </label>
      <div className="mt-4 w-full flex flex-col gap-4 justify-center items-center">
        <h2>Récipients disponibles:</h2>
        {containers.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {containers.map((container: string) => (
              <li className="flex gap-2 items-center badge badge-accent">
                {store.getContainerNameByID(container)}
                <button onClick={() => removeContainer(container)}>x</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="italic">Aucun</p>
        )}
        <button className="btn btn-primary" onClick={updateContainers}>
          Modifier les récipients '{category}'
        </button>
      </div>
    </div>
  );
};

export default ContainerCategories;
