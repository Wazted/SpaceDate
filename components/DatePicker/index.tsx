import React, { useState, forwardRef, LegacyRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Box } from "@chakra-ui/react";
import { SET_DATE } from "../../store/types";
import { useDispatch } from "react-redux";

type DatePickerType = {
  value?: Date;
  onClick?: any;
};

export default function DatePicker() {
  const [startDate, setStartDate] = useState(new Date());
  const dispatch = useDispatch();

  const customInputRef = (
    { value, onClick }: DatePickerType,
    ref: LegacyRef<any>
  ) => (
    <Button onClick={onClick} ref={ref}>
      {"Pick a date"}
    </Button>
  );

  const CustomInput = forwardRef(customInputRef);

  return (
    <Box>
      <ReactDatePicker
        selected={startDate}
        onChange={(date: Date) => {
          date.setHours(0,0,0,0);
          setStartDate(date);
          dispatch({ type: SET_DATE, payload: date.toISOString() });
        }}
        customInput={<CustomInput />}
      />
    </Box>
  );
}
