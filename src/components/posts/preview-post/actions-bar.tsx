"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  setPostStatusToArchive,
  setPostStatusToPublish,
} from "@/features/posts/posts.service";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ChartLine, CloudUpload, EyeOff, FilePen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  postStatus: string;
  postId: string;
}
export const ActionsBar = ({ postStatus, postId }: Props) => {
  const isMobile = useIsMobile();

  const [pending, startTransition] = useTransition();
  const [showLoading, setShowLoading] = useState({
    loadA: false,
    loadB: false,
  });

  const handleSetPostStatusToPublishClick = () => {
    setShowLoading({ loadA: true, loadB: false });
    startTransition(async () => {
      const response = await setPostStatusToPublish(postId);
      if (response) {
        toast.error(response);
      } else {
        toast.success("Published post successfully");
      }
    });
  };

  const handleSetPostStatusToArchiveClick = () => {
    setShowLoading({ loadA: false, loadB: true });
    startTransition(async () => {
      const response = await setPostStatusToArchive(postId);
      if (response) {
        toast.error(response);
      } else {
        toast.success("Archived post successfully");
      }
    });
  };

  useEffect(() => {
    if (!pending) {
      setShowLoading({ loadA: false, loadB: false });
    }
  }, [pending]);
  return (
    <div
      className={cn(
        "absolute w-full left-1/2 -translate-x-1/2 z-5",
        isMobile && "md:hidden mb-1 bottom-0 -translate-y-1/2",
        !isMobile && "hidden md:block",
      )}
    >
      <div className="p-2 rounded-lg bg-white w-2/3 shadow-lg bg-green-500 max-w-[900px] mx-auto ">
        <div className="border border-gray-100 p-1 flex items-center gap-2 md:gap-4 justify-center">
          <Button
            className="flex items-center bg-brand-blue text-white rounded-md py-1 px-2 hover:bg-brand-blue/90"
            asChild
          >
            <Link href={`/posts/${postId}/edit`}>
              <FilePen className="size-4" />
              <span className="hidden lg:block text-sm ml-1">Edit</span>
            </Link>
          </Button>
          <Button
            className="flex items-center bg-violet-600 text-white rounded-md py-1 px-2 hover:bg-violet-500/90"
            asChild
          >
            <Link href={`/posts/${postId}/seo`}>
              <ChartLine className="size-4" />
              <span className="hidden lg:block text-sm ml-1">Edit SEO</span>
            </Link>
          </Button>

          {postStatus === "draft" ? (
            <>
              <Button
                disabled={pending}
                onClick={handleSetPostStatusToPublishClick}
                className="flex items-center bg-brand-green text-white rounded-md py-1 px-2 hover:bg-brand-green/90 cursor-pointer"
              >
                {pending && showLoading.loadA ? (
                  <Spinner />
                ) : (
                  <>
                    <CloudUpload className="size-4" />
                    <span className="hidden lg:block text-sm ml-1">
                      Publish
                    </span>
                  </>
                )}
              </Button>
              <Button
                onClick={handleSetPostStatusToArchiveClick}
                disabled={pending}
                className="flex items-center bg-black text-white rounded-md py-1 px-2 hover:bg-black/80 cursor-pointer"
              >
                {pending && showLoading.loadB ? (
                  <Spinner />
                ) : (
                  <>
                    <EyeOff className="size-4" />
                    <span className="hidden lg:block text-sm ml-1">
                      Archive
                    </span>
                  </>
                )}
              </Button>
            </>
          ) : postStatus === "published" ? (
            <Button
              onClick={handleSetPostStatusToArchiveClick}
              disabled={pending}
              className="flex items-center bg-black text-white rounded-md py-1 px-2 hover:bg-black/80 cursor-pointer"
            >
              {pending && showLoading.loadB ? (
                <Spinner />
              ) : (
                <>
                  <EyeOff className="size-4" />
                  <span className="hidden lg:block text-sm ml-1">Archive</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleSetPostStatusToPublishClick}
              disabled={pending}
              className="flex items-center bg-brand-green text-white rounded-md py-1 px-2 hover:bg-brand-green/90 cursor-pointer"
            >
              {pending && showLoading.loadA ? (
                <Spinner />
              ) : (
                <>
                  <CloudUpload className="size-4" />
                  <span className="hidden lg:block text-sm ml-1">Publish</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
