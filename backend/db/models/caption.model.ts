import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

export interface Icaptain extends mongoose.Document{
    fullname:{
        firstname:string,
        lastname?:string
    },
    email:string,
    password:string,
    salt:string,
    socketId?:string,
    status:string,
    vehicle:{
        color:string,
        plate:string,
        capacity:number,
        vehicleType:string
    },
    location:{
        lat?:number,
        lng?:number
    },
    CreatedDate:Date,
    UpdatedDate:Date,
    generateAuthToken(): string;
}
const captainSchema=new mongoose.Schema<Icaptain>({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'First name must be at least 3 characters long']
        },
        lastname:{
            type:String,
            required:true,
            minlength:[3,'Last name must be at least 3 characters long']
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password:{
        type:String,
        required:true,
        select:false,
        length:[6,'Password must be at least 6 characters long']
    },
    salt:{
        type:String,
        required:true,
        select:false,
    }, 
    socketId: {
        type: String,
      },
      status:{
type:String,
enum:["active","inactive"],
default:"inactive",
      },
      vehicle:{
        color:{
            type:String,
            required:true,
            minlength:[3,'Colr must be at least 3 character long']
        },
        plate:{
            type:String,
            required:true,
            minlength:[3,'Plate number must be at least 3 character long']
        },
        capacity:{
            type:Number,
            required:true,
            min:[1,'Capacity must be at least 1']
        },
        vehicleType:{
            type:String,
            required:true,
            enum:["car","motorcycle",'auto'],
        }
      },
      location:{
       lat:{
        type:Number,
       },
       lng:{
        type:Number,
       }
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

captainSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({
        _id:this._id
    },process.env.JWT_SECRET!,{
        expiresIn:"24h"
    })
    return token
}

   export  const captainModel=mongoose.model<Icaptain>('Captain',captainSchema)