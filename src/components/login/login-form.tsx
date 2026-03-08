"use client";

import { LogIn } from "lucide-react";
import { ChangeEvent, useActionState, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import { LoginUserFormState } from "@/features/auth/auth.types";
import { validateLogin } from "@/features/auth/auth.service";

export function LoginForm() {
  const router = useRouter();

  const initialState: LoginUserFormState = {
    errors: {},
    errorMessage: null,
    success: false,
  };

  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const [state, formAction, isPending] = useActionState(
    validateLogin,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      setFormFields({
        email: "",
        password: "",
      });
      router.replace("/");
    }
  }, [state, state.success, router]);

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 w-full sm:max-w-[500px]">
        <h3 className="text-2xl font-serif font-bold text-brand-blue mb-8">
          Login
        </h3>
        {state.errorMessage && (
          <p className="text-red-500 text-center pt-1 capitalize">
            {state.errorMessage}
          </p>
        )}

        <form action={formAction} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-semibold text-brand-blue"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 outline-none transition-all"
              placeholder="john@doe.com"
              onChange={handleFormChange}
              value={formFields.email}
            />
            {state.errors.email && (
              <small className="text-xs -mt-1 text-red-500">
                {state.errors.email}
              </small>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-semibold text-brand-blue"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 outline-none transition-all"
              onChange={handleFormChange}
              value={formFields.password}
            />
            {state.errors.password && (
              <small className="text-xs -mt-1 text-red-500">
                {state.errors.password}
              </small>
            )}
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="cursor-pointer w-full bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl h-14 text-lg font-bold transition-all shadow-lg hover:shadow-brand-blue/20"
          >
            {isPending ? (
              <Spinner className="ml-2 h-5 w-5 text-center" />
            ) : (
              <>
                <LogIn className="ml-2 h-5 w-5" />
                Login
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
