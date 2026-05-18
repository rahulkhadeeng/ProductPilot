"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LuLoader } from "react-icons/lu";
import { PiCheckCircle, PiEye, PiXCircle } from "react-icons/pi";
import { toast } from "sonner";

import Modal from "@/components/ui/modal/modal";
import { activateProduct, rejectProduct } from "@/lib/actions";

type PendingProduct = {
  id: string;
  name: string;
  headline: string;
  description: string;
  logo: string;
  releaseDate: string;
  website: string;
  twitter: string;
  instagram: string;
  categories: { id: string; name: string }[];
  images: { id: string; url: string }[];
};

export default function AdminProductActions({
  product,
}: {
  product: PendingProduct;
}) {
  const router = useRouter();
  const [viewVisible, setViewVisible] = useState(false);
  const [approveVisible, setApproveVisible] = useState(false);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const approve = () => {
    startTransition(async () => {
      const result = await activateProduct(product.id);

      if (!result) {
        toast.error("Could not activate product.", { position: "top-right" });
        return;
      }

      toast.success("Product activated successfully.", {
        position: "top-right",
      });
      setApproveVisible(false);
      router.refresh();
    });
  };

  const reject = () => {
    startTransition(async () => {
      const result = await rejectProduct(product.id, rejectReason.trim());

      if (!result) {
        toast.error("Could not reject product.", { position: "top-right" });
        return;
      }

      toast.success("Product rejected successfully.", {
        position: "top-right",
      });
      setRejectVisible(false);
      setRejectReason("");
      router.refresh();
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 md:gap-x-4 lg:flex-row">
        <button
          onClick={() => setViewVisible(true)}
          className="rounded-md bg-[#ff6154] px-6 py-2 text-center text-sm text-white transition-all duration-300 hover:bg-[#ff4437]"
        >
          View
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setApproveVisible(true)}
            className="rounded-md bg-emerald-100 p-2 text-center text-sm transition-all duration-300 hover:bg-emerald-200 md:px-4 md:py-2"
            aria-label={`Approve ${product.name}`}
          >
            <PiCheckCircle className="text-xl text-emerald-500" />
          </button>

          <button
            onClick={() => setRejectVisible(true)}
            className="rounded-md bg-red-100 p-2 text-center text-sm transition-all duration-300 hover:bg-red-200 md:px-4 md:py-2"
            aria-label={`Reject ${product.name}`}
          >
            <PiXCircle className="text-xl text-red-500" />
          </button>
        </div>
      </div>

      <Modal visible={viewVisible} setVisible={setViewVisible}>
        <div className="max-h-[75vh] max-w-3xl overflow-y-auto pr-4">
          <div className="flex items-start gap-4">
            <Image
              src={product.logo}
              alt={`${product.name} logo`}
              width={120}
              height={120}
              className="h-20 w-20 rounded-md border object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <PiEye className="text-xl text-[#ff6154]" />
                <h2 className="text-2xl font-bold">{product.name}</h2>
              </div>
              <p className="mt-1 text-gray-500">{product.headline}</p>
            </div>
          </div>

          <p className="mt-6 text-gray-600">{product.description}</p>

          <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
            <Info label="Website" value={product.website} />
            <Info label="Release Date" value={product.releaseDate} />
            <Info label="Twitter" value={product.twitter || "Not provided"} />
            <Info
              label="Instagram"
              value={product.instagram || "Not provided"}
            />
            <Info
              label="Categories"
              value={product.categories.map((category) => category.name).join(", ")}
            />
          </div>

          {product.images.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {product.images.map((image) => (
                <Image
                  key={image.id}
                  src={image.url}
                  alt={`${product.name} screenshot`}
                  width={300}
                  height={220}
                  className="h-36 w-full rounded-md border object-cover"
                />
              ))}
            </div>
          )}
        </div>
      </Modal>

      <Modal visible={approveVisible} setVisible={setApproveVisible}>
        <div className="flex max-w-lg flex-col items-start gap-2">
          <div className="flex flex-col items-start transition-all sm:flex-row sm:items-center sm:gap-5">
            <PiCheckCircle className="mb-4 rounded-md bg-emerald-100 p-1 text-5xl text-emerald-500" />
            <h2 className="mb-4 text-3xl font-bold">Activate Product</h2>
          </div>

          <p className="mb-4 text-gray-500">
            Are you sure you want to activate this product?
          </p>

          <p className="pb-10 text-gray-500">
            Once activated, the product will be visible to the public and users
            will be able to interact with it.
          </p>

          <button
            onClick={approve}
            disabled={isPending}
            className="flex items-center gap-2 rounded-md bg-emerald-100 px-4 py-2 font-medium text-emerald-800 transition-all hover:bg-emerald-200 active:bg-emerald-300"
          >
            Click here to activate
            {isPending && <LuLoader className="animate-spin" />}
          </button>
        </div>
      </Modal>

      <Modal visible={rejectVisible} setVisible={setRejectVisible}>
        <div className="flex max-w-lg flex-col items-start">
          <div className="mb-2 flex flex-col gap-x-4 transition-all sm:flex-row sm:items-center">
            <PiXCircle className="mb-4 rounded-md bg-red-100 p-1 text-5xl text-red-500" />
            <h2 className="mb-4 text-3xl font-bold">Reject Product</h2>
          </div>

          <p className="mb-4 text-gray-500">
            Are you sure you want to reject this product?
          </p>

          <p className="text-gray-500">
            Once rejected, the owner will be notified with the next steps to
            take.
          </p>

          <div className="w-full">
            <h3 className="mt-2 py-4 font-semibold text-gray-500">
              Reason for rejection
            </h3>

            <textarea
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              className="w-full rounded-md border p-2 focus:outline-none"
              placeholder="Enter reason for rejection"
              rows={3}
            />
          </div>

          <button
            onClick={reject}
            disabled={isPending || rejectReason.trim().length < 3}
            className="mt-10 flex items-center gap-2 rounded-md bg-red-100 px-4 py-2 font-medium text-red-800 transition-all hover:bg-red-200 active:bg-red-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending && <LuLoader className="animate-spin" />}
            Click here to reject
          </button>
        </div>
      </Modal>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h3 className="font-semibold">{label}</h3>
      <p className="mt-1 break-words text-gray-500">{value}</p>
    </div>
  );
}
