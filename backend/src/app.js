import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import prisma from "./config/prisma.js";
import authRoutes from "./routes/authRoutes.js";


const app = express();

// ===========================
// Middleware
// ===========================
aapp.use(cors({
    origin: [
        "https://aastha-4fm5.onrender.com",
        "http://127.0.0.1:5500",
        "https://adubeaastha.netlify.app/"
    ],
    credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

// ===========================
// Routes
// ===========================
app.use("/api/auth", authRoutes);

// ===========================
// Home Route
// ===========================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 Aastha Backend Running Successfully"
    });
});

// ===========================
// Database Test Route
// ===========================
app.get("/db-test", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT NOW()`;

        res.status(200).json({
            success: true,
            message: "✅ Database Connected Successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database Connection Failed",
            error: error.message
        });
    }
});

// ===========================
// 404 Route
// ===========================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

export default app;