import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminOrderContextProvider from "./AdminOrderContext";
import { authOptions } from "@/app/api/auth/authOptions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    redirect("/forbidden");
  }
  return <AdminOrderContextProvider>{children}</AdminOrderContextProvider>;
}
