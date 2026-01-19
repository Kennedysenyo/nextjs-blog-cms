export interface PostType {
  id: string;
  title: string;
  slug: string;
  contentMd: string;
  excerpt: string;
  featuredImage: string;
  categoryId: string;
  authorId: string;
  status: string;
  publishedAt: string;
}

export interface FormErrors {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  category?: string;
  featuredImage?: string;
}
export interface ReturnedData {
  postId: string | null;
  errorMessage: string | null;
}
export interface ResponseType {
  errors: FormErrors;
  success: boolean;
  returned: ReturnedData;
}

export interface EditResponseType {
  errors: FormErrors;
  success: boolean;
  errorMessage: string | null;
}

export interface PostDataType {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  categoryId: string;
}

export interface CategoryFormErrors {
  name?: string;
  slug?: string;
}

export interface CategoryFormResponseType {
  errors: CategoryFormErrors;
  success: boolean;
  errorMessage: string | null;
}

export interface CreateUserFormErrors {
  name?: string;
  email?: string;
  password?: string;
  cnfrmPassword?: string;
}

export interface CreateUserFormResponseType {
  errors: CreateUserFormErrors;
  success: boolean;
  errorMessage: string | null;
}
