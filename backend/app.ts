import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import { connectToDB } from "./db/db";
import cors from "cors";
import { userRoutes } from "./routes/user.routes";

export const app = express();

connectToDB(); // Ensure this function is defined and connects successfully
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/users", userRoutes);