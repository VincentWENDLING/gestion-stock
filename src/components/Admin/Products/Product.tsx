import {deleteItemByID} from '../../../databaseClient';

import DeleteButton from '../DeleteButton';

const Product = ({product}: any) => {
  const deleteProduct = (itemID: string) => {
    deleteItemByID(itemID);
  };

  return (
    <>
      <tr>
        <td>{product.name}</td>
        <td>{product.category}</td>
        <td>{product.default_container}</td>
        <td>
          <DeleteButton deleteFunction={deleteProduct} id={product.id} />
        </td>
      </tr>
    </>
  );
};

export default Product;
