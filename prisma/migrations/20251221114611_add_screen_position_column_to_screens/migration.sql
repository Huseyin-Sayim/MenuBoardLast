-- CreateEnum
CREATE TYPE "Position" AS ENUM ('vertical', 'horizontal');

-- AlterTable
ALTER TABLE "Screen" ADD COLUMN     "position" "Position" NOT NULL DEFAULT 'horizontal';
