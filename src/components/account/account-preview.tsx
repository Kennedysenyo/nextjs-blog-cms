import { fetchUserDetails } from "@/features/users/users.queries";
import Image from "next/image";

export const AccountPreview = async () => {
  const userDetails = await fetchUserDetails();
  return (
    <div className="p-4 flex flex-col">
      <div className=" flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2 rounded-lg shadow-md ">
        <div className="relative bg-sidebar h-[350px] mx-auto w-full flex justify-center items-center">
          <div className="absolute w-full h-full max-w-[300px] max-h-[300px] rounded-full">
            <Image
              src={userDetails.image || "/user-placeholder.png"}
              alt={`Profile picture of ${userDetails.name}`}
              fill
            />
          </div>
        </div>
        <div className="bg-sidebar p-2">
          <ul className="bg-white border border-gray-300/50 p-2 rounded h-full flex flex-col gap-2">
            <li className="p-2 border border-gray-300/50 w-full truncate">
              <span className="font-bold text-brand-blue">ID:</span>{" "}
              {userDetails.id}
            </li>
            <li className="p-2 border border-gray-300/50 w-full truncate">
              <span className="font-bold text-brand-blue">NAME:</span>{" "}
              {userDetails.name}
            </li>
            <li className="p-2 border border-gray-300/50 w-full truncate">
              <span className="font-bold text-brand-blue">EMAIL:</span>{" "}
              {userDetails.email}
            </li>
            <li className="p-2 border border-gray-300/50 w-full truncate">
              <span className="font-bold text-brand-blue">ROLE:</span>{" "}
              {userDetails.role}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
