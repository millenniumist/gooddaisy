-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_orderId_fkey`;

-- AlterTable
ALTER TABLE `orderitem` MODIFY `orderId` INTEGER NULL;
