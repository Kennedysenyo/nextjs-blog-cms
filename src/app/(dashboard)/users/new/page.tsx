import { FormPageHeader } from "@/components/form-page-header";
import { requireSession } from "@/lib/better-auth/server-auth";
import { redirect } from "next/navigation";
import { NewUserForm } from "@/components/users/add-user-form";

export default async function NewUserPage() {
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

  return (
    <div className="h-full flex flex-col">
      <FormPageHeader
        title="Create New User"
        subTitle="Fill the form below to add new user"
        urlList={urlList}
      />
      <NewUserForm />
    </div>
  );
}
