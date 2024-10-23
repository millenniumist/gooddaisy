/*
  Warnings:

  - The `productionStatus` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('INPROCESS', 'SHIPPED');

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "productionStatus",
ADD COLUMN     "productionStatus" "OrderStatus" NOT NULL DEFAULT 'INPROCESS';
