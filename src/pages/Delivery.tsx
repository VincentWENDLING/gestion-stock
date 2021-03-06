import store from '../stores/store';
import {useNavigate, useLocation} from 'react-router-dom';
import {useState, useEffect} from 'react';

import {Item, Order, ItemWithLabInfo} from '../types';

import RestaurantDelivery from '../components/Delivery/RestaurantDelivery';

import Spinner from '../components/Misc/Spinner';
import {getLastModificationOfOrder} from '../databaseClient';

const sortItemsByRestaurant = (orderItems: any) => {
  if (
    orderItems === undefined ||
    orderItems === null ||
    orderItems.length === 0
  ) {
    return [];
  }

  const restaurants: Array<string> = [];

  for (const item of orderItems) {
    if (!restaurants.includes(item.restaurant_name)) {
      restaurants.push(item.restaurant_name);
    }
  }

  const itemsByRestaurant: Array<Array<Item>> = [];
  let restaurantItem: Array<Item> = [];

  for (const restaurant of restaurants) {
    for (const item of orderItems) {
      if (item.restaurant_name === restaurant) {
        restaurantItem.push(item);
      }
    }
    itemsByRestaurant.push(restaurantItem);
    restaurantItem = [];
  }

  return itemsByRestaurant;
};

const Delivery = () => {
  const navigate = useNavigate();

  const location: any = useLocation();
  const ordersDate = location.state.date;

  if (store.user.role !== 'Livreur' && store.user.role !== 'Admin') {
    navigate('/unauthorized');
  }

  const [orderItems, setOrderItems] = useState<Array<ItemWithLabInfo>>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const originalOrders = await store.orderStore.getOrders(ordersDate);

      const orders: Array<Order> = [];

      for (const originalOrder of originalOrders) {
        const tmp = await getLastModificationOfOrder(originalOrder.id);
        if (tmp === null) {
          // order has no modification
          orders.push(originalOrder);
        } else {
          orders.push(tmp);
        }
      }
      const orderItemsTmp = await store.orderStore.prepareOrders(orders);

      console.log(orderItemsTmp);

      setOrderItems(orderItemsTmp);
      setDataLoading(false);
    })();
  }, []);

  return (
    <>
      {' '}
      {dataLoading ? (
        <Spinner />
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-center mt-24">
            Date: {ordersDate}
          </h1>
          <ol className="flex gap-2 h-3/4 w-11/12 m-auto p-4 overflow-x-scroll mt-20">
            {sortItemsByRestaurant(
              orderItems.filter(item => {
                return !item.canceledByLab;
              })
            ).map((restaurant: Array<any>) => (
              <RestaurantDelivery
                restaurant_items={restaurant}
                key={restaurant[0].restaurant_name}
              />
            ))}
          </ol>
        </>
      )}
    </>
  );
};

export default Delivery;
