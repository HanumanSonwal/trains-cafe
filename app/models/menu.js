// import mongoose from 'mongoose';
// import { boolean } from 'zod';

// const MenuSchema = new mongoose.Schema({
//     Item_Name: { type: String, required: true },
//     image: { type: String, required: true },
//     Category_Id:{ type: String, required: true },
//     Vendor: { type: String, required: true },
//     Price: { type: String, required: true },
//     Discount:{ type: String, required: true },
//     Food_Type:{ type: String, required: true },
//     Description:{ type: String, required: true },
// });

// // This prevents model overwriting in development
// export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
import mongoose from "mongoose";

// Define Food Type Enum
const FoodTypeEnum = ["Vegetarian", "Non-Vegetarian", "Vegan"]; // Add more as necessary

const MenuSchema = new mongoose.Schema(
  {
    Item_Name: { type: String, required: true },
    image: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^(http|https):\/\/[^ "]+$/.test(v), // Simple URL validation
        message: "Invalid image URL format",
      },
    },
    Category_Id: {
      type: mongoose.Schema.Types.ObjectId, // Change to ObjectId for referencing
      required: true,
      ref: "Category", // Use correct model name (capitalized)
    },
    Group_Id:{ 
        type: String,
        required: true,
      
    },
    Vendor: { 
        type: mongoose.Schema.Types.ObjectId, // Change to ObjectId for referencing
        required: true,
        ref: 'Vendor' // Use correct model name (capitalized)
    },
    Price: {
      type: Number, // Changed to Number for price calculations
      required: true,
      min: 0, // Ensure price is non-negative
    },
    Discount: {
      type: Number, // Changed to Number
      required: true,
      min: 0, // Ensure discount is non-negative
    },
    Food_Type: {
      type: String,
      required: true,
      enum: FoodTypeEnum, // Enforce specific food types
    },
    Station: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Station", // Enforce specific food types
    },
    Description: { type: String, required: true },
    GroupId: { type: String },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// This prevents model overwriting in development
export default mongoose.models.Menu || mongoose.model("Menu", MenuSchema);
