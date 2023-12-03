"use client";

import { closeDropdowns } from "@/lib/closeDropdowns";
import Link from "next/link";

import AdminNavBarMobMenu from "./AdminNavBarMobMenu";
import { redirect } from "next/navigation";

export default function AdminNavBar() {
  return (
    <div className="navbar  m-auto flex min-w-[300px] max-w-7xl   justify-between rounded-md border bg-base-100 p-4">
      <h1 className="btn btn-ghost text-xl">Admin panel</h1>

      <div className="md:hidden">
        <AdminNavBarMobMenu />
      </div>
      <ul className="font-bold sm:hidden md:flex">
        <li className="mx-4 my-6  md:my-0" onClick={closeDropdowns}>
          <Link
            href={"/dashboard/orders"}
            className="hover:text-primary focus:text-primary"
          >
            All orders
          </Link>
        </li>
        <li className="mx-4 my-6  md:my-0" onClick={closeDropdowns}>
          <Link
            href={"/dashboard/add-product"}
            className="hover:text-primary focus:text-primary"
          >
            Add Product
          </Link>
        </li>
        <li className="mx-4 my-6 md:my-0" onClick={closeDropdowns}>
          <Link
            href={"/dashboard"}
            className="focus:primery hover:text-primary"
          >
            All Products
          </Link>
        </li>
      </ul>
    </div>
  );
}
