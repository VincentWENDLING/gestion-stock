import {makeAutoObservable} from 'mobx';
import {makePersistable} from 'mobx-persist-store';

import {
  getContainerCategories,
  getContainers,
  getItemCategories,
  getItemsWithContainer,
  sendOrderItems,
  sendOrders,
  sendWasteItems,
  sendWastes,
  updateOldModificationsOfOrder,
  getItemsFromOrder,
  getItemsFromWaste,
  updateItemCancelStatus,
  updateOrderComment,
  updateOrderStatus,
  updateOrderDate,
  getRestaurantData,
  getRestaurantsName,
  logUserAuth,
  getAllRestaurants,
} from '../databaseClient';
import {
  Container,
  ContainerCategory,
  Item,
  ItemCategory,
  Order,
  OrderItem,
  OrderItemContainer,
  Restaurant,
  Status,
  User,
  WasteItemContainer,
} from '../types';
import {OrderStore} from './order-store';

class Store {
  itemCategories: Array<ItemCategory> = [];
  containerCategories: Array<ContainerCategory> = [];

  orderStore: OrderStore;

  defaultItems: Array<any> = [];

  restaurants: Array<Restaurant> = [];

  order: Order = {
    id: '',
    items: [],
    status: 'On order',
    comment: '',
    created_at: '',
    restaurant_id: '',
  };

  orderMode: 'Order' | 'Waste' = 'Order';

  isLoggedIn = false;

  restaurant: Restaurant = {
    id: '',
    name: '',
    address: '',
  };

  user: User = {
    id: '',
    username: 'Anon',
    role: 'Anon',
    restaurant_id: '',
  };

  constructor() {
    this.orderStore = new OrderStore();
    this.addItems();
    this.addContainers();

    this.initDefautItems();
    this.initOrder();
    this.initRestaurants();

    makeAutoObservable(this);

    makePersistable(this, {
      name: 'Store',
      properties: [
        'itemCategories',
        'defaultItems',
        'restaurant',
        'containerCategories',
      ],
      storage: window.localStorage,
    });
  }

  async initRestaurants() {
    this.restaurants = await getAllRestaurants();
  }

  async initDefautItems() {
    this.defaultItems = await getItemsWithContainer();
  }

  /**
   * This function initiates the orders, on the store creation, with two empty orders
   */
  initOrder() {
    this.order.items = []; // emptying the array, just in case

    this.restaurant.id = this.user.restaurant_id;
    for (const restaurant of this.restaurants) {
      if (restaurant.id === this.restaurant.id) {
        this.restaurant.name = restaurant.name;
        this.restaurant.address = restaurant.address;
      }
    }

    for (const item of this.defaultItems) {
      this.order.items.push({
        id: item.id,
        name: item.name,
        quantity: [0, 0],
        container: [
          {
            id:
              item.container === null
                ? 'b8018542-e927-44c1-b40c-39fc586b74cf'
                : item.container.id,
            name: item.container === null ? 'Pack' : item.container.name,
          },
          {
            id:
              item.container === null
                ? 'b8018542-e927-44c1-b40c-39fc586b74cf'
                : item.container.id,
            name: item.container === null ? 'Pack' : item.container.name,
          },
        ],
        orderPriority: item.orderPriority,
        labPriority: item.labPriority,
        category: item.category,
      });
    }

    this.order.items = this.order.items.sort((a: OrderItem, b: OrderItem) => {
      return a.orderPriority - b.orderPriority;
    });
  }

