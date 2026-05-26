"use client";

import confetti from "canvas-confetti";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CiGlobe } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { LuLoader } from "react-icons/lu";
import { PiCalendar, PiPackage, PiTag, PiTextT, PiXCircleFill } from "react-icons/pi";
import { toast } from "sonner";

import { ImagesUploader } from "@/components/ImagesUploader";
import { LogoUploader } from "@/components/LogoUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProduct } from "@/lib/actions";
import {
  firstProductValidationError,
  makeProductSlug,
  PRODUCT_LIMITS,
  type ProductSubmissionInput,
} from "@/lib/product-validation";

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

const submissionSteps = [
  "Basics",
  "Categories",
  "Details",
  "Media",
  "Release",
  "Links",
  "Review",
];

function StepShell({
  children,
  className = "space-y-10",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "-100%" }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function NewProductForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState("");
  const [uploadedProductImages, setUploadedProductImages] = useState<string[]>(
    []
  );
  const [releaseDate, setReleaseDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const showValidation = (message: string) => {
    toast(
      <div className="mx-auto flex items-center gap-4">
        <PiXCircleFill className="text-3xl text-red-500" />
        <div className="text-md font-semibold">{message}</div>
      </div>,
      { position: "top-right" }
    );
  };

  const getPayload = useCallback(
    (): ProductSubmissionInput => ({
      name,
      slug,
      headline,
      description,
      logo: uploadedLogoUrl,
      releaseDate,
      website,
      twitter,
      instagram,
      images: uploadedProductImages,
      category: selectedCategories,
    }),
    [
      name,
      slug,
      headline,
      description,
      uploadedLogoUrl,
      releaseDate,
      website,
      twitter,
      instagram,
      uploadedProductImages,
      selectedCategories,
    ]
  );

  const nextStep = useCallback(() => {
    if (step === 1 && name.trim().length < 4) {
      showValidation("Please enter at least 4 characters for the product name.");
      return;
    }

    if (step === 2 && selectedCategories.length < 1) {
      showValidation("Please select at least 1 category for the product.");
      return;
    }

    if (step === 3 && headline.trim().length < 10) {
      showValidation("Please enter at least 10 characters for the headline.");
      return;
    }

    if (step === 3 && description.trim().length < 20) {
      showValidation("Please enter at least 20 characters for the description.");
      return;
    }

    if (step === 4 && !uploadedLogoUrl) {
      showValidation("Please upload a logo for the product.");
      return;
    }

    if (step === 4 && uploadedProductImages.length < 1) {
      showValidation("Please upload at least 1 image for the product.");
      return;
    }

    if (step === 4 && uploadedProductImages.length > PRODUCT_LIMITS.imageMax) {
      showValidation("You can upload up to 5 product images.");
      return;
    }

    if (step === 5 && !releaseDate) {
      showValidation("Please select a release date.");
      return;
    }

    if (step === 6 && !website && !twitter && !instagram) {
      showValidation("Please enter at least one link for the product.");
      return;
    }

    if (step === 6) {
      const validationMessage = firstProductValidationError(getPayload());

      if (validationMessage) {
        showValidation(validationMessage);
        return;
      }
    }

    setStep((current) => current + 1);
  }, [
    step,
    name,
    selectedCategories,
    headline,
    description,
    uploadedLogoUrl,
    uploadedProductImages,
    releaseDate,
    website,
    twitter,
    instagram,
    getPayload,
  ]);

  const prevStep = useCallback(() => {
    setStep((current) => current - 1);
  }, []);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const productName = event.target.value.slice(0, 30);
    setName(productName);
    setSlug(makeProductSlug(productName));
    setSubmissionError("");
  };

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories((current) =>
        current.filter((item) => item !== category)
      );
      return;
    }

    if (selectedCategories.length < 3) {
      setSelectedCategories((current) => [...current, category]);
      return;
    }

    toast.error("You can select up to 3 categories.", {
      position: "top-right",
    });
  };

  const submitAnotherProduct = () => {
    setStep(1);
    setName("");
    setSlug("");
    setSelectedCategories([]);
    setHeadline("");
    setDescription("");
    setUploadedLogoUrl("");
    setUploadedProductImages([]);
    setReleaseDate(new Date().toISOString().slice(0, 10));
    setWebsite("");
    setTwitter("");
    setInstagram("");
    setSubmissionError("");
  };

  const submitProduct = async () => {
    if (loading) {
      return;
    }

    const payload = {
      ...getPayload(),
      releaseDate: releaseDate ? format(new Date(releaseDate), "dd/MM/yyyy") : "",
    };
    const validationMessage = firstProductValidationError(payload);

    if (validationMessage) {
      showValidation(validationMessage);
      return;
    }

    setLoading(true);
    setSubmissionError("");

    try {
      const result = await createProduct(payload);

      if (!result.success) {
        setSubmissionError(result.error);
        toast.error(result.error, { position: "top-right" });
        return;
      }

      toast.success("Product submitted for review.", { position: "top-right" });
      setStep(8);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Product submission failed.";
      setSubmissionError(message);
      toast.error(message, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step !== 8) {
      return;
    }

    const end = Date.now() + 3000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) {
        return;
      }

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  }, [step]);

  return (
    <div className="site-container flex flex-col items-center justify-center py-8 md:py-16">
      <div className="w-full overflow-hidden">
        {step < 8 && (
          <div className="mb-10">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Step {step} of {submissionSteps.length}
              </span>
              <span>{submissionSteps[step - 1]}</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#ff6154] transition-all duration-300"
                style={{
                  width: `${(step / submissionSteps.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <StepShell>
            <div className="flex items-center gap-3">
              <PiPackage className="text-4xl text-indigo-500" />
              <h1 className="text-4xl font-semibold">New product</h1>
            </div>
            <p className="mt-4 text-xl font-light leading-8">
              Ready to showcase your product to the world? You came to the right
              place. Follow the steps below to get started.
            </p>

            <div className="mt-10">
              <h2 className="font-medium">Name of the Product</h2>
              <Input
                type="text"
                value={name}
                maxLength={30}
                className="mt-2 h-11 rounded-md"
                onChange={handleNameChange}
              />
              <div className="mt-2 text-sm text-gray-500">
                {name.length} / {PRODUCT_LIMITS.nameMax}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-medium">
                Slug (Url) - This will be used to create a unique URL for your
                product
              </h2>
              <Input
                type="text"
                value={slug}
                className="mt-2 h-11 rounded-md"
                readOnly
              />
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell>
            <div className="flex items-center gap-3">
              <PiTag className="text-4xl text-indigo-500" />
              <h1 className="text-4xl font-semibold">
                What category does your product belong to?
              </h1>
            </div>
            <p className="mt-4 text-xl font-light leading-8">
              Choose at least 1 category that best fits your product. This will
              help people discover your product.
            </p>

            <div className="mt-10">
              <h2 className="font-medium">Select Categories</h2>
              <div className="grid grid-cols-2 items-center justify-center gap-2 pt-4 md:grid-cols-4">
                {categories.map((category) => (
                  <motion.button
                    type="button"
                    key={category}
                    className="flex rounded-full border"
                    onClick={() => handleCategoryToggle(category)}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span
                      className={`w-full cursor-pointer p-2 text-center text-xs md:text-sm ${
                        selectedCategories.includes(category)
                          ? "rounded-full bg-[#ff6154] text-white"
                          : "text-black"
                      }`}
                    >
                      {category}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell>
            <div className="flex items-center gap-3">
              <PiTextT className="text-4xl text-indigo-500" />
              <h1 className="text-4xl font-semibold">Product Details</h1>
            </div>
            <p className="mt-4 text-xl font-light leading-8">
              Keep it simple and clear. Describe your product in a way that
              makes it easy for people to understand what it does.
            </p>

            <div className="mt-10">
              <h2 className="font-medium">Headline</h2>
              <Input
                type="text"
                value={headline}
                className="mt-2 h-11 rounded-md"
                onChange={(event) =>
                  setHeadline(event.target.value.slice(0, 70))
                }
              />
              <div className="mt-1 text-sm text-gray-500">
                {headline.length} / {PRODUCT_LIMITS.headlineMax}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-medium">Short Description</h2>
              <Textarea
                className="mt-2 min-h-48 rounded-md"
                maxLength={PRODUCT_LIMITS.descriptionMax}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value.slice(0, 300))
                }
              />
              <div className="mt-1 text-sm text-gray-500">
                {description.length} / {PRODUCT_LIMITS.descriptionMax}
              </div>
            </div>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell>
            <h1 className="text-4xl font-semibold">
              Add images to showcase your product
            </h1>
            <p className="mt-4 text-xl font-light leading-8">
              Include images that best represent your product. This helps people
              understand what your product looks like.
            </p>

            <div className="mt-10">
              <h2 className="font-medium">Logo</h2>
              {uploadedLogoUrl ? (
                <div className="mt-2">
                  <Image
                    src={uploadedLogoUrl}
                    alt="logo"
                    width={1000}
                    height={1000}
                    className="h-40 w-40 rounded-md object-cover"
                  />
                </div>
              ) : (
                <LogoUploader
                  endpoint="productLogo"
                  onChange={(url) => {
                    if (url) {
                      setUploadedLogoUrl(url);
                    }
                  }}
                />
              )}
            </div>

            <div className="mt-4">
              <div className="font-medium">
                Product Images (upload 1 to {PRODUCT_LIMITS.imageMax} images)
              </div>
              {uploadedProductImages.length > 0 ? (
                <div className="mt-2 space-y-4 md:flex md:gap-2 md:space-y-0">
                  {uploadedProductImages.map((url) => (
                    <div key={url} className="relative h-40 md:w-40">
                      <Image
                        priority
                        src={url}
                        alt="Uploaded Product Image"
                        fill
                        sizes="160px"
                        className="rounded-md object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <ImagesUploader
                  endpoint="productImages"
                  onChange={setUploadedProductImages}
                />
              )}
            </div>
          </StepShell>
        )}

        {step === 5 && (
          <StepShell className="space-y-5">
            <div className="flex items-center gap-3">
              <PiCalendar className="text-4xl text-indigo-500" />
              <h1 className="text-4xl font-semibold">Release Date</h1>
            </div>
            <p className="mt-4 text-xl font-light leading-8">
              When will your product be available to the public? Select a date
              to continue.
            </p>

            <div className="mt-10 max-w-sm">
              <h2 className="pb-4 font-medium">Release Date</h2>
              <Input
                type="date"
                value={releaseDate}
                min={new Date().toISOString().slice(0, 10)}
                className="h-11"
                onChange={(event) => setReleaseDate(event.target.value)}
              />
            </div>
          </StepShell>
        )}

        {step === 6 && (
          <StepShell>
            <h1 className="text-4xl font-semibold">Additional Links</h1>
            <p className="mt-4 text-xl font-light leading-8">
              Add links to your product&apos;s website, social media, and other
              platforms.
            </p>

            <div className="mt-10">
              <div className="flex items-center gap-x-2 font-medium">
                <CiGlobe className="text-2xl text-gray-600" />
                <h2 className="text-xl">Website</h2>
              </div>
              <Input
                type="text"
                value={website}
                className="mt-2 h-11 rounded-md"
                placeholder="https://www.yourdomain.com"
                onChange={(event) => setWebsite(event.target.value)}
              />
            </div>

            <div className="mt-10">
              <div className="flex items-center gap-x-2 font-medium">
                <FaXTwitter className="text-2xl" />
                <h2 className="text-xl">Twitter</h2>
              </div>
              <Input
                placeholder="https://www.twitter.com"
                type="text"
                className="mt-2 h-11 rounded-md"
                value={twitter}
                onChange={(event) => setTwitter(event.target.value)}
              />
            </div>

            <div className="mt-10">
              <div className="flex items-center gap-x-2 font-medium">
                <FaInstagram className="text-2xl" />
                <h2 className="text-xl">Instagram</h2>
              </div>
              <Input
                placeholder="https://www.instagram.com/"
                type="text"
                className="mt-2 h-11 rounded-md"
                value={instagram}
                onChange={(event) => setInstagram(event.target.value)}
              />
            </div>
          </StepShell>
        )}

        {step === 7 && (
          <StepShell className="space-y-5">
            <h1 className="text-4xl font-semibold">Review and submit</h1>
            <p className="mt-4 text-xl font-light leading-8">
              Review the details of your product and submit it to the world.
              Your product will be reviewed before it goes live.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              <ReviewItem label="Name of the product" value={name} />
              <ReviewItem label="Slug (URL)" value={slug} />
              <ReviewItem label="Category" value={selectedCategories.join(", ")} />
              <ReviewItem label="Website URL" value={website} />
              <ReviewItem label="Headline" value={headline} />
              <ReviewItem label="Short description" value={description} />
              <ReviewItem label="Twitter" value={twitter} />
              <ReviewItem label="Instagram" value={instagram} />
              <ReviewItem
                label="Release date - Pending Approval"
                value={
                  releaseDate
                    ? new Date(releaseDate).toDateString()
                    : "Not specified"
                }
              />

              <div>
                <div className="font-semibold">Product Images</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {uploadedProductImages.map((url) => (
                    <Image
                      key={url}
                      priority
                      src={url}
                      alt="Uploaded Product Image"
                      width={112}
                      height={112}
                      className="h-28 w-28 rounded-md object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
          </StepShell>
        )}

        {step === 8 && (
          <StepShell className="flex flex-col items-start gap-5">
            <div className="text-4xl font-semibold">Congratulations</div>
            <div className="mt-4 text-xl font-light leading-8">
              Your product has been successfully submitted. Our team will review
              it and get back to you soon.
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <button
                onClick={() => router.push("/my-products")}
                className="mt-4 flex w-60 cursor-pointer items-center justify-center rounded bg-[#ff6154] px-4 py-2 text-white transition-all duration-300 hover:bg-orange-600"
              >
                Go to your products
              </button>

              <button
                onClick={submitAnotherProduct}
                className="mt-4 flex w-60 cursor-pointer items-center justify-center rounded border px-4 py-2 text-[#ff6154] transition-all duration-300 hover:bg-foreground/5"
              >
                Submit another product
              </button>
            </div>
          </StepShell>
        )}

        {step !== 8 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-10 flex items-center justify-between"
          >
            {step !== 1 ? (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            ) : (
              <div />
            )}

            {step === 7 ? (
              <div className="flex flex-col items-end gap-3">
                {submissionError && (
                  <p className="max-w-sm text-right text-sm text-red-600">
                    {submissionError}
                  </p>
                )}
                <button
                onClick={submitProduct}
                disabled={loading}
                className="mt-4 flex items-center gap-2 rounded-md bg-[#ff6154] px-4 py-2 text-white transition-all duration-300 hover:bg-orange-600"
              >
                {loading ? "Submitting..." : "Submit"}
                {loading && <LuLoader className="h-5 w-5 animate-spin" />}
              </button>
              </div>
            ) : (
              <button
                onClick={nextStep}
                className="mt-4 rounded-md bg-[#ff6154] px-4 py-2 text-white transition-all duration-300 hover:bg-orange-600"
              >
                Continue
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h2 className="font-semibold">{label}</h2>
      <p className="mt-2 break-words text-gray-600">{value || "Not specified"}</p>
    </div>
  );
}
