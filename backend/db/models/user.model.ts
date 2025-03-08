import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { pbkdf2Sync, randomBytes } from 'crypto'
export interface IUser extends Document {
    fullname: {
      firstname: string;
      lastname?: string;
    };
    email: string;
    password: string;
    salt: string;
    socketId?: string,
    CreatedDate:Date,
    UpdatedDate:Date,
    generateAuthToken(): string; // Declare the method
  }
const userSchema=new mongoose.Schema<IUser>({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'First name must be at least 3 characters long']
        },
        lastname:{
            type:String,
            minlength:[3,'Last name must be at least 3 characters long']
        }
    },
    email:{
            type:String,
            required:true,
            unique:true,
    },
    password:{
        type:String,
        require:true,
        select:false,
        length:[6,'Password must be at least 6 characters long']
    },
    salt:{
        type:String,
        require:true,
        select:false,
    },
    socketId: {
        type: String,
      },
      CreatedDate:{
        type:Date,
        default:Date.now
      },
      UpdatedDate:{
        type:Date,
        default:Date.now
      }
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET,{
        expiresIn: "24h",
    });
    return token;
}
export const generateSalt=function (length = 16): string {
    return randomBytes(length).toString('hex');
  }
  
 export const hashPassword= function (password: string, salt: string): string {
    return pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  }

  export const UserModel=mongoose.model<IUser>('User',userSchema)