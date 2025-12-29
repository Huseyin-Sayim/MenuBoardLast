/*
  Warnings:

  - You are about to drop the column `position` on the `Screen` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Screen" DROP COLUMN "position";

-- DropEnum
DROP TYPE "Position";
