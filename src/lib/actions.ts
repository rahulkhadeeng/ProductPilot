"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth/auth";
import { prisma as db } from "./prisma";
import {
  productSubmissionSchema,
  type ProductSubmissionInput,
} from "./product-validation";

type ProductData = ProductSubmissionInput;

type CreateProductResult =
  | {
      success: true;
      product: {
        id: string;
        slug: string;
        status: string;
      };
    }
  | {
      success: false;
      error: string;
      fieldErrors?: Partial<Record<keyof ProductData, string[]>>;
    };

interface UpdateProductData extends ProductData {
  rank?: number;
}

export const createProduct = async ({
  name,
  slug,
  headline,
  description,
  logo,
  releaseDate,
  website,
  twitter,
  instagram,
  images,
  category,
}: ProductData): Promise<CreateProductResult> => {
  try {
    const authenticatedUser = await auth();

    if (!authenticatedUser?.user?.id) {
      throw new Error("You must be signed in to submit a Product");
    }

    const parsed = productSubmissionSchema.safeParse({
      name,
      slug,
      headline,
      description,
      logo,
      releaseDate,
      website,
      twitter,
      instagram,
      images,
      category,
    });

    if (!parsed.success) {
      return {
        success: false,
        error:
          parsed.error.issues[0]?.message ??
          "Please check the product details.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const existingProduct = await db.product.findUnique({
      where: {
        slug: parsed.data.slug,
      },
      select: {
        id: true,
      },
    });

    if (existingProduct) {
      return {
        success: false,
        error: "That product slug is already taken. Try a different name.",
        fieldErrors: {
          slug: ["That product slug is already taken. Try a different name."],
        },
      };
    }

    const userId = authenticatedUser.user.id;

    const product = await db.product.create({
      data: {
        name: parsed.data.name,
        rank: 0,
        slug: parsed.data.slug,
        headline: parsed.data.headline,
        description: parsed.data.description,
        logo: parsed.data.logo,
        releaseDate: parsed.data.releaseDate,
        website: parsed.data.website,
        twitter: parsed.data.twitter,
        instagram: parsed.data.instagram,
        status: "PENDING",

        categories: {
          connectOrCreate: parsed.data.category.map((name) => ({
            where: {
              name,
            },
            create: {
              name,
            },
          })),
        },

        images: {
          createMany: {
            data: parsed.data.images.map((image) => ({ url: image })),
          },
        },

        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    revalidatePath("/my-products");
    revalidatePath("/admin");

    return {
      success: true,
      product: {
        id: product.id,
        slug: product.slug,
        status: product.status,
      },
    };
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "That product slug is already taken. Try a different name.",
        fieldErrors: {
          slug: ["That product slug is already taken. Try a different name."],
        },
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Product submission failed.",
    };
  }
};

export const updateProduct = async (
  productId: string,
  {
    name,
    slug,
    headline,
    description,
    logo,
    releaseDate,
    website,
    twitter,
    instagram,
    images,
  }: UpdateProductData
) => {
  try {
    const authenticatedUser = await auth();

    if (!authenticatedUser) {
      throw new Error("You must be signed in to update a product");
    }

    const userId = authenticatedUser.user?.id;

    const existingProduct = await db.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    if (existingProduct.userId !== userId) {
      throw new Error("You don't have permission to update this product");
    }

    const updatedProduct = await db.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        slug,
        headline,
        description,
        logo,
        releaseDate,
        website,
        twitter,
        instagram,

        // Update images only if provided
        images:
          images.length > 0
            ? {
                deleteMany: {
                  productId, // Delete all existing images related to the product
                },
                createMany: {
                  data: images.map((image) => ({ url: image })),
                },
              }
            : undefined, // If no new images, skip this part
        status: "PENDING",
      },
    });

    return updatedProduct;
  } catch (error: unknown) {
    console.error("Error updating product:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while updating the product";
    throw new Error(
      message
    );
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const authenticatedUser = await auth();

    if (!authenticatedUser) {
      throw new Error("You must be signed in to delete a product");
    }

    if (!authenticatedUser.user || !authenticatedUser.user.id) {
      throw new Error("User Id is missing or invalid");
    }

    const userId = authenticatedUser.user?.id;

    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.userId !== userId) {
      throw new Error("You don't have permission to delete this product");
    }

    await db.product.delete({
      where: {
        id: productId,
      },
      include: {
        images: true,
      },
    });

    return true;
  } catch (error: unknown) {
    console.error("Error updating product:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while updating the product";
    throw new Error(
      message
    );
  }
};

