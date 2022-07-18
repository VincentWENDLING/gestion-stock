import {makeAutoObservable} from "mobx";
import {supabase} from "../supabaseClient";
import {Container, ContainerCategory, Item, ItemCategory, Order, OrderItem, Restaurant, Status, User} from "../types";
import { proxyPrint } from "../utils";
import {OrderStore} from "./order-store";


class Store {

    itemCategories: Array<ItemCategory> = [];
    containerCategories: Array<ContainerCategory> = [];

    orderStore: OrderStore;

    order: Order = {
        id: "",
        items: [],
        status: "On order",
        comment: "", 
        created_at: "",
        restaurant_id: ""
    };

    orderMode: "Order" | "Waste" = "Order";

    isLoggedIn = false;

    restaurant: Restaurant = {
        id: "",
        name: "",
        address: ""
    };

    user: User = {
        id: "",
        username: "Anon",
        role: "Anon",
        restaurant_id: ""
    };

    constructor() {
        this.orderStore = new OrderStore();
        this.addItems();
        this.addContainers();
        
        this.initOrder();

        makeAutoObservable(this);
    }

    /**
     * This function initiates the orders, on the store creation, with two empty orders 
     */
    async initOrder() {
        const {data: items} = await supabase
            .from('item')
            .select(`*,
                container:default_container(
                    id,
                    name
                )
            `)

        this.order.items = [] // emptying the array, just in case

        if (items !==  null) {
            for (const item of items) {
                this.order.items.push({
                    id: item.id,
                    name: item.name,
                    quantity: [0, 0],
                    container: [
                        {
                            id: (item.container === null) ? 'b8018542-e927-44c1-b40c-39fc586b74cf' : item.container.id,
                            name: (item.container === null) ? 'Pack' : item.container.name,
                        },
                        {
                            id: (item.container === null) ? 'b8018542-e927-44c1-b40c-39fc586b74cf' : item.container.id,
                            name: (item.container === null) ? 'Pack' : item.container.name,
                        },
                    ],
                    priority: item.priority,
                    category: item.category
                })
            }
        }
    }

    /**
     * This function fetchs all the items from supabase, sorts them by category and adds it to the store
     */
    async addItems() {

        // Adding the items to the store
        let { data: categories } = await supabase
        .from('item')
        .select('category');

        let { data: items } = await supabase
            .from('item')
            .select(`*,
                container:default_container(
                    id,
                    name
                )`);

        let listCategories:Array<string> = [];

        categories?.forEach((category:any)=>{
        if (!listCategories.includes(category.category))
            listCategories.push(category.category);
        });

        for (const category of listCategories) {

            let categoryItems:Array<any> = [];
            items?.forEach((item:any)=>{
                if (item.category===category) {
                    categoryItems.push(item);
                }
            });

            let products:Array<Item> = [];


            categoryItems?.forEach(item=>{
                products.push({
                    id: item.id,
                    name: item.name,
                    quantity: 0,
                    container: (item.container === null) ? 'Pack' : item.container.name,
                    container_id: (item.container === null) ? 'b8018542-e927-44c1-b40c-39fc586b74cf' : item.container.id,
                    priority: item.priority
                });
            })

            store.addItemCategory({
                name: category,
                items: products
            });

        }
    }

    /**
     * This function adds the item category given as a parameter to the store
     * @param category This is the ItemCategory that we want to add to the store
     */
    addItemCategory(category: ItemCategory) {
        this.itemCategories.push(category);
    }

    /**
     * This function fetchs all the containers from supabase, sorts them by category and adds it to the store
     */
    async addContainers() {

        // Adding the containers to the store
        let { data: categories } = await supabase
        .from('container')
        .select('category');

        let { data: containers } = await supabase
            .from('container')
            .select('*');

        let listCategories:Array<string> = [];

        if (categories !== null)
            for (const category of categories){
                if (!listCategories.includes(category.category))
                    listCategories.push(category.category);
            }

        for (const category of listCategories) {

            let categoryContainers:Array<Container> = [];
            if (containers !== null)
                for (let container of containers){
                    if (container.category===category) {
                        categoryContainers.push(container);
                    }
                }

            let containersList:Array<Container> = [];

            categoryContainers?.forEach(container=>{
                containersList.push({
                    name: container.name,
                    id: container.id
                });
            });

            store.addContainerCategory({
                name: category,
                containers: containersList
            });

        }
    }

    /**
     * This function adds the container category given as a parameter to the store
     * @param category This is the ContainerCategory that we want to add to the store
     */
     addContainerCategory(category: ContainerCategory) {
        this.containerCategories.push(category);
    }

