import express from 'express';
import connectDB from './src/config/mongo.config.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './src/routes/authRoutes.js'
import cors from 'cors';

const app = express();



app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials : true
}))

dotenv.config();
app.use(express.json());
app.use(cookieParser());


// routes
app.use("/api/auth", authRoutes);


app.listen(5000, ()=> {
    connectDB();
    console.log('App running on port 5000');
})