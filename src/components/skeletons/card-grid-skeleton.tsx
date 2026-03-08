export const CardSkeleton = () => {
  return (
    <div className="relative overflow-hidden w-full shadow-md p-2 md:p-4 rounded-lg aspect-[2/1.5] flex flex-col justify-center items-center space-y-4 bg-gray-200 animate-pulse">
      <div className="h-10 w-24 bg-gray-300 rounded-md" />

      <div className="flex justify-center items-center gap-3">
        <div className="w-7 h-7 bg-gray-300 rounded-md" />
        <div className="h-6 w-28 bg-gray-300 rounded-md" />
      </div>

      <div className="w-40 h-40 absolute -top-7 -right-8 bg-gray-300 rounded-full opacity-20" />
    </div>
  );
};

export const CardGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
};
