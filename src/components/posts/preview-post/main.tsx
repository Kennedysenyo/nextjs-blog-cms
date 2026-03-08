import { notFound } from "next/navigation";
import { BreadCrumb, BreadCrumbType } from "@/components/breadcrumb";
import { PostStatus } from "./post-status";
import { Calendar, User } from "lucide-react";
import { PostContent } from "./post-content";
import Link from "next/link";
import { Suspense } from "react";
import { PostContentSkeleton } from "@/components/skeletons/post-content-skeleton";
import { fetchPostById } from "@/features/posts/posts.queries";

interface Props {
  postId: string;
}

export const MainPreview = async ({ postId }: Props) => {
  const post = await fetchPostById(postId);
  if (!post) {
    notFound();
  }

  const urlList: BreadCrumbType[] = [
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
      name: "Post Preview",
      url: `/posts/${post.id}/preview`,
    },
  ];

  return (
    <article className="min-h-screen bg-white ">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-brand-blue/5 to-white section-padding">
        <div className="container-custom max-w-3xl">
          <div className="flex items-center justify-between">
            <BreadCrumb urlList={urlList} />
            <PostStatus postStatus={post.status} />
          </div>
          <div className="mb-6 mt-2">
            <span className="inline-block bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {post.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {post.publishedAt && (
                <time dateTime={post.publishedAt.toISOString()}>
                  {post.publishedAt.toISOString().split("T")[0]}
                </time>
              )}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="container-custom max-w-3xl mt-0">
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="section-padding">
        <div className="container-custom max-w-3xl prose prose-lg dark:prose-invert mx-auto">
          <Suspense fallback={<PostContentSkeleton />}>
            <PostContent postId={post.id} />
          </Suspense>
        </div>
      </div>

      {/* Author Info and Related */}
      <div className="section-padding bg-gray-50">
        <div className="container-custom max-w-3xl">
          <div className="border-t border-b border-gray-200 py-8 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Written by
              </p>
              <p className="text-2xl font-serif font-bold text-brand-blue">
                {post.author}
              </p>
            </div>
            <Link
              href="/posts"
              className="inline-flex items-center justify-center h-12 px-8 bg-brand-green text-white font-bold rounded-lg hover:bg-brand-green/90 transition-colors"
            >
              More Articles
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
