import dotenv from "dotenv";

dotenv.config()
export const mongoURI = process.env.MONGO_URI as string;
export const JWT_SECRET = process.env.JWT_SECRET_KEY || 'secret';
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
export const EMAIL_LOGIN = process.env.EMAIL_LOGIN || '';
