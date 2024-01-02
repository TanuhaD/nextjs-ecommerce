"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AdminOrderContextValue {
  orderId: string | null;
  mySetOrderId: Function;
  // mySetOrderId: React.Dispatch<React.SetStateAction<string | null>>;
}
const initialContextValue: AdminOrderContextValue = {
  orderId: null,
  mySetOrderId: (newOrderId: string) => {},
};
interface AdminOrderContextProviderProps {
  children: React.ReactNode;
}
export const AdminOrderContext =
  createContext<AdminOrderContextValue>(initialContextValue);

export default function AdminOrderContextProvider({
  children,
}: AdminOrderContextProviderProps) {
  const [orderId, setOrderId] = useState<string | null>(null);

  const mySetOrderId = (newOrderId: string) => {
    setOrderId(newOrderId);
  };
  useEffect(() => {
    console.log("setup function");

    return () => {
      console.log("cleanup function");
    };
  }, []);
  return (
    <AdminOrderContext.Provider value={{ orderId, mySetOrderId }}>
      <div className="flex items-center justify-center p-6 font-bold text-info sm:flex-col md:flex-row">
        <p className="md:mr-3">Admin order information : </p>
        <p>{orderId || " no order "}</p>
      </div>
      {children}
    </AdminOrderContext.Provider>
  );
}

export const useAdminOrderContext = () => {
  const context = useContext(AdminOrderContext);
  if (!context) {
    throw new Error(
      "useAdminOrderContext must be used within an AdminOrderContextProvider",
    );
  }
  return context;
};