export const getOwnerProducts = async () => {
  try {
    const authenticatedUser = await auth();

    if (!authenticatedUser) {
      return [];
    }

    const userId = authenticatedUser.user?.id;

    const products = await db.product.findMany({
      where: {
        userId: userId,
      },
    });

    return products;
  } catch (error) {
    console.error("Error fetching owner products:", error);
    return [];
  }
};

export const getProductById = async (productId: string) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        categories: true,
        images: true,
        upvotes: true,
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: true,
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.log(error);
  }
};

export const isUserAdmin = async () => {
  const authenticatedUser = await auth();

  if (!authenticatedUser?.user) {
    return false;
  }

  const userId = authenticatedUser.user.id;
  const email = authenticatedUser.user.email;

  const user = await db.user.findFirst({
    where: {
      OR: [
        ...(userId ? [{ id: userId }] : []),
        ...(email ? [{ email }] : []),
      ],
    },
  });

  if (!user) {
    return false;
  }

  return user.isAdmin;
};

export const isUserPremium = async () => {
  const authenticatedUser = await auth();

  if (!authenticatedUser?.user) {
    return false;
  }

  const userId = authenticatedUser.user.id;
  const email = authenticatedUser.user.email;

  const user = await db.user.findFirst({
    where: {
      OR: [
        ...(userId ? [{ id: userId }] : []),
        ...(email ? [{ email }] : []),
      ],
    },
  });

  if (!user) {
    return false;
  }

  return user.isPremium;
};

export const getUsers = async () => {
  try {
    const users = await db.user.findMany();

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Could not fetch users");
  }
};

export const getPendingProducts = async () => {
  try {
    const pendingProducts = await db.product.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        categories: true,
        images: {
          orderBy: {
            updatedAt: "desc",
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },

      // get the most recent first
      orderBy: {
        createdAt: "desc",
      },
    });

    return pendingProducts;
  } catch (error) {
    console.error("Error fetching pending products:", error);
    throw new Error("Could not fetch pending products");
  }
};

export const getActiveProducts = async () => {
  try {
    const activeProducts = await db.product.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        categories: true,
        images: {
          orderBy: {
            updatedAt: "desc",
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: true,
          },
        },
        upvotes: {
          include: {
            user: true,
          },
        },
      },

      orderBy: {
        upvotes: {
          _count: "desc",
        },
      },
    });

    return activeProducts;
  } catch (error) {
    console.log("Error fetching active products:", error);
    throw new Error("Could not fetch active products");
  }
};

export const getRejectedProducts = async () => {
  try {
    const rejectedProducts = await db.product.findMany({
      where: {
        status: "REJECTED",
      },
      include: {
        categories: true,
        images: true,
      },

      //
      orderBy: {
        createdAt: "desc",
      },
    });

    return rejectedProducts;
  } catch (error) {
    console.log("Error fetching active products:", error);
    throw new Error("Could not fetch active products");
  }
};

export const getTotalUpvotesCount = async () => {
  try {
    const totalUpvotes = await db.upvote.count({
      where: {
        product: {
          status: "ACTIVE",
        },
      },
    });

    return totalUpvotes;
  } catch (error) {
    console.log("Error fetching total upvotes:", error);
  }
};

export const activateProduct = async (productId: string) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.status === "ACTIVE") {
      throw new Error("Product is already active");
    }

    if (product.status !== "PENDING") {
      throw new Error(
        `Product is not in 'PENDING' status and cannot be activated`
      );
    }

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        status: "ACTIVE",
      },
    });

    revalidatePath("/admin");
    revalidatePath("/products");
    revalidatePath(`/product/${product.slug}`);

    await db.notification.create({
      data: {
        userId: product.userId,
        body: `Your product ${product.name} has been activated`,
        type: "ACTIVATED",
        status: "UNREAD",
        profilePicture: product.logo,
        productId: product.id,
      },
    });

    return product;
  } catch (error: unknown) {
    console.error("Error activating product:", error);
    return null;
  }
};

