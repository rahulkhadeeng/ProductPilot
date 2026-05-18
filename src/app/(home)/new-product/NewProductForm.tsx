"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProduct } from "@/lib/actions";

const categories = [
  "Media",
  "Blockchain",
  "Cloud",
  "Commerce",
  "Cybersecurity",
  "Data",
  "Design",
  "Photography",
  "Ecommerce",
  "Education",
  "Entertainment",
  "Video",
  "Finance",
  "Social",
  "Health",
  "Fitness",
  "Marketing",
  "Music",
  "Productivity",
  "Engineering",
  "Sales",
  "Sports",
  "Travel",
  "Bootstrapped",
  "Art",
  "Analytics",
  "SaaS",
  "Artificial Intelligence",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function NewProductForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [logo, setLogo] = useState("");
  const [imageUrlsText, setImageUrlsText] = useState("");
  const [releaseDate, setReleaseDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const slug = useMemo(() => slugify(name), [name]);
  const imageUrls = useMemo(
    () =>
      imageUrlsText
        .split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean),
    [imageUrlsText]
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) => {
      if (current.includes(category)) {
        return current.filter((item) => item !== category);
      }

      if (current.length === 3) {
        toast.error("Choose up to 3 categories.");
        return current;
      }

      return [...current, category];
    });
  };

  const validateCurrentStep = () => {
    if (step === 1 && name.trim().length < 4) {
      toast.error("Enter at least 4 characters for the product name.");
      return false;
    }

    if (step === 2 && selectedCategories.length < 1) {
      toast.error("Select at least one category.");
      return false;
    }

    if (step === 3 && headline.trim().length < 10) {
      toast.error("Enter at least 10 characters for the headline.");
      return false;
    }

    if (step === 3 && description.trim().length < 20) {
      toast.error("Enter at least 20 characters for the description.");
      return false;
    }

    if (step === 4 && !logo.trim()) {
      toast.error("Add a logo image URL.");
      return false;
    }

    if (step === 4 && imageUrls.length < 1) {
      toast.error("Add at least one gallery image URL.");
      return false;
    }

    if (step === 5 && !website.trim()) {
      toast.error("Add the product website URL.");
      return false;
    }

    return true;
  };

  const continueToNextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }

    setStep((current) => Math.min(current + 1, 6));
  };

  const submitProduct = () => {
    if (!validateCurrentStep()) {
      return;
    }

    startTransition(async () => {
      const product = await createProduct({
        name: name.trim(),
        slug,
        headline: headline.trim(),
        description: description.trim(),
        logo: logo.trim(),
        releaseDate: releaseDate ? format(new Date(releaseDate), "dd/MM/yyyy") : "",
        website: website.trim(),
        twitter: twitter.trim(),
        instagram: instagram.trim(),
        images: imageUrls,
        category: selectedCategories,
      });

      if (!product) {
        toast.error("Product submission failed. Check the details and try again.");
        return;
      }

      setSubmitted(true);
      toast.success("Product submitted for review.");
    });
  };

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-5 px-6 py-16">
        <h1 className="text-4xl font-semibold">Product submitted</h1>
        <p className="text-xl font-light leading-8 text-muted-foreground">
          Your product is pending review. Once approved, it will appear in the
          product feed.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => router.push("/products")}>Browse products</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Submit another product
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-center px-6 py-8 md:py-20">
      <div className="w-full max-w-5xl overflow-hidden">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold">New product</h1>
            <p className="mt-4 text-xl font-light leading-8 text-muted-foreground">
              Showcase your product to the community. Submissions are reviewed
              before they go live.
            </p>
          </div>

          <div className="rounded-md border px-3 py-2 text-sm font-medium text-muted-foreground">
            Step {step} / 6
          </div>
        </div>

        {step === 1 && (
          <section className="space-y-8">
            <div>
              <label className="font-medium" htmlFor="product-name">
                Name of the product
              </label>
              <Input
                id="product-name"
                value={name}
                maxLength={30}
                className="mt-2 h-11"
                onChange={(event) => setName(event.target.value.slice(0, 30))}
              />
              <p className="mt-2 text-sm text-gray-500">{name.length} / 30</p>
            </div>

            <div>
              <label className="font-medium" htmlFor="product-slug">
                Slug
              </label>
              <Input
                id="product-slug"
                value={slug}
                readOnly
                className="mt-2 h-11"
              />
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-semibold">Choose categories</h2>
              <p className="mt-3 text-muted-foreground">
                Select 1 to 3 categories that best describe the product.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {categories.map((category) => {
                const selected = selectedCategories.includes(category);

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`rounded-full border px-3 py-2 text-sm transition-all active:scale-95 ${
                      selected
                        ? "border-indigo-500 bg-indigo-500 text-white"
                        : "bg-white hover:border-indigo-300"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-8">
            <div>
              <label className="font-medium" htmlFor="headline">
                Headline
              </label>
              <Input
                id="headline"
                value={headline}
                maxLength={70}
                className="mt-2 h-11"
                onChange={(event) =>
                  setHeadline(event.target.value.slice(0, 70))
                }
              />
              <p className="mt-2 text-sm text-gray-500">
                {headline.length} / 70
              </p>
            </div>

            <div>
              <label className="font-medium" htmlFor="description">
                Short description
              </label>
              <Textarea
                id="description"
                value={description}
                maxLength={300}
                className="mt-2 min-h-40"
                onChange={(event) =>
                  setDescription(event.target.value.slice(0, 300))
                }
              />
              <p className="mt-2 text-sm text-gray-500">
                {description.length} / 300
              </p>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="space-y-8">
            <div>
              <label className="font-medium" htmlFor="logo">
                Logo image URL
              </label>
              <Input
                id="logo"
                value={logo}
                placeholder="https://..."
                className="mt-2 h-11"
                onChange={(event) => setLogo(event.target.value)}
              />
            </div>

            {logo && (
              <Image
                src={logo}
                alt="Product logo preview"
                width={160}
                height={160}
                className="h-40 w-40 rounded-md border object-cover"
              />
            )}

            <div>
              <label className="font-medium" htmlFor="gallery">
                Gallery image URLs
              </label>
              <Textarea
                id="gallery"
                value={imageUrlsText}
                placeholder={"https://...\nhttps://..."}
                className="mt-2 min-h-36"
                onChange={(event) => setImageUrlsText(event.target.value)}
              />
              <p className="mt-2 text-sm text-gray-500">
                Add one URL per line. UploadThing will replace this placeholder
                in the upload phase.
              </p>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="space-y-8">
            <div>
              <label className="font-medium" htmlFor="release-date">
                Release date
              </label>
              <Input
                id="release-date"
                type="date"
                value={releaseDate}
                className="mt-2 h-11"
                onChange={(event) => setReleaseDate(event.target.value)}
              />
            </div>

            <div>
              <label className="font-medium" htmlFor="website">
                Website
              </label>
              <Input
                id="website"
                value={website}
                placeholder="https://www.yourdomain.com"
                className="mt-2 h-11"
                onChange={(event) => setWebsite(event.target.value)}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="font-medium" htmlFor="twitter">
                  Twitter
                </label>
                <Input
                  id="twitter"
                  value={twitter}
                  placeholder="https://twitter.com/..."
                  className="mt-2 h-11"
                  onChange={(event) => setTwitter(event.target.value)}
                />
              </div>

              <div>
                <label className="font-medium" htmlFor="instagram">
                  Instagram
                </label>
                <Input
                  id="instagram"
                  value={instagram}
                  placeholder="https://instagram.com/..."
                  className="mt-2 h-11"
                  onChange={(event) => setInstagram(event.target.value)}
                />
              </div>
            </div>
          </section>
        )}

        {step === 6 && (
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold">Review and submit</h2>

            <div className="grid gap-6 rounded-md border p-5 md:grid-cols-2">
              <ReviewItem label="Name" value={name} />
              <ReviewItem label="Slug" value={slug} />
              <ReviewItem label="Categories" value={selectedCategories.join(", ")} />
              <ReviewItem label="Headline" value={headline} />
              <ReviewItem label="Description" value={description} />
              <ReviewItem label="Release date" value={releaseDate} />
              <ReviewItem label="Website" value={website} />
              <ReviewItem label="Images" value={`${imageUrls.length} image(s)`} />
            </div>
          </section>
        )}

        <div className="mt-10 flex items-center justify-between">
          <Button
            variant="outline"
            disabled={step === 1 || isPending}
            onClick={() => setStep((current) => Math.max(current - 1, 1))}
          >
            Previous
          </Button>

          {step === 6 ? (
            <Button disabled={isPending} onClick={submitProduct}>
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          ) : (
            <Button onClick={continueToNextStep}>Continue</Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h3 className="font-semibold">{label}</h3>
      <p className="mt-2 break-words text-gray-600">{value || "Not provided"}</p>
    </div>
  );
}
