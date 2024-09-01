import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.CORS_ORIGIN;
      
      // Check if origin is in the allowed origins array or if there's no origin (for same-origin requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin); // Allow the request
      } else {
        callback(new Error('Not allowed by CORS')); // Reject the request
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({extended:true, limit:"16kb"}))

app.use(cookieParser());

import databaseRouter from "./routes/database.routes.js"

app.use("/api/v1/db", databaseRouter);

export default app;

