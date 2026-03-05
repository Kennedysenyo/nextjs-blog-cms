import { FormPageHeader } from "@/components/form-page-header";
import { requireSession } from "@/lib/better-auth/server-auth";
import { redirect } from "next/navigation";
import { EditUserForm } from "@/components/users/edit-user/edit-user-form";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
      name: "New",
      url: "/users/new",
    },
  ];

  const { id } = await params;

  return (
    <div className="h-full flex flex-col">
      <FormPageHeader
        title="Update User"
        subTitle="Fill the form below to add new user"
        urlList={urlList}
      />
      <EditUserForm />
    </div>
  );
}
