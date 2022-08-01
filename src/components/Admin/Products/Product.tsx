import {deleteItemByID} from '../../../databaseClient';

import DeleteButton from '../DeleteButton';
import ModifyProductModal from './ModifyProductModal';

const Product = ({product}: any) => {
  const deleteProduct = (itemID: string) => {
    deleteItemByID(itemID);
  };

  return (
    <>
      <ModifyProductModal
        id={product.id}
        previousName={product.name}
        previousCategory={product.category}
        previousDefaultContainer={product.default_container}
        previousLabPriority={product.labPriority}
        previousOrderPriority={product.orderPriority}
      />
      <tr>
        <td>{product.name}</td>
        <td>{product.category}</td>
        <td>{product.default_container}</td>
        <td>
          <DeleteButton deleteFunction={deleteProduct} id={product.id} />
        </td>
        <label
          htmlFor={`modify-modal-${product.id}`}
          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg modal-button btn-primary md:mt-4 mt-2"
        >
          Modifier
        </label>
      </tr>
    </>
  );
};

export default Product;
