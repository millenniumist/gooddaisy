/*
  Warnings:

  - The values [CART] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'INPROCESS', 'SHIPPED');
ALTER TABLE "Order" ALTER COLUMN "productionStatus" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "productionStatus" TYPE "OrderStatus_new" USING ("productionStatus"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "productionStatus" SET DEFAULT 'INPROCESS';
COMMIT;
