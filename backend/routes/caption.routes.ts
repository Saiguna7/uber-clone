import { Router } from 'express'
import { body } from 'express-validator';
import { registerUser } from '../controllers/captiom.controller';

const router=Router()
router.post('/register',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
    body('vehicle.color').isLength({min:3}).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({min:3}).withMessage('Plate number must be at least 3 characters long'),
    body('vehicle.capacity').isInt().withMessage('Capacity must be a number'),
    body('vehicle.vehicleType').isIn(['car','motorcycle','auto']).withMessage('Invalid vehicle type')
],registerUser)
export const captionRoutes=router