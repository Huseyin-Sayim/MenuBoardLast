/*
  Warnings:

  - Added the required column `height` to the `DeviceScreenCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `DeviceScreenCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `DeviceScreenCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeviceScreenCode" ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "DeviceScreenCode" ADD CONSTRAINT "DeviceScreenCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
