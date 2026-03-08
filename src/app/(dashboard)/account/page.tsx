import { AccountPreview } from "@/components/account/account-preview";
import { UpdateAccountForm } from "@/components/account/UpdateForm";
import { FormPageHeader } from "@/components/form-page-header";
import { AccountPreviewSkeleton } from "@/components/skeletons/account-preview-skeleton";
import { fetPersonalAccountDataForEdit } from "@/features/users/users.queries";
import { Suspense } from "react";

const urlList = [
  {
    id: 1,
    name: "Dashboard",
    url: "/",
  },
  {
    id: 2,
    name: "Account",
    url: "/account",
  },
];
export default async function SettingsPage() {
  const user = await fetPersonalAccountDataForEdit();
  return (
    <div className="h-full flex flex-col overflow-y-auto p-4 pb-10">
      <FormPageHeader
        title="Account"
        subTitle="Personal Account details"
        urlList={urlList}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-12 ">
        <Suspense fallback={<AccountPreviewSkeleton />}>
          <AccountPreview />
        </Suspense>
        <UpdateAccountForm data={user} />
      </div>
    </div>
  );
}
