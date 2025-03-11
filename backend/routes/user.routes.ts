import { Router } from "express";
import { body } from "express-validator";
import { getUserProfile, loginUser, logoutUser, registerUser } from "../controllers/user.controller";
import { authUser } from "../middlewares/auth.middleware";

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
router.post('/login',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long')
],loginUser
)

router.get('/profile',authUser,getUserProfile)
router.post('/logout',authUser,logoutUser)

export const userRoutes = router;