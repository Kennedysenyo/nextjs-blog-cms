import { AddButton } from "@/components/AddButton";
import { Filter } from "@/components/posts/all-posts/filter";
import Pagination from "@/components/posts/all-posts/Paginations";

import { PostTable } from "@/components/posts/all-posts/table";
import { PostTableSkeleton } from "@/components/skeletons/post-table-skeleton";
import { requireSession } from "@/features/auth/authorize";
import { fetchCategoriesAndPostsTotalPages } from "@/features/posts/posts.queries";

import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string | string[];
    page?: string;
    cat?: string;
    status?: string;
  }>;
}) {
  const session = await requireSession();

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const term = Array.isArray(params.query)
    ? params.query[0]
    : params.query || "";
  const category = params.cat || "";
  const status = params.status || "";
  const currentPage = params.page || "1";

  const { totalPages, categories } = await fetchCategoriesAndPostsTotalPages(
    term,
    category,
    status,
  );
  // console.table(posts);
  return (
    <div className="p-4 md:px-8 h-full flex flex-col overflow-y-auto">
      <div className="p-4 flex justify-between">
        <Filter categories={categories} />
        <AddButton url="/posts/new" label="Add Post" />
      </div>
      <Suspense
        key={term + category + status + currentPage}
        fallback={<PostTableSkeleton />}
      >
        <PostTable
          currentPage={currentPage}
          term={term}
          category={category}
          status={status}
        />
      </Suspense>

      <div className="flex items-center justify-center mt-6">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
