import React, { useEffect, useRef, useState } from "react";
import { Delete } from "@mui/icons-material";
import {
  Grid,
  Typography,
  Button,
  Box,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import { useShoppingCart, Product } from "../context/ShoppingCartContext";
import { formatCurrency } from "../utilities/formatCurrency";
import electron from "electron";

const ipcRenderer = electron.ipcRenderer || false;

type SalesItemProps = {
  id: string;
  // name: string;
  // price: number;
};

export async function getProduct(id: string): Promise<Product> {
  // let product: Product;
  try {
    // @ts-ignore
    const product: Product = await ipcRenderer.invoke("get-product-by-id", id);
    return product;
  } catch (e) {
    console.log(e);
  } finally {
    // @ts-ignore
    ipcRenderer.removeAllListeners("get-product-by-id");
  }
}

const SaleItem = ({ id }: SalesItemProps) => {
  const { getItemQuantity, changeCartQuantity, removeFromCart } =
    useShoppingCart();

  const quantityRef = useRef<number>(1);

  const quantity = getItemQuantity(id);

  // const { name, price } = products.find((product) => id === product.id);

  const changeQuantity = () => {
    // @ts-ignore
    changeCartQuantity(id, +quantityRef.current.value);
  };

  const inputProps = {
    min: 1,
  };

  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    getProduct(id)
      .then((item) => setProduct(item))
      .catch((e) => {
        console.log(e);
      });
  }, [id]);

  return product ? (
    <>
      <Grid container my={1} sx={{ alignItems: "center" }}>
        <Grid item xs={4}>
          <Typography>{product.name}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{formatCurrency(product.price)}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Box display="flex" width="100%">
            {/* <Button onClick={() => decreaseCartQuantity(id)}>-</Button>
            <Typography>{quantity}</Typography>
            <Button onClick={() => increaseCartQuantity(id)}>+</Button> */}
            <TextField
              inputRef={quantityRef}
              onChange={changeQuantity}
              type="number"
              inputProps={inputProps}
              sx={{ width: "50%" }}
            />
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Typography>{formatCurrency(product.price * quantity)}</Typography>
        </Grid>
        <Grid item xs={2}>
          <IconButton
            onClick={() => {
              removeFromCart(id);
            }}
          >
            <Delete />
          </IconButton>
        </Grid>
      </Grid>
      <Divider />
    </>
  ) : null;
};

export default SaleItem;
