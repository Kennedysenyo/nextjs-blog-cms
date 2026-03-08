"use server";

import {
  CreatePostInput,
  CreatePostInputFormErrors,
  CreatePostInputResponseType,
  CreatePostInputReturnedType,
  CreateSeoInput,
  CreateSeoInputFormErrors,
  EditPostInputFormErrors,
  EditPostInputResponseType,
  SeoFormResponseType,
  UpdatePostInput,
} from "./posts.types";
import {
  createPostSchema,
  editPostSchema,
  updateSeoSchema,
} from "./posts.schema";
import z from "zod";
import { handleError } from "@/utils/handle-error";

import { db } from "@/db/db";
import { postSeoTable, postTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  requirePermission,
  requireSelfOrPermission,
  requireSession,
} from "../auth/authorize";
import { redirect } from "next/navigation";
import { fetchPostAuthorId } from "./posts.queries";
import { revalidatePath } from "next/cache";

export const insertPost = async (
  data: CreatePostInput,
): Promise<CreatePostInputReturnedType> => {
  try {
    const baseUrl = process.env.BASE_URL!;
    if (!baseUrl)
      throw new Error("BASE_URL enviroment variable is require to create post");

    const session = await requireSession();

    if (!session) {
      redirect("/login");
    }
    const authorId = session?.user.id;
    if (!authorId) {
      throw new Error("Error! No User session found!");
    }
    await requirePermission({ post: ["create"] });

    const canonicalUrl = `${baseUrl}/insights/${data.slug}`;

    const result = await db.transaction(async (tx) => {
      const [postId] = await tx
        .insert(postTable)
        .values({
          title: data.title,
          slug: data.slug,
          contentMd: data.contentMd,
          excerpt: data.excerpt,
          featuredImage: data.featuredImage,
          categoryId: data.categoryId,
          authorId,
          status: "draft",
          publishedAt: null,
          archivedAt: null,
        })
        .returning({ id: postTable.id });

      await tx.insert(postSeoTable).values({
        postId: postId.id,
        metaTitle: data.title,
        metaDescription: data.excerpt,
        canonicalUrl,
        ogTitle: data.title,
        ogDescription: data.excerpt,
        ogImage: data.featuredImage,
        ogType: "article",
        twitterCard: "summary_large_image",
        twitterTitle: data.title,
        twitterDescription: data.excerpt,
        twitterImage: data.featuredImage,
        keywords: null,
      });

      return postId.id;
    });
    return { postId: result, errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const validateCreatePostForm = async (
  _prevState: CreatePostInputResponseType,
  formData: FormData,
): Promise<CreatePostInputResponseType> => {
  const rawInput = Object.fromEntries(formData);

  const result = createPostSchema.safeParse(rawInput);

  if (!result.success) {
    let errors: CreatePostInputFormErrors = {};

    const flattenedErrors = z.flattenError(result.error).fieldErrors;

    for (const [key, value] of Object.entries(flattenedErrors)) {
      errors = { ...errors, [key]: value[0] };
    }
    return {
      errors,
      success: false,
      returned: { postId: null, errorMessage: null },
    };
  }

  const { postId, errorMessage } = await insertPost(result.data);

  if (errorMessage) {
    return {
      errors: {},
      success: false,
      returned: { postId: null, errorMessage },
    };
  }
  return {
    errors: {},
    success: true,
    returned: { postId, errorMessage: null },
  };
};

export const updatePost = async (
  postId: string,
  data: UpdatePostInput,
): Promise<string | null> => {
  try {
    const session = await requireSession();
    if (!session) {
      redirect("/login");
    }
    const { authorId } = await fetchPostAuthorId(postId);

    await requireSelfOrPermission(authorId, {
      resource: "post",
      own: "update:own",
      any: "update:any",
    });

    const baseUrl = process.env.BASE_URL!;
    if (!baseUrl)
      throw new Error("BASE_URL enviroment variable is require to create post");

    const canonicalUrl = `${baseUrl}/insights/${data.slug}`;

    await db.transaction(async (tx) => {
      await tx
        .update(postTable)
        .set({
          title: data.title,
          slug: data.slug,
          contentMd: data.contentMd,
          excerpt: data.excerpt,
          featuredImage: data.featuredImage,
          categoryId: data.categoryId,
        })
        .where(eq(postTable.id, postId));

      await tx
        .update(postSeoTable)
        .set({
          metaTitle: data.title,
          metaDescription: data.excerpt,
          canonicalUrl,
          ogTitle: data.title,
          ogDescription: data.excerpt,
          ogImage: data.featuredImage,
          ogType: "article",
          twitterCard: "summary_large_image",
          twitterTitle: data.title,
          twitterDescription: data.excerpt,
          twitterImage: data.featuredImage,
          keywords: null,
        })
        .where(eq(postSeoTable.postId, postId));
    });

    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return error.message;
    }
    return error as string;
  }
};

export const validateEditForm = async (
  postId: string,
  _prevState: EditPostInputResponseType,
  formData: FormData,
): Promise<EditPostInputResponseType> => {
  const rawInput = Object.fromEntries(formData);

  // console.log(rawInput);

  const result = editPostSchema.safeParse(rawInput);

  if (!result.success) {
    let errors: EditPostInputFormErrors = {};

    const flattenedErrors = z.flattenError(result.error).fieldErrors;
    for (const [key, value] of Object.entries(flattenedErrors)) {
      errors = { ...errors, [key]: value[0] };
    }
    return {
      errors,
      errorMessage: null,
      success: false,
    };
  }
  const errorMessage = await updatePost(postId, result.data);

  if (errorMessage) {
    return {
      errors: {},
      success: false,
      errorMessage,
    };
  }
  return {
    errors: {},
    success: true,
    errorMessage: null,
  };
};

export const updateMetaData = async (
  postId: string,
  metadata: CreateSeoInput,
): Promise<string | null> => {
  try {
    const session = await requireSession();

    if (!session) {
      redirect("/login");
    }

    const authorId = session?.user.id;
    if (!authorId) {
      throw new Error("Error! No User session found!");
    }

    await requireSelfOrPermission(authorId, {
      resource: "post",
      own: "update:own",
      any: "update:any",
    });

    await db
      .update(postSeoTable)
      .set({
        metaTitle: metadata.metaTitle,
        metaDescription: metadata.metaDescription,
        ogTitle: metadata.metaTitle,
        ogDescription: metadata.metaDescription,
        twitterTitle: metadata.metaTitle,
        twitterDescription: metadata.metaDescription,
      })
      .where(eq(postSeoTable.postId, postId));

    return null;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return error as string;
  }
};

export const validateSEOForm = async (
  id: string,
  _prevState: SeoFormResponseType,
  formData: FormData,
): Promise<SeoFormResponseType> => {
  const rawInput = Object.fromEntries(formData);

  const result = updateSeoSchema.safeParse(rawInput);

  if (!result.success) {
    let errors: CreateSeoInputFormErrors = {};

    const flattenedErrors = z.flattenError(result.error).fieldErrors;

    for (const [key, value] of Object.entries(flattenedErrors)) {
      errors = { ...errors, [key]: value[0] };
    }

    return { errors, errorMessage: null, success: false };
  }
  const { data } = result;
  const errorMessage = await updateMetaData(id, {
    ...data,
    keywords: data.keywords.split(","),
  });

  if (errorMessage) {
    return { errors: {}, success: false, errorMessage };
  }
  return { errors: {}, success: true, errorMessage: null };
};

export const setPostStatusToPublish = async (
  id: string,
): Promise<string | null> => {
  try {
    await requirePermission({ post: ["publish"] });

    await db.transaction(async (tx) => {
      await tx
        .update(postTable)
        .set({ status: "published", publishedAt: new Date(), archivedAt: null })
        .where(eq(postTable.id, id));

      await tx
        .update(postSeoTable)
        .set({ robots: "index, follow" })
        .where(eq(postSeoTable.postId, id));
    });
    revalidatePath(`posts/${id}/preview`);
    return null;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized" || error.message === "Forbidden") {
        return error.message;
      }
      return "Error! Status change unsuccessful";
    }
    return error as string;
  }
};

export const setPostStatusToArchive = async (
  id: string,
): Promise<string | null> => {
  try {
    await requirePermission({ post: ["archive"] });

    await db.transaction(async (tx) => {
      await tx
        .update(postTable)
        .set({ status: "archived", publishedAt: null, archivedAt: new Date() })
        .where(eq(postTable.id, id));

      await tx
        .update(postSeoTable)
        .set({ robots: "noindex, follow" })
        .where(eq(postSeoTable.postId, id));
    });
    revalidatePath(`/posts/${id}/preview`);
    return null;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized" || error.message === "Forbidden") {
        return error.message;
      }
      return "Error! Status change unsuccessful";
    }
    return error as string;
  }
};

export const deletePostById = async (id: string): Promise<string | null> => {
  try {
    await requirePermission({ post: ["delete"] });

    const [deletedPostId] = await db
      .delete(postTable)
      .where(eq(postTable.id, id))
      .returning({ id: postTable.id });

    if (!deletedPostId) {
      throw new Error("An Error Occured!");
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized" || error.message === "Forbidden") {
        return error.message;
      }
      return "Failed to Delete Post";
    }
    return error as string;
  }
};
