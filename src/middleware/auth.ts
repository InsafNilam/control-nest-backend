import { Request, Response, NextFunction } from "express";
import { JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import * as UserService from "../api/user/user.service";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string | null;
        email: string | null;
      };
    }
  }
}

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(" ")[1];
        const decoded: string | JwtPayload = verify(
          token,
          process.env.JWT_SECRET as string
        );

        // JwtPayload Object
        if (typeof decoded !== "object") {
          res.status(401);
          throw new Error("Not authorized");
        }

        const user = await UserService.getUserById(decoded.userID);
        if (!user) {
          res.status(401);
          throw new Error("Not authorized");
        }

        if (Date.now() >= decoded.exp! * 1000) {
          throw new TokenExpiredError(
            "Token Expired",
            new Date(decoded.exp! * 1000)
          );
        }

        req.user = { id: user.id, name: user.name, email: user.email };
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, No token");
    }
  }
);
