export const handleError = (error: any) => {
  if (error instanceof Error) {
    console.error(error);
    return {
      postId: null,
      errorMessage:
        error.message ===
        'duplicate key value violates unique constraint "posts_slug_key"'
          ? "Slug Already exists, Try a different one."
          : error.message,
    };
  }
  return { postId: null, errorMessage: error as string };
};
