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

app.get("/", async (_request: Request, response: Response) => {
  const title = "ControlNest Server";
  const content = "Welcome to the ControlNest Server!";

  // Optional: Load data from a database or API
  // ...

  const template = `
  <!DOCTYPE html>
    <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        html, body {
            height: 100%;
            width: 100%;
            margin: 0;
        }
        body {
            background-image: linear-gradient(to bottom right, #FDFCFB, #E2D1C3);
            font-family: sans-serif;  /* Optional: Set font family */
            display: flex;  /* Enable flexbox for centering */
            flex-direction: column;
            justify-content: center;  /* Center elements horizontally */
            align-items: center;  /* Center elements vertically */
        }

        h1 {
            font-size: 70px;
            font-weight: 600;
            background-image: radial-gradient(circle, #553c9a, #ee4b2b);
            color: transparent;
            background-clip: text;
            -webkit-background-clip: text;
            margin: 0;  /* Remove default margin for centering */
        }

        p {
            text-align: center;  /* Center paragraph text */
            color: #4c4a37; 
            font-family: 'Source Sans Pro', sans-serif; 
            font-size: 18px; 
            line-height: 32px; 
            margin: 0 0 24px;
        }
      </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>${content}</p>
      </body>
    </html>`;

  response.setHeader("Content-Type", "text/html");
  return response.send(template);
});
app.use("/api/user", UserRouter);
app.use("/api/location", LocationRouter);
app.use("/api/device", DeviceRouter);

app.listen(PORT, () => {
  console.log(`ControlNest Server is listening on port ${PORT}...`);
});
