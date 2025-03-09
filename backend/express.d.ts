import { IUser } from "./db/models/user.model";

// Augment the Express Request type
declare module "express" {
  interface Request {
    user?: IUser | Icaptain; // Optional property to allow undefined when no user is authenticated
  }
}