"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { PiCheckCircle, PiFlag, PiPencilLine, PiXCircle } from "react-icons/pi";
import { toast } from "sonner";

import { ImagesUploader } from "@/components/ImagesUploader";
import { LogoUploader } from "@/components/LogoUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProduct } from "@/lib/actions";

type EditableProduct = {
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
  categories: { id: string; name: string }[];
  images: { id: string; url: string }[];
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/\./g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function EditProductForm({
  product,
}: {
  product: EditableProduct;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [isEditingProductImages, setIsEditingProductImages] = useState(false);
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState("");
  const [uploadedProductImages, setUploadedProductImages] = useState<string[]>(
    []
  );
  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [headline, setHeadline] = useState(product.headline);
  const [description, setDescription] = useState(product.description);
  const [releaseDate, setReleaseDate] = useState(product.releaseDate);
  const [website, setWebsite] = useState(product.website);
  const [twitter, setTwitter] = useState(product.twitter);
  const [instagram, setInstagram] = useState(product.instagram);

  const handleNameChange = (value: string) => {
    const nextName = value.slice(0, 30);
    setName(nextName);
    setSlug(makeSlug(nextName));
  };

  const saveProduct = () => {
    startTransition(async () => {
      try {
        await updateProduct(product.id, {
          name,
          slug,
          headline,
          description,
          releaseDate,
          website,
          twitter,
          instagram,
          category: product.categories.map((category) => category.name),
          logo: uploadedLogoUrl || product.logo,
          images:
            uploadedProductImages.length > 0
              ? uploadedProductImages
              : product.images.map((image) => image.url),
        });

        toast(
          <div className="mx-auto flex items-center gap-4">
            <PiCheckCircle className="text-3xl text-emerald-500" />
            <div className="text-md font-semibold">
              Product updated successfully.
            </div>
          </div>,
          { position: "top-right" }
        );

        router.refresh();
      } catch (error) {
        toast(
          <div className="mx-auto flex items-center gap-4">
            <PiXCircle className="text-3xl text-red-500" />
            <div className="text-md font-semibold">
              There was an error updating the product.
            </div>
          </div>,
          { position: "top-right" }
        );
        console.error(error);
      }
    });
  };

  const currentImages =
    uploadedProductImages.length > 0
      ? uploadedProductImages
      : product.images.map((image) => image.url);

  return (
    <section className="pt-8">
      <div className="flex items-center gap-4">
        <PiPencilLine className="text-3xl text-emerald-500" />
        <h2 className="text-2xl font-bold">Edit Product</h2>
      </div>

      <div className="mt-8 items-center gap-x-4 rounded-md bg-emerald-100 p-6 md:flex">
        <PiFlag className="mb-4 text-5xl text-emerald-500 md:mb-0" />
        <p className="text-gray-600">
          Updating a live product sends it back to pending review until an admin
          approves it again.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <h3 className="text-lg font-medium">Logo</h3>
          {isEditingLogo ? (
            <div className="mt-6">
              <LogoUploader
                endpoint="productLogo"
                onChange={(url) => {
                  if (url) {
                    setUploadedLogoUrl(url);
                    setIsEditingLogo(false);
                  }
                }}
              />
              <button
                onClick={() => setIsEditingLogo(false)}
                className="mt-2 cursor-pointer text-red-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <Image
                src={uploadedLogoUrl || product.logo}
                alt={`${product.name} logo`}
                width={240}
                height={240}
                className="h-32 w-32 rounded-md border object-cover md:h-48 md:w-48"
              />
              <button
                onClick={() => setIsEditingLogo(true)}
                className="mt-2 cursor-pointer text-sm text-blue-500 hover:underline"
              >
                Change Logo
              </button>
            </div>
          )}
        </div>

        <Field label="Product Name">
          <Input
            className="mt-3 h-11"
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
          />
        </Field>

        <Field label="Slug">
          <Input className="mt-3 h-11" value={slug} readOnly />
        </Field>

        <Field label="Website">
          <Input
            className="mt-3 h-11"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </Field>

        <Field label="Release Date">
          <Input
            className="mt-3 h-11"
            value={releaseDate}
            onChange={(event) => setReleaseDate(event.target.value)}
          />
        </Field>

        <Field label="Headline">
          <Textarea
            className="mt-3 min-h-28"
            value={headline}
            onChange={(event) => setHeadline(event.target.value)}
          />
        </Field>

        <Field label="Short Description">
          <Textarea
            className="mt-3 min-h-28"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Field>

        <Field label="Twitter">
          <Input
            className="mt-3 h-11"
            value={twitter}
            onChange={(event) => setTwitter(event.target.value)}
          />
        </Field>

        <Field label="Instagram">
          <Input
            className="mt-3 h-11"
            value={instagram}
            onChange={(event) => setInstagram(event.target.value)}
          />
        </Field>

        <div className="md:col-span-2 xl:col-span-1">
          <h3 className="text-lg font-medium">Categories</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {product.categories.map((category) => (
              <div
                key={category.id}
                className="rounded-full bg-gray-200 p-2 text-center text-sm"
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 xl:col-span-3">
          <h3 className="mb-2 text-lg font-medium">Product Images</h3>

          {isEditingProductImages ? (
            <div>
              <ImagesUploader
                endpoint="productImages"
                onChange={(urls) => {
                  setUploadedProductImages(urls);
                  setIsEditingProductImages(false);
                }}
              />
              <button
                className="mt-2 cursor-pointer text-red-500 hover:underline"
                onClick={() => setIsEditingProductImages(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {currentImages.map((url) => (
                  <Image
                    key={url}
                    priority
                    src={url}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="h-32 w-full rounded-md border object-cover"
                  />
                ))}
              </div>
              <button
                onClick={() => setIsEditingProductImages(true)}
                className="mt-2 cursor-pointer text-sm text-blue-500 hover:underline"
              >
                Click to upload images
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end py-10">
        <Button disabled={isPending} onClick={saveProduct}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-lg font-medium">{label}</h3>
      {children}
    </div>
  );
}
