/*
  Warnings:

  - You are about to drop the column `extention` on the `Gallery` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Gallery` table. All the data in the column will be lost.
  - Added the required column `extension` to the `Gallery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Gallery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gallery" DROP COLUMN "extention",
DROP COLUMN "updateAt",
ADD COLUMN     "extension" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
