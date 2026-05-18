"use client";

import { toast } from "sonner";

import type { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";

type LogoUploaderProps = {
  endpoint: keyof typeof ourFileRouter;
  onChange: (url?: string) => void;
};

export function LogoUploader({ endpoint, onChange }: LogoUploaderProps) {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url);
        toast.success("Logo uploaded.");
      }}
      onUploadError={(error: Error) => {
        toast.error(error.message);
      }}
    />
  );
}
