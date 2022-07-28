export type Restaurant = {
  id: string;
  name: string;
  address: string;
};

export type Item = {
  id: string;
  name: string;
  quantity: number;
  container: string;
  container_id: string;
  labPriority: number;
  orderPriority: number;
};

export type Container = {
  name: string;
  id: string;
  category?: string;
};

export type ContainerCategory = {
  name: string;
  containers: Array<Container>;
};

export type User = {
  id: string;
  username: string;
  role: Role;
  restaurant_id: string;
};

export type Status =
  | 'On order'
  | 'Ordered'
  | 'Prepared'
  | 'Delivered'
  | 'Received'
  | null;

type Role = 'Admin' | 'Manager' | 'Labo' | 'Livreur' | 'Anon';

export type ItemCategory = {
  name: string;
  items: Array<Item>;
};

export type OrderItemContainer = {
  id?: string;
  canceled_by_lab?: boolean;
  item_id: string;
  container_id: string;
  order_id: string;
  quantity: number;
  labPriority: number;
  orderPriority: number;
};

export type WasteItemContainer = {
  id?: string;
  item_id: string;
  container_id: string;
  waste_id: string;
  quantity: number;
  labPriority: number;
  orderPriority: number;
};

export type Order = {
  id: string;
  items: Array<OrderItem>;
  status: Status;
  comment: string;
  created_at: string;
  restaurant_id: string;
  original_order?: string;
};

export type OrderDB = {
  // order sent in the DB
  status: Status;
  comment: string;
  created_at: string;
  created_by: string;
  restaurant_id: string;
  original_order?: string;
  isLastModifiedOrder?: boolean;
};

export type OrderTuple = {
  originalOrder: Order;
  modifiedOrder: Order;
};

export type Waste = {
  id: string;
  items: Array<OrderItem>;
  status: Status;
  comment: string;
  created_at: string;
  restaurant_id: string;
};

export type WasteDB = {
  // order sent in the DB
  status: Status;
  comment: string;
  created_at: string;
  created_by: string;
  restaurant_id: string;
};

export type ItemInDB = {
  id: string;
  name: string;
  labPriority: number;
  orderPriority: number;
  category: string;
  default_container: string;
};

export type OrderItem = {
  id: string;
  name: string;
  quantity: Array<number>;
  container: Array<Container>;
  labPriority: number;
  orderPriority: number;
  category: string;
};

export interface RestaurantName {
  restaurant: string;
}

export interface CanceledByLab {
  canceledByLab: boolean;
}

export type LabItem = {
  name: string;
  priority: number;
  containers: Array<RestaurantName & string>;
  quantities: Array<RestaurantName & number>;
  canceledByLab: boolean;
};

export interface _Quantity {
  quantity: number;
}

export interface _Container {
  container: string;
}

interface ItemOrderID {
  item_order_id: string;
}

export type LabItemInfo = ItemOrderID &
  RestaurantName &
  (_Quantity | _Container);

export type LabItemQuantity = ItemOrderID & RestaurantName & _Quantity;

export type LabItemContainer = ItemOrderID & RestaurantName & _Container;

export type ItemWithLabInfo = Omit<Item, 'container_id' | 'orderPriority'> &
  RestaurantName &
  CanceledByLab;

export type FullUser = {
  id: string;
  username: string;
  password: string;
  role: Role;
  restaurant: Restaurant;
};
