import {useState} from 'react';
import {createPortal} from 'react-dom';
import {addContainer} from '../../../databaseClient';

const AddContainerModal = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  const createContainer = (e: any) => {
    e.preventDefault();
    addContainer(name, category);
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
            Ajouter un récipient
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
            <button
              className="btn btn-primary"
              onClick={e => createContainer(e)}
            >
              Ajouter un récipient
            </button>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
};

export default AddContainerModal;
