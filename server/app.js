import express from 'express';
import connectDB from './src/config/mongo.config.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());


app.listen(5000, ()=> {
    connectDB();
    console.log('App running on port 5000');
})