export const rejectProduct = async (productId: string, reason: string) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.status === "REJECTED") {
      throw new Error("Product is already rejected");
    }

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        status: "REJECTED",
      },
    });

    revalidatePath("/admin");
    revalidatePath("/my-products");

    await db.notification.create({
      data: {
        userId: product.userId,
        body: `Your product ${product.name} has been rejected. Reason : ${reason}`,
        type: "REJECTED",
        status: "UNREAD",
        profilePicture: product.logo,
        productId: product.id,
      },
    });

    return product;
  } catch (error: unknown) {
    console.error("Error rejecting product:", error);
    return null;
  }
};

export const upvoteProduct = async (productId: string) => {
  try {
    const authenticatedUser = await auth();

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      throw new Error("User ID is missing or invalid");
    }

    const userId = authenticatedUser.user.id;

    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
        logo: true,
        slug: true,
        status: true,
        userId: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.status !== "ACTIVE") {
      throw new Error("Only active products can be upvoted");
    }

    const upvote = await db.upvote.findFirst({
      where: {
        productId,
        userId,
      },
    });

    // Use an empty string if profile picture is undefined
    const profilePicture = authenticatedUser.user.image || "";

    if (upvote) {
      await db.upvote.delete({
        where: {
          id: upvote.id,
        },
      });
    } else {
      await db.upvote.create({
        data: {
          productId,
          userId,
        },
      });

      // notify the product owner about the upvote
      if (product.userId !== userId) {
        await db.notification.create({
          data: {
            userId: product.userId,
            body: `Upvoted your product "${product.name}"`,
            profilePicture: profilePicture,
            productId: product.id,
            type: "UPVOTE",
            status: "UNREAD",
          },
        });
      }
    }

    revalidatePath("/products");
    revalidatePath("/my-upvoted");
    revalidatePath(`/product/${product.slug}`);
    revalidatePath("/notifications");

    return true;
  } catch (error) {
    console.error("Error upvoting product:", error);
    throw error;
  }
};

export const commentOnProduct = async (
  productId: string,
  commentText: string
) => {
  try {
    const authenticatedUser = await auth();

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      throw new Error("User Id is missing or invalid");
    }

    const userId = authenticatedUser.user.id;
    const trimmedComment = commentText.trim();

    if (!trimmedComment) {
      throw new Error("Comment cannot be empty");
    }

    if (trimmedComment.length > 1000) {
      throw new Error("Comment must be 1000 characters or fewer");
    }

    const productDetails = await db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        userId: true,
        name: true,
        slug: true,
        status: true,
      },
    });

    if (!productDetails) {
      throw new Error("Product not found");
    }

    if (productDetails.status !== "ACTIVE") {
      throw new Error("Only active products can receive comments");
    }

    //
    const profilePicture = authenticatedUser.user.image || "";

    const comment = await db.comment.create({
      data: {
        createdAt: new Date(),
        productId,
        userId,
        body: trimmedComment,
        profilePicture: profilePicture,
      },
      include: {
        user: true,
      },
    });

    if (productDetails && productDetails.userId !== userId) {
      await db.notification.create({
        data: {
          userId: productDetails.userId,
          body: `Someone commented on your product "${productDetails.name}"`,
          profilePicture: profilePicture,
          productId: productId,
          commentId: comment.id,
          type: "COMMENT",
          status: "UNREAD",
        },
      });
    }

    revalidatePath(`/product/${productDetails.slug}`);
    revalidatePath("/notifications");

    return comment;
  } catch (error) {
    console.log("Error commenting on product", error);
    throw error;
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    const authenticatedUser = await auth();

    if (!authenticatedUser?.user?.id) {
      throw new Error("You must be signed in to delete a comment");
    }

    const userId = authenticatedUser.user.id;

    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        product: {
          select: {
            userId: true,
            slug: true,
          },
        },
      },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isAdmin: true,
      },
    });

    const canDelete =
      comment.userId === userId ||
      comment.product.userId === userId ||
      user?.isAdmin === true;

    if (!canDelete) {
      throw new Error("You don't have permission to delete this comment");
    }

    await db.comment.delete({
      where: {
        id: commentId,
      },
    });

    revalidatePath(`/product/${comment.product.slug}`);
    revalidatePath("/notifications");

    return true;
  } catch (error) {
    console.log("Error while deleting a comment", error);
    throw error;
  }
};

