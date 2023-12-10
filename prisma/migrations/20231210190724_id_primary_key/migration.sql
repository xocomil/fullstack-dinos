/*
  Warnings:

  - The primary key for the `Dinosaur` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Dinosaur" DROP CONSTRAINT "Dinosaur_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Dinosaur_pkey" PRIMARY KEY ("id");
