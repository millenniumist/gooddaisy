/*
  Warnings:

  - You are about to drop the column `productionStatus` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "productionStatus",
ADD COLUMN     "orderStatus" "OrderStatus" NOT NULL DEFAULT 'INPROCESS';
