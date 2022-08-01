import {createPortal} from 'react-dom';
import {modifyResataurant} from '../../../databaseClient';
import {useState} from 'react';

interface Props {
  id: string;
  previousName: string;
  previousAddress: string;
}

const ModifyProductModal = ({id, previousName, previousAddress}: Props) => {
  const [name, setName] = useState(previousName);
  const [address, setAddress] = useState(previousAddress);
  const triggerModifyRestaurant = (e: any) => {
    e.preventDefault();
    modifyResataurant(id, {
      name: name,
      address: address,
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
            Modifier le restaurant
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
              <span className="w-1/3">Adresse</span>
              <input
                className="input input-bordered"
                type="text"
                placeholder="Adresse du restaurant"
                value={address}
                onChange={evt => setAddress(evt.target.value)}
              />
            </label>
            <button
              className="btn btn-primary"
              onClick={e => triggerModifyRestaurant(e)}
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
