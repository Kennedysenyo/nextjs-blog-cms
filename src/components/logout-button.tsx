"use client";

import { useTransition } from "react";
import { Spinner } from "./ui/spinner";

import { LogOut } from "lucide-react";
import { logOut } from "@/features/auth/auth.service";

function LogOutButton() {
  const [isPending, startTransition] = useTransition();

  const handleSignout = () => {
    startTransition(async () => {
      await logOut();
    });
  };
  return (
    <button
      onClick={handleSignout}
      className="shadow-md bg-white hover:bg-brand-blue/90 hover:text-white transition-all duration-300 rounded-md px-2 py-4 flex gap-2 items-center justify-content"
    >
      {isPending ? (
        <Spinner className="h-6 w-6" />
      ) : (
        <>
          <LogOut className="h-6 w-6" />
          <span>LogOut</span>
        </>
      )}
    </button>
  );
}

export default LogOutButton;
