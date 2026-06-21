import type { Types, Document } from "mongoose";

export type UserRole = "admin" | "author";
export type PostStatus = "draft" | "published";
export type MediaType = "image" | "video";

export type Ref<T> = Types.ObjectId | T;

export interface ITimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends Document, ITimestamps {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string | null;
  bio: string | null;
  isActive: boolean;
}

export type IUserPublic = Omit<IUser, "password">;

export interface ICategory extends Document, ITimestamps {
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
}

export interface IPost extends Document, ITimestamps {
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  author: Ref<IUser>;
  category: Ref<ICategory>;
  tags: string[];
  status: PostStatus;
  views: number;
  media: {
    url: string;
    type: MediaType;
    uploadedBy: Ref<IUser>;
  }[];
  publishedAt: Date | null;
  readingTime: number;
}

export interface IPostPopulated extends Omit<IPost, "author" | "category"> {
  author: IUserPublic;
  category: ICategory;
}

export interface IComment extends Document, ITimestamps {
  post: Ref<IPost>;
  user_info: {
    name: string;
    email: string;
    phone?: string;
  };
  content: string;
  isvisible: boolean;
  parentComment: Ref<IComment> | null;
}

export interface IMedia extends Document, ITimestamps {
  url: string;
  publicId: string;
  type: MediaType;
  format: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  uploadedBy: Ref<IUser>;
}

export interface ICommentPopulated extends Omit<IComment, "user" | "post" | "parentComment"> {
  post: Pick<IPost, "_id" | "title" | "slug">;
  parentComment: IComment | null;
}


export const POST_POPULATION = {
  author: { path: "author", select: "name email avatar bio role" },
  category: { path: "category", select: "name slug description" },
} as const;


export const COMMENT_POPULATION = {
  user: { path: "user", select: "name email avatar" },
  post: { path: "post", select: "title slug" },
  parentComment: { path: "parentComment", select: "content user" },
} as const;

export const MEDIA_POPULATION = {
  uploadedBy: { path: "uploadedBy", select: "name email" },
} as const;

export interface ISettings extends Document, ITimestamps {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  footerText: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  postSettings: {
    postsPerPage: number;
    autoApproveComments: boolean;
  };
}