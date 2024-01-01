import { env } from "@/lib/env";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import { redirect } from "next/navigation";
import "@/styles/globals.css";
import AdminNavBar from "@/components/AdminComponents/AdminNavBar/AdminNavBar";
import { authOptions } from "../../api/auth/authOptions";
import AdminOrderContextProvider from "./orders/AdminOrderContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(env.BASE_URL),
  title: "Flowmazon",
  description: "We make your wallet cry",
};

const RootAdminDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    redirect("/forbidden");
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminOrderContextProvider>
          <AdminNavBar />
          <main className=" m-auto min-w-[300px] max-w-7xl p-4">
            {children}
          </main>
        </AdminOrderContextProvider>
      </body>
    </html>
  );
};

export default RootAdminDashboardLayout;
