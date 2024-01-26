import Navbar from "@/components/NavBar/NavBar";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer/Footer";
import SessionProvider from "./SessionProvider";
import { env } from "@/lib/env";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(env.BASE_URL),
  title: "PrimePicks",
  description: "We make your wallet cry",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          <main className=" m-auto min-w-[300px] max-w-7xl p-4">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
