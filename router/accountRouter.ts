import { Request, Response, Router } from "express";
import { account_model } from "../models/models";
import bcrypt from "bcrypt";
import { auth } from "./foodOrder";

export const accountRouter = Router();

accountRouter.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userExists = await account_model.findOne({ email });

  if (userExists) {
    res.json({ message: "user exists", userExists });
    return;
  }
  try {
    const rounds = 10;
    const encryptedPass = await bcrypt.hash(password, rounds);
    const userExists = await account_model.create({
      email,
      password: encryptedPass,
    });
    res.json({ message: "success", userExists });
  } catch (e) {
    console.error(e, "aldaa");
  }
});

accountRouter.post("/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email && !password) {
    res.status(400).json({ message: "email or pass required" });
    return;
  }
  const user = await account_model.findOne({ email });
  if (!user) {
    res.status(400).json({ message: "user doesn't exist" });
    return;
  }
  try {
    const verify = await bcrypt.compare(password, user.password!);
    console.log(verify);
    res.json(verify);
  } catch (e) {
    console.error(e, "aldaa");
  }
});
accountRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    if (id) {
      const user = await account_model.findById(id).populate("FoodOrder");
      res.json(user);
      return;
    } else {
      res.json({ message: "not signed in" });
      return;
    }
  } catch (e) {
    console.log(e, "aldaa");
  }
});
accountRouter.put("/:id", auth, async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  try {
    if (id && body) {
      const user = await account_model.findByIdAndUpdate(id, body);
      res.json(user);
      return;
    } else {
      res.json({ message: "not signed in" });
      return;
    }
  } catch (e) {
    console.log(e, "aldaa");
  }
});
