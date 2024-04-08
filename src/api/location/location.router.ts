import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as LocationService from "./location.service";
import { protect } from "../../middleware/auth";
import { isValidObjectId } from "mongoose";

export const LocationRouter = express.Router();

LocationRouter.get(
  "/",
  protect,
  async (_request: Request, response: Response) => {
    try {
      const locations = await LocationService.ListLocations();
      return response.status(200).json(locations);
    } catch (err: any) {
      return response.status(500).json({ error: err.message });
    }
  }
);

LocationRouter.get(
  "/:id",
  protect,
  async (request: Request, response: Response) => {
    const id: string = request.params.id;
    if (id && !isValidObjectId(id))
      return response
        .status(400)
        .json({ error: "ID is not type of Mongodb DB" });

    try {
      const location = await LocationService.getLocation(id);
      return response.status(200).json(location);
    } catch (err: any) {
      return response.status(500).json({ error: err.message });
    }
  }
);

LocationRouter.post(
  "/",
  body("name").isString(),
  body("address").isString(),
  body("phone").isString(),
  protect,
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ error: errors.array().join(", ") });
    }
    try {
      const location = request.body;

      const newLocation = await LocationService.createLocation({
        ...location,
        userId: request.user.id,
      });
      return response
        .status(201)
        .json({
          success: "Location Creation was Successfull",
          location: newLocation,
        });
    } catch (err: any) {
      return response.status(500).json({ error: err.message });
    }
  }
);

LocationRouter.put(
  "/:id",
  body("name").optional().isString(),
  body("address").optional().isString(),
  body("phone").optional().isString(),
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
      const location = request.body;
      const updateLocation = await LocationService.updateLocation(location, id);
      return response
        .status(200)
        .json({
          success: "Location update was successfull",
          location: updateLocation,
        });
    } catch (err: any) {
      return response.status(500).json({ error: err.message });
    }
  }
);

LocationRouter.delete(
  "/:id",
  protect,
  async (request: Request, response: Response) => {
    const id: string = request.params.id;
    if (id && !isValidObjectId(id))
      return response
        .status(400)
        .json({ error: "ID is not type of Mongodb DB" });

    try {
      await LocationService.deleteLocation(id);
      return response
        .status(200)
        .json({ success: "Location Deleted Successfull" });
    } catch (err: any) {
      return response.status(500).json({ error: err.message });
    }
  }
);
