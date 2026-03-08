export const RecentsSkeleton = () => {
  return (
    <div className="bg-sidebar rounded-md border border-gray-300 p-2 flex flex-col animate-pulse">
      <div className="p-2 rounded-md border border-gray-300/50 bg-white">
        <div className="h-5 w-40 mx-auto bg-gray-300 rounded" />
      </div>

      <div className="flex p-2 items-center gap-4">
        <div className="h-4 w-16 bg-gray-300 rounded ml-3" />
        <div className="h-4 w-20 bg-gray-300 rounded sm:ml-7 md:ml-14" />
        <div className="h-4 w-16 bg-gray-300 rounded ml-auto mr-3" />
      </div>

      <ul className="p-2 border border-gray-300/50 flex-1 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i}>
            <div className="p-3 relative flex gap-4 items-center bg-white border border-gray-300">
              <div className="hidden md:block absolute top-[50%] -translate-y-[50%] w-[40px] h-[40px] rounded-full bg-gray-300" />

              <div className="md:ml-11 h-4 w-24 bg-gray-300 rounded" />

              <div className="h-4 w-40 bg-gray-300 rounded max-w-[50%]" />

              <div className="ml-auto h-4 w-20 bg-gray-300 rounded" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const RecentsSectionSkeleton = () => {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <RecentsSkeleton />
        <RecentsSkeleton />
      </div>
    </div>
  );
};
