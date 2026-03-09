"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { validateSEOForm } from "@/features/posts/posts.service";
import {
  CreateSeoInput,
  SeoFormResponseType,
} from "@/features/posts/posts.types";
import { cn } from "@/lib/utils/utils";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useActionState, useEffect, useState } from "react";

interface Props extends CreateSeoInput {
  id: string;
}

export const SEOForm = ({
  id,
  metaTitle,
  metaDescription,
  keywords,
}: Props) => {
  const [formData, setFormData] = useState<CreateSeoInput>({
    metaTitle,
    metaDescription,
    keywords,
  });

  const router = useRouter();

  const [keywordsCount, setKeywordsCount] = useState(
    () =>
      formData.keywords
        .join()
        .split(/\s*,\s*/)
        .map((k) => k.trim())
        .filter((k) => k.length > 0).length,
  );

  const handleFormFieldChange = (
    e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const data = { ...prev, [name]: name === "keywords" ? [value] : value };
      setKeywordsCount(
        data.keywords
          .join(" ")
          .split(/\s*,\s*/)
          .filter(Boolean).length,
      );
      return data;
    });
  };

  const initialState: SeoFormResponseType = {
    errors: {},
    success: false,
    errorMessage: null,
  };
  const [state, formAction, isPending] = useActionState(
    validateSEOForm.bind(null, id),
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      router.push(`/posts/${id}/preview`);
    }
  }, [state.success]);

  return (
    <div className="w-full flex-1 overflow-hidden p-4">
      <div className="bg-sidebar rounded-md shadow-md p-2 md:p-4 border border-gray-100 mx-auto flex flex-col h-full  sm:max-w-[900px]">
        <div className="relative flex items-center mb-2">
          <h3 className="text-2xl font-serif font-bold text-brand-blue">
            Edit Metadata
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
                  htmlFor="metaTitle"
                  className="text-sm font-semibold text-brand-blue"
                >
                  Meta Title
                </label>
                <input
                  id="metaTitle"
                  type="text"
                  name="metaTitle"
                  autoComplete="off"
                  className="bg-white w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 outline-none transition-all"
                  value={formData.metaTitle!}
                  onChange={handleFormFieldChange}
                />
                {state.errors.metaTitle && (
                  <small className="text-xs text-red-500">
                    {state.errors.metaTitle}
                  </small>
                )}
              </div>

              <div>
                <label
                  htmlFor="metaDescription"
                  className="text-sm font-semibold text-brand-blue"
                >
                  Meta Description
                </label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  rows={4}
                  autoComplete="off"
                  placeholder="e.g., There are ..."
                  className="bg-white w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 outline-none transition-all resize-none"
                  value={formData.metaDescription!}
                  onChange={handleFormFieldChange}
                />

                <div className="flex items-center space-between">
                  {state.errors.metaDescription && (
                    <small className="text-xs text-red-500">
                      {state.errors.metaDescription}
                    </small>
                  )}
                  <p className="ml-auto ">
                    <span
                      className={cn(
                        "text-green-500",
                        formData.metaDescription!.length > 160 &&
                          "text-red-500",
                        formData.metaDescription!.length < 120 &&
                          "text-yellow-500",
                      )}
                    >
                      {formData.metaDescription!.length}
                    </span>
                    /160
                  </p>
                </div>
              </div>
              <div>
                <label
                  htmlFor="keywords"
                  className="text-sm font-semibold text-brand-blue"
                >
                  Keywords (10 max)
                </label>
                <br />
                <small className="text-sm italic">
                  (add comma separated keywords (e.g., word1, word2,..etc.))
                </small>
                <textarea
                  id="keywords"
                  name="keywords"
                  rows={4}
                  autoComplete="off"
                  placeholder="e.g., There are ..."
                  className="bg-white w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 outline-none transition-all resize-none"
                  value={formData.keywords.join(" ")}
                  onChange={handleFormFieldChange}
                />

                <div className="flex items-center space-between">
                  {state.errors.keywords && (
                    <small className="text-xs text-red-500">
                      {state.errors.keywords}
                    </small>
                  )}
                  <p className="ml-auto ">
                    <span
                      className={cn(
                        "text-green-500",
                        keywordsCount > 10 && "text-red-500",
                      )}
                    >
                      {keywordsCount}
                    </span>
                    /10
                  </p>
                </div>
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
