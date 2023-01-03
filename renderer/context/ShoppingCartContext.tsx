import { Dispatch } from "react";
import { createContext, useContext, ReactNode, useState } from "react";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

export type CartItem = {
  _id: string;
  quantity: number;
};

type ShoppingCartContext = {
  getItemQuantity: (_id: string) => number;
  // increaseCartQuantity: (_id: string) => void;
  // decreaseCartQuantity: (_id: string) => void;
  changeCartQuantity: (_id: string, quantity: number) => void;
  removeFromCart: (_id: string) => void;
  setCartItems: Dispatch<CartItem[]>;
  cartItems: CartItem[];
};

export type Product = {
  _id: string;
  price: number;
  name: string;
  stock: number;
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  // let cartItems: CartItem[], setCartItems: Dispatch<CartItem[]>;

  // if (localStorage) {
  //   [cartItems, setCartItems] = useLocalStorage<CartItem[]>("cart", []);
  // } else {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // }

  function getItemQuantity(_id: string) {
    return cartItems.find((item) => item._id === _id)?.quantity || 0;
  }

  function changeCartQuantity(_id: string, quantity: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item._id === _id) == null) {
        return [...currItems, { _id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item._id === _id) {
            return { ...item, quantity };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseCartQuantity(_id: string) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item._id === _id)?.quantity === 1) {
        return currItems.filter((item) => item._id !== _id);
      } else {
        return currItems.map((item) => {
          if (item._id === _id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function removeFromCart(_id: string) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item._id !== _id);
    });
  }
  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        changeCartQuantity,
        // increaseCartQuantity,
        // decreaseCartQuantity,
        removeFromCart,
        setCartItems,
        cartItems,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}
