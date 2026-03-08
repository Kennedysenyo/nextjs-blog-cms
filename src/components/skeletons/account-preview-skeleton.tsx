export const AccountPreviewSkeleton = () => {
  return (
    <div className="p-4 flex flex-col animate-pulse">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2 rounded-lg shadow-md">
        {/* Image section */}
        <div className="relative bg-sidebar h-[350px] mx-auto w-full flex justify-center items-center">
          <div className="absolute w-full h-full max-w-[300px] max-h-[300px] rounded-full bg-gray-300" />
        </div>

        {/* Details section */}
        <div className="bg-sidebar p-2">
          <ul className="bg-white border border-gray-300/50 p-2 rounded h-full flex flex-col gap-2">
            <li className="p-2 border border-gray-300/50 w-full">
              <div className="h-4 w-48 bg-gray-300 rounded" />
            </li>

            <li className="p-2 border border-gray-300/50 w-full">
              <div className="h-4 w-40 bg-gray-300 rounded" />
            </li>

            <li className="p-2 border border-gray-300/50 w-full">
              <div className="h-4 w-56 bg-gray-300 rounded" />
            </li>

            <li className="p-2 border border-gray-300/50 w-full">
              <div className="h-4 w-24 bg-gray-300 rounded" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
