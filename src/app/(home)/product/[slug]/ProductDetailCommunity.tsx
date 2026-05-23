"use client";

import Avvvatars from "avvvatars-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaExclamation } from "react-icons/fa";
import { PiCaretUpFill, PiTrash, PiUploadSimple } from "react-icons/pi";
import { toast } from "sonner";

import CarouselComponent from "@/components/CarouselComponent";
import AuthContent from "@/components/navbar/AuthContent";
import ShareModalContent from "@/components/ShareProductModalContent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Modal from "@/components/ui/modal/modal";
import ShareModal from "@/components/ui/modal/ShareProductModal";
import { commentOnProduct, deleteComment, upvoteProduct } from "@/lib/actions";
import type {
  AuthSession,
  ProductCardView,
  ProductCommentView,
} from "@/lib/product-types";

type ProductDetailCommunityProps = {
  product: ProductCardView;
  authenticatedUser: AuthSession;
};

export default function ProductDetailCommunity({
  product,
  authenticatedUser,
}: ProductDetailCommunityProps) {
  const [totalUpvotes, setTotalUpvotes] = useState(product.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(
    product.upvoters.includes(authenticatedUser?.user?.id ?? "")
  );
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<ProductCommentView[]>(
    product.commentData
  );
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isUpvotePending, setIsUpvotePending] = useState(false);
  const [isCommentPending, setIsCommentPending] = useState(false);
  const [deletingCommentIds, setDeletingCommentIds] = useState<string[]>([]);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const handleUpvoteClick = async () => {
    if (isUpvotePending) {
      return;
    }

    if (!authenticatedUser?.user?.id) {
      toast(
        <div className="mx-auto flex w-full items-center gap-4">
          <FaExclamation className="text-xl text-red-500" />
          <div className="text-md font-semibold">
            Please Sign in to upvote products.
          </div>
        </div>,
        { position: "top-right" }
      );
      setShowLoginModal(true);
      return;
    }

    setIsUpvotePending(true);

    try {
      await upvoteProduct(product.id);
      setTotalUpvotes((current) => (hasUpvoted ? current - 1 : current + 1));
      setHasUpvoted((current) => !current);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update your upvote.",
        { position: "top-right" }
      );
    } finally {
      setIsUpvotePending(false);
    }
  };

  const handleCommentSubmit = async () => {
    const trimmedComment = commentText.trim();

    if (!authenticatedUser?.user?.id) {
      setShowLoginModal(true);
      return;
    }

    if (!trimmedComment) {
      toast.error("Comment cannot be empty.", { position: "top-right" });
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

    const user = authenticatedUser.user;
    setIsCommentPending(true);

    try {
      const savedComment = await commentOnProduct(product.id, trimmedComment);

      setCommentText("");
      setComments((current) => [
        {
          id: savedComment?.id ?? `comment-${Date.now()}`,
          user:
            savedComment?.user.name ??
            savedComment?.user.email ??
            user.name ??
            user.email ??
            "Community member",
          body: savedComment?.body ?? trimmedComment,
          profile: savedComment?.profilePicture ?? user.image ?? "",
          userId: savedComment?.userId ?? user.id,
          timestamp: savedComment?.createdAt ?? new Date().toISOString(),
          name:
            savedComment?.user.name ??
            savedComment?.user.email ??
            user.name ??
            user.email ??
            "Community member",
        },
        ...current,
      ]);
      toast.success("Comment posted.", { position: "top-right" });
    } catch (error) {
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
      setComments((current) =>
        current.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
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
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Image
            src={product.logo}
            alt="logo"
            width={1000}
            height={1000}
            className="h-16 w-16 cursor-pointer rounded-md border shadow-md transition-all md:h-20 md:w-20"
            priority
          />

          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold transition-all sm:text-3xl">
              {product.name}
            </h2>
            <p className="pl-0.5 text-sm font-medium text-foreground/80 sm:text-base">
              {product.headline}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <button
            type="button"
            onClick={() => setShareModalVisible(true)}
            className="hidden items-center justify-center gap-2 rounded border px-3 py-1 font-medium transition-all duration-300 hover:border-indigo-500 active:scale-90 sm:flex sm:px-5 sm:py-2"
          >
            <PiUploadSimple />
            Share
          </button>

          <button
            type="button"
            onClick={handleUpvoteClick}
            disabled={isUpvotePending}
            className={`flex items-center justify-center gap-2 rounded border px-3 py-1 font-medium transition-all duration-300 active:scale-90 sm:px-4 sm:py-2 ${
              hasUpvoted
                ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                : "bg-white hover:border-indigo-500"
            } disabled:pointer-events-none disabled:opacity-60`}
          >
            <PiCaretUpFill />
            {totalUpvotes}
          </button>

          <a
            href={product.website}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center rounded border px-3 py-1 font-medium transition-all duration-300 hover:border-indigo-500 active:scale-90 sm:px-5 sm:py-2"
          >
            Visit
          </a>
        </div>
      </div>

      {product.description && (
        <div className="pt-5">
          <p className="text-gray-500">{product.description}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {product.categories.map((category) => (
          <Link
            href={`/category/${category.toLowerCase()}`}
            key={category}
            className="cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-gray-600 transition-all duration-300 hover:bg-gray-200 active:scale-90"
          >
            <h2 className="text-center text-xs">{category}</h2>
          </Link>
        ))}
      </div>

      <div className="pt-10">
        <CarouselComponent productImages={product.images} />
      </div>

      <div className="border-b pb-5 pt-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Community Feedback</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {comments.length === 0
                ? "Be the first to start the conversation."
                : `${comments.length} comment${
                    comments.length === 1 ? "" : "s"
                  } from the community.`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShareModalVisible(true)}
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-foreground/80 transition-all duration-300 hover:border-indigo-500 active:scale-90 sm:hidden"
          >
            <PiUploadSimple />
            Share
          </button>
        </div>
      </div>

      <div className="border-b py-2">
        <div className="flex w-full items-center gap-4">
          <Avatar>
            {authenticatedUser?.user ? (
              <>
                <AvatarImage src={authenticatedUser.user.image ?? undefined} />
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
              <Avvvatars style="shape" value={product.name} />
            )}
          </Avatar>

          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="What do you think about this product?"
            maxLength={1000}
            className="hidden w-full rounded-md p-4 text-gray-600 placeholder:text-sm focus:outline-none md:block"
            rows={1}
          />

          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="What do you think about this product?"
            maxLength={1000}
            className="block w-full rounded-md p-4 text-gray-600 placeholder:text-sm focus:outline-none md:hidden"
            rows={2}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <p className="mr-auto pt-2 text-xs text-muted-foreground">
            {commentText.trim().length}/1000
          </p>
          <button
            type="button"
            onClick={
              authenticatedUser ? handleCommentSubmit : () => setShowLoginModal(true)
            }
            disabled={isCommentPending}
            className="rounded-md border px-3 py-2 text-sm text-foreground/80 transition-all duration-300 hover:border-[#ff6154] active:scale-90 disabled:pointer-events-none disabled:opacity-60"
          >
            {authenticatedUser
              ? isCommentPending
                ? "Posting..."
                : "Comment"
              : "Sign in to comment"}
          </button>
        </div>
      </div>

      {comments.length > 0 ? (
        <div className="space-y-8 py-10">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.profile} />
                <AvatarFallback>
                  <Avvvatars value={comment.name} />
                </AvatarFallback>
              </Avatar>

              <div className="w-full">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start gap-x-2 transition-all sm:flex-row sm:items-center">
                    <div className="flex gap-x-2">
                      <h3 className="cursor-pointer font-semibold text-gray-600">
                        {comment.user}
                      </h3>
                      {comment.userId === product.userId && (
                        <Badge className="bg-[#88aaff] px-2 py-0 text-xs hover:bg-[#88aaff]">
                          Creator
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      {new Date(comment.timestamp).toDateString()}
                    </div>
                  </div>

                  {(comment.userId === authenticatedUser?.user?.id ||
                    product.userId === authenticatedUser?.user?.id) && (
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

                <p className="mt-2 text-sm text-gray-600">{comment.body}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold">No comments yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Share a useful first impression, question, or launch feedback.
          </p>
        </div>
      )}

      <ShareModal visible={shareModalVisible} setVisible={setShareModalVisible}>
        <ShareModalContent currentProduct={product} />
      </ShareModal>

      <Modal visible={showLoginModal} setVisible={setShowLoginModal}>
        <AuthContent />
      </Modal>
    </>
  );
}
