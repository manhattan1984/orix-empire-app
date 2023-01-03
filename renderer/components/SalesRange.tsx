import React, { Dispatch, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { TextField } from "@mui/material";

type SalesRangeProps = {
  label: string;
  time: Dayjs;
  setTime: Dispatch<Dayjs>;
};

const SalesRange = ({ label, time, setTime }: SalesRangeProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label={label}
        value={time}
        onChange={(newTime) => {
          const time = dayjs(newTime).unix();
          console.log("new time", time);

          // newTime.t;
          // console.log("date", newTime.toISOString());

          // const date = new Date(newTime.toISOString());
          // const date = new Date(newTime.toDate());
          // setTime(newTime.unix());
          setTime(newTime);
        }}
      />
    </LocalizationProvider>
  );
};

export default SalesRange;
