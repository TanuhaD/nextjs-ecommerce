"use client";

import profilePicPleholder from "@/assets/profile-pic-placeholder.png";
import { closeDropdowns } from "@/lib/closeDropdowns";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
interface UserMenuButtonProps {
  session: Session | null;
}

export default function UserMenuButton({ session }: UserMenuButtonProps) {
  const user = session?.user;

  return (
    <>
      {!user && (
        <Link className="btn-ghost btn" href="/api/auth/signin">
          Sign In
        </Link>
      )}
      {user && (
        <div className="dropdown-end dropdown-hover dropdown flex">
          <label tabIndex={0} className="btn-ghost btn-circle btn">
            {user ? (
              <Image
                src={user?.image || profilePicPleholder}
                alt="Profile picture"
                width={40}
                height={40}
                className="w-10 rounded-full"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
            )}
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box z-[1] mt-5 w-52 bg-base-100 p-2 shadow"
          >
            <li onClick={closeDropdowns}>
              <Link href={"/orders"}>You orders</Link>
            </li>
            <li>
              <Link href="/api/auth/signout?callbackUrl=/">Sign out</Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
