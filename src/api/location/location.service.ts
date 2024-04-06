import { db } from "../../utils/db.server";

type Location = {
  id: string;
  name: string;
  address: string;
  phone: string;
  userId: string;
};

export const ListLocations = async (): Promise<Omit<Location, "userId">[]> => {
  return db.location.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
    },
  });
};

export const getLocation = async (
  id: string
): Promise<Omit<Location, "userId"> | null> => {
  return db.location.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
    },
  });
};

export const createLocation = async (
  location: Omit<Location, "id">
): Promise<Omit<Location, "userId">> => {
  const { name, address, phone, userId } = location;
  return db.location.create({
    data: {
      name,
      address,
      phone,
      userId,
    },
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
    },
  });
};

export const updateLocation = async (
  location: Omit<Location, "id">,
  id: string
): Promise<Omit<Location, "userId">> => {
  const { name, address, phone } = location;

  const dataToUpdate: { [key: string]: string } = {}; // Initialize empty object to store data to update

  // Add properties to dataToUpdate only if they are not null or undefined
  if (name !== undefined || name !== null || name.length > 0) {
    dataToUpdate.name = name;
  }
  if (address !== undefined || address !== null || address.length > 0) {
    dataToUpdate.address = address;
  }
  if (phone !== undefined || phone !== null || phone.length > 0) {
    dataToUpdate.phone = phone;
  }

  // Perform update only if there is data to update
  if (Object.keys(dataToUpdate).length > 0) {
    return db.location.update({
      where: { id },
      data: {
        name,
        address,
        phone,
      },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
      },
    });
  } else {
    // If no data to update, return the current user data
    return db.location.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
      },
    });
  }
};

export const deleteLocation = async (
  id: string
): Promise<Omit<Location, "userId">> => {
  return db.location.delete({
    where: { id },
  });
};
