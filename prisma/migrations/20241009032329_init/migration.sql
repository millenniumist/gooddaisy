/*
  Warnings:

  - You are about to alter the column `message` on the `product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `addOnItem` on the `product` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Double`.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `message` DOUBLE NULL DEFAULT 0,
    MODIFY `addOnItem` DOUBLE NULL DEFAULT 0;
