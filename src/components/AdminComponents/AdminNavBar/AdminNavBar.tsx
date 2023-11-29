"use client";

import MenuIcon from "@/components/MenuIcon";
import { closeDropdowns } from "@/lib/closeDropdowns";
import Link from "next/link";
import { useRef, useState } from "react";
import AdminNavBarMobMenu from "./AdminNavBarMobMenu";

export default function AdminNavBar() {
  return (
    <div className="navbar  flex justify-between bg-base-100">
      <h1 className="btn btn-ghost text-xl">Admin panel</h1>

      <div className="md:hidden">
        <AdminNavBarMobMenu />
      </div>
      <ul className="hidden font-bold md:flex">
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
