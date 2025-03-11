import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import { connectToDB } from "./db/db";
import cors from "cors";
import { userRoutes } from "./routes/user.routes";
import cookieParser from "cookie-parser";
import { captionRoutes } from "./routes/caption.routes";
export const app = express();

connectToDB();
const corsOptions = {
  origin: "http://localhost:5173", // Exact frontend origin
  credentials: true, // Allow cookies/credentials
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Ensure cookies are parsed

app.get("/", (_req: Request, res: Response) => {
  console.log("Reached / route");
  res.send("Hello World!");
});

app.use("/users", userRoutes);
app.use("/captains", captionRoutes);