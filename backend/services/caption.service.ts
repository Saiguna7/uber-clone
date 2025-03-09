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

  if (!firstname || !email || !password || !salt || !color || !plate || !capacity || !vehicleType ) {
    throw new Error("All required fields (firstname, email, password) are required");
  }

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