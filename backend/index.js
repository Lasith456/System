import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import ticketRoutes from "./routes/ticket.route.js"
import departmentRoutes from "./routes/department.route.js"

import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config();
const app=express();
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); 
app.use(cookieParser());
const PORT= process.env.PORT || 3000;
app.use("/api/auth",authRoutes)
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}
app.use('/ticket', ticketRoutes);
app.use('/api', departmentRoutes);
app.listen(PORT,()=>{
    console.log("Server is running in port ",PORT)
    connectDB();
})