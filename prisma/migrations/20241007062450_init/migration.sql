/*
  Warnings:

  - Made the column `addOnItem` on table `orderitem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `OrderItem_orderId_fkey` ON `orderitem`;

-- AlterTable
ALTER TABLE `orderitem` MODIFY `addOnItem` BOOLEAN NOT NULL;
