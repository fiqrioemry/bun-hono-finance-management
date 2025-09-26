/*
  Warnings:

  - You are about to drop the column `date` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `transactionTime` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."AccountType" ADD VALUE 'INVESTMENT';
ALTER TYPE "public"."AccountType" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "public"."transactions" DROP COLUMN "date",
DROP COLUMN "updatedAt",
ADD COLUMN     "finalBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "initialBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "merchantLocation" TEXT,
ADD COLUMN     "merchantName" TEXT,
ADD COLUMN     "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "transactionTime" TEXT NOT NULL;