  /**
   * This function fetchs all the items from supabase, sorts them by category and adds it to the store
   */
  async addItems() {
    // Adding the items to the store
    const categories = await getItemCategories();

    const items = await getItemsWithContainer();

    const listCategories: Array<string> = [];

    for (const category of categories) {
      if (!listCategories.includes(category)) {
        listCategories.push(category);
      }
    }

    for (const category of listCategories) {
      const categoryItems: Array<any> = [];

      for (const item of items) {
        if (item.category === category) {
          categoryItems.push(item);
        }
      }

      const products: Array<Item> = [];

      for (const item of categoryItems) {
        products.push({
          id: item.id,
          name: item.name,
          quantity: 0,
          container: item.container === null ? 'Pack' : item.container.name,
          container_id:
            item.container === null
              ? 'b8018542-e927-44c1-b40c-39fc586b74cf'
              : item.container.id,
          labPriority: item.labPriority,
          orderPriority: item.orderPriority,
        });
      }

      store.addItemCategory({
        name: category,
        items: products,
      });
    }
    this.itemCategories = this.itemCategories.sort((a, b) => {
      return a.items[0].orderPriority - b.items[0].orderPriority;
    });
  }

  /**
   * This function adds the item category given as a parameter to the store
   * @param category This is the ItemCategory that we want to add to the store
   */
  addItemCategory(category: ItemCategory) {
    for (const itemCategory of this.itemCategories) {
      if (itemCategory.name === category.name) {
        return;
      }
    }
    console.log('added:', category.name)
    this.itemCategories.push(category);
  }

  /**
   * this function takes the name of a container as a parameter and returns its ID
   * @param name the name of the container
   * @returns the id of the container (defaut is an empty string)
   */
  getContainerIDByName(name: string): string {
    for (const containerCategory of this.containerCategories) {
      for (const container of containerCategory.containers) {
        if (container.name === name) {
          return container.id;
        }
      }
    }
    return '';
  }

  /**
   * This function fetchs all the containers from supabase, sorts them by category and adds it to the store
   */
  async addContainers() {
    // Adding the containers to the store
    const categories = await getContainerCategories();

    const containers = await getContainers();

    const listCategories: Array<string> = [];

    if (categories !== null)
      for (const category of categories) {
        if (!listCategories.includes(category)) listCategories.push(category);
      }

    for (const category of listCategories) {
      const categoryContainers: Array<Container> = [];
      if (containers !== null)
        for (const container of containers) {
          if (container.category === category) {
            categoryContainers.push(container);
          }
        }

      const containersList: Array<Container> = [];

      for (const container of categoryContainers) {
        containersList.push({
          name: container.name,
          id: container.id,
        });
      }

      store.addContainerCategory({
        name: category,
        containers: containersList,
      });
    }
  }

  /**
   * This function adds the container category given as a parameter to the store
   * @param category This is the ContainerCategory that we want to add to the store
   */
  addContainerCategory(category: ContainerCategory) {
    for (const containerCategory of this.containerCategories) {
      if (category.name === containerCategory.name) {
        return;
      }
    }
    this.containerCategories.push(category);
  }

  /**
   * This function returns all the items which category is the one given to the function
   * @param category the category name
   */
  getItemsOfCategory(category: string) {
    const itemsOfCategory: Array<OrderItem> = [];

    for (const item of this.order.items) {
      if (item.category === category) {
        itemsOfCategory.push(item);
      }
    }

    return itemsOfCategory;
  }

  /**
   * This function adds an item to the order, or updates it if the item has already been ordered
   * @param name name of the item
   * @param quantity amount needed
   * @param container type of container needed
   */
  updateOrder(name: string, quantity: number, container: Container) {
    console.log(`${name}: ${quantity} ${container.name}`);

    for (const item of this.order.items) {
      if (item.name === name) {
        (item.container[1].name = container.name),
          (item.container[1].id = container.id),
          (item.quantity[1] = quantity);
      }
    }
  }

