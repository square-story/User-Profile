import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";

const startServer = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log("Connected to MongoDB");

        app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        });
    } catch (err) {
        console.error("Error starting server:", err);
        process.exit(1);
    }
};

startServer();
