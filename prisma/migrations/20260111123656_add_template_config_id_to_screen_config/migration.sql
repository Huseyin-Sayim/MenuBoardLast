-- AlterTable
ALTER TABLE "ScreenConfig" ADD COLUMN     "templateConfigId" TEXT;

-- AddForeignKey
ALTER TABLE "ScreenConfig" ADD CONSTRAINT "ScreenConfig_templateConfigId_fkey" FOREIGN KEY ("templateConfigId") REFERENCES "TemplateConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;
