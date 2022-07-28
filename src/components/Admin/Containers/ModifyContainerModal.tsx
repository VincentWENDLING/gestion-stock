import {createPortal} from 'react-dom';
import {modifyContainer} from '../../../databaseClient';
import {useState} from 'react';

interface Props {
  id: string;
  previousName: string;
  previousCategory: string | undefined;
}

const ModifyContainerModal = ({id, previousName, previousCategory}: Props) => {
  const [name, setName] = useState(previousName);
  const [category, setCategory] = useState(previousCategory);

  const triggerModifyContainer = (e: any) => {
    e.preventDefault();
    modifyContainer(id, {name: name, category: category});
  };

  return createPortal(
    <>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-4"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold text-center mb-4">
            Modifier le récipient
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
              onClick={e => triggerModifyContainer(e)}
            >
              Modifier le récipient
            </button>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ModifyContainerModal;
