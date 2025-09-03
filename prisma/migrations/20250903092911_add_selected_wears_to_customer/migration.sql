/*
  Warnings:

  - Made the column `notes` on table `Customer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "selectedWears" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "notes" SET NOT NULL;
