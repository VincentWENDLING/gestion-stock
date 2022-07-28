import {useState} from 'react';
import {createPortal} from 'react-dom';
import {addItem} from '../../../databaseClient';
import store from '../../../stores/store';

const AddProductModal = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [labPriority, setLabPriority] = useState(0);
  const [orderPriority, setOrderPriority] = useState(0);
  const [defaultContainer, setDefaultContainer] = useState('');

  const createProduct = (e: any) => {
    e.preventDefault();
    addItem(name, category, defaultContainer, labPriority, orderPriority);
  };

  const handlePriorityChange = (input: string, place: string) => {
    const value = parseInt(input);

    if (isNaN(value) || value < 0) {
      if (place === 'lab') {
        setLabPriority(0);
        return;
      } else {
        setOrderPriority(0);
        return;
      }
    } else {
      if (place === 'lab') {
        setLabPriority(value);
      } else {
        setOrderPriority(value);
      }
    }
    return;
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
            Ajouter un produit
          </h3>
          <form action="submit" className="flex flex-col gap-4">
            <label className="input-group">
              <span>Nom</span>
              <input
                placeholder="Nom du produit"
                className="input input-bordered"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
            <label className="input-group">
              <span>Catégorie</span>
              <input
                placeholder="Catégorie du produit"
                className="input input-bordered"
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
              />
            </label>
            <label className="input-group">
              <span>Ordre Labo</span>
              <input
                className="input input-bordered"
                type="number"
                min="0"
                value={labPriority}
                onChange={e => handlePriorityChange(e.target.value, 'lab')}
              />
            </label>
            <label className="input-group">
              <span>Ordre Commande</span>
              <input
                className="input input-bordered"
                type="number"
                min="0"
                value={orderPriority}
                onChange={e => handlePriorityChange(e.target.value, 'order')}
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
            <button className="btn btn-primary" onClick={e => createProduct(e)}>
              Ajouter produit
            </button>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
};

export default AddProductModal;
