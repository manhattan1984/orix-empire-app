import { Box, Dialog, Divider, Grid, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { formatCurrency } from "../utilities/formatCurrency";
import SalesRange from "./SalesRange";
import CircularProgress from "@mui/material/CircularProgress";
import Loading from "./Loading";

import { Order, OrderItem } from "../../types";
import electron from "electron";

const ipcRenderer = electron.ipcRenderer || false;

type ReportDialogProps = {
  open: boolean;
  onClose: () => void;
  userEmail: string;
  department: string;
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

  const defaultDate: Dayjs = dayjs();

  const [startDate, setStartDate] = useState<Dayjs | null>(defaultDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(defaultDate);
  const [orders, setOrders] = useState<Order[]>([]);

  // let orders, ordersLoading;

  const [totalSales, setTotalSales] = useState<number>(0);

  const getTotalSale = (): number => {
    return orderSummary.reduce(
      (initial: number, { total }) => initial + total,
      0
    );
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

  const getOrders = async () => {
    const user = "me";

    const getTimeStamp = (date: Dayjs) => dayjs(date).valueOf();

    const startDateTimeStamp = getTimeStamp(startDate);
    const endDateTimeStamp = getTimeStamp(endDate);

    console.log("timestamps", startDateTimeStamp, endDateTimeStamp, userEmail);

    // @ts-ignore
    const now = await ipcRenderer.invoke("get-orders", {
      startDateTimeStamp,
      endDateTimeStamp,
      soldBy: userEmail,
    });
    setOrders(now);
  };

  useEffect(() => {
    getOrders();
    getSummary();
    console.log("orders length", orders.length);
  }, [startDate, endDate]);

  useEffect(() => {
    setTotalSales(getTotalSale());
  }, [orderSummary]);

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
            {orderSummary.map(({ name, sold, total }) => (
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
            ))}
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
