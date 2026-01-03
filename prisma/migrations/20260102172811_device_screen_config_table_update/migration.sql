/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `DeviceScreenCode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DeviceScreenCode_deviceId_key" ON "DeviceScreenCode"("deviceId");
