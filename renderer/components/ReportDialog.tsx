import { Box, Dialog, Divider, Grid, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { formatCurrency } from "../utilities/formatCurrency";
import SalesRange from "./SalesRange";
import CircularProgress from "@mui/material/CircularProgress";
import Loading from "./Loading";

type ReportDialogProps = {
  open: boolean;
  onClose: () => void;
  userEmail: string;
  department: string;
};

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  soldBy: string;
  total: number;
  order: OrderItem[];
  orderTime: Date;
};

const ReportDialog = ({
  open,
  onClose,
  userEmail,
  department,
}: ReportDialogProps) => {
  const handleClose = () => {
    onClose();
  };

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  // const q = query(
  //   collection(firestoreDB, `orixempire/${department}/orders`),
  //   where("soldBy", "==", userEmail),
  //   where("orderTime", ">=", startDate.toDate()),
  //   where("orderTime", "<=", endDate.toDate())
  // );

  let orders, ordersLoading;

  // const [orders, ordersLoading, ordersError, snapshot] = useCollectionData<
  //   Order | any
  // >(q, {});

  const [totalSales, setTotalSales] = useState<number>(0);

  const getTotalSale = (): number => {
    return orders?.reduce((initial: number, { total }) => initial + total, 0);
  };

  const [orderSummary, setOrderSummary] = useState([]);

  const getProductSummary = (
    name: string,
    price: number,
    orderItems: OrderItem[]
  ) => {
    const productList = orderItems.filter((order) => order.name === name);

    const sold = productList.reduce((acc, { quantity }) => {
      return acc + quantity;
    }, 0);
    const total = sold * price;

    return {
      name,
      sold,
      total,
    };
  };

  const getSummary = () => {
    const productsSold = orders?.map((order) => order.order).flat();

    const productsNames = productsSold?.map(({ name }) => name);
    const setOfProductsSold = Array.from(new Set(productsNames));

    const summary = setOfProductsSold.map((name: string) => {
      const price = productsSold.find((product) => product.name === name).price;
      return getProductSummary(name, price, productsSold);
    });

    setOrderSummary(summary);
  };

  const test = async () => {
    // Filter Orders
  };

  useEffect(() => {
    setTotalSales(getTotalSale());
    getSummary();

    test();

    console.log("fetching orders");
  }, [orders, ordersLoading, startDate, endDate]);

  return (
    <Dialog onClose={handleClose} open={open} fullWidth={true}>
      <Box padding={2}>
        <Typography variant="h5">Sales Summary</Typography>
        <Box display="flex" justifyContent="space-between" my={2}>
          <SalesRange time={startDate} setTime={setStartDate} label="From" />
          <SalesRange time={endDate} setTime={setEndDate} label="To" />
        </Box>
        <Grid container textAlign="end">
          <Grid container>
            <Grid item xs={4}>
              Name
            </Grid>
            <Grid item xs={4}>
              Sold
            </Grid>
            <Grid item xs={4}>
              Total
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {!ordersLoading ? (
              orderSummary.map(({ name, sold, total }) => (
                <Grid container key={name}>
                  <Grid item xs={4}>
                    <Typography>{name}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>{sold}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>{formatCurrency(total)}</Typography>
                  </Grid>
                  <Divider />
                </Grid>
              ))
            ) : (
              <Loading fullScreen={false} />
            )}
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-between">
          <Typography>Grand Total</Typography>
          <Typography textAlign="end">
            {formatCurrency(totalSales || 0)}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ReportDialog;
