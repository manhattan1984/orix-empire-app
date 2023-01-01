import { Container, Box, Typography } from "@mui/material";
import { useShoppingCart, Product } from "../context/ShoppingCartContext";
import React, { useEffect, useState } from "react";
import { DateRange } from "@mui/icons-material";
import { formatCurrency } from "../utilities/formatCurrency";

import electron from "electron";
import { getProduct } from "./SaleItem";

const ipcRenderer = electron.ipcRenderer || false;

type SalesRecieptProps = {
  total: number;
  products: Product[];
  department: string;
};

type RecieptItems = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

const SalesReciept = ({ total, products, department }: SalesRecieptProps) => {
  const { cartItems } = useShoppingCart();
  const [recieptItems, setRecieptItems] = useState<RecieptItems[]>([]);


  useEffect(() => {
    const recieptPromises = cartItems.map(async ({ _id, quantity }) => {
      try {
        const product = await getProduct(_id);
        console.log("inside reciept", product);

        return { ...product, _id, quantity };
      } catch (error) {
        console.log(error);
      }
    });

    Promise.all(recieptPromises).then((items: RecieptItems[]) => {
      setRecieptItems(items);
      console.log("recieptItems", recieptItems);
    });
  }, [cartItems]);
  return (
    <Container maxWidth="xs">
      <Box textAlign="center" my={1}>
        <Typography textTransform="uppercase">
          Orix Empire {department}
        </Typography>
        <Typography>No.1 Wobasi Street, Off Ikwerre Road</Typography>
        <Box display="flex" my={1}>
          <Typography mr={1}>{new Date().toLocaleDateString()}</Typography>
          <Typography>{new Date().toLocaleTimeString()}</Typography>
        </Box>
      </Box>

      {recieptItems.map(({ quantity, _id, price, name }) => {
        console.log("see", name, quantity, price);

        const subtotal = quantity * price;
        return (
          <Box key={_id} display="flex" justifyContent="space-between">
            <Typography>
              {name} x{quantity}
            </Typography>
            <Typography>{formatCurrency(subtotal)}</Typography>
          </Box>
        );
      })}
      <Box display="flex" justifyContent="space-between" my={1}>
        <Typography>Total:</Typography>
        <Typography>{formatCurrency(total)}</Typography>
      </Box>
      <Typography my={2}>Tel: 08102437899</Typography>
    </Container>
  );
};

export default SalesReciept;
