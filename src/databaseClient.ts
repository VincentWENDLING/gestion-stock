import {createClient} from '@supabase/supabase-js';
import {
  Order,
  OrderDB,
  OrderItemContainer,
  Status,
  WasteDB,
  WasteItemContainer,
} from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const logIn = async (username: string, password: string) => {
  let {data: user} = await supabase
    .from('users')
    .select('*')
    .eq('username', username.toLowerCase());

  let errorMessage = '';

  if (user === null) user = []; // hacky thingy to prevent typescript from being a pain in the arm

  if (user.length === 0) {
    errorMessage = "Le nom d'utilisateur ou le mot de passe est incorrect";
    return [null, errorMessage];
  } else {
    const userSingle = user[0]; // user is an array of size 1
    if (userSingle.password === password) {
      return [userSingle, errorMessage];
    } else {
      errorMessage = "Le nom d'utilisateur ou le mot de passe est incorrect";
      return [null, errorMessage];
    }
  }
};

/**************************** ORDERS ****************************/

export const getOrderByID = async (orderID: string) => {
  const {data: order} = await supabase
    .from('order')
    .select('*')
    .eq('id', orderID);
  if (order !== null) {
    return order[0];
  } else return null;
};

export const getOrdersByDate = async (date: string) => {
  const {data: orders} = await supabase
    .from('order')
    .select('*')
    .eq('created_at', date);

  return orders;
};

export const getAllOrders = async () => {
  const {data: orders} = await supabase.from('order').select('*');

  return orders;
};

export const getOrdersWithRestaurantName = async () => {
  const {data} = await supabase
    .from('order')
    .select(
      `
            *,
            restaurant:restaurant_id(
                name
            )
        `
    )
    .is('original_order', null);

  if (data !== null) {
    return data.sort((a: Order, b: Order) => {
      return Date.parse(b.created_at) - Date.parse(a.created_at);
    });
  } else {
    return [];
  }
};

export const getAllOriginalOrders = async () => {
  const {data: orders} = await supabase
    .from('order')
    .select('*')
    .is('original_order', null);

  return orders;
};

export const getLastModificationOfOrder = async (originalOrderID: string) => {
  const {data: lastModification} = await supabase
    .from('order')
    .select('*')
    .eq('original_order', originalOrderID)
    .eq('isLastModifiedOrder', true);

  if (lastModification !== null && lastModification.length > 0) {
    return lastModification[0];
  } else return null;
};

export const sendOrders = async (orders: Array<OrderDB>) => {
  const {data} = await supabase.from('order').insert(orders);

  return data;
};

export const updateOldModificationsOfOrder = async (
  originalOrderID: string,
  modifiedOrderID: string
) => {
  await supabase
    .from('order')
    .update({isLastModifiedOrder: false})
    .eq('original_order', originalOrderID)
    .neq('id', modifiedOrderID);
};

export const updateOrderStatus = async (orderID: string, status: Status) => {
  await supabase.from('order').update({status: status}).eq('id', orderID);
};

export const updateOrderComment = async (orderID: string, comment: string) => {
  await supabase.from('order').update({comment: comment}).eq('id', orderID);
};

export const updateOrderDate = async (orderID: string, date: string) => {
  await supabase.from('order').update({created_at: date}).eq('id', orderID);
};

/**************************** WASTES ****************************/

export const getWasteByID = async (wasteID: string) => {
  const {data: waste} = await supabase
    .from('waste')
    .select('*')
    .eq('id', wasteID);

  if (waste !== null) {
    return waste[0];
  } else return null;
};

export const getWastesByDate = async (date: string) => {
  const {data: wastes} = await supabase
    .from('waste')
    .select('*')
    .eq('created_at', date);

  return wastes;
};

export const getAllWastes = async () => {
  const {data: wastes} = await supabase.from('waste').select('*');

  return wastes;
};

export const getWastesWithRestaurantName = async () => {
  const {data} = await supabase.from('waste').select(`
            *,
            restaurant:restaurant_id(
                name
            )
        `);

  if (data !== null) {
    return data.sort((a: Order, b: Order) => {
      return Date.parse(b.created_at) - Date.parse(a.created_at);
    });
  } else {
    return [];
  }
};

export const sendWastes = async (wastes: Array<WasteDB>) => {
  const {data} = await supabase.from('waste').insert(wastes);

  return data;
};

/**************************** ITEMS ****************************/

export const getItemsWithContainer = async () => {
  const {data: items} = await supabase.from('item').select(`*,
                container:default_container(
                    id,
                    name
                )
            `);

  return items !== null ? items : [];
};

export const getItemByID = async (itemID: string) => {
  const {data: itemFromDB} = await supabase
    .from('item')
    .select('*')
    .eq('id', itemID);

  if (itemFromDB !== null && itemFromDB.length > 0) {
    return itemFromDB[0];
  }
};

export const getItemCategories = async () => {
  const tmp: Array<string> = [];

  const {data: categories} = await supabase.from('item').select('category');

  if (categories !== null) {
    for (const cat of categories) {
      if (!tmp.includes(cat.category)) {
        tmp.push(cat.category);
      }
    }
  }

  return tmp;
};

export const getItems = async () => {
  const {data} = await supabase.from('item').select('*');

  return data === null ? [] : data;
};

export const deleteItemByID = async (itemID: string) => {
  await supabase.from('item').delete().eq('id', itemID);
};

