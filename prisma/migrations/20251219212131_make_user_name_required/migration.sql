/*
  Warnings:

  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `tasks` MODIFY `status` ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'in_progress';

-- AlterTable
ALTER TABLE `users` MODIFY `name` VARCHAR(191) NOT NULL;
