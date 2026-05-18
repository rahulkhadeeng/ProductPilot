"use client";

import { toast } from "sonner";

import type { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";

type ImagesUploaderProps = {
  endpoint: keyof typeof ourFileRouter;
  onChange: (urls: string[]) => void;
};

export function ImagesUploader({ endpoint, onChange }: ImagesUploaderProps) {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res.map((item) => item.url));
        toast.success("Images uploaded.");
      }}
      onUploadError={(error: Error) => {
        toast.error(error.message);
      }}
    />
  );
}
