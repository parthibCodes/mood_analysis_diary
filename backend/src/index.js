import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT || 3000;
connectDB();

import userRoutes from "./routes/user.routes.js";
app.use("/api/v0/users",userRoutes);

import journalRoutes from "./routes/journal.routes.js";
app.use("/api/v0/journal",journalRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});