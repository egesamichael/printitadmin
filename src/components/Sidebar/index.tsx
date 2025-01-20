"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import SidebarItem from "@/components/Sidebar/SidebarItem";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "",
    menuItems: [
      {
        label: "Dashboard",
        route: "/dashboard",
      },
     
      {
        label: "Print",
        children: [
          { label: "View", route: "/design/view" },
          {
            label: "Orders",
            children: [
              { label: "Documents", route: "/print/orders/documents" },
              { label: "Pending", route: "/design/orders/pending" },
              { label: "Shipped", route: "/design/orders/shipped" },
            ],
          },
        ],
      },
      ,
      {
        label: "Design",
        children: [
          { label: "View", route: "/design/view" },
          {
            label: "Orders",
            children: [
              { label: "Drafts", route: "/design/orders/drafts" },
              { label: "Pending", route: "/design/orders/pending" },
              { label: "Shipped", route: "/design/orders/shipped" },
            ],
          },
        ],
      },

      ,
      {
        label: "Brand",
        children: [
          { label: "View", route: "/brand/view" },
          {
            label: "Orders",
            children: [
              { label: "Drafts", route: "/design/orders/drafts" },
              { label: "Pending", route: "/design/orders/pending" },
              { label: "Shipped", route: "/design/orders/shipped" },
            ],
          },
        ],
      },
      
      {
        label: "Bid",
        children: [
          { label: "View", route: "/design/view" },
          {
            label: "Orders",
            route: "/bids/orders",
          },
        ],
      },
      ,
      {
        label: "Stationary",
        children: [
          { label: "View", route: "/stationary/view" },
          {
            label: "Orders", },
        ],
      },
      ,
      {
        label: "Equipment",
        children: [
          { label: "Categories", route: "/equipment/view" },
          { label: "Products", route: "/equipment/products" },
          { label: "Orders", },
        ],
      },
      {
        label: "Users",
        route: "/users",
      },
      // etc.
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`
          fixed left-0 top-0 z-9999 h-screen w-72 flex-col
          bg-black duration-300 ease-linear dark:bg-boxdark
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/">
            <Image
              width={176}
              height={32}
              src={"/images/logo/logo.png"}
              alt="Logo"
              priority
            />
          </Link>

          {/* Mobile Close */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* your path here */}
              <path d="..." />
            </svg>
          </button>
        </div>

        {/* SIDEBAR MENU */}
        <div className="flex flex-col overflow-y-auto no-scrollbar">
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.name && (
                  <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                    {group.name}
                  </h3>
                )}

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      // You can remove pageName/setPageName 
                      // if you now handle "active" state differently.
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
