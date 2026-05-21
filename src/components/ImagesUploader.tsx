"use client";

import { toast } from "sonner";

import type { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";

type ImagesUploaderProps = {
  endpoint: keyof typeof ourFileRouter;
  onChange: (urls: string[]) => void;
};

type UploadedFile = {
  url?: string;
  ufsUrl?: string;
};

export function ImagesUploader({ endpoint, onChange }: ImagesUploaderProps) {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        const urls = (res as UploadedFile[])
          .map((item) => item.url ?? item.ufsUrl)
          .filter((url): url is string => Boolean(url));

        onChange(urls);

        if (urls.length > 0) {
          toast.success("Images uploaded.", { position: "top-center" });
        }
      }}
      onUploadError={(error: Error) => {
        toast.error(error.message, { position: "top-center" });
      }}
      appearance={{
        container:
          "mt-2 min-h-64 rounded-lg border border-dashed border-gray-300 bg-white px-6 py-8 transition-all hover:border-indigo-400 hover:bg-indigo-50/20",
        uploadIcon: "h-12 w-12 text-gray-400",
        label: "text-base font-medium text-gray-700",
        allowedContent: "text-sm text-gray-500",
        button:
          "rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-600",
      }}
    />
  );
}
