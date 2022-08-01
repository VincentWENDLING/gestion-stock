import {useState} from 'react';
import {createPortal} from 'react-dom';
import store from '../../../stores/store';
import {ItemCategory} from '../../../types';

import ContainerCategories from './ContainersCategory';

const UpdateCategoryContainersModal = () => {
  const categories = store.itemCategories.map(
    (itemCategory: ItemCategory) => itemCategory.name
  );

  const [currentCateogry, setCurrentCateogry] = useState('');

  return createPortal(
    <>
      <input
        type="checkbox"
        id="item_category-container"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="item_category-container"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold text-center mb-4">
            Gérer les catégories
          </h3>
          <label className="input-group">
            <span>Selectionnez une catégorie</span>
            <select
              className="select select-bordered select-md"
              value={currentCateogry}
              onChange={e => setCurrentCateogry(e.target.value)}
            >
              {categories.map(category => (
                <option value={category}>{category}</option>
              ))}
            </select>
          </label>
          {currentCateogry !== '' ? (
            <ContainerCategories category={currentCateogry} />
          ) : null}
        </div>
      </div>
    </>,
    document.body
  );
};

export default UpdateCategoryContainersModal;
