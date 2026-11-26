-- AlterTable
ALTER TABLE `Usage` ADD COLUMN `costUsd` DECIMAL(18, 10) NULL;

-- AlterTable
ALTER TABLE `UsageStep` ADD COLUMN `costUsd` DECIMAL(18, 10) NULL;
