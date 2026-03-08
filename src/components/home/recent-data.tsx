import { fetchRecents } from "@/features/posts/posts.queries";
import {
  SelectRecentDraftPostType,
  SelectRecentPublishedPostType,
} from "@/features/posts/posts.types";
import Image from "next/image";
import Link from "next/link";

interface DraftProps {
  posts: SelectRecentDraftPostType[];
}

const RecentDrafts = ({ posts }: DraftProps) => {
  return (
    <div className="bg-sidebar rounded-md border border-gray-300  p-2 flex flex-col">
      <div className="p-2 rounded-md border border-gray-300/50 bg-white">
        <p className="text-center font-bold text-brand-blue">
          Recent Draft Posts
        </p>
      </div>
      <div className="flex p-2 items-center gap-4">
        <span className="text-brand-blue font-bold ml-3">Author</span>
        <span className="text-brand-blue font-bold sm:ml-7 md:ml-14">
          Title
        </span>
        <span className="text-brand-blue font-bold ml-auto mr-3">Date</span>
      </div>
      <ul className="p-2 border border-gray-300/50 flex-1 space-y-2">
        {posts.map((post) => (
          <li key={post.title}>
            <Link
              className="p-3 relative flex gap-4 items-center bg-white border border-gray-300 hover:bg-brand-blue/10"
              href={`/posts/${post.id}/preview`}
            >
              <div className="hidden md:block absolute top-[50%] -translate-y-[50%] w-[40px] h-[40px] rounded-full">
                <Image
                  src={post.image || "/user-placeholder.png"}
                  alt={`Picture of ${post.author}`}
                  fill
                />
              </div>
              <span className="md:ml-11 font-bold">{`${post.author?.split(" ")[0][0].toLocaleUpperCase()}. ${post.author?.split(" ")[1]}`}</span>
              <span className=" max-w-[50%] truncate">{post.title}</span>
              <span className=" ml-auto">
                {post.createdAt.toLocaleDateString()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface PublishedProps {
  posts: SelectRecentPublishedPostType[];
}

const RecentPublished = ({ posts }: PublishedProps) => {
  return (
    <div className="bg-sidebar rounded-md border border-gray-300  p-2 flex flex-col">
      <div className="p-2 rounded-md border border-gray-300/50 bg-white">
        <p className="text-center font-bold text-brand-blue">
          Recent Published Posts
        </p>
      </div>
      <div className="flex p-2 items-center gap-4">
        <span className="text-brand-blue font-bold ml-3">Author</span>
        <span className="text-brand-blue font-bold sm:ml-7 md:ml-14">
          Title
        </span>
        <span className="text-brand-blue font-bold ml-auto mr-3">Date</span>
      </div>
      <ul className="p-2 border border-gray-300/50 flex-1 space-y-2">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              className="p-3 relative flex gap-4 items-center bg-white border border-gray-300 hover:bg-brand-blue/10"
              href={`/posts/${post.id}/preview`}
            >
              <div className="hidden md:block absolute top-[50%] -translate-y-[50%] w-[40px] h-[40px] rounded-full">
                <Image
                  src={post.image || "/user-placeholder.png"}
                  alt={`Picture of ${post.author}`}
                  fill
                />
              </div>
              <span className="md:ml-11 sm:font-bold">{`${post.author?.split(" ")[0][0].toLocaleUpperCase()}. ${post.author?.split(" ")[1]}`}</span>
              <span className=" max-w-[50%] truncate">{post.title}</span>
              <span className=" ml-auto">
                {post.publishedAt?.toLocaleDateString()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const RecentsSection = async () => {
  const { recentPublished, recentDrafts } = await fetchRecents();
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <RecentPublished posts={recentPublished} />
        <RecentDrafts posts={recentDrafts} />
      </div>
    </div>
  );
};
