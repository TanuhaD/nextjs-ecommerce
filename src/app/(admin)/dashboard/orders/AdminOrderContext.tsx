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
  console.log("component rerender; orderId", orderId);
  const mySetOrderId = (newOrderId: string) => {
    console.log("newOrderId", newOrderId);
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
      <div>Admin order context</div>
      <div>{orderId || "no order id"}</div>
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
