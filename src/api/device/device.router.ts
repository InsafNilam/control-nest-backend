import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as DeviceService from "./device.service";
import { protect } from "../../middleware/auth";
import { isValidObjectId } from "mongoose";

import { deleteImage, uploadImage } from "../../utils/upload.image";
import { JsonObject } from "@prisma/client/runtime/library";

export const DeviceRouter = express.Router();

DeviceRouter.get(
  "/",
  body("locationId").isString(),
  protect,
  async (request: Request, response: Response) => {
    try {
      const { locationId } = request.body;
      if (locationId && !isValidObjectId(locationId))
        return response
          .status(400)
          .json({ error: "ID is not type of Mongodb DB" });

      const devices = await DeviceService.ListDevices(locationId);
      return response.status(200).json(devices);
    } catch (err: any) {
      return response.status(500).json({ error: err.message });
    }
  }
);

DeviceRouter.get(
  "/:id",
  protect,
  async (request: Request, response: Response) => {
    const id: string = request.params.id;
    if (id && !isValidObjectId(id))
      return response
        .status(400)
        .json({ error: "ID is not type of Mongodb DB" });

    try {
      const device = await DeviceService.getDevice(id);
      return response.status(200).json(device);
    } catch (err: any) {
      return response.status(500).json({ error: err.message });
    }
  }
);

DeviceRouter.post(
  "/",
  body("locationId").isString(),
  body("type").isString(),
  body("status").isString(),
  protect,
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ error: errors.array().join(", ") });
    }
    try {
      const device = request.body;

      if (request.files.image) {
        const image = await uploadImage(request.files.image);
        device["image"] = image;
      }

      const newDevice = await DeviceService.createDevice(device);
      return response
        .status(201)
        .json({ success: "Device Creation Successfull", device: newDevice });
    } catch (err: any) {
      return response.status(500).json({ error: err.message });
    }
  }
);

DeviceRouter.put(
  "/:id",
  body("type").optional().isString(),
  body("status").optional().isString(),
  protect,
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array().join(", ") });
    }

    const id: string = request.params.id;
    if (id && !isValidObjectId(id))
      return response
        .status(400)
        .json({ error: "ID is not type of Mongodb DB" });

    try {
      const field = request.body;
      const device = await DeviceService.getDevice(id);

      if (!device) {
        return response.status(404).json({ error: "Device not found" });
      }

      if (request.files?.image) {
        if (device?.image && typeof device?.image === "object") {
          const imageID = (device.image as JsonObject).id;
          await deleteImage(imageID);

          const image = await uploadImage(request.files.image);
          field["image"] = image;
        } else {
          const image = await uploadImage(request.files.image);
          field["image"] = image;
        }
      }

      const updateDevice = await DeviceService.updateDevice(field, id);
      return response
        .status(200)
        .json({ success: "Device Successfully Updated", device: updateDevice });
    } catch (err: any) {
      return response.status(500).json({ error: err.message });
    }
  }
);

DeviceRouter.delete(
  "/:id",
  protect,
  async (request: Request, response: Response) => {
    const id: string = request.params.id;
    if (id && !isValidObjectId(id))
      return response
        .status(400)
        .json({ error: "ID is not type of Mongodb DB" });

    try {
      const device = await DeviceService.getDevice(id);
      if (device?.image && typeof device?.image === "object") {
        const imageID = device.image as JsonObject;
        await deleteImage(imageID.id);
      }

      await DeviceService.deleteDevice(id);
      return response
        .status(200)
        .json({ success: "Device Deleted Successfully" });
    } catch (err: any) {
      return response.status(500).json({ error: err.message });
    }
  }
);
