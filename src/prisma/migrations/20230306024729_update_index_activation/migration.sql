-- DropIndex
DROP INDEX "activations_id_user_id_idx";

-- CreateIndex
CREATE INDEX "activations_id_user_id_otp_code_idx" ON "activations"("id", "user_id", "otp_code");
