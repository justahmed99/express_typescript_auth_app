/*
  Warnings:

  - You are about to drop the column `activation_token` on the `activations` table. All the data in the column will be lost.
  - Added the required column `is_used` to the `activations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otp_code` to the `activations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activations" DROP COLUMN "activation_token",
ADD COLUMN     "is_used" BOOLEAN NOT NULL,
ADD COLUMN     "otp_code" TEXT NOT NULL;
