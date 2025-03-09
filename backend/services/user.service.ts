import { UserModel, IUser } from "../db/models/user.model";

export const createUser = async (userData: {
  firstname: string;
  lastname?: string;
  email: string;
  password: string;
  salt: string;
}): Promise<IUser> => {
  const { firstname, lastname, email, password, salt } = userData;

  if (!firstname || !email || !password || !salt) {
    throw new Error("All required fields (firstname, email, password) are required");
  }

  const user = await UserModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    salt,
  });

  return user;
};