import { FormPageHeader } from "@/components/form-page-header";
import { redirect } from "next/navigation";
import { NewCategoryForm } from "@/components/posts/post-categories/add-form";
import { requireSession } from "@/features/auth/authorize";

export default async function NewCategoryPage() {
  const session = await requireSession();

  if (!session) {
    redirect("/login");
  }

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
      name: "New",
      url: "/categories/new",
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <FormPageHeader
        title="Add Category"
        subTitle="Fill the form below to add new category"
        urlList={urlList}
      />
      <NewCategoryForm />
    </div>
  );
}
