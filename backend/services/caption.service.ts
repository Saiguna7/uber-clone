import { Icaptain ,captainModel} from "../db/models/caption.model";

export const createCaption = async (userData: {
  firstname: string;
  lastname?: string;
  email: string;
  password: string;
  salt: string;
  color: string;
  plate: string;
  capacity: number;
  vehicleType: string;
}): Promise<Icaptain> => {
  const { firstname, lastname, email, password, salt,color,plate,capacity,vehicleType} = userData;

  const user = await captainModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    salt,
    vehicle:{
        color,
        plate,
        capacity,
        vehicleType
    }
  });

  return user;
};