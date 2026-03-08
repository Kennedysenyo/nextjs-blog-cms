import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { fetchPostContentById } from "@/features/posts/posts.queries";
const mediaConfig = {
  enableLazyLoading: true,
  sandboxIframes: true,
  allowFullScreen: false,
  showCaptions: true,
  autoPlay: false,
};

export const PostContent = async ({ postId }: { postId: string }) => {
  const { contentMd } = await fetchPostContentById(postId);
  return (
    <MarkdownRenderer
      content={contentMd}
      mediaConfig={mediaConfig}
      className="prose prose-lg dark:prose-invert max-w-none"
    />
  );
};
