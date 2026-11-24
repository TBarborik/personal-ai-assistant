-- AlterTable
ALTER TABLE `DocumentChunk` ADD COLUMN `embedding` JSON NULL,
    ADD COLUMN `embeddingModel` VARCHAR(191) NULL;
