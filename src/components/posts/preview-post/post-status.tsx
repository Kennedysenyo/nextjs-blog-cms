import { cn } from "@/lib/utils/utils";

interface Props {
  postStatus: string;
}

export const PostStatus = ({ postStatus }: Props) => {
  return (
    <div className="flex items-center ">
      <span className="hidden md:block mr-1 text-brand-blue text-sm">
        Status:
      </span>
      <span
        className={cn(
          "py-1 px-2 border border-gray-100 text-sm  rounded-lg  self-start",
          postStatus === "draft" && "bg-brand-gold text-brand-blue",
          postStatus === "published" && "bg-brand-green text-white",
          postStatus === "archived" && "bg-black text-white",
        )}
      >
        {postStatus}
      </span>
    </div>
  );
};
