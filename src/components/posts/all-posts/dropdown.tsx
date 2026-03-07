import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Eye, FilePen } from "lucide-react";
import Link from "next/link";

import { DeleteButton } from "@/components/delete-button";
import { deletePostById } from "@/features/posts/posts.service";

interface Props {
  id: string;
}
export const DropDown = ({ id }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="border-none" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-1">
        <DropdownMenuItem
          asChild
          className="bg-brand-green cursor-pointer hover:bg-brand-hover/90"
        >
          <Link
            className="flex items-center hover:text-white gap-2 text-white"
            href={`/posts/${id}/preview`}
          >
            <Eye className="size-4 text-white" /> <span className="">View</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="bg-brand-blue cu hover:bg-brand-blue/90"
        >
          <Link
            className="flex items-center gap-2 text-white"
            href={`/posts/${id}/edit`}
          >
            <FilePen className="size-4 text-white" /> <span>Edit</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          variant="destructive"
          className="bg-destructive"
        >
          <DeleteButton
            id={id}
            handler={deletePostById}
            dialogTitle="Are you absolutely sure?"
            dialogDescription="This action cannot be undone. This will permanently delete your post
            from database."
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
