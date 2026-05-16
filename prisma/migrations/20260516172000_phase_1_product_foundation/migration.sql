-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_productId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "headline" TEXT,
ADD COLUMN "instagram" TEXT,
ADD COLUMN "logo" TEXT,
ADD COLUMN "name" TEXT,
ADD COLUMN "rank" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "releaseDate" TEXT,
ADD COLUMN "slug" TEXT,
ADD COLUMN "status" "ProductStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "twitter" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "website" TEXT;

-- Backfill renamed product fields before making the new shape required.
UPDATE "Product"
SET
  "name" = COALESCE(NULLIF("title", ''), 'Untitled Product'),
  "headline" = COALESCE(NULLIF("tagline", ''), 'No headline'),
  "logo" = COALESCE("thumbnail", ''),
  "releaseDate" = '',
  "website" = COALESCE("websiteUrl", ''),
  "twitter" = '',
  "instagram" = '',
  "slug" = LOWER(REGEXP_REPLACE(COALESCE(NULLIF("title", ''), "id"), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || SUBSTRING("id", 1, 8);

-- Remove old product fields after backfill.
ALTER TABLE "Product" DROP COLUMN "tagline",
DROP COLUMN "thumbnail",
DROP COLUMN "title",
DROP COLUMN "websiteUrl",
ALTER COLUMN "headline" SET NOT NULL,
ALTER COLUMN "instagram" SET NOT NULL,
ALTER COLUMN "logo" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "releaseDate" SET NOT NULL,
ALTER COLUMN "slug" SET NOT NULL,
ALTER COLUMN "twitter" SET NOT NULL,
ALTER COLUMN "website" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "Vote";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upvote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Upvote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Image_productId_idx" ON "Image"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_userId_productId_key" ON "Upvote"("userId", "productId");

-- CreateIndex
CREATE INDEX "_CategoryToProduct_B_index" ON "_CategoryToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_userId_idx" ON "Product"("userId");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
