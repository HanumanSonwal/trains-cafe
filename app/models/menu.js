import mongoose from "mongoose";

const FoodTypeEnum = ["Vegetarian", "Non-Vegetarian"];

const MenuSchema = new mongoose.Schema(
  {
    Item_Name: { type: String, required: true },
    image: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^(http|https):\/\/[^ "]+$/.test(v),
        message: "Invalid image URL format",
      },
    },
    Category_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    Group_Id: {
      type: String,
      required: true,
    },
    Vendor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "vendor",
    },
    Price: {
      type: Number,
      required: true,
      min: 0,
    },
    Final_Price: {
      type: Number,
      required: true,
      min: 0,
    },
    Discount: {
      type: Number,
      required: true,
      min: 0,
    },
    Food_Type: {
      type: String, 
      required: true,
      enum: FoodTypeEnum,
    },
    Station: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Station",
    },
    Description: { type: String, required: true },
    GroupId: { type: String },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Menu || mongoose.model("Menu", MenuSchema);
