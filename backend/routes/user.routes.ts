import { Router } from "express";
import { body } from "express-validator";
import { registerUser } from "../controllers/user.controller";

const router = Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("fullname.firstname").isLength({ min: 3 }).withMessage("First name must be at least 3 characters long"),
  ],
  registerUser
);

export const userRoutes = router;