  /**
   * This function sends the order to the database
   */
  async sendOrder(mode = 'Order') {
    let order = null;

    if (mode === 'Order') {
      order = await sendOrders([
        {
          created_at: new Date().toISOString(), // toISOString is needed to be able to send to supabase
          restaurant_id: this.restaurant.id,
          created_by: this.user.id,
          comment: this.order.comment,
          status: 'Ordered',
        },
      ]);
    } else {
      order = await sendWastes([
        {
          created_at: new Date().toISOString(), // toISOString is needed to be able to send to supabase
          restaurant_id: this.restaurant.id,
          created_by: this.user.id,
          comment: this.order.comment,
          status: null,
        },
      ]);
    }

    const orderArray: Array<OrderItemContainer> = []; // array containing the (order-item-containers) 3-tuple
    const wasteArray: Array<WasteItemContainer> = []; // array containing the (waste-item-containers) 3-tuple

    if (order !== null && order.length > 0) {
      this.order.id = order[0].id;

      for (const item of this.order.items) {
        if (item.quantity[1] > 0) {
          if (mode === 'Order') {
            const orderItem: OrderItemContainer = {
              item_id: item.id,
              container_id: item.container[1].id,
              quantity: item.quantity[1],
              orderPriority: item.orderPriority,
              labPriority: item.labPriority,
              order_id: order[0].id,
              canceled_by_lab: false,
            };

            orderArray.push(orderItem);
          } else {
            const wasteItem: WasteItemContainer = {
              item_id: item.id,
              container_id: item.container[1].id,
              quantity: item.quantity[1],
              orderPriority: item.orderPriority,
              labPriority: item.labPriority,
              waste_id: order[0].id,
            };

            wasteArray.push(wasteItem);
          }
        }
      }
      // sending everything in one request
      if (mode === 'Order') {
        await sendOrderItems(orderArray);
      } else {
        await sendWasteItems(wasteArray);
      }
    }
  }

  /**
   * This function modifies the order in the database
   */
  async modifyOrder() {
    const order = await sendOrders([
      {
        created_at: new Date().toISOString(), // toISOString is needed to be able to send to supabase
        restaurant_id: this.restaurant.id,
        created_by: this.user.id,
        comment: this.order.comment,
        status: 'Ordered',
        original_order: this.order.id,
        isLastModifiedOrder: true,
      },
    ]);

    const orderArray: Array<OrderItemContainer> = []; // array containing the (order-item-containers) 3-tuple

    if (order !== null && order.length > 0) {
      const originalOrderID: string = this.order.id;
      const modifiedOrderID: string = order[0].id;

      for (const item of this.order.items) {
        if (item.quantity[1] === 0 && item.quantity[0] === 0) {
          continue;
        }

        const orderItem = {
          canceled_by_lab: false,
          item_id: item.id,
          container_id: item.container[1].id,
          order_id: modifiedOrderID,
          quantity: item.quantity[1],
          orderPriority: item.orderPriority,
          labPriority: item.labPriority,
        };

        orderArray.push(orderItem);
      }

      await updateOldModificationsOfOrder(originalOrderID, modifiedOrderID);

      // sending everything in one request
      await sendOrderItems(orderArray);
    }
  }

  /**
   * this function update the sotre order based on the orderID givn as parameter
   * @param orderID the ID of the current order
   * @param originalOrder this boolean says weither the value needs to be updated for the original order or the current order
   */
  async setOrder(orderID: string, originalOrder: boolean) {
    if (originalOrder) {
      // we "reset" the order in the store in order to make sure there is no overlap between order items
      await this.resetOrder();
      this.order.id = orderID;
    }

    this.order.status = 'Ordered';
    //this.order.created_at = "" // TODO set created_at
    // TODO updated restaurant info

    let items: Array<any> = [];

    if (this.orderMode === 'Order') {
      items = await getItemsFromOrder(orderID);
    } else {
      items = await getItemsFromWaste(orderID);
    }

    if (items !== null) {
      for (const item of items) {
        let orderPriority = 0;
        let labPriority = 0;
        for (const orderItem of this.order.items) {
          if (item.item.name === orderItem.name) {
            if (originalOrder) {
              orderItem.container[1].name = item.container.name;
              orderItem.container[0].name = item.container.name;

              orderItem.quantity = [item.quantity, item.quantity];
            } else {
              orderItem.container[1].name = item.container.name;
              orderItem.quantity[1] = item.quantity;
            }
            orderPriority = orderItem.orderPriority;
            labPriority = orderItem.labPriority;
          }
        }

        const newItem: Item = {
          id: item.item.id,
          name: item.item.name,
          quantity: item.quantity,
          container: item.container.name,
          container_id: item.container.id,
          orderPriority: orderPriority,
          labPriority: labPriority,
        };

        // changing the items inside the "default" list of items (updating quantity and container)
        for (const category of this.itemCategories) {
          for (let itemInCat of category.items) {
            if (itemInCat.name === newItem.name) {
              itemInCat = Object.assign(itemInCat, newItem);
            }
          }
        }
      }
    }
    return this.itemCategories;
  }

