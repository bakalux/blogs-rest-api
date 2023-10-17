import dotenv from "dotenv";

dotenv.config()
export const mongoURI = process.env.MONGO_URI as string;
export const JWT_SECRET = 'asdfasdf';
