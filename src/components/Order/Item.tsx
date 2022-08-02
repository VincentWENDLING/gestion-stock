import {useState} from 'react';
import store from '../../stores/store';
import {Container} from '../../types';

import PlusCircleOutline from '../../assets/plus-circle-outline.png';
import MinusCircleOutline from '../../assets/minus-circle-outline.png';

const Item = (props: any) => {
  const {name, containerProp, quantityProp, isOrdered, isEditable, category} =
    props;

  const [quantity] = useState<number>(quantityProp);

  const [newQuantity, setNewQuantity] = useState<string>(quantityProp[1]); // text is easier to manipulate for the input
  const [oldQuantity] = useState<number>(quantityProp[0]);
  const quantityDiff = parseInt(newQuantity) - oldQuantity;

  const [oldContainer] = useState<Container>(containerProp[0]);
  const [newContainer, setNewContainer] = useState<Container>(containerProp[1]);
  const containerChanged = oldContainer.name !== newContainer.name;

  const handleQuantityChange = (newQuantityValue: string) => {
    let value = '0';
    const parsedNewQuantity = parseInt(newQuantityValue);

    if (isNaN(parsedNewQuantity) || parsedNewQuantity < 0) {
      // NaN
      //value = newQuantityValue.replace(/[^0-9]+/g, '');
      value = '0';
    } else {
      value = newQuantityValue;
    }

    setNewQuantity(value);

    if (value !== '0') {
      store.updateOrder(name, parseInt(value), {
        name: newContainer.name,
        id: newContainer.id,
      });
    } else if (value === '0' && oldQuantity !== 0) {
      store.updateOrder(name, parseInt(value), {
        name: newContainer.name,
        id: newContainer.id,
      });
    }
  };

  const handleContainerChange = (newContainerValue: string) => {
    const containerID = store.getContainerIDByName(newContainerValue);

    setNewContainer({
      id: containerID,
      name: newContainerValue,
    });

    if (quantity !== 0) {
      store.updateOrder(name, parseInt(newQuantity), {
        name: newContainerValue,
        id: containerID,
      });
    }
  };

  return (
    <div className="flex justify-center items-stretch gap-1">
      <div className="w-1/3 tooltip" data-tip={name}>
        <p className="w-full h-full flex items-center border border-solid border-slate-300 rounded-lg truncate">
          {name}
        </p>
      </div>
      <select
        className={`w-1/3 select select-bordered select-sm md:select-md${
          containerChanged ? 'bg-yellow-300' : ''
        }`}
        name="Container"
        id="container-select"
        defaultValue={newContainer.name}
        onChange={event => handleContainerChange(event.target.value)}
        disabled={isOrdered || !isEditable}
      >
        {store.containerCategories.map(category => (
          <optgroup label={category.name}>
            {category.containers.map(container => (
              <option value={container.name}>{container.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
      {category === 'Pain' || category === 'Cookies' ? (
        <input
          id="quantityInput"
          className={`w-3/12 input input-bordered input-sm md:input-md 
                                ${
                                  quantityDiff > 0
                                    ? 'bg-green-300'
                                    : quantityDiff < 0
                                    ? 'bg-red-500'
                                    : ''
                                }`}
          type="number"
          min="0"
          disabled={isOrdered || !isEditable}
          placeholder={newQuantity}
          onChange={event => handleQuantityChange(event.target.value)}
        />
      ) : (
        <div className="flex justify-centera items-center gap-2">
          <p className="w-4 lg:w-5 xl:w-8 font-bold text-lg md:text-xl lg:text-2xl xl:text-3xl">
            {newQuantity}
          </p>
          <img
            className={`w-8 ${
              isOrdered || !isEditable ? 'pointer-events-none' : ''
            }`}
            src={MinusCircleOutline}
            alt="Remove 1"
            onClick={() =>
              handleQuantityChange((parseInt(newQuantity) - 1).toString())
            }
          />
          <img
            className={`w-8 ${
              isOrdered || !isEditable ? 'pointer-events-none' : ''
            }`}
            src={PlusCircleOutline}
            alt="Add 1"
            onClick={() =>
              handleQuantityChange((parseInt(newQuantity) + 1).toString())
            }
          />
        </div>
      )}
    </div>
  );
};

export default Item;
