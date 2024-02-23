import logo from "@/assets/logo2.png";
import { GetCart } from "@/lib/db/cart";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import ShoppingCartButton from "./ShoppingCartButton";
import UserMenuButton from "./UserMenuButton";
import { authOptions } from "@/app/api/auth/authOptions";

async function searchProducts(formData: FormData) {
  "use server";

  const searchQuery = formData.get("searchQuery")?.toString();
  if (searchQuery) {
    redirect("/search?query=" + searchQuery);
  }
}

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const cart = await GetCart();
  return (
    <div id="navbar" className="bg-base-100">
      <div className="navbar m-auto max-w-7xl flex-col gap-2 md:flex-row">
        <div className="flex-1">
          <Link
            href="/"
            className="btn border-none bg-transparent normal-case hover:bg-transparent  hover:text-primary sm:text-xl md:text-2xl lg:text-3xl"
          >
            <Image src={logo} height={40} width={40} alt="PrimePicks logo" />
            PrimePicks
          </Link>
        </div>
        <div className="flex-none gap-2">
          <form action={searchProducts}>
            <div className="form-control">
              <input
                className=" input input-bordered w-full min-w-[100px]"
                name="searchQuery"
                placeholder="Search"
              />
            </div>
          </form>
          <ShoppingCartButton cart={cart} />
          <UserMenuButton session={session} />
        </div>
      </div>
    </div>
  );
}
