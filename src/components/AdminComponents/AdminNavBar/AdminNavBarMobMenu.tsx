import MenuIcon from "@/components/MenuIcon";
import { closeDropdowns } from "@/lib/closeDropdowns";
import Link from "next/link";

export default function AdminNavBarMobMenu() {
  return (
    <div className="  dropdown dropdown-end flex">
      <button className=" mx-2 block cursor-pointer  ">
        <MenuIcon />
      </button>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1] mt-[54px] w-52 items-center rounded-box bg-base-100 p-2 font-bold shadow-lg  "
      >
        <li className="mx-4 my-6 md:my-0" onClick={closeDropdowns}>
          <Link href={"/dashboard/orders"}>All orders</Link>
        </li>
        <li className="mx-4 my-6 md:my-0" onClick={closeDropdowns}>
          <Link href={"/dashboard/add-product"}>Add Product</Link>
        </li>
        <li className="mx-4 my-6 md:my-0" onClick={closeDropdowns}>
          <Link href={"/dashboard"}>All Products</Link>
        </li>
      </ul>
    </div>
  );
}
