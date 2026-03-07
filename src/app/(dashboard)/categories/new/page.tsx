import { FormPageHeader } from "@/components/form-page-header";
import { requireSession } from "@/lib/better-auth/server-auth";
import { redirect } from "next/navigation";
import { NewCategoryForm } from "@/components/posts/post-categories/add-form";

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
      name: "New",
      url: "/posts/categories/new",
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
