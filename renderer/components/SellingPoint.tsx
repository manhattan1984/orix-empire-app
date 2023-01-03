import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  Grid,
  Autocomplete,
  IconButton,
} from "@mui/material";

import React, { useEffect, useState, useRef } from "react";
import {
  useShoppingCart,
  Product,
  CartItem,
} from "../context/ShoppingCartContext";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/router";

import SaleItem, { getProduct } from "../components/SaleItem";
import SalesReciept, { ProductInCartItem } from "../components/SalesReciept";

import ReportDialog from "./ReportDialog";
import { formatCurrency } from "../utilities/formatCurrency";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import Loading from "../components/Loading";
import {
  Cancel,
  ExitToApp,
  OfflineBolt,
  Power,
  PowerOff,
  Print,
  Receipt,
  ReceiptLong,
  WifiFind,
  WifiOff,
} from "@mui/icons-material";
import Head from "next/head";
import electron, { IpcRenderer } from "electron";

import { Order, OrderItem } from "../../types";

const ipcRenderer = electron.ipcRenderer || false;

type SellingPointProps = {
  department: string;
  email: string;
};

const SellingPoint = ({ department, email }: SellingPointProps) => {
  const cardRef = useRef<number>(0);
  const cashRef = useRef<number>(0);
  const recieptRef = useRef();
  const searchRef = useRef<string>("");

  const router = useRouter();

  const [due, setDue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [products, setProducts] = useState([]);
  const [productsInCart, setProductsInCart] = useState<ProductInCartItem[]>();
  //
  const [online, setOnline] = useState(true);
  useEffect(() => {
    function changeStatus() {
      setOnline(navigator.onLine);
    }
    window.addEventListener("online", changeStatus);
    window.addEventListener("offline", changeStatus);
    return () => {
      window.removeEventListener("online", changeStatus);
      window.removeEventListener("offline", changeStatus);
    };
  }, []);
  //

  const { enqueueSnackbar } = useSnackbar();

  const handleDialog = () => setDialogOpen(!dialogOpen);
  const handlePrint = useReactToPrint({
    content: () => recieptRef.current,
  });

  const { changeCartQuantity, cartItems, setCartItems } = useShoppingCart();

  // TODO: GET USER DEPARTMENT FROM DATABASE

  const [total, setTotal] = useState(0);

  const isCartEmpty = cartItems.length === 0;

  const addOrderToDatabase = () => {
    // Update Cart Items

    const soldBy = email;

    const orderTime = Date.now();

    const order = { order: productsInCart, soldBy, orderTime };

    // throw new Error("Connect to DB");

    // @ts-ignore
    ipcRenderer.invoke("add-order", order);

    return false;

    try {
      // add order to database
    } catch (error) {
      console.log(error);
      return;
    }
    return true;
  };

  const clearSales = () => {
    if (!isCartEmpty) {
      setCartItems([]);
      // @ts-ignore
      cashRef.current.value = 0;
      // @ts-ignore
      cardRef.current.value = 0;
    }
  };

  const endSales = () => {
    console.log(isCartEmpty);

    if (!isCartEmpty && due === 0) {
      if (addOrderToDatabase()) {
        handlePrint();
        clearSales();
      }
    }
    if (isCartEmpty) {
      enqueueSnackbar("Cart Is Empty");
    }
    if (due < 0) {
      enqueueSnackbar("The customer over paid, return over due");
    }
    if (total >= due) {
      enqueueSnackbar("Complete Payment");
    }
  };

  const calculateDue = () => {
    // @ts-ignore
    const theNewDue = total - +cashRef.current.value - +cardRef.current.value;

    setDue(theNewDue);
  };

  const logOut = () => {
    router.push("/");
  };

  useEffect(() => {
    // @ts-ignore
    ipcRenderer.send("show-products", search);

    // @ts-ignore
    ipcRenderer.on("products-ready", (event, args) => {
      setProducts(args);
    });

    return function cleanup() {
      // @ts-ignore
      ipcRenderer.removeAllListeners("show-products");
    };
  }, [search]);

  // TODO: calculate total based on cart items
  useEffect(() => {
    const productItems = cartItems.map(({ _id }) => {
      return getProduct(_id);
    });

    Promise.all(productItems)
      .then((productItems) => {
        const newTotal = cartItems.reduce((total, cartItem) => {
          const product: Product = productItems.filter(
            (product) => product._id === cartItem._id
          )[0];
          return total + (product?.price || 0) * cartItem.quantity;
        }, 0);

        setTotal(newTotal);
      })
      .catch((e) => console.log(e));

    getProductsInCart(setProductsInCart, cartItems);
  }, [cartItems]);

  useEffect(() => {
    calculateDue();
  }, [total]);

  type SetListType = {
    (value: React.SetStateAction<ProductInCartItem[]>): void;
    (arg0: ProductInCartItem[]): void;
  };

  function getProductsInCart(setList: SetListType, cartItems: CartItem[]) {
    const productsPromises = cartItems.map(async ({ _id, quantity }) => {
      try {
        const product = await getProduct(_id);

        return { ...product, _id, quantity };
      } catch (error) {
        console.log(error);
      }
    });

    Promise.all(productsPromises).then((items: ProductInCartItem[]) => {
      setList(items);
    });
  }

  const inputProps = {
    min: 0,
  };
  return (
    <>
      <ReportDialog
        open={dialogOpen}
        onClose={handleDialog}
        userEmail={email}
        department={department}
      />

      <Box display="flex" alignItems="center" justifyContent="flex-end">
        <Box width="100%">
          <IconButton size="large" color="secondary" onClick={handleDialog}>
            <Receipt />
          </IconButton>
        </Box>
        <Typography mr={1}>{email}</Typography>
        <IconButton size="large" color="error" onClick={logOut}>
          <ExitToApp />
        </IconButton>
      </Box>
      <Grid mt={1} container spacing={2}>
        <Grid item xs={8}>
          <Paper elevation={0} sx={{ p: 1 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Autocomplete
                options={products.map((option) => option.name)}
                fullWidth
                sx={{ mr: 1 }}
                onChange={(event, newValue) => {
                  const product = products.find(
                    (product) => product.name === newValue
                  );

                  product && changeCartQuantity(product._id, 1);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(e) => {
                      setSearch(e.currentTarget.value);
                    }}
                    label="Product"
                  />
                )}
              />
              <IconButton size="large" color="error" onClick={clearSales}>
                <Cancel fontSize="large" />
              </IconButton>
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ mt: 2, p: 2 }}>
            <Grid container>
              <Grid item xs={4}>
                <Typography>Item</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>Price</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>Qty</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>Subtotal</Typography>
              </Grid>
              <Grid item xs={2}></Grid>
            </Grid>
            {cartItems.map((product) => (
              <SaleItem key={product._id} id={product._id} />
            ))}
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper elevation={0} sx={{ p: 2 }}>
            <Box my={1} display="flex" justifyContent="space-between">
              <Typography>Total</Typography>
              <Typography>{formatCurrency(total)}</Typography>
            </Box>

            <Divider />

            <Box my={1}>
              <Typography>Add Payment</Typography>

              <Box
                my={1}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography mr={1}>Cash</Typography>
                <TextField
                  type={"number"}
                  onChange={calculateDue}
                  inputRef={cashRef}
                  inputProps={inputProps}
                />
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography mr={1}>Card</Typography>
                <TextField
                  inputProps={inputProps}
                  type={"number"}
                  onChange={calculateDue}
                  inputRef={cardRef}
                />
              </Box>
            </Box>

            <Divider />

            <Box my={1} display="flex" justifyContent="space-between">
              <Box
                width="100%"
                ml={1}
                display="flex"
                justifyContent="space-between"
              >
                <Typography>Due</Typography>
                <Typography>{formatCurrency(due)}</Typography>
              </Box>
            </Box>

            <Box display="flex" justifyContent="center">
              <IconButton color="secondary" size="large" onClick={endSales}>
                <Print fontSize="large" />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ display: "block" }}>
        <Box ref={recieptRef}>
          <SalesReciept
            total={total}
            productsInCart={productsInCart}
            department={department}
          />
        </Box>
      </Box>
    </>
  );
};

export default SellingPoint;
