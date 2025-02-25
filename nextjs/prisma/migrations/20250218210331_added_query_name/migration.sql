/*
  Warnings:

  - You are about to drop the column `betType` on the `Legs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Legs" DROP COLUMN "betType",
ADD COLUMN     "queryName" TEXT;
