import {useState} from 'react';
import {createPortal} from 'react-dom';
import {addRestaurant} from '../../../databaseClient';

const AddRestaurantModal = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const [nameNotOK, setNameNotOK] = useState(false);
  const [addressNotOK, setAddressNotOK] = useState(false);

  const createUser = (event: any) => {
    event.preventDefault();
    if (name === '' || address === '') {
      setNameNotOK(name === '');
      setAddressNotOK(address === '');
    } else {
      setNameNotOK(false);
      setAddressNotOK(false);

      addRestaurant(name, address);

      setName(''); // reseting the state
      setAddress('');
    }
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
            Ajouter un restaurant
          </h3>
          <form action="submit" className="flex flex-col gap-4">
            <label className="input-group w-full">
              <span className="w-1/3">Nom</span>
              <input
                className={`input input-bordered ${
                  nameNotOK ? 'input-error' : ''
                }`}
                type="text"
                placeholder="Nom du restaurant"
                value={name}
                onChange={evt => setName(evt.target.value)}
              />
            </label>
            <label className="input-group w-full">
              <span className="w-1/3">Adresse</span>
              <input
                className={`input input-bordered ${
                  addressNotOK ? 'input-error' : ''
                }`}
                type="text"
                placeholder="Adresse du restaurant"
                value={address}
                onChange={evt => setAddress(evt.target.value)}
              />
            </label>
            <button className="btn btn-primary" onClick={e => createUser(e)}>
              Ajouter un restaurant
            </button>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
};

export default AddRestaurantModal;
