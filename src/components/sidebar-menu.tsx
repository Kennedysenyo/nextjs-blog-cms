"use client";

import Link from "next/link";
import { SidebarGroup, SidebarMenuItem } from "./ui/sidebar";
import {
  CircleUserRound,
  FilePlus,
  FileText,
  LayoutDashboard,
  List,
  ListPlus,
  LucideProps,
  UserRoundPlus,
  Users2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";

interface SubRoutes {
  name: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  url: string;
}

interface SidebarNavType {
  id: number;
  name: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  isOpen?: boolean;
  url?: string;
  subRoutes?: SubRoutes[];
}

export const SidebarMenu = () => {
  const [sidebarContent, setSidebarContent] = useState<SidebarNavType[]>([
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutDashboard,
      url: "/",
    },
    {
      id: 2,
      name: "Posts",
      icon: FileText,
      isOpen: false,
      subRoutes: [
        {
          name: "All Posts",
          icon: FileText,
          url: "/posts",
        },
        {
          name: "Add Post",
          icon: FilePlus,
          url: "/posts/new",
        },
      ],
    },
    {
      id: 3,
      name: "Categories",
      icon: List,
      isOpen: false,
      subRoutes: [
        {
          name: "All categories",
          icon: FileText,
          url: "/categories",
        },
        {
          name: "Add Category",
          icon: ListPlus,
          url: "/categories/new",
        },
      ],
    },
    {
      id: 4,
      name: "Users",
      icon: Users2,
      isOpen: false,
      subRoutes: [
        {
          name: "All Users",
          icon: FileText,
          url: "/users",
        },
        {
          name: "Add User",
          icon: UserRoundPlus,
          url: "/users/new",
        },
      ],
    },

    {
      id: 5,
      name: "Account",
      icon: CircleUserRound,
      url: "/account",
    },
  ]);

  const pathname = usePathname();

  const toggleMenu = (id: number) => {
    setSidebarContent((prev) =>
      prev.map((menu) =>
        menu.subRoutes
          ? menu.id === id
            ? { ...menu, isOpen: !menu.isOpen }
            : menu
          : menu,
      ),
    );
  };

  return (
    <>
      <SidebarGroup className="space-y-4 flex-1">
        {sidebarContent.map((menu) =>
          menu.subRoutes ? (
            <SidebarMenuItem
              key={menu.id}
              className=" cursor-pointer bg-white  "
            >
              <span
                onClick={() => toggleMenu(menu.id)}
                className={cn(
                  "w-full bg-white flex gap-2 shadow-md items-center justify-content px-2 py-4 hover:bg-brand-blue/90 hover:text-white transition-all duration-300 rounded-md border border-top-brand-blue",

                  pathname.includes(menu.name.toLocaleLowerCase()) &&
                    "bg-brand-blue text-white",
                )}
              >
                <menu.icon className=" w-6 h-6" />
                <span>{menu.name}</span>
              </span>

              <div
                className={cn(
                  "flex flex-col space-y-2 bg-sidebar border border-gray-100 overflow-hidden transition-all duration-300 bg-brand-blue/10",
                  menu.isOpen ? "h-auto p-2 pl-4" : "h-0 min-h-0 p-0",
                )}
              >
                {menu.subRoutes.map((nav) => (
                  <Link
                    key={nav.name}
                    className={cn(
                      "flex items-center gap-2 text-sm bg-sidebar border border-gray-100 bg-white hover:text-white hover:bg-brand-blue/80 p-1 rounded-sm",
                      pathname === nav.url && "bg-brand-blue/90 text-white",
                    )}
                    href={nav.url}
                  >
                    {<nav.icon className="size-5" />}
                    {nav.name}
                  </Link>
                ))}
              </div>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem
              key={menu.id}
              className={cn(
                "shadow-md bg-white hover:bg-brand-blue/90 hover:text-white transition-all duration-300 rounded-md border border-top-brand-blue",
                pathname === menu.url && "bg-brand-blue text-white",
              )}
            >
              <Link
                href={menu.url!}
                className="w-full flex gap-2 items-center justify-content px-2 py-4"
              >
                <menu.icon className=" w-6 h-6" />
                <span>{menu.name}</span>
              </Link>
            </SidebarMenuItem>
          ),
        )}
      </SidebarGroup>
    </>
  );
};
