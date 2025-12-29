/*
  Warnings:

  - Added the required column `devices` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "devices" TEXT NOT NULL;
