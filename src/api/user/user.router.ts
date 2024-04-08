import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { cookieToken } from "../../utils/token";
import bcrypt from "bcryptjs";

import * as UserService from "./user.service";
import { protect } from "../../middleware/auth";
import { isValidObjectId } from "mongoose";

export const UserRouter = express.Router();

UserRouter.get("/", protect, async (_request: Request, response: Response) => {
  try {
    const users = await UserService.ListUsers();
    return response.status(200).json(users);
  } catch (err: any) {
    return response.status(500).json({ error: err.message });
  }
});

UserRouter.get(
  "/:id",
  protect,
  async (request: Request, response: Response) => {
    const id: string = request.params.id;
    if (id && !isValidObjectId(id))
      return response
        .status(400)
        .json({ error: "ID is not type of Mongodb DB" });

    try {
      const user = await UserService.getUserById(id);
      return response.status(200).json(user);
    } catch (err: any) {
      return response.status(500).json({ error: err.message });
    }
  }
);

UserRouter.post(
  "/",
  body("name").isString(),
  body("email").isEmail(),
  body("password").isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ error: errors.array().join(", ") });
    }
    try {
      const user = request.body;
      await UserService.createUser(user);

      if (user) {
        return response
          .status(201)
          .json({ success: "User Registeration Successfull" });
      } else {
        return response
          .status(400)
          .json({ error: "Invalid user! please check again" });
      }
    } catch (err: any) {
      return response.status(500).json({ error: err.message });
    }
  }
);

UserRouter.post(
  "/login",
  body("email").isEmail(),
  body("password").isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ error: errors.array().join(", ") });
    }
    try {
      const user = request.body;
      const userExists = await UserService.getUserByEmail(user.email);

      if (
        userExists &&
        (await bcrypt.compare(user.password, userExists.password!))
      ) {
        const { password, ...rest } = userExists;
        cookieToken(rest, response);
      } else {
        response.status(400).json({ error: "Invalid credentials" });
      }
    } catch (err: any) {
      return response.status(500).json({ error: err.message });
    }
  }
);

UserRouter.put(
  "/:id",
  body("name").optional().isString(),
  body("email").optional().isEmail(),
  body("password").optional().isString(),
  protect,
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ error: errors.array().join(", ") });
    }
    const id: string = request.params.id;
    if (id && !isValidObjectId(id))
      return response
        .status(400)
        .json({ error: "ID is not type of Mongodb DB" });

    try {
      const user = request.body;
      const updateUser = await UserService.updateUser(user, id);
      return response
        .status(200)
        .json({ success: "User update Successfull", user: updateUser });
    } catch (err: any) {
      return response.status(500).json({ error: err.message });
    }
  }
);

UserRouter.delete(
  "/:id",
  protect,
  async (request: Request, response: Response) => {
    const id: string = request.params.id;
    if (id && !isValidObjectId(id))
      return response
        .status(400)
        .json({ error: "ID is not type of Mongodb DB" });

    try {
      await UserService.deleteUser(id);
      return response
        .status(200)
        .json({ success: "User Deleted Successfully" });
    } catch (err: any) {
      return response.status(500).json({ error: err.message });
    }
  }
);
