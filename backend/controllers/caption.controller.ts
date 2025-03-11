import expressAsyncHandler from "express-async-handler";
import { captainModel } from "../db/models/caption.model";
import { Request,Response,NextFunction } from "express";
import { validationResult } from "express-validator";
import { generateSalt, hashPassword } from "../db/models/user.model";
import { createCaption } from "../services/caption.service";
import { BlacklistTokenModel } from "../db/models/backlistToken.model";
export const registerCaptain = expressAsyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return; // Exit early without returning a Response
    }
    const {fullname,email,password,vehicle}=req.body
    const isCaptain=await captainModel.findOne({email})
    if(isCaptain){
        res.status(400).json({error:"Captain Email already exists"})
        return
    }
    const salt=generateSalt()
    const hashPass=hashPassword(password,salt)

    if(!salt || !hashPass){
        res.status(500).json({error:"Something went wrong while creating user"})
        return
    }

    const captain=await createCaption({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashPass,
        salt,
            color:vehicle.color,
            plate:vehicle.plate,
            capacity:vehicle.capacity,
            vehicleType:vehicle.vehicleType
    })
    
    if (!captain) {
        res.status(500).json({ error: "Something went wrong while creating user" });
        return;
      }
  
    const token=captain.generateAuthToken()
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    res.status(201).json({ message: "Captain created successfully" });
})

export const loginCaption = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { email, password } = req.body;
  
    const caption = await captainModel.findOne({ email }).select(["+password", "+salt"]);
  
    if (!caption) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }
  
    const isPasswordMatch = hashPassword(password, caption.salt);
    if (isPasswordMatch !== caption.password) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }
  
    const userResponse = {
      _id: caption._id,
      email: caption.email,
      lastname: caption.fullname.lastname,
      firstname: caption.fullname.firstname,
      vehicle: caption.vehicle,
    };
    const token = caption.generateAuthToken();
  
    // Set the token cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  
    res.status(200).json({ message: "User logged in successfully", token, user: userResponse });
  });
export const getCaptionProfile=expressAsyncHandler(async(req:Request,res:Response,_next:NextFunction)=>{
    res.status(200).json({message:"User logged in successfully",caption:req.user})
})

export const logoutCaption=expressAsyncHandler(async(req:Request,res:Response,_next:NextFunction)=>{
    const token=req.cookies.token || (req.headers.authorization?.split(" ")[1] || "");
    if(!token){
        res.status(401).json({error:"Unauthorized"})
        return
    }
    const blacklistedToken=await BlacklistTokenModel.findOne({token})
    if(blacklistedToken){
        res.status(401).json({ error: "Unauthorized" });
        return; // Exit early, handled by expressAsyncHandler
    }
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/", 
      });
        // Blacklist the token
        await BlacklistTokenModel.create({
          token, // Match token expiration
        });
  
        res.status(200).json({ message: "User logged out successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to logout. Please try again." });
        return;
      }
})