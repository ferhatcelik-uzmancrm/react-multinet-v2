import React, { createContext, useContext, useEffect, useState } from "react";
import { BrandOptions } from "../enums/Enums";

type AppContextData = {
  count: number;
  incrementCount: () => void;
  selectedBrand: BrandOptions;
  currentDate: string;
  currentTime: string;
  updateTaskData: (newData: string[]) => void;
  taskData: string[];
  updateIsAccount: (data: boolean) => void;
  isAccount: boolean;
};

const AppContext = createContext<AppContextData | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
}

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [count, setCount] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState<BrandOptions>(
    BrandOptions.Default
  ); //MANAGE SELECTED BRAND HERE. It will be changed when brand comes from API
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [taskData, setTaskData] = useState([""]);
  const [isAccount, setIsAccount] = useState(false); //Check company detail is 'Contact' or 'Account' then show-hide fields by

  useEffect(() => {
    const brand = sessionStorage.getItem("brand");
    switch (brand) {
      case "Multinet":
        setSelectedBrand(BrandOptions.Multinet);
        break;
      default:
        break;
    }
  }, []);

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 10); // YYYY-MM-DD
      const formattedTime = now.toTimeString().slice(0, 5); // HH:mm

      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    };
    const intervalId = setInterval(updateDateTime, 60000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const updateTaskData = (newData: string[]) => {
    setTaskData(newData);
  };

  const updateIsAccount = (data: boolean) => {
    setIsAccount(data);
  };

  const contextValue: AppContextData = {
    count,
    incrementCount,
    selectedBrand,
    currentDate,
    currentTime,
    updateTaskData,
    taskData,
    updateIsAccount,
    isAccount,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
