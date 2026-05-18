"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LuLoader } from "react-icons/lu";
import { PiCheckCircle, PiStorefront, PiTrash } from "react-icons/pi";
import { toast } from "sonner";

import Modal from "@/components/ui/modal/modal";
import { deleteProduct } from "@/lib/actions";

export default function DeleteProductButton({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const enabled = confirmationInput.toLowerCase() === "delete";

  const confirmDelete = () => {
    if (!enabled) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteProduct(productId);
        toast(
          <div className="mx-auto flex items-center gap-4">
            <PiCheckCircle className="text-3xl text-emerald-500" />
            <div className="text-md font-semibold">
              Product deleted successfully.
            </div>
          </div>,
          { position: "top-right" }
        );
        router.push("/my-products");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Could not delete this product.", {
          position: "top-right",
        });
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setVisible(true)}
        className="flex cursor-pointer items-center justify-center rounded-md bg-red-100 p-4 transition-all duration-300 hover:bg-red-200"
      >
        <PiTrash className="text-xl text-red-500" />
      </button>

      <Modal visible={visible} setVisible={setVisible}>
        <div className="max-w-lg">
          <PiStorefront className="mb-10 rounded-md bg-red-100 p-1 text-5xl text-red-500" />
          <h2 className="mb-10 text-xl font-semibold">Delete Product</h2>

          <p className="text-sm">
            Once your product is deleted, all related content will be
            permanently removed.
          </p>

          <p className="py-10 text-sm">
            This action cannot be undone. To confirm deletion, type
            &quot;delete&quot; below.
          </p>

          <input
            type="text"
            className="mt-6 w-full rounded-xl border p-4 focus:outline-none"
            value={confirmationInput}
            onChange={(event) => setConfirmationInput(event.target.value)}
          />

          <div className="mt-10 flex justify-end">
            <button
              className="mr-4 cursor-pointer rounded-full border border-red-500 bg-white px-4 py-2 text-sm font-light text-red-500"
              onClick={() => setVisible(false)}
            >
              Cancel
            </button>
            <button
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                enabled
                  ? "bg-red-500 text-white"
                  : "cursor-not-allowed bg-gray-200 text-gray-500"
              }`}
              disabled={!enabled || isPending}
              onClick={confirmDelete}
            >
              Confirm delete
              {isPending && <LuLoader className="h-5 w-5 animate-spin" />}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
