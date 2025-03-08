import { Request, Response, NextFunction } from "express";
import { generateSalt, hashPassword } from "../db/models/user.model";
import { createUser } from "../services/user.service";
import { validationResult } from "express-validator";
import asyncHandler from "express-async-handler";

// Define the handler with explicit typing
export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; // Exit early without returning a Response
    }

    const { fullname, email, password } = req.body;
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
    res.status(201).json({ message: "User created successfully", token });
  }
);