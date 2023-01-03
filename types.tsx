import Realm from "realm";

export type OrderItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  soldBy: string;
  total: number;
  order: OrderItem[];
  orderTime: number;
};
