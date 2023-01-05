import path from "path";
import { homedir } from "os";
import { app } from "electron";
import Realm from "realm";
import { Product } from "../renderer/context/ShoppingCartContext";
import { Order } from "../types";
import { ProductionQuantityLimits } from "@mui/icons-material";

const ProductSchema = {
  name: "Product",
  properties: {
    id: "string",
    name: "string",
    stock: "int",
    price: "int",
  },
  primaryKey: "id",
};

const OrderItemSchema = {
  name: "OrderItem",
  properties: {
    id: "string",
    name: "string",
    price: "int",
    quantity: "int",
  },
};

const OrderSchema = {
  name: "Order",
  properties: {
    id: "string",
    soldBy: "string",
    order: "OrderItem[]",
    orderTime: "int",
  },
  primaryKey: "id",
};

const UserSchema = {
  name: "User",
  properties: {
    // id: "string",
    username: "string",
    password: "string",
    role: "string",
  },
  primaryKey: "username",
};

const getDBPath = (filename): string => {
  let base = app.getAppPath();
  console.log("base", base);

  if (app.isPackaged) {
    base = base.replace("/app.asar", "");
  }
  return path.join(homedir(), `extraResources/realm/${filename}.realm`);
};

// example usage for 'test.sqlite' file
getDBPath("database");

const originalConfig = {
  path: getDBPath("database"),
  schema: [ProductSchema, OrderSchema, OrderItemSchema, UserSchema],
  deleteRealmIfMigrationNeeded: true,
};
export class UseRealm {
  realm: Realm;

  constructor() {
    Realm.open(originalConfig)
      .then((realm) => {
        this.realm = realm;
        console.log("path", this.realm.path);
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

  getProductById(id: string) {
    const product = this.realm.objectForPrimaryKey("Product", id).toJSON();
    return product;
  }

  addOrder(order: Order) {
    this.realm.write(() => {
      this.realm.create("Order", {
        ...order,
        id: new Realm.BSON.UUID().toHexString(),
      });

      const orders = order.order;

      for (const order of orders) {
        const { id, quantity } = order;
        const product = this.realm.objectForPrimaryKey<Product>("Product", id);
        product.stock -= quantity;
      }
    });
  }

  getOrders(arg) {
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

  logIn({ username, password }) {
    console.log("username", username);

    const user = this.realm.objectForPrimaryKey("User", username).toJSON();

    console.log(user);

    const success = user && user.password === password;

    if (success) {
      console.log("Log In Success");
      return user;
    }
    return null;
  }

  // Admin
  getAllProducts({ resource, params }) {
    console.log("resource", resource);

    const { field, order } = params;
    const products = this.realm.objects(resource).toJSON();

    const response = {
      data: products,
      total: products.length,
    };
    return response;
  }

  getOneProduct({ resource, params }) {
    const { id } = params;
    const product = this.realm.objectForPrimaryKey(resource, id).toJSON();
    const response = {
      data: product,
    };

    return response;
  }

  getManyProducts({ resource, params }) {
    const { ids } = params;
    const products = this.realm
      .objects(resource)
      .filtered("id IN $0", ids)
      .toJSON();

    const response = {
      data: products,
    };

    return response;
  }

  // to be continued
  getManyReference({ resource, params }) {
    const { field, order } = params.sort;
    // to be continued
  }

  createProduct({resource, params}) {
    const createData = params.data;
    createData.id = new Realm.BSON.UUID().toHexString();
    let data;
    this.realm.write(() => {
      data = this.realm.create(resource, createData).toJSON();
    });
    const response = { data };
    return response;
  }

  updateProduct({resource, params}) {
    const { id, data } = params;
    let product;
    this.realm.write(() => {
      product = this.realm.objectForPrimaryKey(resource, id).toJSON();
      Object.assign(product, data);
    });
    const response = {
      data: product,
    };
    return response;
  }
}
