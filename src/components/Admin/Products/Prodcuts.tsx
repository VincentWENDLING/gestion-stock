import {useEffect, useState} from 'react';
import {getItems} from '../../../databaseClient';
import store from '../../../stores/store';
import {ItemInDB, ItemCategory} from '../../../types';

import Product from './Product';

const filterItems = (
  items: Array<ItemInDB>,
  nameFilter: string,
  containerFilter: string,
  categoryFilter: string
) => {
  let tmp: Array<ItemInDB> = items;

  if (nameFilter !== '') {
    // filter by name
    tmp = items.filter((item: ItemInDB) => {
      return item.name.includes(nameFilter);
    });
  }

  if (containerFilter !== '') {
    // filter by container
    tmp = tmp.filter((item: ItemInDB) => {
      if (item.default_container === null) {
        return false;
      } else {
        return item.default_container.includes(containerFilter);
      }
    });
  }

  if (categoryFilter !== '') {
    // filter by category
    tmp = tmp.filter((item: ItemInDB) => {
      return item.category.includes(categoryFilter);
    });
  }

  return tmp;
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
      <h1>Produits</h1>
      <div className="flex flex-col gap-4">
        <label
          htmlFor="my-modal-3"
          className="btn modal-button btn-primary md:w-1/2"
        >
          Ajouter un produit
        </label>
        <table className="max-w-screen-sm table table-compact md:table-normal">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Unité par défaut</th>
              <th>Action</th>
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
                <input
                  className="input input-sm input-bordered"
                  type="text"
                  value={categoryFilter}
                  onChange={event => setCategoryFilter(event.target.value)}
                />
              </td>
              <td className="p-0">
                <input
                  className="input input-sm input-bordered"
                  type="text"
                  value={containerFilter}
                  onChange={event => setContainerFilter(event.target.value)}
                />
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
