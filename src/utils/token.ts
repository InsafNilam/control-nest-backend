import type { Response } from "express";
import { sign } from "jsonwebtoken";

type User = {
  id: string;
  name: string | null;
  email: string | null;
};

const generateJWTToken = (userID: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret not found in environment variables.");
  }
  return sign({ userID: userID }, process.env.JWT_SECRET, {
    expiresIn: "1 day",
  });
};

export const cookieToken = (user: User, response: Response) => {
  const token = generateJWTToken(user.id);
  // Server Only Cookie
  const options = {
    // 1 Day
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  return response.status(200).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
