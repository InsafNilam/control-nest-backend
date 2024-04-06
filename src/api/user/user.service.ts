import { db } from "../../utils/db.server";
import bcrypt from "bcryptjs";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  password: string | null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return db.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
    },
  });
};

export const getUserById = async (
  id: string
): Promise<Omit<User, "password"> | null> => {
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

export const ListUsers = async (): Promise<Omit<User, "password">[]> => {
  return db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

export const createUser = async (
  user: Omit<User, "id">
): Promise<Omit<User, "password">> => {
  const { name, email, password } = user;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password!, salt);

  return db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

export const updateUser = async (
  user: Omit<User, "id">,
  id: string
): Promise<Omit<User, "password">> => {
  const { name, email, password } = user;
  const dataToUpdate: { [key: string]: string } = {}; // Initialize empty object to store data to update

  // Add properties to dataToUpdate only if they are not null or undefined
  if (name !== undefined || name !== null || name.length > 0) {
    dataToUpdate.name = name;
  }
  if (email !== undefined || email !== null || email.length > 0) {
    dataToUpdate.email = email;
  }
  if (password !== undefined || password !== null || password.length > 0) {
    dataToUpdate.password = password;
  }

  // Perform update only if there is data to update
  if (Object.keys(dataToUpdate).length > 0) {
    return db.user.update({
      where: { id },
      data: {
        name,
        email,
        password,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  } else {
    // If no data to update, return the current user data
    return db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
};

export const deleteUser = async (
  id: string
): Promise<Omit<User, "password">> => {
  return db.user.delete({
    where: { id },
  });
};
