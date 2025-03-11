import { Request, Response, NextFunction } from "express";
import { UserModel } from "../db/models/user.model";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler"; // Correct import
import { BlacklistTokenModel } from "../db/models/backlistToken.model";
import { captainModel } from "../db/models/caption.model";

export const authUser = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  // Check if token is blacklisted
  const blacklisted = await BlacklistTokenModel.findOne({ token });
  if (blacklisted) {
    res.status(401).json({ error: "Token has been invalidated" });
    return;
  }

  // Verify token (assuming JWT)
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded === 'string') {
      throw new Error("Invalid token payload");
    }
    const user = await UserModel.findById(decoded._id);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
});

export const authCaption = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

    const blacklistedToken = await BlacklistTokenModel.findOne({ token });
    if (blacklistedToken) {
      res.status(401).json({ error: "Token has been invalidated" });
      return;
    }

    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET) 
      console.log("Decoded token:", decoded);
      if (typeof decoded === 'string') {
        throw new Error("Invalid token payload");
      }
      const caption = await captainModel.findById(decoded._id);
      if (!caption) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      req.user = caption;
      return next();
    } catch (error) {
      console.error("JWT verification error:", error instanceof Error && error.message);
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  }
);