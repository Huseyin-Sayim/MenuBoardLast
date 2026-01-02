-- DropIndex
DROP INDEX "Screen_deviceId_key";

-- AlterTable
ALTER TABLE "ScreenConfig" ADD COLUMN     "displayDuration" INTEGER;
