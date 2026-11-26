-- CreateTable
CREATE TABLE `Usage` (
    `id` VARCHAR(191) NOT NULL,
    `conversationId` VARCHAR(191) NULL,
    `messageId` VARCHAR(191) NULL,
    `provider` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `inputTokens` INTEGER NULL,
    `outputTokens` INTEGER NULL,
    `totalTokens` INTEGER NULL,
    `cacheReadTokens` INTEGER NULL,
    `cacheWriteTokens` INTEGER NULL,
    `reasoningTokens` INTEGER NULL,
    `durationMs` INTEGER NULL,
    `stepCount` INTEGER NOT NULL,
    `toolCallCount` INTEGER NOT NULL,
    `finishReason` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Usage_createdAt_idx`(`createdAt`),
    INDEX `Usage_provider_model_createdAt_idx`(`provider`, `model`, `createdAt`),
    INDEX `Usage_conversationId_messageId_idx`(`conversationId`, `messageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsageStep` (
    `int` VARCHAR(191) NOT NULL,
    `usageId` VARCHAR(191) NULL,
    `position` INTEGER NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `inputTokens` INTEGER NULL,
    `outputTokens` INTEGER NULL,
    `totalTokens` INTEGER NULL,
    `cacheReadTokens` INTEGER NULL,
    `cacheWriteTokens` INTEGER NULL,
    `reasoningTokens` INTEGER NULL,
    `finishReason` VARCHAR(191) NOT NULL,
    `toolCalls` JSON NOT NULL,

    UNIQUE INDEX `UsageStep_usageId_position_key`(`usageId`, `position`),
    PRIMARY KEY (`int`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UsageStep` ADD CONSTRAINT `UsageStep_usageId_fkey` FOREIGN KEY (`usageId`) REFERENCES `Usage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
