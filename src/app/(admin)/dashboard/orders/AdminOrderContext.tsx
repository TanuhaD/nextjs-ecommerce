"use client";

import { createContext, use, useEffect, useState } from "react";

interface AdminOrderContextValue {
  orderId: string | null;
  setOrderId: React.Dispatch<React.SetStateAction<string | null>>;
}
interface AdminOrderContextProviderProps {
  children: React.ReactNode;
}
export const AdminOrderContext = createContext<AdminOrderContextValue | null>(
  null,
);

export default function AdminOrderContextProvider({
  children,
}: AdminOrderContextProviderProps) {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderContextValue, setOrderContextValue] =
    useState<AdminOrderContextValue | null>(null);

  useEffect(() => {
    setOrderContextValue({
      orderId,
      setOrderId: (newOrderId) => {
        // Дополнительные проверки или логика установки orderId
        console.log("newOrderId", newOrderId);
        setOrderId(newOrderId);
      },
    });
  }, [orderId]);
  // const contextValue: AdminOrderContextValue = {
  //   orderId,

  //   setOrderId: (newOrderId) => {
  //     // Дополнительные проверки или логика установки orderId
  //     console.log("newOrderId", newOrderId);
  //     setOrderId(newOrderId);
  //   },
  // };
  return (
    <AdminOrderContext.Provider value={orderContextValue}>
      {children}
    </AdminOrderContext.Provider>
  );
}
