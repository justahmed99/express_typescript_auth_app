import { config } from "dotenv";

config();

export const {
    PORT,
    DATABASE_URL,
    PASSWORD_SALT,
    PASSWORD_DIGEST,
    PASSWORD_KEY_LENGTH,
    PASSWORD_ITERATION,
    OTP_LENGTH,
    JWT_SECRET_KEY
} = process.env;