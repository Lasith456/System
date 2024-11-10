import mongoose from "mongoose";
import { exit } from "process";

export const connectDB= async ()=>{
try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);    
} catch (error) {
    console.error("Connecting MongoDB Error:",error.message)
    process.exit(1)
}
}