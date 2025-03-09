import expressAsyncHandler from "express-async-handler";
import { captainModel } from "../db/models/caption.model";
import { Request,Response,NextFunction } from "express";
import { validationResult } from "express-validator";
import { generateSalt, hashPassword } from "../db/models/user.model";
import { createCaption } from "../services/caption.service";
export const registerUser = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
    res.status(201).json({message:"captain created successfully",token})
})