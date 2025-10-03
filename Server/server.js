import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./routes/aiRoutes.js";
import userRouter from "./routes/userRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import serverless from "serverless-http";

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => res.send("Server is Live!"));
app.use("/api/ai", requireAuth(), aiRouter);
app.use("/api/user", requireAuth(), userRouter);

// Export as serverless handler
const handler = serverless(app);

// Connect Cloudinary on first cold start
let cloudinaryConnected = false;
async function connectOnce() {
  if (!cloudinaryConnected) {
    await connectCloudinary();
    cloudinaryConnected = true;
  }
}

// This wrapper ensures Cloudinary connects before handling requests
export default async function(req, res) {
  await connectOnce();
  return handler(req, res);
}
