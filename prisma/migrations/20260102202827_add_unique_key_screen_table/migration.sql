/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `Screen` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Screen_deviceId_key" ON "Screen"("deviceId");
