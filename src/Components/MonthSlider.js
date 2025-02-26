import React from 'react';
import { Slider } from '@mui/material';

const months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]

export default function MonthSlider({onMonthChange}){
    const [selectedMonth, setSelectedMonth] = React.useState(0);

    const handleSliderChange = (event, newValue) => {
        setSelectedMonth(newValue);
        //onMonthChange(months[newValue]);
    };

    return (
    <div style={{ width: 300, margin: "20px auto", textAlign: "center" }}>
      <Slider
        value={selectedMonth}
        min={0}
        max={11}
        step={1}
        marks
        valueLabelDisplay="auto"
        onChange={handleSliderChange}
      />
    </div>
    )
}