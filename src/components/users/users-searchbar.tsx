"use client";

import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";

export const UsersSearchBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("page", "1");

      if (term.trim()) {
        params.set("query", term.trim());
      } else if (!term.trim()) {
        params.delete("query");
      }

      router.replace(`${pathname}?${params.toString()}`);
    }, 300);
  };
  return (
    <div className="flex-1 mx-auto w-full max-w-2/5 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
      <div className="relative">
        <Search className="absolute left-2 top-5 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        <label htmlFor="term" className="sr-only">
          Search
        </label>
        <input
          type="text"
          name="term"
          placeholder="Search ..."
          className="w-full pl-7 pr-2 py-1 rounded-sm border border-gray-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all invalid:text-gray-100"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};
