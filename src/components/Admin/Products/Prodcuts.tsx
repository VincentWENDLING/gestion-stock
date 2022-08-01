import {useEffect, useState} from 'react';
import {getItems} from '../../../databaseClient';
import store from '../../../stores/store';
import {ItemInDB, ItemCategory} from '../../../types';

import Product from './Product';
import AddProductModal from './AddProductModal';

const filterItems = (
  items: Array<ItemInDB>,
  nameFilter: string,
  containerFilter: string,
  categoryFilter: string
) => {
  return items
    .filter((item: ItemInDB) => {
      return item.name.toLowerCase().includes(nameFilter.toLowerCase());
    })
    .filter((item: ItemInDB) => {
      if (item.default_container === null) {
        return false;
      } else {
        return item.default_container
          .toLowerCase()
          .includes(containerFilter.toLowerCase());
      }
    })
    .filter((item: ItemInDB) => {
      return item.category.toLowerCase().includes(categoryFilter.toLowerCase());
    });
};

const Products = () => {
  const categories = store.itemCategories.map(
    (itemCategory: ItemCategory) => itemCategory.name
  );

  const [nameFilter, setNameFilter] = useState('');
  const [containerFilter, setContainerFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [items, setItems] = useState<Array<ItemInDB>>([]);

  useEffect(() => {
    (async () => {
      setItems(await getItems());
    })();
  }, []);
  return (
    <>
      <AddProductModal />
      <div className="flex flex-col gap-4">
        <label
          htmlFor="my-modal-3"
          className="btn modal-button btn-primary md:w-1/2"
        >
          Ajouter un produit
        </label>
        <table className="w-full table table-compact table-zebra md:table-normal">
          <thead>
            <tr>
              <th style={{position: 'static'}}>Nom</th>
              <th>Catégorie</th>
              <th>Unité par défaut</th>
              <th>Supprimer</th>
              <th>Modifier</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-0">
                <input
                  className="input input-sm input-bordered"
                  type="text"
                  value={nameFilter}
                  onChange={event => setNameFilter(event.target.value)}
                />
              </td>
              <td className="p-0">
                <select
                  className="select select-sm select-bordered"
                  value={categoryFilter}
                  defaultValue=""
                  onChange={event => setCategoryFilter(event.target.value)}
                >
                  <option value="">----------</option>
                  {categories.map((category: string) => (
                    <option value={category}>{category}</option>
                  ))}
                </select>
              </td>
              <td className="p-0">
                <select
                  className="select select-sm select-bordered"
                  value={containerFilter}
                  defaultValue=""
                  onChange={e => setContainerFilter(e.target.value)}
                >
                  <option value="">----------</option>
                  {store.containerCategories.map(containerCategory => (
                    <optgroup label={containerCategory.name}>
                      {containerCategory.containers.map(container => (
                        <option value={container.name}>{container.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </td>
            </tr>
            {filterItems(
              items,
              nameFilter,
              containerFilter,
              categoryFilter
            ).map((item: ItemInDB) => (
              <Product product={item} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Products;
