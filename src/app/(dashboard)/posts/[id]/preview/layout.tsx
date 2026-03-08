import { ActionsBar } from "@/components/posts/preview-post/actions-bar";
import { fetchPostStatus } from "@/features/posts/posts.queries";
import { ReactNode } from "react";

export default async function PreviewLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await fetchPostStatus(id);
  return (
    <div className="relative h-full">
      <ActionsBar postId={post.id} postStatus={post.status} />
      <div className=" h-full">{children}</div>
    </div>
  );
}
