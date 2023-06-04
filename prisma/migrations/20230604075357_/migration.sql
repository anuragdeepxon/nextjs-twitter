/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `TweetBatch` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `TweetBatch_uuid_key` ON `TweetBatch`(`uuid`);
