import { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from "mongoose";
import app from "../src/app";
import { config } from "../src/config";

// Cache the database connection
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }

    try {
        if (mongoose.connection.readyState === 1) {
            isConnected = true;
            return;
        }

        await mongoose.connect(config.mongoUri);
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    await connectToDatabase();
    return app(req, res);
}
