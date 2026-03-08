import { AddButton } from "@/components/AddButton";
import Pagination from "@/components/posts/all-posts/Paginations";
import { UsersTableSkeleton } from "@/components/skeletons/users-table-skeleton";
import { UsersSearchBar } from "@/components/users/users-searchbar";
import { UsersTable } from "@/components/users/users-table";
import { fetchUsersTotalPages } from "@/features/users/users.queries";
import { requireSession } from "@/lib/better-auth/server-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function UsersPage({
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
  const totalPages = await fetchUsersTotalPages(term);

  return (
    <div className="p-4 md:px-8 h-full flex flex-col overflow-y-auto">
      <div className="p-4 flex justify-end">
        <UsersSearchBar />
        <AddButton url="/users/new" label="Add User" />
      </div>
      <Suspense key={currentPage + term} fallback={<UsersTableSkeleton />}>
        <UsersTable currentPage={currentPage} term={term} />
      </Suspense>

      <div className="flex items-center justify-center mt-6">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
