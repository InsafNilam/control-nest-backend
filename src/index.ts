import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import upload from "express-fileupload";

// Router
import { UserRouter } from "./api/user/user.router";
import { LocationRouter } from "./api/location/location.router";
import { DeviceRouter } from "./api/device/device.router";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.PORT) {
  process.exit();
}
const PORT: number = parseInt(process.env.PORT as string, 10) || 8000;

const app = express();
// MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(
  upload({
    useTempFiles: false,
    limits: { fileSize: 5 * 1024 * 1024 },
  })
);

app.use("/", async (_request: Request, response: Response) => {
  return response.status(200).send("ControlNest Server is Up and Running");
});
app.use("/api/user", UserRouter);
app.use("/api/location", LocationRouter);
app.use("/api/device", DeviceRouter);

app.listen(PORT, () => {
  console.log(`ControlNest Server is listening on port ${PORT}...`);
});
