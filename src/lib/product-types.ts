import type { Session } from "next-auth";

export type ProductCommentView = {
  id: string;
  profile: string;
  body: string;
  user: string;
  timestamp: Date | string;
  userId: string;
  name: string;
};

export type ProductCardView = {
  id: string;
  name: string;
  slug: string;
  headline: string;
  description: string;
  logo: string;
  releaseDate: string;
  website: string;
  twitter: string;
  instagram: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: string;
  images: string[];
  categories: string[];
  commentsLength: number;
  commentData: ProductCommentView[];
  upvoters: string[];
  upvotes: number;
};

export type AuthSession = Session | null;
