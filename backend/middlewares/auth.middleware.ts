import { Request, Response, NextFunction } from "express";
import { UserModel } from "../db/models/user.model";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler"; // Correct import
import { BlacklistTokenModel } from "../db/models/backlistToken.model";
import { captainModel } from "../db/models/caption.model";

export const authUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1] ;

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return; // Exit early, handled by expressAsyncHandler
    }
const blacklistedToken=await BlacklistTokenModel.findOne({token})
if(blacklistedToken){
    res.status(401).json({ error: "Unauthorized" });
    return; // Exit early, handled by expressAsyncHandler
}
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };
      const user = await UserModel.findById(decoded._id);

      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return; // Exit early, handled by expressAsyncHandler
      }

      // Attach user to request object
      req.user = user; // Assuming req.user is typed or you need to extend the Request type
     return next(); // Pass control to the next middleware
    } catch (error) {
      res.status(401).json({ error: "Unauthorized" });
      return; // Exit early, handled by expressAsyncHandler
    }
  }
);

export const authCaption = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Headers:", req.headers);
    console.log("Cookies:", req.cookies);
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("No token provided");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const blacklistedToken = await BlacklistTokenModel.findOne({ token });
    if (blacklistedToken) {
      console.log("Token is blacklisted:", token);
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };
      console.log("Decoded token:", decoded);
      const caption = await captainModel.findById(decoded._id);
      if (!caption) {
        console.log("Captain not found for _id:", decoded._id);
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      console.log("Authenticated captain:", caption);
      req.user = caption;
      return next();
    } catch (error) {
      console.error("JWT verification error:", error instanceof Error && error.message);
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  }
);