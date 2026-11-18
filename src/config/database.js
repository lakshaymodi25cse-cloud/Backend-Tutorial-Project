import mongoose from "mongoose";
import { MONGODBURI } from "./constants.js";

const connectDB = async () => {
    try {
        if (!MONGODBURI) {
            throw new Error(
                "MongoDB connection string is missing! Please define MONGODB_URI or MONGODBURI in your .env file."
            );
        }
        const conn = await mongoose.connect(MONGODBURI);
        console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error("Database Connection Failed:", error.message || error);
        process.exit(1);
    }
};

export default connectDB;
