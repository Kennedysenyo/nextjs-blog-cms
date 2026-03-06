import { NewPostForm } from "@/components/posts/new-post/post-form";
import { FormPageHeader } from "@/components/form-page-header";
import { requireSession } from "@/lib/better-auth/server-auth";
import { redirect } from "next/navigation";
import { fetchCategories } from "@/features/categories/categories.queries";
import { CategorySelectType } from "@/features/categories/categories.types";

export default async function NewPostPage() {
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
      name: "New Post",
      url: "/posts/new",
    },
  ];
  const categories: CategorySelectType[] = await fetchCategories();
  return (
    <div className="h-full flex flex-col">
      <FormPageHeader
        title="Create New Post"
        subTitle="  Fill the form below and submit to preview draft"
        urlList={urlList}
      />
      <NewPostForm categories={categories} />
    </div>
  );
}
