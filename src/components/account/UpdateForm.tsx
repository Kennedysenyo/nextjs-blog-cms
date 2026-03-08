"use client";

import { Spinner } from "@/components/ui/spinner";
import { validateUpdatePersonalAccountForm } from "@/features/users/users.service";
import {
  SelectUpdatePersonalAccount,
  UpdatePersonalAcountFormState,
} from "@/features/users/users.types";

import { Save } from "lucide-react";
import { ChangeEvent, useActionState, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface Props {
  data: SelectUpdatePersonalAccount;
}

export const UpdateAccountForm = ({ data }: Props) => {
  const [formData, setFormData] = useState<
    Omit<SelectUpdatePersonalAccount, "id">
  >({
    name: data.name,
    email: data.email,
  });

  const handleFormFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const initialState: UpdatePersonalAcountFormState = {
    errors: {},
    success: false,
    errorMessage: null,
  };

  const [state, formAction, isPending] = useActionState(
    validateUpdatePersonalAccountForm.bind(null, data.id),
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Updated Successfully");
    }
  }, [state]);

  return (
    <div className="w-full  overflow-hidden p-4">
      <div className="bg-sidebar rounded-md shadow-md p-2 md:p-4 border border-gray-100 mx-auto flex flex-col h-full  sm:max-w-[900px]">
        <div className="relative flex items-center mb-2">
          <h3 className="text-2xl font-serif font-bold text-brand-blue">
            Update Account
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
                  className="bg-white w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 outline-none transition-all"
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
                  htmlFor="amail"
                  className="text-sm font-semibold text-brand-blue"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  name="email"
                  autoComplete="off"
                  readOnly
                  className="bg-white w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 outline-none transition-all hover:cursor-not-allowed"
                  value={formData.email}
                />
                {state.errors.email && (
                  <small className="text-xs text-red-500">
                    {state.errors.email}
                  </small>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            aria-disabled={isPending}
            className="cursor-pointer w-full bg-brand-blue hover:bg-brand-blue/90 text-white rounded-md h-14 text-lg font-bold transition-all shadow-lg hover:shadow-brand-blue/20 "
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
