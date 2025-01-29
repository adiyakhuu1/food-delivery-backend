import { NextFunction, Request, Response, Router } from "express";
import { foodCategory_model } from "../models/models";
// import { Token } from "@clerk/backend";
// import { Auth } from "mongodb";
import { verifyToken } from "@clerk/backend";
// import {auth}
// import {}
export type customRequest = Request & {
  userId?: string;
  email?: string;
  role?: {
    role: string;
  };
};
export const FoodCategoryRouter = Router();
const auth = async (req: customRequest, res: Response, next: NextFunction) => {
  const token = req.get("auth");
  if (token) {
    try {
      const verified = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      req.userId = verified.sub;
      req.email = verified.sub;
      console.log(verified);

      next();
      return;
    } catch (e) {
      console.log(e, "aldaa");
    }
  }
  console.log("no");
};

FoodCategoryRouter.get("/", async (req: customRequest, res: Response) => {
  const result = await foodCategory_model.find();
  res.json(result);
});
FoodCategoryRouter.get("/:_id", async (req: customRequest, res: Response) => {
  if (!req.params) {
    return;
  }
  try {
    const result = await foodCategory_model.find(req.params);
    if (result) {
      res.json(result);
    }
  } catch (err) {
    console.log(err, "error");
    res.json({});
  }
});
FoodCategoryRouter.post(
  "/addnew",
  auth,
  async (req: customRequest, res: Response) => {
    const body = req.body;
    const addnew = await foodCategory_model.create(body);
    res.send(addnew);
  }
);

FoodCategoryRouter.delete(
  "/:id",
  auth,
  async (req: customRequest, res: Response) => {
    const { id } = req.params;
    const deleteOne1 = await foodCategory_model.findByIdAndDelete(id);
    res.json(deleteOne1);
  }
);
FoodCategoryRouter.put(
  "/:id",
  auth,
  async (req: customRequest, res: Response) => {
    const { id } = req.params;
    const { name } = req.query;

    const deleteOne1 = await foodCategory_model.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        name,
      }
    );

    res.json({ deleteOne1 });
  }
);
