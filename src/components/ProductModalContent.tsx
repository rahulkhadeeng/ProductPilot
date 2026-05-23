"use client";

import Image from "next/image";
import Link from "next/link";
import {
  PiCaretUpFill,
  PiTrash,
  PiUploadSimple,
} from "react-icons/pi";
import CarouselComponent from "./CarouselComponent";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Avvvatars from "avvvatars-react";
import React, { useState } from "react";
import ShareModal from "./ui/modal/ShareProductModal";
import ShareModalContent from "./ShareProductModalContent";
import { commentOnProduct, deleteComment, upvoteProduct } from "@/lib/actions";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { FaCheck, FaExclamation } from "react-icons/fa";
import Modal from "./ui/modal/modal";
import AuthContent from "./navbar/AuthContent";
import type {
  AuthSession,
  ProductCardView,
  ProductCommentView,
} from "@/lib/product-types";

type ProductModalContentProps = {
  currentProduct: ProductCardView | null;
  authenticatedUser: AuthSession;
  totalUpvotes: number;
  hasUpvoted: boolean;
  setTotalUpvotes: React.Dispatch<React.SetStateAction<number>>;
  setHasUpvoted: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProductModalContent = ({
  currentProduct,
  authenticatedUser,
  totalUpvotes,
  hasUpvoted,
  setTotalUpvotes,
  setHasUpvoted,
}: ProductModalContentProps) => {
  const [shareModalModalVisible, setShareModalVisible] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<ProductCommentView[]>(
    currentProduct?.commentData ?? []
  );
  const [isUpvotePending, setIsUpvotePending] = useState(false);
  const [isCommentPending, setIsCommentPending] = useState(false);
  const [deletingCommentIds, setDeletingCommentIds] = useState<string[]>([]);

  if (!currentProduct) {
    return null;
  }

  const handleUpvoteClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();

    if (isUpvotePending) {
      return;
    }

    if (!authenticatedUser) {
      toast(
        <>
          <div className="flex items-center gap-4 mx-auto w-full">
            <FaExclamation className="text-red-500 text-xl" />

            <div className="text-md font-semibold">
              Please Sign in to upvote products.
            </div>
          </div>
        </>,
        {
          position: "top-right",
        }
      );

      setShowLoginModal(true);
    } else {
      setIsUpvotePending(true);

      try {
        await upvoteProduct(currentProduct.id);

        setTotalUpvotes((current) => (hasUpvoted ? current - 1 : current + 1));

        setHasUpvoted((current) => !current);

        toast(
          <>
            <div className="flex items-center gap-4 mx-auto w-full">
              <FaCheck className="text-green-500 text-xl" />

              <div className="text-md font-semibold">Product upvoted.</div>
            </div>
          </>,
          {
            position: "top-right",
          }
        );
      } catch (error) {
        console.log("Error while upvoting product:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not update your upvote.",
          { position: "top-right" }
        );
      } finally {
        setIsUpvotePending(false);
      }
    }
  };

  const handleShareClick = () => {
    setShareModalVisible(true);
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommentText(event.target.value);
  };

  const handleCommentSubmit = async () => {
    const trimmedComment = commentText.trim();

    if (!authenticatedUser?.user?.id || !trimmedComment) {
      if (!authenticatedUser?.user?.id) {
        setShowLoginModal(true);
      } else {
        toast.error("Comment cannot be empty.", { position: "top-right" });
      }
      return;
    }

    if (trimmedComment.length > 1000) {
      toast.error("Comment must be 1000 characters or fewer.", {
        position: "top-right",
      });
      return;
    }

    if (isCommentPending) {
      return;
    }

    setIsCommentPending(true);

    try {
      const savedComment = await commentOnProduct(
        currentProduct.id,
        trimmedComment
      );

      setCommentText("");

      setComments([
        {
          id: savedComment?.id ?? `optimistic-${Date.now()}`,
          user:
            savedComment?.user.name ??
            authenticatedUser.user.name ??
            authenticatedUser.user.email ??
            "Community member",
          body: savedComment?.body ?? trimmedComment,
          profile:
            savedComment?.profilePicture ?? authenticatedUser.user.image ?? "",
          userId: savedComment?.userId ?? authenticatedUser.user.id,
          timestamp: savedComment?.createdAt ?? new Date().toISOString(),
          name:
            savedComment?.user.name ??
            savedComment?.user.email ??
            authenticatedUser.user.name ??
            authenticatedUser.user.email ??
            "Community member",
        },
        ...comments,
      ]);
      toast.success("Comment posted.", { position: "top-right" });
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "Could not post comment.",
        { position: "top-right" }
      );
    } finally {
      setIsCommentPending(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (deletingCommentIds.includes(commentId)) {
      return;
    }

    setDeletingCommentIds((current) => [...current, commentId]);

    try {
      await deleteComment(commentId);

      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "Could not delete comment.",
        { position: "top-right" }
      );
    } finally {
      setDeletingCommentIds((current) =>
        current.filter((id) => id !== commentId)
      );
    }
  };

  return (
    <div className="h-full">
      <div className="md:w-[90%] mx-auto">
        <Image
          src={currentProduct.logo}
          alt="logo"
          width={200}
          height={200}
          className="h-20 w-20 border rounded-md bg-white shadow-md"
        />

        <div className="py-5 space-y-2">
          <h1 className="text-3xl font-semibold capitalize -mb-5">
            {currentProduct.name}
          </h1>

          <div className="md:flex md:justify-between items-center">
            <p className="text-gray-600 text-xl font-light md:w-3/5">
              {currentProduct.headline}
            </p>

            <div className="flex items-center gap-2 pt-4">
              <a
                href={currentProduct.website}
                target="_blank"
                className="border rounded-md flex justify-center items-center py-3 px-8 cursor-pointer hover:bg-neutral-50 transition-all duration-300 active:scale-90"
              >
                Visit
              </a>

              <button
                className={`rounded-md flex justify-center items-center px-8 py-3 gap-x-3 cursor-pointer bg-gradient-to-r w-full active:scale-90
                ${
                  hasUpvoted
                    ? "border border-indigo-500 hover:bg-indigo-50 transition-all"
                    : "text-black border hover:bg-indigo-50 transition-all duration-300"
                } disabled:pointer-events-none disabled:opacity-60`}
                onClick={handleUpvoteClick}
                disabled={isUpvotePending}
              >
                <PiCaretUpFill
                  className={`text-xl ${
                    hasUpvoted ? "text-indigo-500" : "text-black"
                  }`}
                />
                {/* Upvote  */}
                {totalUpvotes}
              </button>
            </div>
          </div>

          <h2 className="text-gray-600 py-10">{currentProduct.description}</h2>

          <div className="md:flex justify-between items-center pb-10">
            <div className="flex gap-x-2">
              {currentProduct.categories.map((category) => (
                <Link
                  key={category}
                  href={`/category/${category.toLowerCase()}`}
                  className="bg-foreground/5 text-gray-600 px-4 py-2 text-xs md:text-sm lg:text-base font-medium rounded-md cursor-pointer hover:bg-foreground/10 transition-all duration-300 overflow-hidden h-fit active:scale-90"
                >
                  {category}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-x-6 py-4">
              <div
                onClick={handleShareClick}
                className="text-md text-foreground/70 font-medium flex items-center gap-x-1 cursor-pointer hover:text-foreground/90 transition-all duration-300"
              >
                <PiUploadSimple />
                <p>Share</p>
              </div>
            </div>
          </div>

          <CarouselComponent productImages={currentProduct.images} />

          <div className="py-10 ">
            <div className="py-10">
              <h1 className="font-semibold">Community Feedback</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {comments.length === 0
                  ? "Be the first to start the conversation."
                  : `${comments.length} comment${
                      comments.length === 1 ? "" : "s"
                    } from the community.`}
              </p>
            </div>

            <div className="border-t border-b py-2">
              <div className="w-full flex items-center gap-4">
                <Avatar>
                  {authenticatedUser?.user ? (
                    <>
                      <AvatarImage
                        src={authenticatedUser.user.image ?? undefined}
                      />

                      <AvatarFallback>
                        <Avvvatars
                          value={
                            authenticatedUser.user.email ??
                            authenticatedUser.user.name ??
                            "Community member"
                          }
                        />
                      </AvatarFallback>
                    </>
                  ) : (
                    <Avvvatars style="shape" value={currentProduct.name} />
                  )}
                </Avatar>

                <textarea
                  value={commentText}
                  onChange={handleCommentChange}
                  placeholder="What do you think about this product?"
                  maxLength={1000}
                  className="w-full rounded-md p-4 focus:outline-none text-gray-600 placeholder:text-sm hidden md:block"
                  rows={1}
                />

                <textarea
                  value={commentText}
                  onChange={handleCommentChange}
                  placeholder="What do you think about this product?"
                  maxLength={1000}
                  className="w-full rounded-md p-4 focus:outline-none text-gray-600 placeholder:text-sm block md:hidden"
                  rows={2}
                />
              </div>

              <div className="flex justify-end mt-4">
                <p className="mr-auto pt-2 text-xs text-muted-foreground">
                  {commentText.trim().length}/1000
                </p>
                {authenticatedUser ? (
                  <button
                    onClick={handleCommentSubmit}
                    disabled={isCommentPending}
                    className="px-3 py-2 text-sm text-foreground/80 border hover:border-[#ff6154] rounded-md transition-all duration-300 active:scale-90 disabled:pointer-events-none disabled:opacity-60"
                  >
                    {isCommentPending ? "Posting..." : "Comment"}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-3 py-2 text-sm text-foreground/80 border hover:border-[#ff6154] rounded-md transition-all duration-300 active:scale-90"
                  >
                    Sign in to comment
                  </button>
                )}
              </div>
            </div>

            {comments.length > 0 ? (
              <div className="py-10 space-y-8">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.profile} />

                    <AvatarFallback>
                      <Avvvatars value={comment.name} />
                    </AvatarFallback>
                  </Avatar>

                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col sm:flex-row gap-x-2 items-start sm:items-center transition-all">
                        <div className="flex gap-x-2">
                          <h1 className="text-gray-600 font-semibold cursor-pointer">
                            {comment.user}
                          </h1>
                          {comment.userId === currentProduct.userId && (
                            <Badge className="bg-[#88aaff] text-xs hover:bg-[#88aaff] px-2 py-0">
                              Creator
                            </Badge>
                          )}
                        </div>

                        <div className="text-gray-500 text-xs">
                          {new Date(comment.timestamp).toDateString()}
                        </div>
                      </div>

                      {(comment.userId === authenticatedUser?.user?.id ||
                        currentProduct.userId ===
                          authenticatedUser?.user?.id) && (
                        <button
                          type="button"
                          disabled={deletingCommentIds.includes(comment.id)}
                          onClick={() => handleDeleteComment(comment.id)}
                          aria-label="Delete comment"
                          className="text-red-500 transition-all hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                        >
                          <PiTrash />
                        </button>
                      )}
                    </div>

                    <div className="text-gray-600 text-sm mt-2">
                      {comment.body}
                    </div>
                  </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="my-10 rounded-md border border-dashed p-8 text-center">
                <h2 className="text-xl font-semibold">No comments yet</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Share a useful first impression, question, or launch feedback.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ShareModal
        visible={shareModalModalVisible}
        setVisible={setShareModalVisible}
      >
        <ShareModalContent currentProduct={currentProduct} />
      </ShareModal>

      <Modal visible={showLoginModal} setVisible={setShowLoginModal}>
        <AuthContent />
      </Modal>
    </div>
  );
};

export default ProductModalContent;
