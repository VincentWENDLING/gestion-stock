import store from "../stores/store";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { Item } from "../types";

import RestaurantDelivery from "../components/Delivery/RestaurantDelivery";

import Spinner from "../components/Misc/Spinner";

const sortItemsByRestaurant = (orderItems:any) => {
    
    if (orderItems === undefined || orderItems === null || orderItems.length===0) {
        return [];
    }

    let restaurants:Array<string> = [];

    for (const item of orderItems) {
        if (!restaurants.includes(item.restaurant_name)) {
            restaurants.push(item.restaurant_name);
        }
    }

    let itemsByRestaurant:Array<Array<Item>> = [];
    let restaurantItem:Array<Item> = [];

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
}

const Delivery = () => {

    const navigate = useNavigate()

    const location:any = useLocation();
    const ordersDate = location.state.date;

    if (store.user.role !== "Livreur" && store.user.role !== "Admin") {
        navigate('/unauthorized');
    }

    let [orderItems, setOrderItems]: any = useState([]);
    let [dataLoading, setDataLoading]: any = useState(true);

    useEffect(() => {
        (async () => {
          const orders = await store.orderStore.getOrders(ordersDate);
          const orderItemsTmp = await store.orderStore.prepareOrders(orders);
          setOrderItems(orderItemsTmp);
          setDataLoading(false);
        })();
      }, []);

    return (
        <> {
            dataLoading ?
            (<Spinner />)
            :
            (<>
                <ol className="flex gap-2 h-3/4 w-11/12 m-auto p-4 overflow-x-scroll mt-20">
                    {sortItemsByRestaurant(orderItems).map((restaurant:Array<any>)=>
                        <RestaurantDelivery restaurant_items={restaurant} key={restaurant[0].restaurant_name}/>
                    )}
                </ol>
            </>)
            }
        </>
    );
}

export default Delivery;