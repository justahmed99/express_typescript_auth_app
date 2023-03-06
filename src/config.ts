import { config } from "dotenv";

// Load environment variables from the .env file
config();

// Retrieve the environment variables
export const {
    PORT,
    DATABASE_URL,
    PASSWORD_SALT,
    PASSWORD_DIGEST,
    PASSWORD_KEY_LENGTH,
    PASSWORD_ITERATION,
    OTP_LENGTH
} = process.env;