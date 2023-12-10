"use client";

import { createContext, useState } from "react";
export const AdminOrderContext = createContext<string | null>(null);

interface AdminOrderContextProviderProps {
  children: React.ReactNode;
}

export default function AdminOrderContextProvider({
  children,
}: AdminOrderContextProviderProps) {
  // const [currentUser, setCurrentUser] = useState<string | null>("");
  return (
    <AdminOrderContext.Provider value={null}>
      {children}
    </AdminOrderContext.Provider>
  );
}
