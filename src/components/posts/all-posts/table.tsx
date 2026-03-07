import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropDown } from "./dropdown";

import { capitalizeFirstLetter } from "better-auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, FilePen } from "lucide-react";
import { DeleteButton } from "../../delete-button";
import { fetchPostsByFilter } from "@/features/posts/posts.queries";
import { deletePostById } from "@/features/posts/posts.service";

interface Props {
  currentPage: string;
  term: string;
  category: string;
  status: string;
}
export const PostTable = async ({
  currentPage,
  term,
  category,
  status,
}: Props) => {
  const posts = await fetchPostsByFilter(
    Number(currentPage),
    term,
    category,
    status,
  );
  return (
    <>
      <div className="hidden lg:block px-4 shadow-md rounded-md bg-sidebar mt-4">
        <Table className="rounded-md border border-gray-100">
          <TableCaption>A list of your posts</TableCaption>
          <TableHeader className="bg-sidebar">
            <TableRow>
              <TableHead className="w-[100px] font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white border border-gray-100">
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.id}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{capitalizeFirstLetter(post.category!)}</TableCell>
                <TableCell>{capitalizeFirstLetter(post.status)}</TableCell>
                <TableCell className="text-right">
                  <DropDown id={post.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="space-y-6 lg:hidden mt-4 px-4">
        {posts.map((post) => (
          <div key={post.id} className=" shadow-md rounded-md bg-sidebar p-2 ">
            <div className="">
              <p className="bg-white py- border-b border-gray-100 truncate">
                <span className="bg-sidebar font-semibold p-1 mr-2">ID:</span>
                {post.id}
              </p>
              <p className="bg-white py-1 border-b border-gray-100 truncate">
                <span className="bg-sidebar font-semibold p-1 mr-2">
                  Title:
                </span>
                {post.title}
              </p>
              <p className="bg-white py-1 border-b border-gray-100 truncate">
                <span className="bg-sidebar font-semibold p-1 mr-2">
                  Category:
                </span>
                {capitalizeFirstLetter(post.category!)}
              </p>
              <p className="bg-white py-1 border-b border-gray-100 truncate">
                <span className="bg-sidebar font-semibold p-1 mr-2">
                  Status:
                </span>
                {capitalizeFirstLetter(post.status)}
              </p>
              <div className="flex items-center justify-end gap-5 m-1 ">
                <Button
                  asChild
                  size="sm"
                  className="bg-brand-green hover:bg-brand-green "
                >
                  <Link href={`/posts/${post.id}/preview`}>
                    <Eye className="size-4 text-white" />{" "}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-brand-blue hover:bg-brand-blue/90"
                >
                  <Link href={`/posts/${post.id}/edit`}>
                    <FilePen className="size-4 text-white" />
                  </Link>
                </Button>
                <DeleteButton
                  size="sm"
                  id={post.id}
                  handler={deletePostById}
                  dialogTitle="Are you absolutely sure?"
                  dialogDescription="This action cannot be undone. This will permanently delete your post
                  from database."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