    /**
     * This function returns all the items which category is the one given to the function
     * @param category the category name
     */
    getItemsOfCategory(category:string) {

        let itemsOfCategory: Array<any> = [];
        
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
    updateOrder(id:string, name: string, quantity: number, container: Container, priority: number) {

        let hasUpdated: boolean = false;

        console.log(`${name}: ${quantity} ${container.name}`);

        this.order.items.forEach((item: OrderItem)=>{
            if (item.name === name) {
                item.container[1].name = container.name,
                item.container[1].id = container.id,
                item.quantity[1] = quantity
                hasUpdated = true
            }
        });

    }

    /**
     * This function sends the order to the database
     */
    async sendOrder(mode: string = "Order") {
        
        let mainDBTable = mode === 'Order' ? 'order' : 'waste';
        let secondaryDBTable = mode === 'Order' ? 'order-item-container' : 'waste-item-container'; 
        
        const { data: order } = await supabase
            .from(mainDBTable)
            .insert([
                {
                    created_at: new Date().toISOString(), // toISOString is needed to be able to send to supabase
                    restaurant_id: this.restaurant.id,
                    created_by: this.user.id,
                    comment: this.order.comment,
                    status: mode === 'Order' ? "Ordered" :  null
                },
            ]);

            let orderArray:Array<any> = []; // array containing the (order-item-containers) 3-tuple

            if (order !== null && order.length > 0)
            {

                this.order.id = order[0].id;

                for (let item of this.order.items) {

                    if (item.quantity[1] > 0) {
                        let orderItem:{[k: string]: any} = { /*{[k: string]: any} is required to dynamically ad a field to the object */
                            item_id: item.id,
                            container_id: item.container[1].id,
                            quantity: item.quantity[1],
                            priority: item.priority
                        };

                        if (mode === 'Order') {
                            orderItem.canceled_by_lab = false;
                            orderItem.order_id = order[0].id;
                        }
                        else {
                            orderItem.waste_id = order[0].id;
                        }

                        orderArray.push(orderItem);
                    }
                }

                /*const { data, error } = await supabase
                    .from(secondaryDBTable)
                    .delete()
                    .eq('order_id', this.order.id); */

                // sending everything in one request
                const { data:orderItems } = await supabase
                    .from(secondaryDBTable)
                    .insert(orderArray);

            }
    }

    /**
     * This function modifies the order in the database
     */
    async modifyOrder(mode: string = "Order") {
        
        const { data: order } = await supabase
            .from('order')
            .insert([
                {
                    created_at: new Date().toISOString(), // toISOString is needed to be able to send to supabase
                    restaurant_id: this.restaurant.id,
                    created_by: this.user.id,
                    comment: this.order.comment,
                    status: "Ordered",
                    original_order: this.order.id,
                    isLastModifiedOrder: true
                },
            ]);

            let orderArray:Array<any> = []; // array containing the (order-item-containers) 3-tuple

            if (order !== null && order.length > 0)
            {

                let originalOrderID: string = this.order.id;
                let modifiedOrderID: string = order[0].id

                for (let item of this.order.items) {
                    
                    if (item.quantity[1] === 0) {
                        continue;
                    }

                    let orderItem = {
                        canceled_by_lab: false,
                        item_id: item.id,
                        container_id: item.container[1].id,
                        order_id: modifiedOrderID,
                        quantity:item.quantity[1],
                        priority: item.priority
                    };

                    orderArray.push(orderItem);
                }

                const { data, error } = await supabase
                    .from('order')
                    .update({isLastModifiedOrder: false})
                    .eq('original_order', originalOrderID)
                    .neq('id', modifiedOrderID);

                // sending everything in one request
                const { data:orderItems } = await supabase
                    .from('order-item-container')
                    .insert(orderArray);

            }

    }

    /**
     * this function update the sotre order based on the orderID givn as parameter
     * @param orderID the ID of the current order
     * @param originalOrder this boolean says weither the value needs to be updated for the original order or the current order
     */
    async setOrder(orderID: string, originalOrder: boolean) {

        let tableDBName = (this.orderMode === 'Order') ? 'order' : 'waste';

        if (originalOrder) {
            await this.resetOrder();
            this.order.id = orderID;
        }

        this.order.status = "Ordered";
        //this.order.created_at = "" // TODO set created_at
        // TODO updated restaurant info

        let {data: items} = await supabase
            .from(`${tableDBName}-item-container`)
            .select(`  
                quantity, 
                item:item_id(
                    id,
                    name,
                    priority
                ),
                container: container_id(
                    id,
                    name
                )
            `)
            .eq(`${tableDBName}_id`, orderID);
                    
        //console.log(items)            

        if (items !== null) {
            for (const item of items) {

                for (const orderItem of this.order.items) {
                    if (item.item.name === orderItem.name) {
                        if (originalOrder) {
                            orderItem.container[1].name = item.container.name;
                            orderItem.container[0].name = item.container.name;
                            
                            orderItem.quantity = [item.quantity, item.quantity]
                        }
                        else {
                            orderItem.container[1].name = item.container.name;
                            orderItem.quantity[1] = item.quantity
                        }
                    }
                }

                let newItem:Item = {
                    id: item.item.id,
                    name: item.item.name,
                    quantity: item.quantity,
                    container: item.container.name,
                    container_id: item.container.id,
                    priority: item.item.priority 
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
            id: "",
            items: [],
            status: "On order",
            comment: "", 
            created_at: "",
            restaurant_id: ""
        };

        await this.initOrder()

        // changing the items inside the "default" list of items 
        for (const category of this.itemCategories) {
            for (let itemInCat of category.items) {
                itemInCat.quantity = 0;
                itemInCat.container = "Bac 1/6 profond";
                itemInCat.container_id = "56262456-d89a-4d8b-b833-be377504f88b";
            }
        }

        
    }

    /**
     * This function sets the value 'cancled_by_lab' to true for every order-item-container object in the DB which ID is inside the array (param).
     * @param itemsToCancel array of [ID, true|false]
     */
    async cancelItems(itemsToCancel:Array<any>) {
        for (const item of itemsToCancel) {
            const { data, error } = await supabase
                .from('order-item-container')
                .update({ canceled_by_lab: item[1] })
                .eq('id', item[0]);
        }
    }

    /**
     * This function updates the comment on the order
     * @param comment This string is the comment that was left by the manager
     */
    async updateOrderComment(comment: string, orderID: string) { // TODO update comment inside the DB
        this.order.comment = comment;

        if (orderID !== "") {
            let {data, error} = await supabase
                .from('order')
                .update({comment: comment})
                .eq('id', orderID);
        }
    }

    /**
     * 
     * 
     * 
     */
    async updateOrderStatus(status: Status, orderID: string) {
        this.order.status = status

        if (orderID !== "") {
            let {data, error} = await supabase
                .from('order')
                .update({status: status})
                .eq('id', orderID);
        }
    }

    /**
     * 
     * @param orderID order's id
     * @param date Date you want to change the order's "created_at" attribute to
     */
    async changeOrderDate(orderID: string, date:any) {
        let {data} = await supabase
            .from('order')
            .update({created_at: date})
            .eq('id', orderID);
    }

    /**
     * This function returns the restaurant name and adress given a restaurant ID 
     * @param restaurant_id the ID of the restaurant
     */
    async getRestaurantData(restaurant_id: string) {

        const {data: restaurant} = await supabase
            .from('restaurant')
            .select('name, address')
            .eq('id', restaurant_id);

        return restaurant;
    }

    async getListRestaurantsName() {
        let {data} = await supabase
            .from('restaurant')
            .select('name')

        let restaurantNames:Array<string> = [];

        if (data !== null)
        for (const rest of data) {
            restaurantNames.push(rest.name)
        }

        return restaurantNames
    }

    /**
     * This function is used to update the store's data when a user logs in
     * @param user Logged-in user's information
     */
    async logIn(user: User) {
        this.isLoggedIn = true;
        this.user = {
            id:user.id,
            username: user.username,
            role: user.role,
            restaurant_id: user.restaurant_id || ""
        }; // logging in the user

        sessionStorage.setItem('user', JSON.stringify(this.user));

        // updating the restaurant (if the user is a manager)
        if (this.user.role === "Manager") {
            let {data: restaurant} = await supabase
                .from('restaurant')
                .select('*')
                .eq('id', user.restaurant_id);

            if (restaurant?.length !== 0 && restaurant !== null) // restaurant is an array
                this.restaurant = {
                    id: restaurant[0].id,
                    name: restaurant[0].name,
                    address: restaurant[0].address
                };
        }

        // pushing the log to the table
        let {data: log} = await supabase
            .from('log-auth')
            .insert({
                user_id: user.id,
                log_message: `User logged in` 
            });

    }

    /**
     * This function updates the store's data when a user logs out
     */
    async logOut() {

        // pushing the log to the table
        let {data: log} = await supabase
            .from('log-auth')
            .insert({
                user_id: this.user.id,
                log_message: `User logged out` 
            });

        this.isLoggedIn = false;
        this.user = {
            id:"",
            username: "Anon",
            role: "Anon",
            restaurant_id: ""
        };

        sessionStorage.setItem('user', "");

        this.restaurant = {
            id: "",
            name: "",
            address: ""
        };
    }

}

const store = new Store();

export default store;
