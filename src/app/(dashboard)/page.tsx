import { CardGrid } from "@/components/home/card-grid";
import { HomeHeader } from "@/components/home/header";
import { RecentsSection } from "@/components/home/recent-data";
import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
import { RecentsSectionSkeleton } from "@/components/skeletons/recents-section-skeleton";
import { requireSession } from "@/features/auth/authorize";

import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Home() {
  let user;
  const session = await requireSession();
  if (session) {
    user = session.user;
  }
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto p-4 pb-10">
      <HomeHeader name={user?.name!} />
      <hr />
      <Suspense fallback={<CardGridSkeleton />}>
        <CardGrid />
      </Suspense>
      <Suspense fallback={<RecentsSectionSkeleton />}>
        <RecentsSection />
      </Suspense>
    </div>
  );
}
