import { JsonValue } from "@prisma/client/runtime/library";
import { db } from "../../utils/db.server";
import { v4 as uuidv4 } from "uuid";

type Device = {
  id: string;
  serialNumber: string;
  type: string;
  image: JsonValue;
  status: string;
  locationId: string;
};

export const ListDevices = async (
  id: string
): Promise<Omit<Device, "locationId">[]> => {
  return db.device.findMany({
    where: {
      locationId: id,
    },
    select: {
      id: true,
      serialNumber: true,
      type: true,
      image: true,
      status: true,
    },
  });
};

export const getDevice = async (
  id: string
): Promise<Omit<Device, "locationId"> | null> => {
  return db.device.findUnique({
    where: { id },
    select: {
      id: true,
      serialNumber: true,
      type: true,
      image: true,
      status: true,
    },
  });
};

export const createDevice = async (
  device: Omit<Device, "id">
): Promise<Omit<Device, "locationId">> => {
  const { image, status, type, locationId } = device;
  const serialNumber = uuidv4();

  return db.device.create({
    data: {
      serialNumber,
      type,
      image,
      status,
      locationId,
    },
    select: {
      id: true,
      serialNumber: true,
      type: true,
      image: true,
      status: true,
    },
  });
};

export const updateDevice = async (
  device: Omit<Device, "id">,
  id: string
): Promise<Omit<Device, "locationId">> => {
  const { image, status, type } = device;
  const dataToUpdate: { [key: string]: any } = {}; // Initialize empty object to store data to update

  // Add properties to dataToUpdate only if they are not null or undefined
  if (image !== undefined || image !== null) {
    dataToUpdate.image = image;
  }
  if (status !== undefined || status !== null || status.length > 0) {
    dataToUpdate.status = status;
  }
  if (type !== undefined || type !== null || type.length > 0) {
    dataToUpdate.type = type;
  }

  // Perform update only if there is data to update
  if (Object.keys(dataToUpdate).length > 0) {
    return db.device.update({
      where: { id },
      data: {
        ...dataToUpdate,
      },
      select: {
        id: true,
        serialNumber: true,
        type: true,
        image: true,
        status: true,
      },
    });
  } else {
    // If no data to update, return the current user data
    return db.device.findUnique({
      where: { id },
      select: {
        id: true,
        serialNumber: true,
        type: true,
        image: true,
        status: true,
      },
    });
  }
};

export const deleteDevice = async (
  id: string
): Promise<Omit<Device, "locationId">> => {
  return db.device.delete({
    where: { id },
  });
};
