import { FormPageHeader } from "@/components/form-page-header";
import { requireSession } from "@/lib/better-auth/server-auth";
import { redirect } from "next/navigation";
import { fetchCategoryById } from "@/actions/db/queries";
import { EditCategoryForm } from "@/components/posts/post-categories/edit-form";
import { UpdateCategoryType } from "@/features/categories/categories.types";

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
      name: "Posts",
      url: "/posts",
    },
    {
      id: 3,
      name: "Categories",
      url: "/posts/categories",
    },
    {
      id: 4,
      name: "Edit",
      url: `/posts/categories/${id}/edit`,
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
