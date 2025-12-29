/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `Screen` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceId` to the `Screen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Screen" ADD COLUMN     "deviceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Screen_deviceId_key" ON "Screen"("deviceId");
