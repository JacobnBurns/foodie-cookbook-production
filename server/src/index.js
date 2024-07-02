import express from "express";
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { userRouter } from "./routes/user.js";
import { recipesRouter } from "./routes/recipes.js";


dotenv.config();


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Enable all CORS requests
app.use(cors());

// Routes
app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

// Connect to MongoDB
mongoose.connect(process.env.DB_STRING)
    .then(() => {
        console.log("MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });