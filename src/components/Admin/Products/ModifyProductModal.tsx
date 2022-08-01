import {createPortal} from 'react-dom';
import {modifyItem} from '../../../databaseClient';
import {useState} from 'react';

import store from '../../../stores/store';

interface Props {
  id: string;
  previousName: string;
  previousCategory: string;
  previousDefaultContainer: string;
  previousLabPriority: number;
  previousOrderPriority: number;
}

const ModifyProductModal = ({
  id,
  previousName,
  previousCategory,
  previousDefaultContainer,
  previousLabPriority,
  previousOrderPriority,
}: Props) => {
  const [name, setName] = useState(previousName);
  const [category, setCategory] = useState(previousCategory);
  const [defaultContainer, setDefaultContainer] = useState(
    previousDefaultContainer
  );
  const [labPriority, setLabPriority] = useState(previousLabPriority);
  const [orderPriority, setOrderPriority] = useState(previousOrderPriority);

  const triggerModifyItem = (e: any) => {
    e.preventDefault();
    modifyItem(id, {
      name: name,
      category: category,
      default_container: defaultContainer,
      labPriority: labPriority,
      orderPriority: orderPriority,
    });
  };

  return createPortal(
    <>
      <input
        type="checkbox"
        id={`modify-modal-${id}`}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor={`modify-modal-${id}`}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold text-center mb-4">
            Modifier le produit
          </h3>
          <form action="submit" className="flex flex-col gap-4">
            <label className="input-group w-full">
              <span className="w-1/3">Nom</span>
              <input
                className="input input-bordered"
                type="text"
                placeholder="Nom"
                value={name}
                onChange={evt => setName(evt.target.value)}
              />
            </label>
            <label className="input-group w-full">
              <span className="w-1/3">Catégorie</span>
              <input
                className="input input-bordered"
                type="text"
                placeholder="Catégorie"
                value={category}
                onChange={evt => setCategory(evt.target.value)}
              />
            </label>
            <label className="input-group">
              <span>Récipient par défaut</span>
              <select
                className="select"
                value={defaultContainer}
                onChange={e => setDefaultContainer(e.target.value)}
              >
                {store.containerCategories.map(containerCategory => (
                  <optgroup label={containerCategory.name}>
                    {containerCategory.containers.map(container => (
                      <option value={container.name}>{container.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="input-group">
              <span>Ordre Labo</span>
              <input
                className="input input-bordered"
                type="number"
                min="0"
                value={labPriority}
                onChange={e => setLabPriority(parseInt(e.target.value))}
              />
            </label>
            <label className="input-group">
              <span>Ordre Commande</span>
              <input
                className="input input-bordered"
                type="number"
                min="0"
                value={orderPriority}
                onChange={e => setOrderPriority(parseInt(e.target.value))}
              />
            </label>
            <button
              className="btn btn-primary"
              onClick={e => triggerModifyItem(e)}
            >
              Modifier le produit
            </button>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ModifyProductModal;