  /**
   * This function reset the order object
   */
  async resetOrder() {
    this.order = {
      id: '',
      items: [],
      status: 'On order',
      comment: '',
      created_at: new Date().toLocaleDateString('en-CA'),
      restaurant_id: this.user.restaurant_id,
    };

    this.initOrder();
  }

  /**
   * This function sets the value 'cancled_by_lab' to true for every order-item-container object in the DB which ID is inside the array (param).
   * @param itemsToCancel array of [ID, true|false]
   */
  async cancelItems(itemsToCancel: Array<[string, boolean]>) {
    for (const item of itemsToCancel) {
      await updateItemCancelStatus(item[0], item[1]);
    }
  }

  /**
   * This function updates the comment on the order
   * @param comment This string is the comment that was left by the manager
   */
  async updateOrderComment(comment: string, orderID: string) {
    // TODO update comment inside the DB
    this.order.comment = comment;

    if (orderID !== '') {
      await updateOrderComment(orderID, comment);
    }
  }

  /**
   *  Changes the status of an order
   * @param orderID order's id
   * @param status new status
   */
  async updateOrderStatus(status: Status, orderID: string) {
    this.order.status = status;

    if (orderID !== '') {
      updateOrderStatus(orderID, status);
    }
  }

  /**
   *  Changes the date of an order
   * @param orderID order's id
   * @param date Date you want to change the order's "created_at" attribute to
   */
  async changeOrderDate(orderID: string, date: string) {
    if (orderID !== '') {
      updateOrderDate(orderID, date);
    }
  }

  /**
   * This function returns the restaurant name and adress given a restaurant ID
   * @param restaurant_id the ID of the restaurant
   */
  async getRestaurantData(restaurantID: string) {
    return await getRestaurantData(restaurantID);
  }

  async getListRestaurantsName() {
    return await getRestaurantsName();
  }

  /**
   * This function is used to update the store's data when a user logs in
   * @param user Logged-in user's information
   */
  async logIn(user: User) {
    this.isLoggedIn = true;
    this.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      restaurant_id: user.restaurant_id || '',
    }; // logging in the user

    sessionStorage.setItem('user', JSON.stringify(this.user));

    // updating the restaurant (if the user is a manager)
    if (this.user.role === 'Manager') {
      const restaurant = await getRestaurantData(user.restaurant_id);

      if (restaurant !== null)
        // restaurant is an array
        this.restaurant = {
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address,
        };
    }

    // pushing the log to the table
    await logUserAuth(user.id, 'User logged in');
  }

  /**
   * This function updates the store's data when a user logs out
   */
  async logOut() {
    // pushing the log to the table
    await logUserAuth(this.user.id, 'User logged out');

    this.isLoggedIn = false;
    this.user = {
      id: '',
      username: 'Anon',
      role: 'Anon',
      restaurant_id: '',
    };

    sessionStorage.setItem('user', '');

    this.restaurant = {
      id: '',
      name: '',
      address: '',
    };
  }
}

const store = new Store();

export default store;
