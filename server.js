import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';
import morgan from "morgan";
import path from 'path';
import { fileURLToPath } from 'url';
import authRoute from './routes/auth.route.js';
import itemRoute from './routes/item.route.js';

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//Middleware
app.use(cors({origin: ["http://localhost:5173", "http://localhost:5175"], credentials: true}));
app.use(cookieParser())
app.use(express.json())
app.use(morgan('combined'))
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))

// Routes
app.use('/api/auth', authRoute);
// example
app.use('/api/item', itemRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'Something went wrong!';

    return res.status(errorStatus).send(errorMessage);
})

mongoose.set('strictQuery', true);

const connect = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to database");
    } catch (error) {
        handleError(error);
    }
}

app.listen(PORT, ()=> {
    connect()
    console.log(`Server running on port ${PORT}`);
});