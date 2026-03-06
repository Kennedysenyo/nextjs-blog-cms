import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { capitalizeFirstLetter } from "better-auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FilePen } from "lucide-react";
import { DeleteButton } from "@/components/delete-button";
import {
  deleteCategoryById,
  fetchCategoriesByFilter,
} from "@/features/categories/categories.queries";

interface Props {
  currentPage: string;
  term: string;
}
export const CategoriesTable = async ({ currentPage, term }: Props) => {
  const categories = await fetchCategoriesByFilter(Number(currentPage), term);
  return (
    <>
      <div className="hidden lg:block px-4 shadow-md rounded-md bg-sidebar w-full mx-auto max-w-[1000px] mt-4">
        <Table className="rounded-md border border-gray-100">
          <TableCaption>A list of categories</TableCaption>
          <TableHeader className="bg-sidebar">
            <TableRow>
              <TableHead className="w-[100px] font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Slug (segment)</TableHead>
              <TableHead className="text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white border border-gray-100">
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.id}</TableCell>
                <TableCell>{capitalizeFirstLetter(cat.name)}</TableCell>
                <TableCell>{cat.slug}</TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-5 m-1 ">
                    <Button
                      asChild
                      size="sm"
                      className="bg-brand-blue hover:bg-brand-blue/90"
                    >
                      <Link href={`/posts/categories/${cat.id}/edit`}>
                        <FilePen className="size-4 text-white" />
                      </Link>
                    </Button>
                    <div className="w-9">
                      <DeleteButton
                        id={cat.id}
                        handler={deleteCategoryById}
                        size="sm"
                        dialogTitle="Are you absolutely sure?"
                        dialogDescription="This action cannot be undone. This will permanently delete the category
                        from database."
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="space-y-6 lg:hidden mt-4 px-4">
        {categories.map((cat) => (
          <div key={cat.id} className=" shadow-md rounded-md bg-sidebar p-2 ">
            <div className="">
              <p className="bg-white py- border-b border-gray-100 truncate">
                <span className="bg-sidebar font-semibold p-1 mr-2">ID:</span>
                {cat.id}
              </p>
              <p className="bg-white py-1 border-b border-gray-100 truncate">
                <span className="bg-sidebar font-semibold p-1 mr-2">Name:</span>
                {capitalizeFirstLetter(cat.name)}
              </p>
              <p className="bg-white py-1 border-b border-gray-100 truncate">
                <span className="bg-sidebar font-semibold p-1 mr-2">
                  Slug (segment):
                </span>
                {cat.slug}
              </p>

              <div className="flex items-center justify-end gap-5 m-1 ">
                <Button
                  asChild
                  size="sm"
                  className="bg-brand-blue hover:bg-brand-blue/90"
                >
                  <Link href={`/posts/categories/${cat.id}/edit`}>
                    <FilePen className="size-4 text-white" />
                  </Link>
                </Button>
                <DeleteButton
                  id={cat.id}
                  handler={deleteCategoryById}
                  size="sm"
                  dialogTitle="Are you absolutely sure?"
                  dialogDescription="This action cannot be undone. This will permanently delete the category
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
