import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [csvData, setCsvData] = useState([]);
  const [chosenMonth, setChosenMonth] = React.useState(1);

  return (
    <DataContext.Provider value={{ csvData, setCsvData}}>
      {children}
    </DataContext.Provider>
  );
};
