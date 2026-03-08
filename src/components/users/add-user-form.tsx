"use client";
import { Save } from "lucide-react";

import { ChangeEvent, useActionState, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import {
  CreateUserFormResponseType,
  CreateUserFormType,
} from "@/features/users/users.types";
import { validateCreateUserForm } from "@/features/users/users.service";

export const NewUserForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateUserFormType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const handleFormFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const data = { ...prev, [name]: value };

      // console.table(data);
      return data;
    });
  };

  const initialState: CreateUserFormResponseType = {
    errors: {},
    success: false,
    errorMessage: null,
  };

  const [state, formAction, isPending] = useActionState(
    validateCreateUserForm,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });
      router.push(`/users`);
    }
  }, [state, router]);

  return (
    <div className="w-full  overflow-hidden p-4">
      <div className="bg-sidebar rounded-md shadow-md p-2 md:p-4 border border-gray-100 mx-auto flex flex-col h-full  sm:max-w-[900px]">
        <div className="relative flex items-center mb-2">
          <h3 className="text-2xl font-serif font-bold text-brand-blue">
            New User
          </h3>

          {state.errorMessage && (
            <p className="absolute left-1/2 -translate-x-1/2 text-red-500">
              {state.errorMessage}
            </p>
          )}
        </div>

        <form
          action={formAction}
          className="flex-1 flex flex-col overflow-hidden "
        >
          <div className="flex-1 mb-4 overflow-y-auto border border-gray-200">
            <div className="space-y-6 p-2 md:p-4 bg-white">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-brand-blue"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  autoComplete="off"
                  className="bg-white w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-green/5 outline-none transition-all"
                  value={formData.name}
                  onChange={handleFormFieldChange}
                />
                {state.errors.name && (
                  <small className="text-xs text-red-500">
                    {state.errors.name}
                  </small>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-brand-blue"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="off"
                  className="bg-white w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-green/5 outline-none transition-all"
                  value={formData.email}
                  onChange={handleFormFieldChange}
                />
                {state.errors.email && (
                  <small className="text-xs text-red-500">
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
                  autoComplete="off"
                  className="bg-white w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-green/5 outline-none transition-all"
                  value={formData.password}
                  onChange={handleFormFieldChange}
                />
                {state.errors.password && (
                  <small className="text-xs text-red-500">
                    {state.errors.password}
                  </small>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-brand-blue"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  autoComplete="off"
                  className="bg-white w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-green/5 outline-none transition-all"
                  value={formData.confirmPassword}
                  onChange={handleFormFieldChange}
                />
                {state.errors.confirmPassword && (
                  <small className="text-xs text-red-500">
                    {state.errors.confirmPassword}
                  </small>
                )}
              </div>
              <div>
                <fieldset className="border border-gray-200 p-2 flex gap-4">
                  <legend className="text-sm font-semibold text-brand-blue">
                    Set User Role:
                  </legend>
                  <div className="flex items-center gap-2">
                    <label htmlFor="user">User</label>
                    <input
                      type="radio"
                      id="user"
                      name="role"
                      value="user"
                      checked={formData.role === "user"}
                      onChange={handleFormFieldChange}
                    ></input>
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="editor">Editor</label>

                    <input
                      type="radio"
                      id="editor"
                      name="role"
                      value="editor"
                      checked={formData.role === "editor"}
                      onChange={handleFormFieldChange}
                    ></input>
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="admin">Admin</label>

                    <input
                      type="radio"
                      id="admin"
                      name="role"
                      value={"admin"}
                      checked={formData.role === "admin"}
                      onChange={handleFormFieldChange}
                    ></input>
                  </div>
                </fieldset>
                {state.errors.role && (
                  <small className="text-xs text-red-500">
                    {state.errors.role}
                  </small>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="cursor-pointer w-full bg-brand-blue hover:bg-brand-blue/90 text-white rounded-md h-14 text-lg font-bold transition-all shadow-lg hover:shadow-brand-blue/20"
          >
            {isPending ? (
              <Spinner className="ml-2 h-5 w-5 text-center" />
            ) : (
              <>
                <Save className="ml-2 h-5 w-5" />
                Save
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
