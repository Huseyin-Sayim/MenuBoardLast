-- DropForeignKey
ALTER TABLE "ScreenConfig" DROP CONSTRAINT "ScreenConfig_mediaId_fkey";

-- AlterTable
ALTER TABLE "ScreenConfig" ADD COLUMN     "templateId" TEXT,
ALTER COLUMN "mediaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ScreenConfig" ADD CONSTRAINT "ScreenConfig_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenConfig" ADD CONSTRAINT "ScreenConfig_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
