import express, { Response, Request, NextFunction } from "express";
import { Router } from "express";
import { food_model } from "../models/models";
import { exists } from "fs";
import { error } from "console";
import { verifyToken } from "@clerk/backend";
import { isAdmin } from "./middleware";
import { customRequest } from "./food-category";

export const foodRouter = Router();
const auth = async (req: customRequest, res: Response, next: NextFunction) => {
  const token = req.get("auth");
  if (token) {
    try {
      const verified = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      const userId = verified.sub;
      const { role } = verified.metadata as { role: string };
      req.userId = userId;
      req.role = role;
      console.log(role);
      next();
      return;
    } catch (e) {
      console.error(e, "aldaa");
    }
  }
  console.log("no");
  res.json({ message: "no" });
};
foodRouter.get("/", async (req: Request, res: Response) => {
  const result = await food_model.find();
  res.json(result);
});
foodRouter.delete(
  "/:_id",
  auth,
  isAdmin,
  async (req: Request, res: Response) => {
    const params = req.params;
    try {
      await food_model.findByIdAndDelete(params);
      res.json({ message: "success" });
    } catch (err) {
      console.error("aldaa", err, "aldaa");
      res.json({ message: "aldaa" });
    }
  }
);
foodRouter.get("/:category", async (req: Request, res: Response) => {
  if (!req.params) {
    res.json({ message: "no params" });
    return;
  }
  const params = req.params;
  const result = await food_model.find(params);
  res.json(result);
});
foodRouter.get("/:foodId", async (req: Request, res: Response) => {
  if (!req.params) {
    res.json({ message: "no params" });
    return;
  }
  const params = req.params;
  const result = await food_model.find(params);
  res.json(result);
});
foodRouter.put("/:_id", auth, isAdmin, async (req: Request, res: Response) => {
  const params = req.params;
  const body = req.body;
  try {
    const newchange = await food_model.findByIdAndUpdate(params, body, {
      new: true,
    });
    res.json({ message: "success", newchange });
  } catch (e) {
    console.log(e, "aldaa");
    res.json({ message: "aldaa" });
  }
});

foodRouter.post("/", auth, isAdmin, async (req: Request, res: Response) => {
  const body = req.body;
  try {
    if (!body) {
      res.json({ message: "aldaa" });
    }
    const newitem = await food_model.create(body);
    res.json({ message: "success", newitem });
  } catch (e) {
    res.json({ message: "aldaa" });
    console.error(e, "aldaa");
  }
});
