import dotenv from 'dotenv'
import { Collection, MongoClient, Document } from 'mongodb';
dotenv.config()

const mongoURI = process.env.MONGO_URI as string;
export const client = new MongoClient(mongoURI);

export async function runDb(): Promise<void> {
    try {
        await client.connect();
        console.log('Successfully connected to database!');
    } catch(e) {
        console.log(`Error while connecting to database`, e);
        await client.close();
    }
}

export function getCollection<TViewModel extends Document>(name: string): Collection<TViewModel> {
    return client.db().collection<TViewModel>(name);
}

export function closeDbConnection(): Promise<void> {
    return client.close();
}
