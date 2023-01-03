import Realm from "realm";
import { Product } from "../renderer/context/ShoppingCartContext";
import { Order } from "../types";

const ProductSchema = {
  name: "Product",
  properties: {
    _id: "string",
    name: "string",
    stock: "int",
    price: "int",
  },
  primaryKey: "_id",
};

const OrderItemSchema = {
  name: "OrderItem",
  properties: {
    _id: "string",
    name: "string",
    price: "int",
    quantity: "int",
  },
};

const OrderSchema = {
  name: "Order",
  properties: {
    _id: "string",
    soldBy: "string",
    order: "OrderItem[]",
    orderTime: "int",
  },
  primaryKey: "_id",
};

export class UseRealm {
  realm: Realm;

  constructor() {
    Realm.open({
      path: "realm-files/products",
      schema: [ProductSchema, OrderSchema, OrderItemSchema],
      deleteRealmIfMigrationNeeded: true,
    })
      .then((realm) => {
        this.realm = realm;
        // this.createProducts();
      })
      .catch((error) => console.log(error));
  }

  getProducts(name: string) {
    const products = name
      ? this.realm
          .objects("Product")
          .filtered(`name CONTAINS[c] '${name}' && stock > 0`)
      : [];
    const productsJSON = products.map((product) => product.toJSON());
    return productsJSON;
  }

  getProductById(_id: string) {
    const product = this.realm.objectForPrimaryKey("Product", _id).toJSON();
    return product;
  }

  addOrder(order: Order) {
    this.realm.write(() => {
      this.realm.create("Order", {
        ...order,
        _id: new Realm.BSON.UUID().toHexString(),
      });

      const orders = order.order;

      for (const order of orders) {
        const { _id, quantity } = order;
        const product = this.realm.objectForPrimaryKey<Product>("Product", _id);
        product.stock -= quantity;
      }
    });

    console.log("added Order", order);
  }

  getOrders(arg) {
    console.log("get-orders", arg);

    const { startDateTimeStamp, endDateTimeStamp, soldBy } = arg;

    const orders = this.realm
      .objects("Order")
      .filtered(`soldBy == '${soldBy}'`)
      .filtered(
        `orderTime > ${startDateTimeStamp} && orderTime < ${endDateTimeStamp}`
      );
    const ordersJSON = orders.map((order) => order.toJSON());
    return ordersJSON;
  }

  createProducts() {
    this.realm.write(() => {
      this.realm.create("Product", {
        _id: new Realm.BSON.UUID().toHexString(),
        name: "Panadol",
        price: 200,
        stock: 12,
      });

      this.realm.create("Product", {
        _id: new Realm.BSON.UUID().toHexString(),
        name: "Viagra",
        price: 1000,
        stock: 3,
      });
    });
  }
}
