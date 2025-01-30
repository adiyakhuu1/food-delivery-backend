import { NextFunction, Request, Response, Router } from "express";
import { FoodOrder_model } from "../models/models";
import { verifyToken } from "@clerk/backend";
import { customRequest } from "./food-category";
import { isAdmin } from "./middleware";

export const foodOrderRouter = Router();

export const auth = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.get("auth");
  try {
    if (token) {
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
    }
    res.json("auth failed");
  } catch (e) {
    console.error(e, "aldaa");
    return;
  }
};
foodOrderRouter.post("/", auth, async (req: customRequest, res: Response) => {
  const body = req.body;
  try {
    const newOrder = await FoodOrder_model.create(body);
    res.json({ message: "success", newOrder });
  } catch (e) {
    console.log(e, "aldaa 2");
    res.json({ message: "aldaa" });
  }
});
foodOrderRouter.get("/:user", auth, async (req: Request, res: Response) => {
  const { user } = req.params;
  try {
    const orders = await FoodOrder_model.find({ user }).populate("user");
    res.json(orders);
  } catch (e) {
    console.log(e, "aldaa 2");
  }
});
foodOrderRouter.get("/", auth, async (req: Request, res: Response) => {
  // const { user } = req.params;
  try {
    const orders = await FoodOrder_model.find().populate("user");
    res.json(orders);
  } catch (e) {
    console.log(e, "aldaa 2");
  }
});
foodOrderRouter.put(
  "/:id",
  auth,
  isAdmin,
  async (req: customRequest, res: Response) => {
    const body = req.body;
    console.log(req.params.id);
    try {
      const Order = await FoodOrder_model.findByIdAndUpdate(
        req.params.id,
        body
      );
      console.log("it worked", Order);
      res.json({ message: "success", Order });
    } catch (e) {
      console.log(e, "aldaa 2");
      res.json({ message: "aldaa" });
    }
  }
);
foodOrderRouter.delete(
  "/:id",
  auth,
  isAdmin,
  async (req: customRequest, res: Response) => {
    const { id } = req.params;
    console.log(req.params.id);
    try {
      const Order = await FoodOrder_model.findByIdAndDelete(id);
      console.log("Deleted", Order);
      res.json({ message: "success", Order });
    } catch (e) {
      console.log(e, "aldaa 2");
      res.json({ message: "aldaa" });
    }
  }
);
