import { Router } from 'express'
import { body } from 'express-validator';
import { getCaptionProfile, loginCaption, logoutCaption, registerCaptain } from '../controllers/caption.controller';
import { authCaption } from '../middlewares/auth.middleware';

const router=Router()
router.post('/register',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
    body('vehicle.color').isLength({min:3}).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({min:3}).withMessage('Plate number must be at least 3 characters long'),
    body('vehicle.capacity').isInt().withMessage('Capacity must be a number'),
    body('vehicle.vehicleType').isIn(['car','motorcycle','auto']).withMessage('Invalid vehicle type')
],registerCaptain)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long')
],loginCaption)    
router.get('/profile',authCaption,getCaptionProfile)
router.get('/logout',authCaption,logoutCaption)
export const captionRoutes=router