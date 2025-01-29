import mongoose, { mongo } from "mongoose";
enum userRole {
  USER = "user",
  ADMIN = "admin",
}

enum foodOrderStatus {
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING",
}
// Food category schema
const foodcatSchema = new mongoose.Schema(
  {
    name: { type: String },
  },
  { timestamps: true }
);
// Food - Schema
const food = new mongoose.Schema(
  {
    foodName: { type: String },
    price: { type: Number },
    image: { type: String },
    ingredients: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foodCategory",
    },
  },
  { timestamps: true }
);
// Users schema
const user = new mongoose.Schema(
  {
    id: { type: String },
    email: { type: String },
    password: { type: String },
    phoneNumber: { type: Number, default: 99321351 },
    address: {
      type: String,
      default: "narantuul",
    },
    role: {
      type: String,
      enum: Object.values(userRole),
      default: userRole.USER,
    },
    orderedFoods: { type: mongoose.Schema.Types.ObjectId, ref: "FoodOrder" },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);
//FoodOrderItem schema

const FoodOrderItem = new mongoose.Schema(
  {
    foodName: { type: String },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
    },
    quantity: Number,
  },
  {
    timestamps: true,
  }
);

// FoodOrder schema

const FoodOrder = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    totalPrice: Number,
    foodOrderItems: [FoodOrderItem],
    status: {
      type: String,
      enum: Object.values(foodOrderStatus),
      default: foodOrderStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

export const foodCategory_model = mongoose.model(
  "foodCategory",
  foodcatSchema,
  "food-category"
);
export const food_model = mongoose.model("food", food, "foods");
export const account_model = mongoose.model("user", user, "users");
export const FoodOrder_model = mongoose.model(
  "FoodOrder",
  FoodOrder,
  "foodorders"
);
export const FoodOrderItem_model = mongoose.model(
  "FoodOrderItem",
  FoodOrderItem,
  "foodorderitems"
);
