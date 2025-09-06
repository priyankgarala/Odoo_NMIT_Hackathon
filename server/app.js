import express from 'express';
import connectDB from './src/config/mongo.config.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './src/routes/authRoutes.js'
const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());


// routes
app.use("/api/auth", authRoutes);


app.listen(5000, ()=> {
    connectDB();
    console.log('App running on port 5000');
})