export const getUpvotedProducts = async () => {
  try {
    const authenticatedUser = await auth();

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      throw new Error("User id is missing or invalid");
    }

    const userId = authenticatedUser.user.id;

    const upvotedProducts = await db.upvote.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });

    return upvotedProducts.map((upvote) => upvote.product);
  } catch (error) {
    console.log("Error getting upvoted products", error);
    throw Error;
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await db.product.findFirst({
      where: {
        slug,
        status: "ACTIVE",
      },
      include: {
        user: true,
        images: {
          orderBy: {
            updatedAt: "desc",
          },
        },
        categories: true,
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: true,
          },
        },
        upvotes: {
          include: {
            user: true,
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.log("Error getting product by slug", error);
    return null;
  }
};

export const getAllCategories = async () => {
  try {
    const categories = await db.category.findMany({
      where: {
        products: {
          some: {
            status: "ACTIVE",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  } catch (error) {
    console.log("Error getting all categories", error);
    return null;
  }
};

export const getProductsByCategoryName = async (categoryName: string) => {
  try {
    const products = await db.product.findMany({
      where: {
        categories: {
          some: {
            name: categoryName,
          },
        },

        status: "ACTIVE",
      },
      include: {
        comments: true,
        categories: true,
      },
    });

    return products;
  } catch (error) {
    console.log("Error getting the category", error);
    throw null;
  }
};

export const getNotifications = async () => {
  try {
    const authenticatedUser = await auth();

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      console.log("Getting Notifications: User ID is missing or invalid");
      return null;
    }

    const userId = authenticatedUser.user.id;

    const notifications = await db.notification.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  } catch (error) {
    console.log("Error getting notifications", error);
    return [];
  }
};

export const getNavbarData = async ({
  userId,
  email,
}: {
  userId?: string | null;
  email?: string | null;
}) => {
  try {
    if (!userId && !email) {
      return {
        isAdmin: false,
        notifications: [],
      };
    }

    const user = await db.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(email ? [{ email }] : []),
        ],
      },
      select: {
        isAdmin: true,
        notifications: {
          take: 20,
          include: {
            product: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return {
      isAdmin: user?.isAdmin ?? false,
      notifications: user?.notifications ?? [],
    };
  } catch (error) {
    console.log("Error getting navbar data", error);

    return {
      isAdmin: false,
      notifications: [],
    };
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const authenticatedUser = await auth();

    if (!authenticatedUser?.user?.id) {
      throw new Error("User ID is missing or invalid");
    }

    const userId = authenticatedUser.user.id;

    await db.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        status: "READ",
      },
    });

    revalidatePath("/notifications");

    return true;
  } catch (error) {
    console.log("Error marking notification as read", error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const authenticatedUser = await auth();

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      throw new Error("User ID is missing or invalid");
    }

    const userId = authenticatedUser.user.id;

    await db.notification.updateMany({
      where: {
        userId,
        status: "UNREAD",
      },
      data: {
        status: "READ",
      },
    });

    revalidatePath("/notifications");

    return;
  } catch (error) {
    console.log("Error marking all notifications as read", error);
    throw Error;
  }
};

export const getProductsByUserId = async (userId: string) => {
  try {
    const products = await db.product.findMany({
      where: {
        userId,
      },
    });

    return products;
  } catch (error) {
    console.log("Error getting products by user id", error);
    return [];
  }
};

export const getAdminData = async () => {
  const totalProducts = await db.product.count();
  const totalUsers = await db.user.count();
  const totalUpvotes = await db.upvote.count();
  const totalComment = await db.comment.count();
  const totalCategories = await db.category.count();

  return {
    totalProducts,
    totalUsers,
    totalUpvotes,
    totalComment,
    totalCategories,
  };
};
