import express from 'express';
import connectDB from './src/config/mongo.config.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './src/routes/authRoutes.js'
import userRoutes from './src/routes/userRoutes.js'
import productRoutes from './src/routes/productRoutes.js'
import cartRoutes from './src/routes/cartRoutes.js'
import orderRoutes from './src/routes/orderRoutes.js'
import cors from 'cors';
import { notFound, errorHandler } from './src/middlewares/errorHandlers.js';

//app.jss
dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials : true
}))
app.use(express.json());
app.use(cookieParser());


// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);


// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

// server connection
app.listen(5000, ()=> {
    connectDB();
    console.log('App running on port 5000');
})
