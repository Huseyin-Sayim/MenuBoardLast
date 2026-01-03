/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `DeviceScreenCode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DeviceScreenCode_code_key" ON "DeviceScreenCode"("code");
