/*
  Warnings:

  - You are about to drop the column `addOnPrice` on the `product` table. All the data in the column will be lost.
  - You are about to alter the column `colorRefinement` on the `product` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Double`.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `addOnPrice`,
    MODIFY `colorRefinement` DOUBLE NULL DEFAULT 200;
