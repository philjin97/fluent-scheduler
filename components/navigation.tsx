"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const isHomePage = pathname === "/onboard" || pathname === "/";
  const displayPage = pathname === "/onboard" || pathname === "/";

  return (
    <div
      className={`navbar h-[10vh]  ${
        isHomePage ? "bg-[#3f4166]" : "bg-white"
      } ${displayPage ? "" : "hidden"}`}
    >
      <div className="navbar-start w-[8rem]">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className={` ${isHomePage ? "text-white" : "text-black"}`}>
          {" "}
          <Link
            href="/"
            className={`btn btn-ghost  text-xl font-['Playwrite']`}
          >
            Fluent
          </Link>
        </div>
      </div>

      <div className="navbar-end w-[100%]">
        <a className="btn btn-ghost">
          <Image
            src={"/images/card.svg"}
            alt="profile"
            width={60}
            height={60}
            className="rounded-full"
          />
        </a>
      </div>
    </div>
  );
}
