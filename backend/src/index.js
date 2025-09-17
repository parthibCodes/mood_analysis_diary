import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;
connectDB();

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});