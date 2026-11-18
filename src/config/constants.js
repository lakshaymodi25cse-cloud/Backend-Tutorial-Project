import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const MONGODBURI = process.env.MONGODB_URI || process.env.MONGODBURI;
