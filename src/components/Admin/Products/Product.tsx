import {deleteItemByID} from '../../../databaseClient';

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
          <button
            className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
            onClick={() => deleteProduct(product.id)}
            disabled
          >
            Supprimer
          </button>
        </td>
      </tr>
    </>
  );
};

export default Product;
