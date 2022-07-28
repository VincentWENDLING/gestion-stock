import {useState} from 'react';

interface DeleteButtonProp {
  deleteFunction: (id: string) => void;
  id: string;
}

const DeleteButton = ({deleteFunction, id}: DeleteButtonProp) => {
  const [clickedOnce, setClickedOnce] = useState(false);

  return clickedOnce ? (
    <div className="flex items-center gap-2">
      <button
        className="btn btn-error btn-xs sm:btn-sm md:btn-md lg:btn-lg"
        onClick={() => deleteFunction(id)}
      >
        Êtes vous sûr ?
      </button>
      <label
        onClick={() => setClickedOnce(false)}
        className="btn btn-sm btn-circle"
      >
        ✕
      </label>
    </div>
  ) : (
    <button
      className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
      onClick={() => setClickedOnce(true)}
    >
      Supprimer
    </button>
  );
};

export default DeleteButton;
