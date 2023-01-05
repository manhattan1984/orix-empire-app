import { Dispatch } from "react";
import { createContext, useContext, ReactNode, useState } from "react";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

export type CartItem = {
  id: string;
  quantity: number;
};

type ShoppingCartContext = {
  getItemQuantity: (id: string) => number;
  // increaseCartQuantity: (id: string) => void;
  // decreaseCartQuantity: (id: string) => void;
  changeCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  setCartItems: Dispatch<CartItem[]>;
  cartItems: CartItem[];
};

export type Product = {
  id: string;
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

  function getItemQuantity(id: string) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  function changeCartQuantity(id: string, quantity: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseCartQuantity(id: string) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function removeFromCart(id: string) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
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
