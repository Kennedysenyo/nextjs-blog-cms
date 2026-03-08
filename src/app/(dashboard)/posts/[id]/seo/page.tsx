import { FormPageHeader } from "@/components/form-page-header";
import { SEOForm } from "@/components/posts/post-seo/seo-form";
import { fetchMetadataByPostId } from "@/features/posts/posts.queries";
import { requireSession } from "@/lib/better-auth/server-auth";
import { redirect } from "next/navigation";

export default async function SeoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const metadata = await fetchMetadataByPostId(id);

  if (!metadata) redirect(`/post/${id}/preview`);

  const urlList = [
    {
      id: 1,
      name: "Dashboard",
      url: "/",
    },
    {
      id: 2,
      name: "Posts",
      url: "/posts",
    },
    {
      id: 3,
      name: "Preview",
      url: `/posts/${id}/preview`,
    },
    {
      id: 4,
      name: "Seo",
      url: `/posts/${id}/seo`,
    },
  ];
  return (
    <>
      <FormPageHeader
        title="Edit Metadata"
        subTitle="Update the fields below and click 'Save'"
        urlList={urlList}
      />
      <SEOForm
        id={id}
        metaTitle={metadata.metaTitle}
        metaDescription={metadata.metaDescription}
        keywords={metadata.keywords ? metadata.keywords : []}
      />
    </>
  );
}
