/*
  Warnings:

  - You are about to alter the column `status` on the `tasks` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `tasks` MODIFY `status` ENUM('overdue', 'started', 'completed') NOT NULL DEFAULT 'started';
