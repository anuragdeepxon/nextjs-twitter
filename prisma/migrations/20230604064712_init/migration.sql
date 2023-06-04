-- CreateTable
CREATE TABLE `TweetBatch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NOT NULL,
    `tweet_1` VARCHAR(191) NOT NULL,
    `tweet_2` VARCHAR(191) NOT NULL,
    `tweet_3` VARCHAR(191) NOT NULL,
    `tweet_4` VARCHAR(191) NOT NULL,
    `tweet_5` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
