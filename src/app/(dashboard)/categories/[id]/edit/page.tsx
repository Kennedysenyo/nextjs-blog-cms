import { FormPageHeader } from "@/components/form-page-header";

import { redirect } from "next/navigation";

import { EditCategoryForm } from "@/components/posts/post-categories/edit-form";
import { UpdateCategoryType } from "@/features/categories/categories.types";
import { fetchCategoryById } from "@/features/categories/categories.queries";
import { requireSession } from "@/features/auth/authorize";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();

  if (!session) {
    redirect("/login");
  }
  const { id } = await params;

  const urlList = [
    {
      id: 1,
      name: "Dashboard",
      url: "/",
    },

    {
      id: 2,
      name: "Categories",
      url: "/categories",
    },
    {
      id: 3,
      name: "Edit",
      url: `/categories/${id}/edit`,
    },
  ];
  const category = await fetchCategoryById(id);
  return (
    <div className="h-full flex flex-col">
      <FormPageHeader
        title="Edit Category"
        subTitle="Update the data in the fields and click 'save'"
        urlList={urlList}
      />
      <EditCategoryForm category={category as UpdateCategoryType} />
    </div>
  );
}
