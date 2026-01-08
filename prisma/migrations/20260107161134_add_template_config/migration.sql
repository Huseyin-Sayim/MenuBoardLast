/*
  Warnings:

  - You are about to drop the `BuyTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BuyTemplate" DROP CONSTRAINT "BuyTemplate_templateId_fkey";

-- DropForeignKey
ALTER TABLE "BuyTemplate" DROP CONSTRAINT "BuyTemplate_userId_fkey";

-- DropTable
DROP TABLE "BuyTemplate";

-- CreateTable
CREATE TABLE "TemplateConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "configData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateConfig_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemplateConfig" ADD CONSTRAINT "TemplateConfig_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateConfig" ADD CONSTRAINT "TemplateConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
