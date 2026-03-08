"use client";
import { Save } from "lucide-react";
import { Button } from "../../ui/button";
import { Spinner } from "../../ui/spinner";
import { ChangeEvent, useActionState, useEffect, useState } from "react";

import { slugify } from "@/utils/slugify";

import { useRouter } from "next/navigation";
import { validateCreateCategoryForm } from "@/features/categories/categories.service";
import { CreateCategoryFormResponseType } from "@/features/categories/categories.types";

interface FormFields {
  name: string;
  slug: string;
}

export const NewCategoryForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormFields>({
    name: "",
    slug: "",
  });

  const handleFormFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const data =
        name === "name"
          ? {
              ...prev,
              ...{
                name: value,
                slug: slugify(value),
              },
            }
          : { ...prev, [name]: value };

      // console.table(data);
      return data;
    });
  };

  const initialState: CreateCategoryFormResponseType = {
    errors: {},
    success: false,
    errorMessage: null,
  };

  const [state, formAction, isPending] = useActionState(
    validateCreateCategoryForm,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      setFormData({
        name: "",
        slug: "",
      });
      router.push(`/posts/categories`);
    }
  }, [state, router]);

  return (
    <div className="w-full  overflow-hidden p-4">
      <div className="bg-sidebar rounded-md shadow-md p-2 md:p-4 border border-gray-100 mx-auto flex flex-col h-full  sm:max-w-[900px]">
        <div className="relative flex items-center mb-2">
          <h3 className="text-2xl font-serif font-bold text-brand-blue">
            New Category
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
                  htmlFor="slug"
                  className="text-sm font-semibold text-brand-blue"
                >
                  Slug
                </label>
                <input
                  id="slug"
                  type="text"
                  name="slug"
                  autoComplete="off"
                  className="bg-white w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 outline-none transition-all"
                  value={formData.slug}
                  onChange={handleFormFieldChange}
                />
                {state.errors.slug && (
                  <small className="text-xs text-red-500">
                    {state.errors.slug}
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
