import { FormPageHeader } from "@/components/form-page-header";
import { redirect } from "next/navigation";
import { EditPostForm } from "@/components/posts/edit-post/edit-form";
import { fetchPostByIdForEdit } from "@/features/posts/posts.queries";
import { fetchCategories } from "@/features/categories/categories.queries";
import { requireSession } from "@/features/auth/authorize";

export default async function PostEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const post = await fetchPostByIdForEdit(id);
  if (!post) {
    redirect(`/posts/${id}/preview`);
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
      name: "Edit Post",
      url: `/posts/${id}/edit`,
    },
  ];
  const categories = await fetchCategories();
  return (
    <div className="h-full flex flex-col">
      <FormPageHeader
        title="Edit Post"
        subTitle="  Fill the form below and submit to preview draft"
        urlList={urlList}
      />
      <EditPostForm post={post} categories={categories} postId={id} />
    </div>
  );
}
