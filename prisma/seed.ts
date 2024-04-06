import bcrypt from "bcryptjs";
import { db } from "../src/utils/db.server";
import { v4 as uuidv4 } from "uuid";

import * as UserService from "../src/api/user/user.service";
import * as LocationService from "../src/api/location/location.service";

type User = {
  name: string;
  email: string;
  password: string;
};

type Location = {
  name: string;
  address: string;
  phone: string;
};

type Device = {
  serialNumber: string;
  type: string;
  status: string;
};

async function seed() {
  await Promise.all(
    getUsers().map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      const userExists = await UserService.getUserByEmail(user.email);
      if (!userExists) {
        return db.user.create({
          data: {
            name: user.name,
            email: user.name,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
      return null;
    })
  );

  const users = await UserService.ListUsers();

  await Promise.all(
    getLocations().map(async (location, i) => {
      return db.location.create({
        data: {
          name: location.name,
          address: location.address,
          phone: location.phone,
          userId: users[users.length % i].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    })
  );

  const locations = await LocationService.ListLocations();

  await Promise.all(
    getDevices().map(async (device, i) => {
      return db.device.create({
        data: {
          serialNumber: device.serialNumber,
          status: device.status,
          type: device.type,
          locationId: locations[locations.length % i].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    })
  );
}

seed();

function getUsers(): Array<User> {
  return [
    {
      name: "Insaf Nilam",
      email: "insafnilam.2000@gmail.com",
      password: "123456",
    },
    {
      name: "Ashfaq Nilam",
      email: "ashfaqnilam.1997@gmail.com",
      password: "123456",
    },
    {
      name: "Nihara Nilam",
      email: "nnilam120@gmail.com",
      password: "123456",
    },
  ];
}

function getLocations(): Array<Location> {
  return [
    {
      name: "Colombo",
      address: "27A, St. Albans Place, Colombo 04",
      phone: "0724325896",
    },
    {
      name: "Wattala",
      address: "24A, Welikadamulla Road, Mabola, Wattala",
      phone: "0752361157",
    },
    {
      name: "Gampaha",
      address: "112 Gampaha Fly Over, Gampaha",
      phone: "0714875269",
    },
  ];
}

function getDevices(): Array<Device> {
  return [
    {
      serialNumber: uuidv4(),
      type: getRandomElement(["pos", "kisok", "signage"]),
      status: getRandomElement(["active", "inactive"]),
    },
  ];
}

function getRandomElement(element: Array<string>): string {
  const random = Math.floor(Math.random() * element.length);
  return element[random];
}
