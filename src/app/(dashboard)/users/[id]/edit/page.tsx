import { FormPageHeader } from "@/components/form-page-header";
import { requireSession } from "@/lib/better-auth/server-auth";
import { redirect } from "next/navigation";
import { EditUserForm } from "@/components/users/edit-user/edit-user-form";
import { adminFetchUserById } from "@/features/users/users.queries";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await requireSession();

  if (!session) {
    redirect("/login");
  }

  const urlList = [
    {
      id: 1,
      name: "Dashboard",
      url: "/",
    },
    {
      id: 2,
      name: "Users",
      url: "/users",
    },

    {
      id: 3,
      name: "Edit",
      url: `/users/${id}/edit`,
    },
  ];

  const user = await adminFetchUserById(id);

  return (
    <div className="h-full flex flex-col">
      <FormPageHeader
        title="Update User"
        subTitle="Fill the form below to add new user"
        urlList={urlList}
      />
      <EditUserForm user={user} />
    </div>
  );
}
