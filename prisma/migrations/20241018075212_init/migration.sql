-- AlterTable
ALTER TABLE `product` ADD COLUMN `allowAddOnItem` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `allowColorRefinement` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `allowMessage` BOOLEAN NOT NULL DEFAULT true;
