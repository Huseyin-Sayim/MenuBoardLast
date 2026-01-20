-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "branchCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "businessName" TEXT;
