import {Status} from '../../types';

const getStatusText = (status: Status) => {
  switch (status) {
    case 'On order':
      return 'En commande';
    case 'Ordered':
      return 'Commandée';
    case 'Prepared':
      return 'Préparée';
    case 'Delivered':
      return 'Livrée';
    case 'Received':
      return ''; // cannot reach this state yet (25/07/2022)
    case null:
      return ''; // same
  }
};

const getBadgeColor = (status: Status) => {
  switch (status) {
    case 'On order':
      return 'neutral';
    case 'Ordered':
      return 'primary';
    case 'Prepared':
      return 'secondary';
    case 'Delivered':
      return 'accent';
    case 'Received':
      return ''; // cannot reach this state yet (25/07/2022)
    case null:
      return ''; // same
  }
};

const OrderHistory = ({date, restaurantName, status, openOrder}: any) => {
  return (
    <tr onClick={openOrder}>
      <td className="select-none">{date}</td>
      <td className="select-none">{restaurantName}</td>
      <td
        className={`badge badge-${getBadgeColor(
          status
        )} badge-outline select-none`}
      >
        {getStatusText(status)}
      </td>
    </tr>
  );
};

export default OrderHistory;
