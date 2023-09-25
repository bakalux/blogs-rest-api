import dotenv from 'dotenv'
import { MongoClient } from 'mongodb';
dotenv.config()

const mongoURI = process.env.MONGO_URI as string;
const client = new MongoClient(mongoURI);

export async function runDb(): Promise<void> {
    try {
        await client.connect();
        console.log('Successfully connected to database!');
    } catch(e) {
        console.log(`Error while connecting to database`, e);
        await client.close();
    }
}

export function closeDbConnection(): Promise<void> {
    return client.close();
}
