import Category from '../components/Order/Category';

import ModifyButton from '../components/Order/Buttons/ModifyButton';
import OrderButton from '../components/Order/Buttons/OrderButton';

import store from '../stores/store';
import {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';

import Spinner from '../components/Misc/Spinner';
import GoBack from '../components/Misc/GoBack';
import {ItemCategory, Order} from '../types';

const OrderPage = () => {
  const navigate = useNavigate();
  const location: any = useLocation();

  const [isOrdered, setIsOrdered] = useState<boolean>(
    store.order.status !== 'On order'
  );
  const [date, setDate] = useState<string>(
    new Date().toLocaleDateString('en-CA')
  );
  const [comment, setComment] = useState<string>('');
  const [itemCategories, setItemCategories] = useState<Array<ItemCategory>>(
    store.itemCategories
  );

  const [orderID, setOrderID] = useState<string>('');

  const [isEditable, setIsEditable] = useState<boolean>(true);

  const [dataLoading, setDataLoading] = useState<boolean>(true);

  useEffect(() => {
    if (store.user.role !== 'Manager' && store.user.role !== 'Admin') {
      navigate('/unauthorized');
    }
  }, []);

  store.orderMode = location.state.mode;

  if (location.state !== null && location.state.order_id !== '') {
    useEffect(() => {
      (async function awaitSetOrder() {
        setOrderID(location.state.order_id);

        const [order, lastModification]: Array<Order> =
          await store.orderStore.getOrder(
            location.state.order_id,
            location.state.mode
          );

        store.order.comment = lastModification.comment;
        setComment(lastModification.comment);

        setIsOrdered(lastModification.status !== 'On order'); // updating the component state
        store.order.status = lastModification.status; // updating the status in the store

        const tmp = await store.setOrder(location.state.order_id, true);
        setItemCategories(tmp);

        if (lastModification !== undefined) {
          await store.setOrder(lastModification.id, false);
        }

        setIsEditable(
          order.status === 'On order' || order.status === 'Ordered'
        );
        setDataLoading(false);
        setDate(order.created_at);
      })();
    }, []);
  } else {
    useEffect(() => {
      (async () => {
        await store.resetOrder();
        setItemCategories(store.itemCategories);
        setDataLoading(false);
        setIsOrdered(false); // making sure the order is not considered as "Ordered"
        setDate(store.order.created_at);
      })();
    }, []);
  }

  const listCategory = itemCategories.map((category: ItemCategory) => (
    <li>
      <Category
        categoryName={category.name}
        isOrdered={isOrdered}
        isEditable={isEditable}
        key={category.name}
      />
    </li>
  ));

  const updateDate = (event: any) => {
    store.order.created_at = event.target.value;
    setDate(event.target.value);
    if (orderID !== '') {
      store.changeOrderDate(orderID, event.target.value);
    }
  };

  const updateComment = (event: any) => {
    setComment(event.target.value);
    store.updateOrderComment(event.target.value, orderID);
  };

  return (
    <div className="flex flex-col gap-8 pb-8 justify-center items-center mt-20">
      {dataLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="w-full flex items-center justify-around max-w-screen-md">
            <GoBack />
            <div className="w-10/12 max-w-4xl p-2 rounded-lg flex gap-2 font-bold text-xl justify-center items-center border-2 border-solid border-black">
              <input
                type="date"
                className="w-fit"
                value={date}
                onChange={updateDate}
                disabled={isOrdered || !isEditable}
              ></input>
              <p>|</p>
              <p>{store.restaurant.name}</p>
            </div>
          </div>
          {isEditable ? (
            isOrdered ? (
              <ModifyButton
                isOrdered={isOrdered}
                setIsOrdered={setIsOrdered}
                mode={location.state.mode}
              />
            ) : (
              <OrderButton
                isOrdered={isOrdered}
                setIsOrdered={setIsOrdered}
                mode={location.state.mode}
              />
            )
          ) : (
            <div className="btn btn-disabled">
              {location.state.mode === 'Order'
                ? 'La commande a été praparée'
                : 'Cette page ne peut pas être modifiée'}
            </div>
          )}
          <ol className="w-11/12 max-w-screen-md flex flex-col gap-8">
            {listCategory}
          </ol>
          <textarea
            className="w-11/12 textarea textarea-accent max-w-3xl"
            value={comment}
            placeholder="Un commentaire ?... 💬"
            onChange={updateComment}
            disabled={isOrdered}
          />
        </>
      )}
    </div>
  );
};

export default OrderPage;
