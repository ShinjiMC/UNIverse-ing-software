import dotenv from 'dotenv'

dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Shyni:qwert123@shyni.x3spvzs.mongodb.net/?retryWrites=true&w=majority";
export const PORT = process.env.PORT || 4000;