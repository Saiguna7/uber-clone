import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
export const app=express()
app.use(cors());
