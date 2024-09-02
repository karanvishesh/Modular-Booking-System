import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.CORS_ORIGIN;
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin); 
      } else {
        callback(new Error('Not allowed by CORS')); 
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({extended:true, limit:"16kb"}))

app.use(cookieParser());

import userRouter from "./routes/user.routes.js"
import bookingRouter from "./routes/booking.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/booking", bookingRouter);

export default app;

