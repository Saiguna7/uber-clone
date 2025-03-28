import { Request, Response, NextFunction } from "express";
import { generateSalt, hashPassword, UserModel } from "../db/models/user.model";
import { createUser } from "../services/user.service";
import { validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import { BlacklistTokenModel } from "../db/models/backlistToken.model";
import expressAsyncHandler from "express-async-handler";
export interface IBlacklistToken {
    token: string;
    createdAt: Date;
  }
// Define the handler with explicit typing
export const registerUser = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; // Exit early without returning a Response
    }

    const { fullname, email, password } = req.body;
    const isUserAlreadyExists=await UserModel.findOne({email})
    if(isUserAlreadyExists){
        res.status(400).json({error:"User Email already exists"})
        return
    }
    const salt = generateSalt();
    const hashPass = hashPassword(password, salt);

    if (!salt || !hashPass) {
      res.status(500).json({ error: "Something went wrong while creating user" });
      return;
    }

    const user = await createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashPass,
      salt,
    });

    if (!user) {
      res.status(500).json({ error: "Something went wrong while creating user" });
      return;
    }

    const token = user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    res.status(201).json({ message: "User created successfully"});
  }
);

export const loginUser=asyncHandler(async(req:Request,res:Response,_next:NextFunction)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; // Exit early without returning a Response
    }
    const {email,password}=req.body;


    const user=await UserModel.findOne({email}).select(['+password','+salt']);

    if(!user){
        res.status(400).json({error:"Invalid email or password"});
        return;
    }

    const isPasswordMatch=hashPassword(password,user.salt);
    if(isPasswordMatch!==user.password){
        res.status(400).json({error:"Invalid email or password"});
        return;
    }
    const userResponse = {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
      };
    const token=user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  
    res.status(200).json({ message: "User logged in successfully", user: userResponse });
})


export const getUserProfile=asyncHandler(async(req:Request,res:Response,_next:NextFunction)=>{
    res.status(200).json({message:"User logged in successfully",user:req.user})
})
export const logoutUser = expressAsyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      // Ensure the user is authenticated (using authUser middleware)
      // This step should be handled by the route, not the controller
      const token = req.cookies.token || (req.headers.authorization?.split(" ")[1] || "");
  
      if (!token) {
        res.status(401).json({ error: "No token provided" });
        return;
      }
  
      try {
        // Clear the token cookie
        await BlacklistTokenModel.create({
    token,
  });
        res.clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/", // Explicitly match the default path
        });
  
        // Blacklist the token
  
        res.status(200).json({ message: "User logged out successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to logout. Please try again." });
        return;
      }
    }
  );