export const addItem = async (
  name: string,
  category: string,
  default_container: string,
  labPriority: number,
  orderPriority: number
) => {
  await supabase.from('item').insert([
    {
      name: name,
      default_container: default_container,
      category: category,
      labPriority: labPriority,
      orderPriority: orderPriority,
    },
  ]);
};

export const modifyItem = async (id: string, modifications: any) => {
  await supabase.from('item').update(modifications).eq('id', id);
};

/**************************** CONTAINERS ****************************/

export const getContainers = async () => {
  const {data: containers} = await supabase.from('container').select('*');

  return containers === null ? [] : containers;
};

export const getContainerNameByID = async (containerID: string) => {
  const {data: container} = await supabase
    .from('container')
    .select('name')
    .eq('id', containerID);

  if (container !== null && container.length > 0) {
    return container[0].name;
  } else return '';
};

export const getContainerCategories = async () => {
  const tmp: Array<string> = [];

  const {data: categories} = await supabase
    .from('container')
    .select('category');

  if (categories !== null) {
    for (const cat of categories) {
      if (!tmp.includes(cat.category)) {
        tmp.push(cat.category);
      }
    }
  }

  return tmp;
};

export const deleteContainer = async (id: string) => {
  await supabase.from('container').delete().eq('id', id);
};

export const addContainer = async (name: string, category: string) => {
  await supabase.from('container').insert([{name: name, category: category}]);
};

export const modifyContainer = async (id: string, modifications: any) => {
  await supabase.from('container').update(modifications).eq('id', id);
};

/**************************** ORDER-ITEM-CONTAINER ****************************/

export const sendOrderItems = async (itemsArray: Array<OrderItemContainer>) => {
  const {data: orderItems} = await supabase
    .from('order-item-container')
    .insert(itemsArray);

  return orderItems;
};

export const get3TupleFromOrder = async (orderID: string) => {
  const {data: products} = await supabase
    .from('order-item-container')
    .select('*')
    .eq('order_id', orderID);

  if (products !== null) return products;
  else return [];
};

export const getItemsFromOrder = async (orderID: string) => {
  const {data: items} = await supabase
    .from('order-item-container')
    .select(
      `  
             quantity, 
             item:item_id(
                id,
                name,
                labPriority,
                orderPriority
            ),
            container: container_id(
                id,
                name
            )
        `
    )
    .eq('order_id', orderID);

  if (items !== null) {
    return items;
  } else {
    return [];
  }
};

export const updateItemCancelStatus = async (
  itemID: string,
  cancel: boolean
) => {
  await supabase
    .from('order-item-container')
    .update({canceled_by_lab: cancel})
    .eq('id', itemID);
};

/**************************** WASTE-ITEM-CONTAINER ****************************/

export const sendWasteItems = async (itemsArray: Array<WasteItemContainer>) => {
  const {data: wasteItems} = await supabase
    .from('waste-item-container')
    .insert(itemsArray);

  return wasteItems;
};

export const getItemsFromWaste = async (wasteID: string) => {
  const {data: items} = await supabase
    .from('waste-item-container')
    .select(
      `  
             quantity, 
             item:item_id(
                id,
                name,
                labPriority,
                orderPriority
            ),
            container: container_id(
                id,
                name
            )
        `
    )
    .eq('waste_id', wasteID);

  if (items !== null) {
    return items;
  } else {
    return [];
  }
};

/**************************** RESTAURANTS ****************************/

export const getAllRestaurants = async () => {
  const {data} = await supabase.from('restaurant').select('*');

  return data === null ? [] : data;
};

export const getRestaurantData = async (restaurantID: string) => {
  const {data: restaurant} = await supabase
    .from('restaurant')
    .select('*')
    .eq('id', restaurantID);

  if (restaurant !== null) {
    return restaurant[0];
  } else return null;
};

export const getRestaurantsName = async () => {
  const tmp: Array<string> = [];

  const {data: restaurants} = await supabase.from('restaurant').select('name');

  if (restaurants !== null)
    for (const rest of restaurants) {
      if (!tmp.includes(rest.name)) {
        tmp.push(rest.name);
      }
    }

  return tmp;
};

export const addRestaurant = async (name: string, address: string) => {
  await supabase.from('restaurant').insert([
    {
      name: name,
      address: address,
    },
  ]);
};

export const deleteRestaurantByID = async (restaurantID: string) => {
  const {data} = await supabase
    .from('restaurant')
    .delete()
    .eq('id', restaurantID);
  return data;
};

export const modifyResataurant = async (id: string, modifications: any) => {
  await supabase.from('restaurant').update(modifications).eq('id', id);
};

/**************************** LOGS ****************************/

export const logUserAuth = async (userID: string, logMessage: string) => {
  await supabase.from('log-auth').insert({
    user_id: userID,
    log_message: logMessage,
  });
};

/**************************** USERS ****************************/

export const getUsersWithRestaurant = async () => {
  const {data} = await supabase.from('users').select(`*,
      restaurant:restaurant_id(
        *
      )
    `);

  return data === null ? [] : data;
};

export const deleteUserByID = async (userID: string) => {
  const {data} = await supabase.from('users').delete().eq('id', userID);
  return data;
};

export const addUser = async (
  username: string,
  password: string,
  role: string,
  restaurantID: string
) => {
  const {data} = await supabase.from('users').insert([
    {
      username: username,
      password: password,
      role: role,
      restaurant_id: restaurantID,
    },
  ]);
};

export const modifyUsers = async (id: string, modifications: any) => {
  await supabase.from('user').update(modifications).eq('id', id);
};
