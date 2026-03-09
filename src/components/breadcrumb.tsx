"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { cn } from "@/lib/utils/utils";

export interface BreadCrumbType {
  id: number;
  name: string;
  url: string;
}

interface BreadCrumbProps {
  urlList: BreadCrumbType[];
}

export const BreadCrumb = ({ urlList }: BreadCrumbProps) => {
  const pathname = usePathname();
  return (
    <Breadcrumb className="px-4 ">
      <BreadcrumbList>
        {urlList.map((link, index) => (
          <div key={link.id} className="flex items-center gap-1">
            <BreadcrumbItem>
              <BreadcrumbLink
                className={cn(
                  "hover:underline",
                  pathname === link.url && " opacity-70  pointer-events-none",
                  pathname !== link.url && "text-brand-blue",
                )}
                href={link.url}
              >
                {link.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index === urlList.length - 1 ? null : <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
