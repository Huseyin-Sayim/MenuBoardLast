-- DropForeignKey
ALTER TABLE "ScreenConfig" DROP CONSTRAINT "ScreenConfig_screenId_fkey";

-- AddForeignKey
ALTER TABLE "ScreenConfig" ADD CONSTRAINT "ScreenConfig_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE CASCADE ON UPDATE CASCADE;
