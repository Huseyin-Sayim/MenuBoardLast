-- CreateTable
CREATE TABLE "ScreenConfig" (
    "id" TEXT NOT NULL,
    "screenId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "mediaIndex" INTEGER NOT NULL,

    CONSTRAINT "ScreenConfig_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScreenConfig" ADD CONSTRAINT "ScreenConfig_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenConfig" ADD CONSTRAINT "ScreenConfig_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
