"use client";

import { createContext } from "react";
export const AdminOrderContext = createContext<object | null>(null);

interface AdminOrderContextProviderProps {
  children: React.ReactNode;
}

export default function AdminOrderContextProvider({
  children,
}: AdminOrderContextProviderProps) {
  return (
    <AdminOrderContext.Provider value={null}>
      {children}
    </AdminOrderContext.Provider>
  );
}
