import { Container, Box, Typography } from "@mui/material";
import {
  useShoppingCart,
  Product,
  CartItem,
} from "../context/ShoppingCartContext";
import React, { useEffect, useState } from "react";
import { DateRange } from "@mui/icons-material";
import { formatCurrency } from "../utilities/formatCurrency";

import electron from "electron";
import { getProduct } from "./SaleItem";

const ipcRenderer = electron.ipcRenderer || false;

type SalesRecieptProps = {
  total: number;
  productsInCart: ProductInCartItem[];
  department: string;
};

export type ProductInCartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const SalesReciept = ({
  total,
  productsInCart,
  department,
}: SalesRecieptProps) => {
  return (
    <Container maxWidth="xs">
      <Box textAlign="left" my={1}>
        <Typography textTransform="uppercase" variant="h6">
          Orix Empire {department}
        </Typography>
        <Typography my={1} variant="subtitle2">
          No.1 Wobasi Street, Off Ikwerre Road
        </Typography>
        <Box display="flex" my={1}>
          <Typography mr={1} variant="subtitle2">
            {new Date().toLocaleDateString()}
          </Typography>
          <Typography variant="subtitle2">
            {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </Box>

      {productsInCart?.map(({ quantity, id, price, name }) => {
        const subtotal = quantity * price;
        return (
          <Box key={id} display="flex" justifyContent="space-between">
            <Typography variant="body2">
              {name} x{quantity}
            </Typography>
            <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
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
