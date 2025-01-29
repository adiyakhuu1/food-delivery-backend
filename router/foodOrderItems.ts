import { Request, Response, Router } from "express";
import { FoodOrderItem_model } from "../models/models";

export const foodOrderItemRouter = Router();

foodOrderItemRouter.post("/", async (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);
  try {
    const order = await FoodOrderItem_model.create(body);
    res.json(order);
  } catch (e) {
    console.error(e, "error");
  }
});
foodOrderItemRouter.get("/", async (req: Request, res: Response) => {
  try {
    const order = await FoodOrderItem_model.find();
    res.json(order);
  } catch (e) {
    console.error(e, "error");
  }
});
