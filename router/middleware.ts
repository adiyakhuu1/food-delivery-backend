import { NextFunction, Response } from "express";
import { customRequest } from "./food-category";

export const isAdmin = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.role) {
      if (req.role === "admin") {
        next();
      }
    } else {
      res.sendStatus(403);
      return;
    }
  } catch (e) {
    console.error(e, "aldaa");
  }
};
