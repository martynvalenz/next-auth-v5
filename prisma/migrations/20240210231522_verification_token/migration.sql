/*
  Warnings:

  - You are about to drop the column `identifier` on the `verification_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,token]` on the table `verification_tokens` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `verification_tokens` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "verification_tokens_identifier_token_key";

-- AlterTable
ALTER TABLE "verification_tokens" DROP COLUMN "identifier",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_email_token_key" ON "verification_tokens"("email", "token");
