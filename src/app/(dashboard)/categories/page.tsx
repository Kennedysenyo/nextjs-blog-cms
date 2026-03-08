import { AddButton } from "@/components/AddButton";
import Pagination from "@/components/posts/all-posts/Paginations";
import { Filter } from "@/components/posts/post-categories/filter";
import { CategoriesTable } from "@/components/posts/post-categories/table";
import { CategoriesTableSkeleton } from "@/components/skeletons/categories-table-skeleton";
import { fetchCategoriesTotalPages } from "@/features/categories/categories.queries";
import { requireSession } from "@/lib/better-auth/server-auth";

import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string | string[];
    page?: string;
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

  const currentPage = params.page || "1";
  const totalPages = await fetchCategoriesTotalPages(term);

  return (
    <div className="p-4 md:px-8 h-full flex flex-col overflow-y-auto">
      <div className="p-4 flex justify-end">
        <Filter />
        <AddButton url="/categories/new" label="Add Category" />
      </div>
      <Suspense key={currentPage + term} fallback={<CategoriesTableSkeleton />}>
        <CategoriesTable currentPage={currentPage} term={term} />
      </Suspense>

      <div className="flex items-center justify-center mt-6">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
